import { Suspense } from "react";
import BlogSection from "@/components/BlogSection";
import HeroCarousel from "@/components/HeroCarousel";
import TeesSection from "@/components/TeesSection";
import { getProducts } from "@/lib/printify";
import heroImage from "../../public/images/hero-kenyan-pride.jpg";

const heroSlides = [
  {
    eyebrow: "Kenyan Pride Apparel & Gifts",
    headline: (
      <>
        Rep Your <em className="text-rejesha-red">Roots.</em> Tell Your{" "}
        <em className="text-rejesha-green">Story.</em>
      </>
    ),
    subhead: "Designed for Kenyans, wherever home is.",
    description:
      "Bold Kenyan-inspired designs on hoodies, tees, tote bags, caps, mugs, and pillows made for the diaspora. Designed with pride, made to order, printed in the USA, and shipped worldwide to Kenyans in America, the UK, and beyond.",
    ctaText: "Shop Kenyan Pride Collection",
    ctaHref: "/products",
    footnote: "Different Country. Same Heart.",
    image: heroImage,
    imageAlt:
      "Couple wearing REJESHA Area Code 254 hoodies in Kenyan flag colors, part of the Kenyan pride apparel collection for the diaspora",
  },
  {
    eyebrow: "New Arrival",
    headline: (
      <>
        Shop the <em className="text-rejesha-red">Area</em> Code{" "}
        <em className="text-rejesha-green">254</em> Collection
      </>
    ),
    subhead: "Matching hoodies for you and yours.",
    description:
      "Our best-selling hoodie, printed in bold red, white, and green with the 254 area code that says home without saying a word. Unisex sizing, made to order, and ready to ship to the diaspora anywhere in the world.",
    ctaText: "Shop Area Code 254 Hoodies",
    ctaHref: "/products",
    footnote: "Wherever you are, the code stays the same.",
    image: heroImage,
    imageAlt:
      "Couple wearing matching REJESHA Area Code 254 hoodies in Kenyan flag colors on a couch, showcasing the hoodie available in the REJESHA store",
  },
];

export default function Home() {
  return (
    <div>
      <HeroCarousel slides={heroSlides} />

      <Suspense fallback={null}>
        <TeesSectionData />
      </Suspense>

      <BlogSection />
    </div>
  );
}

async function TeesSectionData() {
  let products;
  try {
    products = await getProducts();
  } catch {
    return null;
  }
  return <TeesSection products={products} />;
}
