import type { Metadata } from "next";
import { Inter, Archivo_Black, Poppins, Playfair_Display, Space_Mono, Alex_Brush } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo",
  weight: "400",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  weight: ["700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "REJESHA — Kenyan Pride Apparel & Gifts for the Diaspora",
  description:
    "Premium Kenyan-inspired hoodies, tote bags, caps, and mugs for the Kenyan diaspora. Designed with pride, printed in the USA, made to order, and shipped worldwide.",
  keywords: [
    "Kenyan apparel",
    "Kenyan pride clothing",
    "Kenyan diaspora gifts",
    "Kenya flag hoodie",
    "Kenyan gifts USA",
    "254 represent apparel",
  ],
  openGraph: {
    title: "REJESHA — Kenyan Pride Apparel & Gifts for the Diaspora",
    description:
      "Premium Kenyan-inspired apparel and gifts, designed for Kenyans wherever home is. Printed in the USA, shipped worldwide.",
    siteName: "REJESHA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivoBlack.variable} ${poppins.variable} ${playfairDisplay.variable} ${spaceMono.variable} ${alexBrush.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-rejesha-white text-rejesha-black">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
