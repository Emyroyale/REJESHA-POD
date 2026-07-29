"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = {
  eyebrow: string;
  headline: React.ReactNode;
  subhead: string;
  description: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
  footnote: string;
  image: StaticImageData | string;
  imageAlt: string;
};

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (slides.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setVisible(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % slides.length);
        setVisible(true);
      }, 450);
      return () => clearTimeout(swap);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  function goTo(i: number) {
    if (i === index) return;
    setVisible(false);
    setTimeout(() => {
      setIndex(i);
      setVisible(true);
    }, 450);
  }

  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden border-b border-rejesha-border bg-rejesha-cream"
      aria-label="Featured collections"
    >
      {/* Animated gradient background */}
      <div className="rj-hero-bg absolute inset-0 bg-[linear-gradient(135deg,#F7F3EA_0%,#EDE5D0_40%,#D9C7A3_70%,#F7F3EA_100%)] opacity-70" />

      {/* Flag-color accent stripe at very top */}
      <div className="absolute left-0 right-0 top-0 flex h-0.5">
        <div className="flex-1 bg-rejesha-black" />
        <div className="flex-1 bg-rejesha-red" />
        <div className="flex-1 bg-rejesha-white border-t border-rejesha-border" />
        <div className="flex-1 bg-rejesha-red" />
        <div className="flex-1 bg-rejesha-green" />
      </div>

      <div
        className={`relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 transition-opacity duration-450 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* ── Copy ── */}
        <div className="order-2 lg:order-1">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 border border-rejesha-green/40 bg-rejesha-green/10 px-3 py-1 font-mono-brand text-[0.6rem] tracking-[0.25em] text-rejesha-green uppercase">
            {slide.eyebrow}
          </span>

          {/* Accent bar */}
          <div className="rj-accent-line mt-4 h-[3px] bg-gradient-to-r from-rejesha-red to-rejesha-green" />

          {/* Headline */}
          <h1 className="font-editorial mt-5 max-w-xl text-4xl font-black leading-[1.1] text-rejesha-black sm:text-5xl lg:text-6xl">
            {slide.headline}
          </h1>

          {/* Subhead */}
          <p className="font-poppins mt-3 max-w-md text-xl font-semibold text-rejesha-black/70 sm:text-2xl">
            {slide.subhead}
          </p>

          {/* Description */}
          <p className="mt-5 max-w-md text-sm leading-relaxed text-rejesha-muted-gray">
            {slide.description}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={slide.ctaPrimary.href}
              className="bg-rejesha-red px-8 py-3.5 font-mono-brand text-xs tracking-widest text-white uppercase transition-colors hover:bg-rejesha-black"
            >
              {slide.ctaPrimary.text}
            </Link>
            {slide.ctaSecondary && (
              <Link
                href={slide.ctaSecondary.href}
                className="border-2 border-rejesha-black bg-transparent px-8 py-3.5 font-mono-brand text-xs tracking-widest text-rejesha-black uppercase transition-colors hover:bg-rejesha-black hover:text-white"
              >
                {slide.ctaSecondary.text}
              </Link>
            )}
          </div>

          {/* Footnote */}
          <p className="font-editorial mt-8 text-base italic text-rejesha-black/50">
            {slide.footnote}
          </p>
        </div>

        {/* ── Image ── */}
        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] lg:aspect-square">
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            {/* Subtle frame */}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div
          className="relative z-10 mx-auto flex max-w-7xl items-center gap-2 px-6 pb-8 lg:justify-start"
          role="group"
          aria-label="Slide navigation"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-rejesha-red"
                  : "w-1.5 bg-rejesha-black/20 hover:bg-rejesha-black/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
