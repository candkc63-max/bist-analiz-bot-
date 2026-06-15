import OpenAI from "openai";

/**
 * OpenAI istemcisini lazy-init ile oluşturur.
 * Modül yüklenirken env kontrolü yapılmaz; route içinde hata yönetimi kolaylaşır.
 */
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable tanımlı değil.");
  }
  return new OpenAI({ apiKey });
}

/**
 * TradingView verisini OpenAI ile analiz eder.
 * @param {import("./validate").TradingViewPayload} payload
 * @returns {Promise<string>} Türkçe analiz metni
 */
export async function analyzeTrade(payload) {
  const client = getOpenAIClient();

  const systemPrompt = `Sen deneyimli bir teknik analiz uzmanısın. TradingView'den gelen indikatör verilerine göre Türkçe trade analizi üret.

Yanıtını MUTLAKA şu başlıklarla ve sırayla ver:

Hisse: [sembol]
Zaman dilimi: [timeframe]
Karar: [AL / BEKLE / ALMA — sadece bu üçünden biri]
Teknik gerekçe: [EMA, RSI, trend, hacim ve sinyal yorumu]
Giriş seviyesi: [fiyat veya aralık]
Stop seviyesi: [fiyat]
Hedef seviyeler: [1. hedef, 2. hedef vb.]
Risk yorumu: [kısa risk değerlendirmesi]

Kurallar:
- Karar satırında yalnızca AL, BEKLE veya ALMA kullan.
- Fiyat seviyelerini sayısal ve net yaz.
- Yatırım tavsiyesi değil, teknik analiz yorumu olduğunu ima et.
- Kısa ve net ol; gereksiz uzatma.`;

  const userPrompt = `Aşağıdaki TradingView alarm verisini analiz et:

Sembol: ${payload.symbol}
Zaman dilimi: ${payload.timeframe}
Fiyat: ${payload.price}
EMA 20: ${payload.ema20}
EMA 50: ${payload.ema50}
EMA 200: ${payload.ema200}
RSI: ${payload.rsi}
Hacim durumu: ${payload.volume_status}
Sinyal: ${payload.signal}
Trend: ${payload.trend}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const analysis = response.choices[0]?.message?.content?.trim();

  if (!analysis) {
    throw new Error("OpenAI boş yanıt döndürdü.");
  }

  return analysis;
}
