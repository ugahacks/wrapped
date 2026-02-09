import type { Metadata } from "next";
import { Amarante, Nunito_Sans } from "next/font/google";

import "./globals.css";

const amarante = Amarante({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display"
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "UGAHacks 11 Wrapped",
  description: "Spotify Wrapped inspired recap for UGAHacks 11"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${amarante.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
