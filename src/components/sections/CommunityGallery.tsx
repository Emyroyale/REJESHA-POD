// Placeholder community gallery — replace tiles with real UGC photos
// when available. Each tile currently shows a styled placeholder.

const GALLERY_PLACEHOLDERS = [
  { id: 1, bg: "bg-rejesha-black", label: "Nairobi · Kenyatta Avenue" },
  { id: 2, bg: "bg-rejesha-green", label: "Dallas Family Reunion 2024" },
  { id: 3, bg: "bg-rejesha-charcoal", label: "London Kenyan Community" },
  { id: 4, bg: "bg-rejesha-red", label: "Caribbean Cruise Group" },
  { id: 5, bg: "bg-rejesha-charcoal", label: "Atlanta Diaspora Meet" },
  { id: 6, bg: "bg-rejesha-black", label: "Graduation Day — Houston" },
];

export default function CommunityGallery() {
  return (
    <section
      className="bg-rejesha-white py-16 sm:py-20"
      aria-labelledby="community-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="font-mono-brand text-[0.6rem] tracking-[0.25em] text-rejesha-muted-gray uppercase">
            #WornYourWay
          </p>
          <h2
            id="community-heading"
            className="mt-2 font-display text-3xl text-rejesha-black sm:text-4xl"
          >
            Worn Your Way
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-rejesha-muted-gray">
            Tag{" "}
            <span className="font-semibold text-rejesha-black">@rejeshastore</span>{" "}
            to be featured. Kenyans everywhere, repping their roots.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {GALLERY_PLACEHOLDERS.map((tile) => (
            <div
              key={tile.id}
              className={`${tile.bg} group relative aspect-square overflow-hidden`}
            >
              {/* Placeholder shimmer pattern */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
                }}
              />

              {/* REJESHA shield watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <svg viewBox="0 0 24 28" className="h-16 w-auto" fill="white">
                  <path d="M12 0 L23 4 V14 C23 21 18 25.5 12 28 C6 25.5 1 21 1 14 V4 Z" />
                </svg>
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-rejesha-black/90 p-3 transition-transform duration-300 group-hover:translate-y-0">
                <p className="font-mono-brand text-[0.6rem] tracking-widest text-white/80 uppercase">
                  {tile.label}
                </p>
              </div>

              {/* UGC placeholder badge */}
              <div className="absolute right-2 top-2 rounded-full bg-white/10 px-2 py-0.5">
                <span className="font-mono-brand text-[0.55rem] text-white/60 uppercase">
                  Photo Coming Soon
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="mt-8 text-center">
          <a
            href="https://instagram.com/rejeshastore"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono-brand text-[0.65rem] tracking-widest text-rejesha-muted-gray uppercase transition-colors hover:text-rejesha-black"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
            Follow @rejeshastore on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
