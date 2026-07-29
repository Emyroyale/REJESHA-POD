"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import MobileMenu from "@/components/layout/MobileMenu";
import BlogHeader from "@/components/BlogHeader";

const SHOP_DROPDOWN = [
  { label: "Shop All T-Shirts", href: "/products" },
  { label: "Unisex Tees", href: "/products?fit=unisex" },
  { label: "Women's Tees", href: "/products?fit=womens" },
  { label: "Best Sellers", href: "/products?category=best-sellers" },
  { label: "New Arrivals", href: "/products?category=new" },
];

const COLLECTIONS_DROPDOWN = [
  { label: "Kenyan Pride", href: "/collections/kenyan-pride" },
  { label: "Sheng & Swahili", href: "/collections/sheng-swahili" },
  { label: "Travel & Cruise", href: "/collections/travel-cruise" },
  { label: "Faith Collection", href: "/collections/faith" },
  { label: "Custom Group Shirts", href: "/customize" },
];

export default function Header() {
  const { count, openDrawer } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/blog")) return <BlogHeader />;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-rejesha-white shadow-sm border-b border-rejesha-border"
            : "bg-rejesha-white border-b border-rejesha-border"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          {/* ── Mobile: Hamburger ── */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded transition-colors hover:bg-rejesha-cream lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl tracking-brand text-rejesha-black transition-opacity hover:opacity-80 sm:text-2xl"
          >
            REJESHA
            <svg viewBox="0 0 24 28" className="h-4 w-auto shrink-0" aria-hidden="true">
              <path d="M12 0 L23 4 V14 C23 21 18 25.5 12 28 C6 25.5 1 21 1 14 V4 Z" fill="#111" />
              <path d="M12 2.2 L21 5.4 V14 C21 19.8 17 23.6 12 25.8 C7 23.6 3 19.8 3 14 V5.4 Z" fill="#B51F2E" />
              <path d="M12 4.6 L19 7 V14 C19 18.6 16 21.8 12 23.6 C8 21.8 5 18.6 5 14 V7 Z" fill="#176B45" />
              <line x1="6" y1="6" x2="18" y2="20" stroke="#fff" strokeWidth="1" />
              <line x1="18" y1="6" x2="6" y2="20" stroke="#fff" strokeWidth="1" />
            </svg>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {/* Shop dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 px-3 py-2 font-mono-brand text-[0.65rem] tracking-widest uppercase transition-colors hover:text-rejesha-red">
                Shop
                <svg viewBox="0 0 16 16" className="h-3 w-3 transition-transform group-hover:rotate-180" fill="currentColor">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </button>
              <div className="invisible absolute left-0 top-full z-50 min-w-[200px] origin-top-left scale-95 bg-rejesha-white opacity-0 shadow-xl ring-1 ring-rejesha-border transition-all duration-150 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                {SHOP_DROPDOWN.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block px-5 py-3 text-sm transition-colors hover:bg-rejesha-cream hover:text-rejesha-red"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/products?category=best-sellers" className="px-3 py-2 font-mono-brand text-[0.65rem] tracking-widest uppercase transition-colors hover:text-rejesha-red">
              Best Sellers
            </Link>

            <Link href="/products?category=new" className="px-3 py-2 font-mono-brand text-[0.65rem] tracking-widest uppercase transition-colors hover:text-rejesha-red">
              New Arrivals
            </Link>

            <Link href="/customize" className="px-3 py-2 font-mono-brand text-[0.65rem] tracking-widest uppercase text-rejesha-red transition-colors hover:text-rejesha-black">
              Customize ✦
            </Link>

            {/* Collections dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 px-3 py-2 font-mono-brand text-[0.65rem] tracking-widest uppercase transition-colors hover:text-rejesha-red">
                Collections
                <svg viewBox="0 0 16 16" className="h-3 w-3 transition-transform group-hover:rotate-180" fill="currentColor">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </button>
              <div className="invisible absolute left-0 top-full z-50 min-w-[200px] origin-top-left scale-95 bg-rejesha-white opacity-0 shadow-xl ring-1 ring-rejesha-border transition-all duration-150 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                {COLLECTIONS_DROPDOWN.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block px-5 py-3 text-sm transition-colors hover:bg-rejesha-cream hover:text-rejesha-red"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/blog" className="px-3 py-2 font-mono-brand text-[0.65rem] tracking-widest uppercase transition-colors hover:text-rejesha-red">
              Journal
            </Link>
          </nav>

          {/* ── Right icons ── */}
          <div className="flex items-center gap-2">
            {/* Search (placeholder) */}
            <Link
              href="/products"
              aria-label="Search"
              className="hidden h-9 w-9 items-center justify-center rounded transition-colors hover:bg-rejesha-cream sm:flex"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.15 6.15a7.5 7.5 0 0 0 10.5 10.5Z" />
              </svg>
            </Link>

            {/* Cart */}
            <button
              onClick={openDrawer}
              aria-label={`Open cart, ${count} item${count !== 1 ? "s" : ""}`}
              className="relative flex h-9 w-9 items-center justify-center rounded transition-colors hover:bg-rejesha-cream"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5M3.375 9.75h17.25l-1.5 9.75a2.25 2.25 0 0 1-2.23 1.95H7.105a2.25 2.25 0 0 1-2.23-1.95L3.375 9.75Z" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rejesha-red text-[0.6rem] font-bold text-white">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
