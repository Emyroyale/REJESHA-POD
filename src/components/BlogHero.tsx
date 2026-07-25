import Link from "next/link";
import RotatingPhrase from "@/components/RotatingPhrase";

export default function BlogHero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 py-24 text-center sm:py-32"
      style={{
        background:
          "radial-gradient(ellipse at center, #1c1c1c 0%, #0a0a0a 70%)",
      }}
    >
      <div className="mx-auto max-w-3xl">
        <span className="font-mono-brand inline-flex items-center gap-3 border border-rejesha-green/50 px-4 py-2 text-xs tracking-[0.3em] text-rejesha-green uppercase">
          <span aria-hidden="true">—</span>
          Kenyan Diaspora — U.S. Edition
          <span aria-hidden="true">—</span>
        </span>

        <h1 className="font-editorial mt-6 text-5xl leading-tight text-rejesha-cream sm:text-6xl">
          The Rejesha
          <span className="font-script mt-1 block text-6xl text-rejesha-red sm:text-7xl">
            Journal
          </span>
        </h1>

        <p className="font-mono-brand mt-4 text-xs tracking-[0.2em] text-rejesha-cream/50 uppercase">
          Real Stories &middot; Real Lives &middot; Life Ya Majuu
        </p>

        <div className="mt-8">
          <RotatingPhrase
            phrases={["Life Ya Majuu.", "Real Stories.", "Real Lives."]}
          />
        </div>

        <p className="mx-auto mt-6 max-w-md text-sm text-rejesha-cream/60">
          Stories from the Kenyan diaspora in America. Immigration. Identity.
          Life Ya Majuu.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#journal-posts"
            className="font-mono-brand bg-rejesha-green px-8 py-3 text-xs tracking-widest text-rejesha-white uppercase transition-colors hover:bg-rejesha-green/80"
          >
            Read Stories
          </Link>
          <Link
            href="/products"
            className="font-mono-brand border border-rejesha-cream/40 px-8 py-3 text-xs tracking-widest text-rejesha-cream uppercase transition-colors hover:border-rejesha-cream hover:bg-rejesha-cream/10"
          >
            Shop Rejesha &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
