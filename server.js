import express from 'express';
import { findStock } from './stocks.js';
import { analyzeStock } from './analyzer.js';
import { generateAnalysis } from './claude.js';

const app = express();
app.use(express.json());

// Kullanıcı mesajından hisse adını çıkar
function extractQuery(text) {
  if (!text) return null;
  return text
    .replace(/analiz|analizi|ne düşünüyorsun|hakkında|hisse|ne olur|nasıl|bakabilir misin/gi, '')
    .replace(/[?!.,]/g, '')
    .trim();
}

// Sayıyı Türkçe formatla
function formatTL(n) {
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ManyChat webhook endpoint
app.post('/webhook', async (req, res) => {
  const body = req.body;

  // ManyChat'ten gelen mesajı al (body veya query string)
  const userMessage =
    req.query?.q ||
    body?.last_input_text ||
    body?.text ||
    body?.message ||
    '';

  console.log('Gelen mesaj:', userMessage);

  const query = extractQuery(userMessage);
  if (!query) {
    return res.json(mcResponse('Hangi hisseyi analiz etmemi istiyorsunuz? Örnek: "YKBNK analiz" veya "Garanti Bankası"'));
  }

  const stock = findStock(query);
  if (!stock) {
    return res.json(mcResponse(
      `"${query}" için BIST'te bir hisse bulamadım. Ticker sembolü (örn: YKBNK) veya şirket adını (örn: Yapı Kredi) yazabilirsiniz.`
    ));
  }

  try {
    const data = await analyzeStock(stock.ticker);
    const analysisText = await generateAnalysis(stock.name, data);

    const message =
      `📊 ${stock.name} (${stock.ticker}) Teknik Analiz\n\n` +
      `💰 Fiyat: ${formatTL(data.price)} TL (${data.dailyChange > 0 ? '+' : ''}${data.dailyChange}%)\n` +
      `📈 Trend: ${data.aboveEma200 ? '▲ Yükseliş' : '▼ Düşüş'} — EMA200: ${formatTL(data.ema200)} TL\n` +
      `📉 RSI: ${data.rsi}\n` +
      `🎯 Hedef: ${formatTL(data.target)} TL\n` +
      `🛑 Stop: ${formatTL(data.stopLoss)} TL\n` +
      `⚖️ Risk/Ödül: 1/${data.riskReward}\n\n` +
      `${analysisText}\n\n` +
      `⚠️ Bu analiz yatırım tavsiyesi değildir.`;

    return res.json(mcResponse(message));
  } catch (err) {
    console.error('Analiz hatası:', err.message);
    return res.json(mcResponse(
      `${stock.name} (${stock.ticker}) analizi şu an yapılamadı. Lütfen birkaç dakika sonra tekrar deneyin.`
    ));
  }
});

// GET ile de çalış (ManyChat URL doğrulama + query string)
app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.get('/webhook', async (req, res) => {
  const userMessage = req.query?.q || '';
  if (!userMessage) return res.json({ status: 'ok', version: 'v2' });

  const query = extractQuery(userMessage);
  const stock = findStock(query);
  if (!stock) return res.json(mcResponse(`"${query}" için hisse bulunamadı.`));

  try {
    const data = await analyzeStock(stock.ticker);
    const analysisText = await generateAnalysis(stock.name, data);
    const message =
      `📊 ${stock.name} (${stock.ticker}) Teknik Analiz\n\n` +
      `💰 Fiyat: ${formatTL(data.price)} TL (${data.dailyChange > 0 ? '+' : ''}${data.dailyChange}%)\n` +
      `📈 Trend: ${data.aboveEma200 ? '▲ Yükseliş' : '▼ Düşüş'} — EMA200: ${formatTL(data.ema200)} TL\n` +
      `📉 RSI: ${data.rsi}\n` +
      `🎯 Hedef: ${formatTL(data.target)} TL\n` +
      `🛑 Stop: ${formatTL(data.stopLoss)} TL\n` +
      `⚖️ Risk/Ödül: 1/${data.riskReward}\n\n` +
      `${analysisText}\n\n` +
      `⚠️ Bu analiz yatırım tavsiyesi değildir.`;
    return res.json(mcResponse(message));
  } catch (err) {
    return res.json(mcResponse(`${stock.name} analizi şu an yapılamadı.`));
  }
});

// ManyChat response formatı
function mcResponse(text) {
  return {
    version: 'v2',
    content: {
      messages: [{ type: 'text', text }],
    },
  };
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot sunucusu ${PORT} portunda çalışıyor`));
