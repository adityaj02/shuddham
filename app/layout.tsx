import type { Metadata } from "next";
import { Noto_Serif, Inter } from "next/font/google";

import { CartProvider } from "@/components/shared/cart-provider";
import { cn } from "@/lib/utils";

import "./globals.css";

const displayFont = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "SHUDDHAM | Ayurvedic Wellness",
  description:
    "Doctor-verified, 100% natural Ayurvedic formulations for modern daily rituals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f8f6f3" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1c18" media="(prefers-color-scheme: dark)" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-surface font-body text-on-surface antialiased",
          displayFont.variable,
          bodyFont.variable
        )}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
