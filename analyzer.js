function calcEMA(closes, period) {
  if (closes.length < period) return [];
  const k = 2 / (period + 1);
  let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const result = new Array(period - 1).fill(null);
  result.push(ema);
  for (let i = period; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
    result.push(ema);
  }
  return result;
}

function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return [];
  const result = new Array(period).fill(null);
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff; else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  result.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
    result.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
  }
  return result;
}

// Son N bar içindeki önemli dip noktalarını bul (destek)
function findSupportLevels(bars, lookback = 60) {
  const recent = bars.slice(-lookback);
  const levels = [];
  for (let i = 2; i < recent.length - 2; i++) {
    const cur = recent[i].low;
    if (
      cur < recent[i - 1].low && cur < recent[i - 2].low &&
      cur < recent[i + 1].low && cur < recent[i + 2].low
    ) {
      levels.push(cur);
    }
  }
  // Benzeri seviyeleri birleştir (%1.5 yakınsa aynı seviye)
  const merged = [];
  for (const lvl of levels.sort((a, b) => b - a)) {
    if (!merged.some(m => Math.abs(m - lvl) / lvl < 0.015)) merged.push(lvl);
  }
  return merged.slice(0, 3);
}

// Son N bar içindeki önemli tepe noktalarını bul (direnç)
function findResistanceLevels(bars, lookback = 60) {
  const recent = bars.slice(-lookback);
  const levels = [];
  for (let i = 2; i < recent.length - 2; i++) {
    const cur = recent[i].high;
    if (
      cur > recent[i - 1].high && cur > recent[i - 2].high &&
      cur > recent[i + 1].high && cur > recent[i + 2].high
    ) {
      levels.push(cur);
    }
  }
  const merged = [];
  for (const lvl of levels.sort((a, b) => a - b)) {
    if (!merged.some(m => Math.abs(m - lvl) / lvl < 0.015)) merged.push(lvl);
  }
  return merged.slice(0, 3);
}

async function fetchHistory(symbol) {
  const end   = Math.floor(Date.now() / 1000);
  const start = end - 2 * 365 * 24 * 3600;
  const url   = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}` +
    `?period1=${start}&period2=${end}&interval=1d&events=history`;

  const res  = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Yahoo Finance HTTP ${res.status}`);
  const json = await res.json();

  const chart     = json?.chart?.result?.[0];
  const times     = chart?.timestamp ?? [];
  const ohlcv     = chart?.indicators?.quote?.[0] ?? {};
  const { open = [], high = [], low = [], close = [], volume = [] } = ohlcv;

  return times.map((t, i) => ({
    date:   new Date(t * 1000),
    open:   open[i],
    high:   high[i],
    low:    low[i],
    close:  close[i],
    volume: volume[i],
  })).filter(b => b.close != null);
}

export async function analyzeStock(ticker) {
  const symbol  = ticker + '.IS';
  const history = await fetchHistory(symbol);

  if (history.length < 210) {
    throw new Error(`${ticker} için yeterli veri bulunamadı.`);
  }

  history.sort((a, b) => a.date - b.date);

  const closes = history.map(b => b.close);
  const n = closes.length;

  const ema20arr  = calcEMA(closes, 20);
  const ema50arr  = calcEMA(closes, 50);
  const ema200arr = calcEMA(closes, 200);
  const rsiArr    = calcRSI(closes, 14);

  const price   = closes[n - 1];
  const ema20   = ema20arr[n - 1];
  const ema50   = ema50arr[n - 1];
  const ema200  = ema200arr[n - 1];
  const rsi     = Math.round(rsiArr[n - 1]);

  const supports    = findSupportLevels(history);
  const resistances = findResistanceLevels(history);

  // Günlük değişim
  const prevClose = closes[n - 2];
  const dailyChange = ((price - prevClose) / prevClose * 100).toFixed(2);

  // Trend belirleme
  const aboveEma200 = price > ema200;
  const aboveEma50  = price > ema50;
  const aboveEma20  = price > ema20;
  const emasBullish = aboveEma200 && aboveEma50 && aboveEma20;

  // Stop seviyesi — EMA200'ün %2 altı veya en yakın destek (hangisi daha yüksekse)
  const nearestSupport = supports.find(s => s < price) ?? (ema200 * 0.98);
  const stopLoss = Math.max(nearestSupport * 0.99, ema200 * 0.97);

  // Hedef — en yakın direnç veya fiyatın %8-12 üstü
  const nearestResistance = resistances.find(r => r > price * 1.01);
  const target = nearestResistance ?? (price * 1.10);

  // Risk/Ödül
  const risk   = price - stopLoss;
  const reward = target - price;
  const riskReward = risk > 0 ? (reward / risk).toFixed(1) : 'N/A';

  // 52 hafta yüksek/düşük
  const last52w = history.slice(-252);
  const high52w = Math.max(...last52w.map(b => b.high));
  const low52w  = Math.min(...last52w.map(b => b.low));

  return {
    ticker,
    price:       +price.toFixed(2),
    prevClose:   +prevClose.toFixed(2),
    dailyChange: +dailyChange,
    ema20:       +ema20.toFixed(2),
    ema50:       +ema50.toFixed(2),
    ema200:      +ema200.toFixed(2),
    rsi,
    aboveEma200,
    emasBullish,
    supports:    supports.map(s => +s.toFixed(2)),
    resistances: resistances.map(r => +r.toFixed(2)),
    stopLoss:    +stopLoss.toFixed(2),
    target:      +target.toFixed(2),
    riskReward,
    high52w:     +high52w.toFixed(2),
    low52w:      +low52w.toFixed(2),
  };
}
