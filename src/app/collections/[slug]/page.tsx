import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = COLLECTIONS[slug];
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: `${collection.name} T-Shirts | REJESHA`,
    description: collection.description,
  };
}

type CollectionMeta = {
  name: string;
  tagline: string;
  description: string;
  image: string;
  productTag: string;
  accentColor: string;
};

const COLLECTIONS: Record<string, CollectionMeta> = {
  "kenyan-pride": {
    name: "Kenyan Pride",
    tagline: "Flag. Lion. Heart. Legacy.",
    description:
      "Bold graphics celebrating Kenyan identity — the flag, the Maasai, the wildlife, and everything that makes home home.",
    image: "/images/collections/kenyan-pride.png",
    productTag: "kenyan-pride",
    accentColor: "#B51F2E",
  },
  "sheng-swahili": {
    name: "Sheng & Swahili",
    tagline: "Say it in the language of home.",
    description:
      "Swahili proverbs, Sheng slang, and the words that only make sense to someone who grew up in Kenya.",
    image: "/images/collections/sheng-swahili.png",
    productTag: "sheng-swahili",
    accentColor: "#176B45",
  },
  "travel-cruise": {
    name: "Travel & Cruise",
    tagline: "Custom shirts for every journey.",
    description:
      "Matching group shirts for cruises, family reunions, destination weddings, and bucket-list trips.",
    image: "/images/collections/travel-cruise.png",
    productTag: "travel-cruise",
    accentColor: "#111111",
  },
  faith: {
    name: "Faith Collection",
    tagline: "Grounded in something greater.",
    description:
      "Uplifting scripture-inspired designs and faith-forward graphics — wear your beliefs with pride.",
    image: "/images/hero-lifestyle.png",
    productTag: "faith",
    accentColor: "#F0B429",
  },
};

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = COLLECTIONS[slug];

  if (!collection) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-3xl text-rejesha-black">
          Collection not found
        </p>
        <Link
          href="/products"
          className="font-mono-brand text-sm tracking-widest text-rejesha-muted-gray uppercase underline-offset-2 hover:text-rejesha-black hover:underline"
        >
          Browse All T-Shirts
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rejesha-white">
      {/* Hero banner */}
      <div className="relative overflow-hidden border-b border-rejesha-border">
        <div className="relative aspect-[21/7] w-full">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 font-mono-brand text-[0.6rem] tracking-widest text-white/60 uppercase">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">·</li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Shop
                  </Link>
                </li>
                <li aria-hidden="true">·</li>
                <li aria-current="page" className="text-white">
                  {collection.name}
                </li>
              </ol>
            </nav>

            <div
              className="mb-3 h-0.5 w-10"
              style={{ backgroundColor: collection.accentColor }}
            />
            <p className="font-mono-brand text-[0.65rem] tracking-[0.25em] text-white/70 uppercase">
              {collection.tagline}
            </p>
            <h1 className="mt-2 font-display text-4xl text-white sm:text-5xl lg:text-6xl">
              {collection.name}
            </h1>
            <p className="mt-3 max-w-sm text-sm text-white/70 leading-relaxed">
              {collection.description}
            </p>
          </div>
        </div>
      </div>

      {/* Products — redirect to filtered listing */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="mb-8 text-sm text-rejesha-muted-gray">
          Showing all {collection.name} designs.
        </p>

        {/* Placeholder grid — replace with real tag-filtered Printify fetch */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Link
              key={i}
              href="/products"
              className="group block"
              aria-label="Browse product"
            >
              <div className="relative aspect-square overflow-hidden bg-rejesha-cream">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 64 64"
                    className="h-16 w-16 text-rejesha-border"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M22 12C22 8 26 6 32 6c6 0 10 2 10 6l8 4v6l-8-4v30H22V22l-8 4v-6l8-4Z" />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-rejesha-black py-3 text-center font-mono-brand text-[0.6rem] tracking-widest text-white uppercase transition-transform duration-300 group-hover:translate-y-0">
                  View Product
                </div>
              </div>
              <div className="mt-3 h-3 w-3/4 animate-pulse rounded bg-rejesha-border" />
              <div className="mt-1.5 h-3 w-1/3 animate-pulse rounded bg-rejesha-border/60" />
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-rejesha-muted-gray">
          More designs coming soon.{" "}
          <Link href="/products" className="font-semibold text-rejesha-black underline-offset-2 hover:underline">
            Browse all T-shirts →
          </Link>
        </p>
      </div>
    </div>
  );
}
