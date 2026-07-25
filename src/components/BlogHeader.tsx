import Link from "next/link";
import { blogPillars } from "@/lib/blog-posts";

export default function BlogHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rejesha-line bg-rejesha-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/blog"
          className="font-editorial flex items-baseline gap-1 text-2xl font-bold text-rejesha-black"
        >
          Rejesha
          <sup className="font-mono-brand text-[0.5rem] text-rejesha-gray">
            TM
          </sup>
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-widest text-rejesha-gray lg:flex">
          {blogPillars.map((pillar) => (
            <Link
              key={pillar.slug}
              href={`/blog?category=${pillar.slug}`}
              className="transition-colors hover:text-rejesha-black"
            >
              {pillar.navLabel}
            </Link>
          ))}
        </nav>

        <Link
          href="/products"
          className="bg-[#c1440e] px-5 py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-rejesha-black"
        >
          Shop ↗
        </Link>
      </div>
    </header>
  );
}
