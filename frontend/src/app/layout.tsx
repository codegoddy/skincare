import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "ZenGlow - Nature Aura Elegance",
  description: "Exquisite Skin Revival with ZenGlow organic skincare.",
};

import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

/* ... existing imports */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <CartProvider>
          <CartDrawer />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

