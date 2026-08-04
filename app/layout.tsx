import type { Metadata, Viewport } from "next";
import { Playpen_Sans } from "next/font/google";
import "./globals.css";

// Self-hosted at build time by next/font - no runtime CDN, so the CSP stays locked to 'self'.
const playpen = Playpen_Sans({ subsets: ["latin"], weight: ["600", "800"], variable: "--font-playpen", display: "swap" });

const title = "Math Hero";
const description = "Pick a hero and race the clock through addition, subtraction, multiplication, and division across 5 difficulty tiers.";
const url = "https://math-hero-bheng.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1120",
};

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  applicationName: title,
  openGraph: {
    title,
    description,
    url,
    siteName: title,
    type: "website",
    images: [{ url: "/heroes/1.png", width: 512, height: 512, alt: "Math Hero" }],
  },
  twitter: { card: "summary", title, description, images: ["/heroes/1.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={playpen.variable}>
      <body>{children}</body>
    </html>
  );
}
