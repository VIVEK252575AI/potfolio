import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/layout/LenisProvider";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vivek Kumar — Aspiring AI Engineer & Software Engineer",
  description:
    "Building intelligent applications through AI, machine learning, and strong software engineering fundamentals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans antialiased selection:bg-[var(--accent-indigo)] selection:text-white">
          <LenisProvider>{children}</LenisProvider>
        </body>
    </html>
  );
}
