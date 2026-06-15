import { analyzeTrade } from "../../lib/openai";
import { sendTelegramMessage } from "../../lib/telegram";
import { validateWebhookPayload } from "../../lib/validate";

/**
 * TradingView webhook endpoint (Pages Router).
 * POST /api/tradingview-webhook
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      endpoint: "/api/tradingview-webhook",
      method: "POST",
      description: "TradingView alarm webhook endpoint'i",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Sadece POST desteklenir." });
  }

  try {
    const body = req.body;

    console.log("[TradingView Webhook] Gelen veri:", JSON.stringify(body, null, 2));

    const validation = validateWebhookPayload(body);
    if (!validation.ok) {
      console.error("[TradingView Webhook] Doğrulama hatası:", validation.error);
      return res.status(400).json({ success: false, error: validation.error });
    }

    const analysis = await analyzeTrade(validation.data);
    console.log("[TradingView Webhook] OpenAI analizi üretildi.");

    await sendTelegramMessage(analysis);
    console.log("[TradingView Webhook] Telegram mesajı gönderildi.");

    return res.status(200).json({
      success: true,
      message: "Analiz oluşturuldu ve Telegram'a gönderildi.",
      analysis,
    });
  } catch (error) {
    console.error("[TradingView Webhook] Hata:", error);

    const message =
      error instanceof Error ? error.message : "Bilinmeyen sunucu hatası.";

    return res.status(500).json({ success: false, error: message });
  }
}
