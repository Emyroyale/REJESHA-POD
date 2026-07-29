import Image from "next/image";
import Link from "next/link";

export default function EditorialFeature() {
  return (
    <section
      className="bg-rejesha-white"
      aria-labelledby="editorial-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2">
          {/* Image side */}
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[540px]">
            <Image
              src="/images/hero-lifestyle.png"
              alt="Two people wearing REJESHA Kenyan-inspired T-shirts on Kenyatta Avenue, Nairobi"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            {/* Kenyan flag color stripe overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex h-1">
              <div className="flex-1 bg-rejesha-black" />
              <div className="flex-1 bg-rejesha-red" />
              <div className="flex-1 bg-rejesha-white" />
              <div className="flex-1 bg-rejesha-red" />
              <div className="flex-1 bg-rejesha-green" />
            </div>
          </div>

          {/* Copy side */}
          <div className="flex flex-col justify-center bg-rejesha-cream px-8 py-16 sm:px-12 sm:py-20 lg:px-16">
            <p className="font-mono-brand text-[0.6rem] tracking-[0.25em] text-rejesha-muted-gray uppercase">
              The REJESHA Story
            </p>

            <div className="mt-4 h-0.5 w-10 bg-gradient-to-r from-rejesha-red to-rejesha-green" />

            <h2
              id="editorial-heading"
              className="mt-6 font-display text-3xl leading-tight text-rejesha-black sm:text-4xl lg:text-5xl"
            >
              From Nairobi
              <br />
              to Everywhere.
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-rejesha-muted-gray">
              Every shirt we make starts with a feeling — the way home smells at
              night, a matatu slogan that made you laugh, a grandmother&apos;s
              saying that still lives in your chest years later.
            </p>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-rejesha-muted-gray">
              REJESHA is Swahili for{" "}
              <em className="font-editorial text-rejesha-black">
                &ldquo;to bring back&rdquo;
              </em>
              . That&apos;s what we do — bring back what you carry inside,
              and put it somewhere the world can see it.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-block bg-rejesha-black px-8 py-3.5 text-center font-mono-brand text-xs tracking-widest text-white uppercase transition-colors hover:bg-rejesha-red"
              >
                Shop the Collection
              </Link>
              <Link
                href="/about"
                className="inline-block border border-rejesha-border px-8 py-3.5 text-center font-mono-brand text-xs tracking-widest text-rejesha-black uppercase transition-colors hover:border-rejesha-black"
              >
                Our Story
              </Link>
            </div>

            {/* Pull quote */}
            <blockquote className="mt-12 border-l-2 border-rejesha-red pl-5">
              <p className="font-editorial text-xl italic text-rejesha-black/70">
                &ldquo;Rep Your Roots. Tell Your Story.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
