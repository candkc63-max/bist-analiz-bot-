# AGENTS.md

## Cursor Cloud specific instructions

### Overview

BIST Analiz Bot is a single Node.js (ES modules) Express server that provides Turkish stock market technical analysis via ManyChat webhooks. It fetches price data from Yahoo Finance, computes indicators (EMA, RSI, support/resistance), and sends the data to the Anthropic Claude API for a natural-language summary in Turkish.

### Running the dev server

```bash
export ANTHROPIC_API_KEY=<your-key>
node --watch server.js
```

Or equivalently: `npm run dev` (uses `node --watch server.js`). The server listens on `PORT` (default 3000). There is no `dotenv` — env vars must be exported in the shell before starting the server.

### Testing endpoints

- `GET /health` — returns `{"status":"ok"}`
- `POST /webhook` with JSON body `{"text":"THYAO analiz"}` — full analysis flow
- `GET /webhook?q=THYAO` — same flow via query string

### Required secrets

- `ANTHROPIC_API_KEY` — needed for Claude analysis text generation. Without it, stock lookup and Yahoo Finance data fetch still work, but the final analysis response will fail gracefully.

### No lint/test tooling

This repository has no linter config, no test framework, and no build step. The only commands are `npm start` and `npm run dev`.

### Gotchas

- The app uses ES modules (`"type": "module"` in `package.json`). All imports use `.js` extensions.
- Yahoo Finance API may rate-limit or block requests from certain IPs — if `analyzeStock` fails, check network access to `query1.finance.yahoo.com`.
- The Anthropic SDK client is instantiated at module load time in `claude.js`, so the env var must be set before the server starts (not after).
