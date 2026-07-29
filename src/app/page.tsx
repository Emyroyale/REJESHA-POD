import { Suspense } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import CollectionTiles from "@/components/sections/CollectionTiles";
import BestSellers from "@/components/sections/BestSellers";
import BrandStatement from "@/components/sections/BrandStatement";
import ShopPathSplit from "@/components/sections/ShopPathSplit";
import EditorialFeature from "@/components/sections/EditorialFeature";
import TrustBar from "@/components/sections/TrustBar";
import CommunityGallery from "@/components/sections/CommunityGallery";
import BlogSection from "@/components/BlogSection";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import { getProducts } from "@/lib/printify";
import type { PrintifyProduct } from "@/lib/printify";
import heroImage from "../../public/images/hero-kenyan-pride.jpg";
import heroLifestyle from "../../public/images/hero-lifestyle.png";

const heroSlides = [
  {
    eyebrow: "Kenyan Pride Apparel",
    headline: (
      <>
        Rep Your{" "}
        <em className="not-italic text-rejesha-red">Roots.</em>
        <br />
        Tell Your{" "}
        <em className="not-italic text-rejesha-green">Story.</em>
      </>
    ),
    subhead: "Designed for Kenyans, wherever home is.",
    description:
      "Bold Kenyan-inspired T-shirts for the diaspora. Original graphics, Sheng & Swahili prints, and custom group shirts — printed in the USA and shipped worldwide.",
    ctaPrimary: { text: "Shop Best Sellers", href: "/products?category=best-sellers" },
    ctaSecondary: { text: "Customize a Shirt", href: "/customize" },
    footnote: "Different Country. Same Heart.",
    image: heroLifestyle,
    imageAlt:
      "Couple wearing REJESHA Kenyan-inspired T-shirts on Kenyatta Avenue, Nairobi",
  },
  {
    eyebrow: "New Arrival",
    headline: (
      <>
        Area Code{" "}
        <em className="not-italic text-rejesha-red">254</em>{" "}
        <em className="not-italic text-rejesha-green">Collection</em>
      </>
    ),
    subhead: "The code that says home without a word.",
    description:
      "Our best-selling design in bold red, white, and green. Unisex and women's fits. Made to order, ready to ship to Kenyans anywhere in the world.",
    ctaPrimary: { text: "Shop Area Code 254", href: "/products" },
    ctaSecondary: { text: "View All Collections", href: "/products" },
    footnote: "Wherever you are, the code stays the same.",
    image: heroImage,
    imageAlt:
      "Couple wearing matching REJESHA Area Code 254 hoodies in Kenyan flag colors",
  },
];

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <HeroCarousel slides={heroSlides} />

      {/* 2. Collection tiles */}
      <CollectionTiles />

      {/* 3. Best Sellers + 7. New Arrivals — single data fetch */}
      <Suspense fallback={<ProductsSkeleton label="Best Sellers" />}>
        <ProductSections />
      </Suspense>

      {/* 4. Brand statement */}
      <BrandStatement />

      {/* 5. Shop path split */}
      <ShopPathSplit />

      {/* 6. Editorial feature */}
      <EditorialFeature />

      {/* 8. Trust bar */}
      <TrustBar />

      {/* 9. Community gallery */}
      <CommunityGallery />

      {/* 10. Blog / Journal */}
      <BlogSection />

      {/* 11. Newsletter */}
      <NewsletterSignup />
    </>
  );
}

/** Single server fetch — passes same products to BestSellers + NewArrivals */
async function ProductSections() {
  let products: PrintifyProduct[] = [];
  try {
    products = await getProducts();
  } catch {
    return null;
  }

  return (
    <>
      <BestSellers
        products={products}
        heading="Best Sellers"
        eyebrow="Most Loved"
      />
      <BestSellers
        products={products}
        heading="Just Dropped"
        eyebrow="New Arrivals"
        tag="new"
        showTabs={false}
      />
    </>
  );
}

function ProductsSkeleton({ label }: { label: string }) {
  return (
    <section className="bg-white py-16 sm:py-20" aria-busy="true" aria-label={`Loading ${label}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10">
          <div className="h-3 w-20 animate-pulse rounded bg-rejesha-border" />
          <div className="mt-3 h-8 w-48 animate-pulse rounded bg-rejesha-border" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square animate-pulse rounded bg-rejesha-cream" />
          ))}
        </div>
      </div>
    </section>
  );
}
