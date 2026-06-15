import { analyzeTrade } from "../../../lib/openai";
import { sendTelegramMessage } from "../../../lib/telegram";
import { validateWebhookPayload } from "../../../lib/validate";

/** Node.js runtime gerekli (OpenAI SDK) */
export const runtime = "nodejs";

/**
 * TradingView webhook endpoint.
 * POST /api/tradingview-webhook
 *
 * Akış:
 * 1. JSON veriyi al ve logla
 * 2. Alanları doğrula
 * 3. OpenAI ile analiz üret
 * 4. Sonucu Telegram'a gönder
 */
export async function POST(request) {
  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: "Geçersiz JSON formatı." },
        { status: 400 }
      );
    }

    // Gelen webhook verisini kaydet (Vercel loglarında görünür)
    console.log("[TradingView Webhook] Gelen veri:", JSON.stringify(body, null, 2));

    const validation = validateWebhookPayload(body);
    if (!validation.ok) {
      console.error("[TradingView Webhook] Doğrulama hatası:", validation.error);
      return Response.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const analysis = await analyzeTrade(validation.data);
    console.log("[TradingView Webhook] OpenAI analizi üretildi.");

    await sendTelegramMessage(analysis);
    console.log("[TradingView Webhook] Telegram mesajı gönderildi.");

    return Response.json({
      success: true,
      message: "Analiz oluşturuldu ve Telegram'a gönderildi.",
      analysis,
    });
  } catch (error) {
    console.error("[TradingView Webhook] Hata:", error);

    const message =
      error instanceof Error ? error.message : "Bilinmeyen sunucu hatası.";

    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

/** GET isteklerine kısa bilgi döner (health check / test). */
export async function GET() {
  return Response.json({
    status: "ok",
    endpoint: "/api/tradingview-webhook",
    method: "POST",
    description: "TradingView alarm webhook endpoint'i",
  });
}
