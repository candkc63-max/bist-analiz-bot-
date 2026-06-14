export const metadata = {
  title: "TradingView AI Analyzer",
  description: "TradingView webhook ile AI destekli trade analiz sistemi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
