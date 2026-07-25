"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = {
  eyebrow: string;
  headline: React.ReactNode;
  subhead: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  footnote: string;
  image: StaticImageData;
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
      }, 400);
      return () => clearTimeout(swap);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  function goTo(i: number) {
    if (i === index) return;
    setVisible(false);
    setTimeout(() => {
      setIndex(i);
      setVisible(true);
    }, 400);
  }

  const slide = slides[index];

  return (
    <section className="rj-hero-bg relative overflow-hidden border-b-2 border-rejesha-line bg-[linear-gradient(135deg,#fdf6ec_0%,#fdebd0_50%,#f5b942_100%)] px-6 py-16 sm:py-24">
      <div
        className={`mx-auto grid max-w-7xl items-center gap-12 transition-opacity duration-400 lg:grid-cols-2 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div>
          <span className="mb-4 inline-block border border-rejesha-green px-3 py-1 font-mono-brand text-[0.65rem] tracking-[0.25em] text-rejesha-green uppercase">
            {slide.eyebrow}
          </span>
          <div className="mt-3 h-[3px] w-10 bg-[linear-gradient(90deg,#bb0000,#006600)]" />
          <h1 className="font-editorial mt-4 max-w-xl text-4xl font-black leading-tight sm:text-6xl">
            {slide.headline}
          </h1>
          <p className="font-poppins mt-2 max-w-xl text-2xl font-semibold leading-tight text-rejesha-black/80 sm:text-3xl">
            {slide.subhead}
          </p>
          <p className="font-poppins mt-6 max-w-md text-sm text-rejesha-gray">
            {slide.description}
          </p>
          <Link
            href={slide.ctaHref}
            className="font-mono-brand mt-10 inline-block border-2 border-rejesha-red bg-rejesha-red px-10 py-3 text-xs tracking-widest text-rejesha-white uppercase transition-colors hover:border-rejesha-black hover:bg-rejesha-black"
          >
            {slide.ctaText}
          </Link>
          <p className="font-editorial mt-8 text-lg text-rejesha-black/70 italic">
            {slide.footnote}
          </p>
        </div>

        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm border border-rejesha-line/60 bg-rejesha-white shadow-[0_8px_40px_rgba(0,0,0,0.1)] lg:aspect-square">
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>

      {slides.length > 1 && (
        <div className="relative z-10 mx-auto mt-10 flex max-w-7xl items-center justify-center gap-2 lg:justify-start">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-rejesha-red" : "w-1.5 bg-rejesha-black/25"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
