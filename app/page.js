export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 640 }}>
      <h1>TradingView AI Analyzer</h1>
      <p>
        TradingView alarm webhook endpoint:{" "}
        <code>/api/tradingview-webhook</code>
      </p>
      <p>
        Vercel&apos;de deploy edildikten sonra TradingView alarm mesajını bu URL&apos;ye
        POST olarak yönlendirin.
      </p>
    </main>
  );
}
