# AGENTS.md

## Cursor Cloud specific instructions

### Overview

TradingView AI Analyzer — a Next.js application that receives TradingView alert webhooks, analyzes trade data with OpenAI (GPT-4o-mini), and sends the analysis to Telegram. Also includes a legacy Express.js BIST stock analysis bot (`server.js`).

### Running the dev server

```bash
npm run dev
```

Starts the Next.js dev server on port 3000. The legacy Express bot can be run with `npm run legacy:dev`.

### Key endpoints

- `GET /` — homepage (shows webhook instructions)
- `GET /api/tradingview-webhook` — returns endpoint info
- `POST /api/tradingview-webhook` — receives TradingView alert data, generates OpenAI analysis, sends to Telegram

### Required environment variables

| Variable | Required for |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI GPT analysis |
| `TELEGRAM_BOT_TOKEN` | Sending analysis to Telegram |
| `TELEGRAM_CHAT_ID` | Target Telegram chat/channel |

### Deployment

- **Vercel** (primary) — `vercel.json` configured, auto-deploys from GitHub
- **Railway** (backup) — `railway.toml` configured with `npm run build` + `npm start`

### Gotchas

- The project uses **Pages Router** (not App Router) — API routes are in `pages/api/`.
- `"type": "module"` was removed from `package.json` — imports in `lib/` and `pages/` use ES module syntax but Next.js handles the transpilation.
- The legacy Express bot (`server.js`, `claude.js`, `analyzer.js`, `stocks.js`) is still in the repo but not used by the Next.js app.
