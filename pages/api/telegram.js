import { findStock } from "../../stocks.js";
import { analyzeStock } from "../../analyzer.js";
import OpenAI from "openai";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY tanımlı değil.");
  return new OpenAI({ apiKey });
}

async function generateAnalysis(stockName, data) {
  const client = getOpenAIClient();

  const trend = data.aboveEma200
    ? data.emasBullish ? "Güçlü Yükseliş" : "Yükseliş"
    : "Düşüş";

  const rsiYorum =
    data.rsi >= 70 ? "Aşırı Alım" :
    data.rsi >= 60 ? "Güçlü" :
    data.rsi >= 40 ? "Nötr" :
    data.rsi >= 30 ? "Zayıf" :
    "Aşırı Satım";

  const prompt = `Sen bir Türk borsası teknik analiz uzmanısın. Aşağıdaki verilere göre ${stockName} (${data.ticker}) hissesi için kısa, net ve anlaşılır bir teknik analiz yaz.

VERİLER:
- Fiyat: ${data.price} TL (günlük ${data.dailyChange > 0 ? "+" : ""}${data.dailyChange}%)
- EMA 20: ${data.ema20} | EMA 50: ${data.ema50} | EMA 200: ${data.ema200}
- RSI (14): ${data.rsi} → ${rsiYorum}
- Trend: ${trend} (EMA 200 ${data.aboveEma200 ? "üstünde" : "altında"})
- Destek: ${data.supports.length ? data.supports.join(" / ") + " TL" : "belirsiz"}
- Direnç: ${data.resistances.length ? data.resistances.join(" / ") + " TL" : "belirsiz"}
- Hedef: ${data.target} TL
- Stop Loss: ${data.stopLoss} TL
- Risk/Ödül: 1/${data.riskReward}
- 52H Yüksek: ${data.high52w} TL | 52H Düşük: ${data.low52w} TL

YAZIM KURALLARI:
- Maksimum 5-6 cümle, sade dil
- Önce genel durum, sonra ne yapılmalı
- Sayıları mutlaka belirt
- Emoji kullanma
- "Kesinlikle al/sat" deme, olasılık diliyle yaz
- Yatırım tavsiyesi olmadığını belirt`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

function formatTL(n) {
  return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function sendTelegram(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN tanımlı değil.");

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
}

function extractQuery(text) {
  if (!text) return null;
  const match = text.match(/^\/analiz\s+(.+)/i);
  if (match) return match[1].trim();
  return text
    .replace(/^\/start/i, "")
    .replace(/analiz|analizi|hakkında|hisse/gi, "")
    .replace(/[?!.,]/g, "")
    .trim() || null;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ status: "ok", bot: "telegram" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST desteklenir." });
  }

  try {
    const update = req.body;
    const message = update?.message;

    if (!message?.text || !message?.chat?.id) {
      return res.status(200).json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();

    if (text === "/start") {
      await sendTelegram(chatId,
        "Merhaba! Ben BIST teknik analiz botuyum.\n\n" +
        "Kullanım: /analiz THYAO\n" +
        "veya direkt hisse adı yazın: Garanti analiz\n\n" +
        "~80 BIST hissesini destekliyorum."
      );
      return res.status(200).json({ ok: true });
    }

    const query = extractQuery(text);
    if (!query) {
      await sendTelegram(chatId,
        "Hangi hisseyi analiz edeyim?\n\nÖrnek: /analiz THYAO"
      );
      return res.status(200).json({ ok: true });
    }

    const stock = findStock(query);
    if (!stock) {
      await sendTelegram(chatId,
        `"${query}" için BIST'te bir hisse bulamadım.\n\n` +
        `Ticker (örn: YKBNK) veya şirket adı (örn: Yapı Kredi) yazın.`
      );
      return res.status(200).json({ ok: true });
    }

    await sendTelegram(chatId, `${stock.name} (${stock.ticker}) analiz ediliyor...`);

    const data = await analyzeStock(stock.ticker);
    const analysisText = await generateAnalysis(stock.name, data);

    const response =
      `📊 <b>${stock.name} (${stock.ticker}) Teknik Analiz</b>\n\n` +
      `💰 Fiyat: ${formatTL(data.price)} TL (${data.dailyChange > 0 ? "+" : ""}${data.dailyChange}%)\n` +
      `📈 Trend: ${data.aboveEma200 ? "▲ Yükseliş" : "▼ Düşüş"} — EMA200: ${formatTL(data.ema200)} TL\n` +
      `📉 RSI: ${data.rsi}\n` +
      `🎯 Hedef: ${formatTL(data.target)} TL\n` +
      `🛑 Stop: ${formatTL(data.stopLoss)} TL\n` +
      `⚖️ Risk/Ödül: 1/${data.riskReward}\n\n` +
      `${analysisText}\n\n` +
      `⚠️ Bu analiz yatırım tavsiyesi değildir.`;

    await sendTelegram(chatId, response);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[Telegram Bot] Hata:", error);
    return res.status(200).json({ ok: true });
  }
}
