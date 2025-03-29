// Konfigurasi
const API_URL = 'https://api.coingecko.com/api/v3';
const CURRENCY = 'idr';
const REFRESH_INTERVAL = 60000; // 1 menit

// Format mata uang IDR
function formatIDR(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

// Format persentase
function formatPercentage(number) {
    const formatted = (number >= 0 ? '+' : '') + number.toFixed(2) + '%';
    return formatted;
}

// Update warna berdasarkan nilai
function updateValueColor(element, value, isPositiveGood = true) {
    element.classList.remove('positive', 'negative', 'neutral');
    
    if (value > 0) {
        element.classList.add(isPositiveGood ? 'positive' : 'negative');
    } else if (value < 0) {
        element.classList.add(isPositiveGood ? 'negative' : 'positive');
    } else {
        element.classList.add('neutral');
    }
}

// Generate RSI acak (simulasi)
function generateRSI() {
    // Simulasi RSI antara 20-80
    return Math.floor(Math.random() * 60) + 20;
}

// Generate MA acak berdasarkan harga (simulasi)
function generateMA(currentPrice) {
    // Simulasi MA ±10% dari harga saat ini
    const variation = (Math.random() * 0.2) - 0.1;
    return currentPrice * (1 + variation);
}

// Update tampilan RSI
function updateRSI(rsiValue) {
    const rsiElement = document.getElementById('rsi-value');
    const rsiBar = document.getElementById('rsi-bar');
    const interpretation = document.getElementById('rsi-interpretation');
    
    rsiElement.textContent = rsiValue;
    rsiBar.style.width = `${rsiValue}%`;
    
    if (rsiValue >= 70) {
        interpretation.textContent = 'Overbought (Potensi Jual)';
        interpretation.style.color = 'var(--negative)';
    } else if (rsiValue <= 30) {
        interpretation.textContent = 'Oversold (Potensi Beli)';
        interpretation.style.color = 'var(--positive)';
    } else {
        interpretation.textContent = 'Netral';
        interpretation.style.color = 'var(--neutral)';
    }
}

// Update tampilan MA
function updateMA(maValue, currentPrice) {
    const maElement = document.getElementById('ma-value');
    const maDirection = document.getElementById('ma-direction');
    const interpretation = document.getElementById('ma-interpretation');
    
    maElement.textContent = formatIDR(maValue);
    
    const percentageDiff = ((currentPrice - maValue) / maValue) * 100;
    const directionIcon = percentageDiff > 2 ? 'fa-arrow-up' : 
                         percentageDiff < -2 ? 'fa-arrow-down' : 'fa-arrows-alt-h';
    
    maDirection.innerHTML = `<i class="fas ${directionIcon}"></i>`;
    
    if (percentageDiff > 5) {
        interpretation.textContent = 'Trend Naik Kuat';
        maDirection.style.color = 'var(--positive)';
    } else if (percentageDiff > 0) {
        interpretation.textContent = 'Trend Naik';
        maDirection.style.color = 'var(--positive)';
    } else if (percentageDiff < -5) {
        interpretation.textContent = 'Trend Turun Kuat';
        maDirection.style.color = 'var(--negative)';
    } else if (percentageDiff < 0) {
        interpretation.textContent = 'Trend Turun';
        maDirection.style.color = 'var(--negative)';
    } else {
        interpretation.textContent = 'Netral';
        maDirection.style.color = 'var(--neutral)';
    }
}

// Fetch data dari API
async function fetchBitcoinData() {
    try {
        // Fetch harga saat ini
        const priceResponse = await fetch(`${API_URL}/simple/price?ids=bitcoin&vs_currencies=${CURRENCY}&include_24hr_change=true`);
        const priceData = await priceResponse.json();
        
        const currentPrice = priceData.bitcoin[CURRENCY];
        const priceChange24h = priceData.bitcoin[`${CURRENCY}_24h_change`];
        
        // Update harga
        document.getElementById('current-btc-price').textContent = formatIDR(currentPrice);
        
        // Update persentase perubahan
        const priceChangeElement = document.getElementById('price-change');
        priceChangeElement.textContent = formatPercentage(priceChange24h);
        updateValueColor(priceChangeElement, priceChange24h);
        
        // Update statistik (simulasi)
        document.getElementById('24h-change').textContent = formatPercentage(priceChange24h);
        document.getElementById('1d-change').textContent = formatPercentage(priceChange24h * 1.2);
        document.getElementById('7d-change').textContent = formatPercentage(priceChange24h * -0.5);
        document.getElementById('30d-change').textContent = formatPercentage(priceChange24h * 5);
        document.getElementById('1y-change').textContent = formatPercentage(priceChange24h * 15);
        
        // Update indikator
        updateRSI(generateRSI());
        updateMA(generateMA(currentPrice), currentPrice);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('current-btc-price').textContent = 'Gagal memuat data';
    }
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    fetchBitcoinData();
    setInterval(fetchBitcoinData, REFRESH_INTERVAL);
    
    // Animasi scroll halus
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
