import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "./globals.css";
import "tailwindcss/tailwind.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";

config.autoAddCss = false;

import Header from "./components/Header";
import BackgroundWrapper from "./components/BackgroundWrapper";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Furugen's Island",
  description: "This is Furugen's personal website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Google Fonts読み込み */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Noto+Sans+JP:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <BackgroundWrapper>
          <Header />
          <main>{children}</main>
        </BackgroundWrapper>
        <Footer />
      </body>
      <GoogleTagManager gtmId="G-3B88D979NP" />
      <GoogleAnalytics gaId="G-3B88D979NP" />
    </html>
  );
}
