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

export const metadata: Metadata = {
  title: "TKS.bd | Premium Agro Direct from Orchard",
  description: "Experience the true taste of Rajshahi's finest mangoes and organic harvests, delivered with transparency and care.",
  keywords: ["Mango", "Rajshahi", "Organic Food", "TKS.bd", "Himsagar", "Langra"],
};

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
