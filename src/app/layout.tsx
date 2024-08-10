import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { config } from '@fortawesome/fontawesome-svg-core'
import "./globals.css";
import 'tailwindcss/tailwind.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false

import Header from "./components/Header";

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
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="pt-40">
          {children}
        </main>
      </body>
    </html>
  );
}
