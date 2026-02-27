import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Daily Push - 每日资讯精选",
  description: "AI热点、万代Hot Toys新品、游戏折扣，每日精选资讯一站掌握",
  keywords: ["AI新闻", "万代", "Hot Toys", "Steam折扣", "游戏优惠"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
