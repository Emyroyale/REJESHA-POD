import Image from "next/image";
import Link from "next/link";

const COLLECTIONS = [
  {
    title: "Kenyan Pride",
    tagline: "Flag. Lion. Heart. Legacy.",
    href: "/collections/kenyan-pride",
    image: "/images/collections/kenyan-pride.png",
    bg: "bg-rejesha-black",
  },
  {
    title: "Sheng & Swahili",
    tagline: "Say it in the language of home.",
    href: "/collections/sheng-swahili",
    image: "/images/collections/sheng-swahili.png",
    bg: "bg-rejesha-charcoal",
  },
  {
    title: "Travel & Cruise",
    tagline: "Custom shirts for every journey.",
    href: "/collections/travel-cruise",
    image: "/images/collections/travel-cruise.png",
    bg: "bg-rejesha-green",
  },
  {
    title: "Custom Group Shirts",
    tagline: "Reunions · Cruises · Graduations",
    href: "/customize",
    // No image — uses gradient tile
    image: null,
    bg: "bg-rejesha-red",
    isCustom: true,
  },
];

export default function CollectionTiles() {
  return (
    <section className="bg-rejesha-cream py-16 sm:py-20" aria-labelledby="collections-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono-brand text-[0.6rem] tracking-[0.25em] text-rejesha-muted-gray uppercase">
              Shop by Collection
            </p>
            <h2
              id="collections-heading"
              className="mt-2 font-display text-3xl text-rejesha-black sm:text-4xl"
            >
              Find Your Story
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden shrink-0 font-mono-brand text-[0.65rem] tracking-widest text-rejesha-muted-gray uppercase underline-offset-2 hover:text-rejesha-black hover:underline sm:block"
          >
            View All →
          </Link>
        </div>

        {/* Grid: 2-up on all sizes, 4-up on large */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.href}
              href={col.href}
              className="group relative aspect-[3/4] overflow-hidden"
              aria-label={`Shop ${col.title} collection`}
            >
              {col.image ? (
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
              ) : (
                /* Gradient tile for custom shirts */
                <div className={`absolute inset-0 ${col.bg} transition-opacity duration-300`}>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4zIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <svg viewBox="0 0 48 48" className="h-12 w-12 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M16 12 C16 8 20 6 24 6 C28 6 32 8 32 12 L36 14 L36 18 L32 16 L32 38 L16 38 L16 16 L12 18 L12 14 Z" />
                      <path d="M20 22 L24 22 M24 22 L24 30 M24 22 L28 22" strokeLinecap="round" />
                    </svg>
                    <p className="font-display text-lg leading-tight text-white sm:text-xl">
                      Make It Yours
                    </p>
                  </div>
                </div>
              )}

              {/* Overlay gradient */}
              {col.image && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              )}

              {/* Text content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <p className="font-mono-brand text-[0.55rem] tracking-[0.2em] text-white/70 uppercase">
                  {col.tagline}
                </p>
                <h3 className="mt-1 font-display text-lg leading-tight text-white sm:text-xl">
                  {col.title}
                </h3>
                <span className="mt-2 inline-block font-mono-brand text-[0.6rem] tracking-widest text-rejesha-gold uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
