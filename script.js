// API Configuration
const API_URL = 'https://api.coingecko.com/api/v3';
const CURRENCY = 'idr';

// DOM Elements
const currentBtcPriceElement = document.getElementById('current-btc-price');
const priceChangeElement = document.getElementById('price-change');
const rsiValueElement = document.getElementById('rsi-value');
const rsiBarElement = document.getElementById('rsi-bar');
const rsiInterpretationElement = document.getElementById('rsi-interpretation');
const maDisplayElement = document.getElementById('ma-display');
const maDirectionElement = document.getElementById('ma-direction');
const maInterpretationElement = document.getElementById('ma-interpretation');
const change24hElement = document.getElementById('24h-change');
const change1dElement = document.getElementById('1d-change');
const change7dElement = document.getElementById('7d-change');
const change30dElement = document.getElementById('30d-change');
const change1yElement = document.getElementById('1y-change');

// Full view indicators
const rsiValueFullElement = document.getElementById('rsi-value-full');
const rsiBarFullElement = document.getElementById('rsi-bar-full');
const rsiInterpretationFullElement = document.getElementById('rsi-interpretation-full');
const maDisplayFullElement = document.getElementById('ma-display-full');
const maDirectionFullElement = document.getElementById('ma-direction-full');
const maInterpretationFullElement = document.getElementById('ma-interpretation-full');

// Format number to IDR currency
function formatIDR(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

// Format percentage
function formatPercentage(number) {
    return (number >= 0 ? '+' : '') + number.toFixed(2) + '%';
}

// Get color based on value
function getValueColor(value, isPositiveGood = true) {
    if (value > 0) {
        return isPositiveGood ? 'var(--positive)' : 'var(--negative)';
    } else if (value < 0) {
        return isPositiveGood ? 'var(--negative)' : 'var(--positive)';
    } else {
        return 'var(--neutral)';
    }
}

// Simulate RSI data (in a real app, you would calculate this from price data)
function getRSIValue() {
    // Simulate RSI between 20-80 for demo purposes
    return Math.floor(Math.random() * 60) + 20;
}

// Simulate MA data (in a real app, you would calculate this from price data)
function getMAValue(currentPrice) {
    // Simulate MA close to current price (±10%)
    const variation = (Math.random() * 0.2) - 0.1;
    return currentPrice * (1 + variation);
}

// Update RSI display
function updateRSI(rsiValue) {
    rsiValueElement.textContent = rsiValue;
    rsiValueFullElement.textContent = rsiValue;
    
    // Set RSI bar width (clamped between 0-100)
    const barWidth = Math.min(Math.max(rsiValue, 0), 100);
    rsiBarElement.style.width = `${barWidth}%`;
    rsiBarFullElement.style.width = `${barWidth}%`;
    
    // Set interpretation
    let interpretation = '';
    if (rsiValue >= 70) {
        interpretation = 'Overbought (Potensi Jual)';
        rsiInterpretationElement.style.color = 'var(--negative)';
    } else if (rsiValue <= 30) {
        interpretation = 'Oversold (Potensi Beli)';
        rsiInterpretationElement.style.color = 'var(--positive)';
    } else {
        interpretation = 'Netral';
        rsiInterpretationElement.style.color = 'var(--neutral)';
    }
    
    rsiInterpretationElement.textContent = interpretation;
    rsiInterpretationFullElement.textContent = interpretation;
    rsiInterpretationFullElement.style.color = rsiInterpretationElement.style.color;
}

// Update MA display
function updateMA(maValue, currentPrice) {
    const maElement = maDisplayElement.querySelector('.ma-value');
    const maFullElement = maDisplayFullElement.querySelector('.ma-value');
    
    maElement.textContent = formatIDR(maValue);
    maFullElement.textContent = formatIDR(maValue);
    
    // Determine direction
    let directionIcon = 'fa-arrows-alt-h';
    let interpretation = '';
    
    if (currentPrice > maValue * 1.02) {
        directionIcon = 'fa-arrow-up';
        interpretation = 'Trend Naik Kuat';
        maDirectionElement.style.color = 'var(--positive)';
    } else if (currentPrice > maValue) {
        directionIcon = 'fa-arrow-up';
        interpretation = 'Trend Naik';
        maDirectionElement.style.color = 'var(--positive)';
    } else if (currentPrice < maValue * 0.98) {
        directionIcon = 'fa-arrow-down';
        interpretation = 'Trend Turun Kuat';
        maDirectionElement.style.color = 'var(--negative)';
    } else if (currentPrice < maValue) {
        directionIcon = 'fa-arrow-down';
        interpretation = 'Trend Turun';
        maDirectionElement.style.color = 'var(--negative)';
    } else {
        interpretation = 'Netral';
        maDirectionElement.style.color = 'var(--neutral)';
    }
    
    maDirectionElement.innerHTML = `<i class="fas ${directionIcon}"></i>`;
    maDirectionFullElement.innerHTML = `<i class="fas ${directionIcon}"></i>`;
    maDirectionFullElement.style.color = maDirectionElement.style.color;
    
    maInterpretationElement.textContent = interpretation;
    maInterpretationFullElement.textContent = interpretation;
}

// Fetch Bitcoin data from CoinGecko API
async function fetchBitcoinData() {
    try {
        // Fetch current price
        const priceResponse = await fetch(`${API_URL}/simple/price?ids=bitcoin&vs_currencies=${CURRENCY}&include_24hr_change=true`);
        const priceData = await priceResponse.json();
        
        const currentPrice = priceData.bitcoin[CURRENCY];
        const priceChange24h = priceData.bitcoin[`${CURRENCY}_24h_change`];
        
        // Update current price display
        currentBtcPriceElement.textContent = formatIDR(currentPrice);
        
        // Update 24h change
        priceChangeElement.textContent = formatPercentage(priceChange24h);
        priceChangeElement.style.color = getValueColor(priceChange24h);
        change24hElement.textContent = formatPercentage(priceChange24h);
        change24hElement.style.color = getValueColor(priceChange24h);
        
        // For demo, we'll simulate other time periods
        change1dElement.textContent = formatPercentage(priceChange24h * 1.2);
        change1dElement.style.color = getValueColor(priceChange24h * 1.2);
        
        change7dElement.textContent = formatPercentage(priceChange24h * 5);
        change7dElement.style.color = getValueColor(priceChange24h * 5);
        
        change30dElement.textContent = formatPercentage(priceChange24h * 10);
        change30dElement.style.color = getValueColor(priceChange24h * 10);
        
        change1yElement.textContent = formatPercentage(priceChange24h * 30);
        change1yElement.style.color = getValueColor(priceChange24h * 30);
        
        // Update indicators
        const rsiValue = getRSIValue();
        updateRSI(rsiValue);
        
        const maValue = getMAValue(currentPrice);
        updateMA(maValue, currentPrice);
        
    } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
        currentBtcPriceElement.textContent = 'Gagal memuat data';
    }
}

// Initialize and update data periodically
fetchBitcoinData();
setInterval(fetchBitcoinData, 60000); // Update every minute