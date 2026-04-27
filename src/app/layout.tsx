import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.settings.findMany({
    where: {
      key: { in: ['seo_title', 'seo_description', 'seo_keywords'] }
    }
  });

  const seoTitle = settings.find(s => s.key === 'seo_title')?.value || "TKS.bd | Premium Agro Direct from Orchard";
  const seoDesc = settings.find(s => s.key === 'seo_description')?.value || "Experience the true taste of Rajshahi's finest mangoes and organic harvests.";
  const seoKeywords = settings.find(s => s.key === 'seo_keywords')?.value || "Mango, Rajshahi, Organic Food, TKS.bd";

  return {
    title: seoTitle,
    description: seoDesc,
    keywords: seoKeywords.split(',').map(k => k.trim()),
    viewport: "width=device-width, initial-scale=1",
    robots: "index, follow",
  };
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`} suppressHydrationWarning>
        <CartProvider>
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
