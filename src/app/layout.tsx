import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { PWARegister } from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "DSCSS 情報セキュリティマネジメント学習",
  description: "情報セキュリティマネジメント試験（SG）合格を目指す学習クイズアプリ",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "DSCSS SG学習" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1, themeColor: "#1a4d37",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head><link rel="apple-touch-icon" href="/icon-192.png" /></head>
      <body className="min-h-screen bg-brand-50">
        <main className="pb-20 max-w-lg mx-auto">{children}</main>
        <BottomNav />
        <PWARegister />
      </body>
    </html>
  );
}
