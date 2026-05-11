import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateAnalysis(stockName, data) {
  const {
    ticker, price, dailyChange,
    ema20, ema50, ema200,
    rsi, aboveEma200, emasBullish,
    supports, resistances,
    stopLoss, target, riskReward,
    high52w, low52w,
  } = data;

  const trend = aboveEma200
    ? (emasBullish ? 'Güçlü Yükseliş' : 'Yükseliş')
    : 'Düşüş';

  const rsiYorum =
    rsi >= 70 ? 'Aşırı Alım — dikkatli ol' :
    rsi >= 60 ? 'Güçlü — hareket devam edebilir' :
    rsi >= 40 ? 'Nötr — bekleme bölgesi' :
    rsi >= 30 ? 'Zayıf — toparlanma gelebilir' :
    'Aşırı Satım — dip arayışında';

  const prompt = `Sen bir Türk borsası teknik analiz uzmanısın. Aşağıdaki verilere göre ${stockName} (${ticker}) hissesi için kısa, net ve anlaşılır bir teknik analiz yaz.

VERİLER:
- Fiyat: ${price} TL (günlük ${dailyChange > 0 ? '+' : ''}${dailyChange}%)
- EMA 20: ${ema20} | EMA 50: ${ema50} | EMA 200: ${ema200}
- RSI (14): ${rsi} → ${rsiYorum}
- Trend: ${trend} (EMA 200 ${aboveEma200 ? 'üstünde' : 'altında'})
- Destek seviyeleri: ${supports.length ? supports.join(' / ') + ' TL' : 'belirsiz'}
- Direnç seviyeleri: ${resistances.length ? resistances.join(' / ') + ' TL' : 'belirsiz'}
- Hedef: ${target} TL
- Stop Loss: ${stopLoss} TL
- Risk/Ödül: 1/${riskReward}
- 52H Yüksek: ${high52w} TL | 52H Düşük: ${low52w} TL

YAZIM KURALLARI:
- Maksimum 5-6 cümle, sade dil
- Önce genel durum, sonra ne yapılmalı
- Sayıları mutlaka belirt
- Emoji kullanma
- "Kesinlikle al/sat" deme, olasılık diliyle yaz
- Yatırım tavsiyesi olmadığını belirt`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text.trim();
}
