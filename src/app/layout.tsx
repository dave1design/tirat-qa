import type { Metadata, Viewport } from "next";
import { Geist_Mono, Noto_Sans_Ethiopic } from "next/font/google";
import { getLocale } from "@/lib/i18n/server";
import { LocaleProvider } from "@/lib/i18n/client";
import "./globals.css";

const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
// Switzer has no Ethiopic glyphs, so Amharic text falls back to this face.
const ethiopic = Noto_Sans_Ethiopic({ subsets: ["ethiopic"], variable: "--font-ethiopic", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: { default: "Tirat QA — Practice. Find bugs. Improve.", template: "%s · Tirat QA" },
  description:
    "Tirat QA is a hands-on software QA practice platform. Test practice websites, find bugs, submit structured bug reports and learn from your results.",
  openGraph: { title: "Tirat QA", description: "Practice. Find bugs. Improve.", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${mono.variable} ${ethiopic.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
