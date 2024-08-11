import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { config } from '@fortawesome/fontawesome-svg-core'
import "./globals.css";
import 'tailwindcss/tailwind.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import assetPrefix from "../../next.config.mjs";
import Head from "next/head"; // Import the Head component

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
  const basePath = process.env.NODE_ENV === 'production' ? assetPrefix : '';
  return (
    <html lang="ja">
      <Head>
        <style>{`
          @font-face {
            font-family: 'DMSans';
            src: url('${basePath}/fonts/DMSans-VariableFont.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'OpenSans';
            src: url('${basePath}/fonts/OpenSans-VariableFont.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'MOBO';
            src: url('${basePath}/fonts/MOBO-SemiBold.otf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}</style>
      </Head>
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
