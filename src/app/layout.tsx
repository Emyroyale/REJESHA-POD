import type { Metadata } from "next";
import {
  Inter,
  Archivo_Black,
  Poppins,
  Playfair_Display,
  Space_Mono,
  Alex_Brush,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CartDrawer from "@/components/layout/CartDrawer";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
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
  title: {
    default: "Kenyan T-Shirts for the Diaspora | REJESHA",
    template: "%s | REJESHA",
  },
  description:
    "Bold Kenyan-inspired T-shirts designed for the diaspora. Sheng & Swahili graphics, Kenyan Pride prints, custom group shirts — printed in the USA, shipped worldwide.",
  keywords: [
    "Kenyan T-shirts",
    "Kenyan diaspora apparel",
    "Kenyan pride clothing",
    "Swahili T-shirt",
    "Sheng T-shirt",
    "custom group shirts Kenya",
    "254 represent",
    "Kenyan gifts USA",
  ],
  openGraph: {
    title: "Kenyan T-Shirts for the Diaspora | REJESHA",
    description:
      "Rep Your Roots. Tell Your Story. Bold Kenyan-inspired T-shirts for the diaspora — printed in the USA, shipped worldwide.",
    siteName: "REJESHA",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenyan T-Shirts for the Diaspora | REJESHA",
    description: "Rep Your Roots. Tell Your Story.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivoBlack.variable} ${poppins.variable} ${playfairDisplay.variable} ${spaceMono.variable} ${alexBrush.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-rejesha-black">
        <CartProvider>
          {/* Announcement ticker */}
          <AnnouncementBar />

          {/* Sticky header */}
          <Header />

          {/* Page content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <Footer />

          {/* Cart drawer — rendered outside main flow */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
