/**
 * Analiz metnini Telegram botuna gönderir.
 * @param {string} message
 * @returns {Promise<void>}
 */
export async function sendTelegramMessage(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN environment variable tanımlı değil.");
  }
  if (!chatId) {
    throw new Error("TELEGRAM_CHAT_ID environment variable tanımlı değil.");
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.ok) {
    const detail = result.description || response.statusText;
    throw new Error(`Telegram mesajı gönderilemedi: ${detail}`);
  }
}
