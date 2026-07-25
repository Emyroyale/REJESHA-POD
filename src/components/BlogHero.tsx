"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RotatingPhrase from "@/components/RotatingPhrase";

const SLIDE_COUNT = 2;

export default function BlogHero() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setVisible(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % SLIDE_COUNT);
        setVisible(true);
      }, 400);
      return () => clearTimeout(swap);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  function goTo(i: number) {
    if (i === index) return;
    setVisible(false);
    setTimeout(() => {
      setIndex(i);
      setVisible(true);
    }, 400);
  }

  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 py-24 text-center sm:py-32"
      style={{
        background:
          "radial-gradient(ellipse at center, #1c1c1c 0%, #0a0a0a 70%)",
      }}
    >
      <div
        className={`mx-auto max-w-3xl transition-opacity duration-400 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {index === 0 ? (
          <>
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
              Stories from the Kenyan diaspora in America. Immigration.
              Identity. Life Ya Majuu.
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
          </>
        ) : (
          <>
            <span className="font-mono-brand inline-flex items-center gap-3 border border-rejesha-red/50 px-4 py-2 text-xs tracking-[0.3em] text-rejesha-red uppercase">
              <span aria-hidden="true">—</span>
              From the Journal to Your Closet
              <span aria-hidden="true">—</span>
            </span>

            <h1 className="font-editorial mt-6 text-5xl leading-tight text-rejesha-cream sm:text-6xl">
              Read It.
              <span className="font-script mt-1 block text-6xl text-rejesha-green sm:text-7xl">
                Wear It.
              </span>
            </h1>

            <p className="font-mono-brand mt-4 text-xs tracking-[0.2em] text-rejesha-cream/50 uppercase">
              Kenyan Pride Apparel &middot; Made to Order &middot; Worldwide
              Shipping
            </p>

            <p className="mx-auto mt-8 max-w-md text-sm text-rejesha-cream/60">
              Every story on the Journal comes from the same place as every
              design in the shop, Kenyan pride, wherever home is. Hoodies,
              tees, totes, and gifts for the diaspora, made to order and
              shipped worldwide.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="font-mono-brand bg-rejesha-red px-8 py-3 text-xs tracking-widest text-rejesha-white uppercase transition-colors hover:bg-rejesha-red/80"
              >
                Shop Rejesha
              </Link>
              <Link
                href="#journal-posts"
                className="font-mono-brand border border-rejesha-cream/40 px-8 py-3 text-xs tracking-widest text-rejesha-cream uppercase transition-colors hover:border-rejesha-cream hover:bg-rejesha-cream/10"
              >
                &larr; Back to Stories
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 mx-auto mt-10 flex max-w-3xl items-center justify-center gap-2">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-rejesha-red" : "w-1.5 bg-rejesha-cream/25"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
