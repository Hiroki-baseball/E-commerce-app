import type { Metadata } from "next";
import localFont from "next/font/local";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
// import { SessionProvider } from "next-auth/react";
import { NextAuthProvider } from "./lib/Next-auth/provider";
import { Suspense } from "react";
import Loading from "./loading";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// 修正: Noto Sans JP フォントの設定で subsets を指定
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"], // 利用可能なサブセットを指定
  variable: "--font-noto-sans-jp",
  weight: ["400", "700"], // 必要なウェイトを指定
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} antialiased`}
      >
        <NextAuthProvider>
          <Header />
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </NextAuthProvider>
      </body>
    </html>
  );
}
