import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { config } from '@fortawesome/fontawesome-svg-core'
import "./globals.css";
import 'tailwindcss/tailwind.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import assetPrefix from '../../next.config.mjs';

const BASE_PATH = assetPrefix.basePath || "";

config.autoAddCss = false

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Stick&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'MOBO';
                src: url('${BASE_PATH}/fonts/MOBO-SemiBold.otf') format('truetype');
                font-weight: normal;
                font-style: normal;
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <BackgroundWrapper>
          <Header />
          <main className="pt-40">
            {children}
          </main>
        </BackgroundWrapper>
        <Footer />
      </body>
    </html>
  );
}
