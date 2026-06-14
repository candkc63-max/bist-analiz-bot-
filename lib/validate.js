/**
 * TradingView webhook payload alanları.
 * @typedef {Object} TradingViewPayload
 * @property {string} symbol
 * @property {string} timeframe
 * @property {number|string} price
 * @property {number|string} ema20
 * @property {number|string} ema50
 * @property {number|string} ema200
 * @property {number|string} rsi
 * @property {string} volume_status
 * @property {string} signal
 * @property {string} trend
 */

const REQUIRED_FIELDS = [
  "symbol",
  "timeframe",
  "price",
  "ema20",
  "ema50",
  "ema200",
  "rsi",
  "volume_status",
  "signal",
  "trend",
];

/**
 * Gelen webhook verisini doğrular.
 * @param {unknown} body
 * @returns {{ ok: true, data: TradingViewPayload } | { ok: false, error: string }}
 */
export function validateWebhookPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "Geçersiz JSON gövdesi. Nesne bekleniyor." };
  }

  const missing = REQUIRED_FIELDS.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ""
  );

  if (missing.length > 0) {
    return {
      ok: false,
      error: `Eksik alanlar: ${missing.join(", ")}`,
    };
  }

  return { ok: true, data: body };
}
