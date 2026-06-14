# AGENTS.md

## Cursor Cloud specific instructions

### Overview

TradingView AI Analyzer — Vercel üzerinde deploy edilen Next.js uygulaması. TradingView alarm webhook'undan gelen teknik indikatör verisini OpenAI ile analiz eder ve sonucu Telegram botuna gönderir.

Eski Express tabanlı BIST Analiz Bot dosyaları (`server.js`, `claude.js`, vb.) repoda duruyor; yeni sistem Next.js API route kullanır.

### Running the dev server

```bash
export OPENAI_API_KEY=<your-key>
export TELEGRAM_BOT_TOKEN=<your-bot-token>
export TELEGRAM_CHAT_ID=<your-chat-id>
npm run dev
```

Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışır.

### Testing endpoints

- `GET /api/tradingview-webhook` — health check
- `POST /api/tradingview-webhook` — TradingView alarm akışı

Örnek test:

```bash
curl -X POST http://localhost:3000/api/tradingview-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "THYAO",
    "timeframe": "1D",
    "price": 285.5,
    "ema20": 280.1,
    "ema50": 275.3,
    "ema200": 260.0,
    "rsi": 58.2,
    "volume_status": "Yüksek",
    "signal": "Alım",
    "trend": "Yükseliş"
  }'
```

### Required secrets

- `OPENAI_API_KEY` — OpenAI analiz metni üretimi
- `TELEGRAM_BOT_TOKEN` — Telegram BotFather token
- `TELEGRAM_CHAT_ID` — Mesajın gönderileceği chat ID

### Vercel deploy

1. Repoyu Vercel'e bağla
2. Environment variable'ları Vercel dashboard'dan ekle
3. Deploy sonrası webhook URL: `https://<proje-adin>.vercel.app/api/tradingview-webhook`

### TradingView alarm JSON örneği

TradingView alert mesajında webhook URL'sine şu formatta JSON gönderin:

```json
{
  "symbol": "{{ticker}}",
  "timeframe": "{{interval}}",
  "price": {{close}},
  "ema20": {{plot_0}},
  "ema50": {{plot_1}},
  "ema200": {{plot_2}},
  "rsi": {{plot_3}},
  "volume_status": "Yüksek",
  "signal": "Alım",
  "trend": "Yükseliş"
}
```

(Pine Script plot numaralarını kendi indikatörünüze göre ayarlayın.)

### No lint/test tooling

Bu repo için lint ve test framework'ü yok. Komutlar: `npm run dev`, `npm run build`, `npm start`.

### Gotchas

- Gelen webhook verisi `console.log` ile Vercel loglarına yazılır.
- OpenAI ve Telegram env var'ları deploy ortamında tanımlı olmalıdır.
- Eski Express sunucusu `npm run legacy:dev` ile çalıştırılabilir (Anthropic API kullanır).
