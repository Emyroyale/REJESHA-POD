import Link from "next/link";

const PATHS = [
  {
    id: "ready-made",
    eyebrow: "Ready When You Are",
    title: "Ready-Made\nT-Shirts",
    description:
      "Original Kenyan and diaspora-inspired designs. Pick your size, pick your color, wear your story. Ships worldwide in days.",
    cta: "Shop All Tees",
    href: "/products",
    bg: "bg-rejesha-cream",
    textColor: "text-rejesha-black",
    ctaStyle:
      "border-2 border-rejesha-black bg-rejesha-black text-white hover:bg-transparent hover:text-rejesha-black",
    accentColor: "bg-rejesha-green",
    icon: (
      <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12 C22 8 26 6 32 6 C38 6 42 8 42 12 L50 16 L50 22 L42 18 L42 54 L22 54 L22 18 L14 22 L14 16 Z" />
        <path d="M26 32 L38 32 M32 26 L32 38" strokeLinecap="round" strokeWidth="2" />
      </svg>
    ),
    features: ["Over 20 original designs", "Unisex + Women's fits", "Ships in 5–10 days"],
  },
  {
    id: "custom",
    eyebrow: "Make It Yours",
    title: "Custom Group\nShirts",
    description:
      "Reunions, cruises, birthday trips, graduations. Upload your design or work with our templates. Minimum 1 shirt.",
    cta: "Start Customizing",
    href: "/customize",
    bg: "bg-rejesha-black",
    textColor: "text-rejesha-white",
    ctaStyle:
      "border-2 border-rejesha-red bg-rejesha-red text-white hover:bg-transparent hover:text-rejesha-red",
    accentColor: "bg-rejesha-red",
    icon: (
      <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12 C22 8 26 6 32 6 C38 6 42 8 42 12 L50 16 L50 22 L42 18 L42 54 L22 54 L22 18 L14 22 L14 16 Z" />
        <path d="M26 30 L30 34 L38 26" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <circle cx="48" cy="48" r="8" fill="currentColor" fillOpacity="0.15" />
        <path d="M44 48 L48 44 L52 48 M48 44 L48 52" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    features: ["Custom names & numbers", "Any design, any occasion", "Group pricing available"],
  },
];

export default function ShopPathSplit() {
  return (
    <section className="bg-rejesha-white" aria-labelledby="shop-path-heading">
      <div className="sr-only">
        <h2 id="shop-path-heading">Two Ways to Shop REJESHA</h2>
      </div>

      <div className="grid sm:grid-cols-2">
        {PATHS.map((path) => (
          <div
            key={path.id}
            className={`${path.bg} ${path.textColor} flex flex-col px-8 py-16 sm:px-12 sm:py-20`}
          >
            {/* Accent bar */}
            <div className={`mb-8 h-0.5 w-10 ${path.accentColor}`} />

            {/* Eyebrow */}
            <p className="font-mono-brand text-[0.6rem] tracking-[0.25em] opacity-60 uppercase">
              {path.eyebrow}
            </p>

            {/* Icon */}
            <div className="my-6 opacity-80">{path.icon}</div>

            {/* Title */}
            <h3 className="whitespace-pre-line font-display text-4xl leading-tight sm:text-5xl">
              {path.title}
            </h3>

            {/* Description */}
            <p className="mt-5 max-w-xs text-sm leading-relaxed opacity-70">
              {path.description}
            </p>

            {/* Features */}
            <ul className="mt-6 space-y-2">
              {path.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs opacity-60">
                  <span className={`h-1 w-1 rounded-full flex-shrink-0 ${path.accentColor}`} />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-10">
              <Link
                href={path.href}
                className={`inline-block px-8 py-3.5 font-mono-brand text-xs tracking-widest uppercase transition-all duration-200 ${path.ctaStyle}`}
              >
                {path.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
