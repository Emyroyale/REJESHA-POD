"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-context";

const SHOP_LINKS = [
  { label: "Shop All T-Shirts", href: "/products" },
  { label: "Unisex Tees", href: "/products?fit=unisex" },
  { label: "Women's Tees", href: "/products?fit=womens" },
  { label: "Best Sellers", href: "/products?category=best-sellers" },
  { label: "New Arrivals", href: "/products?category=new" },
  { label: "Customize a Shirt", href: "/customize" },
];

const COLLECTION_LINKS = [
  { label: "Kenyan Pride", href: "/collections/kenyan-pride" },
  { label: "Sheng & Swahili", href: "/collections/sheng-swahili" },
  { label: "Travel & Cruise", href: "/collections/travel-cruise" },
  { label: "Faith Collection", href: "/collections/faith" },
  { label: "Custom Group Shirts", href: "/customize" },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: Props) {
  const { openDrawer } = useCart();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap & keyboard
  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first)?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="rj-fade-in fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Menu panel */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed left-0 top-0 z-50 flex h-full w-[min(340px,90vw)] flex-col bg-rejesha-cream shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-rejesha-border px-5 py-4">
          <Link
            href="/"
            onClick={onClose}
            className="font-display text-xl tracking-brand text-rejesha-black"
          >
            REJESHA
          </Link>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close menu"
            className="rounded p-1 transition-colors hover:bg-rejesha-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile navigation">
          {/* Shop section */}
          <p className="mb-3 font-mono-brand text-[0.6rem] tracking-[0.25em] text-rejesha-muted-gray uppercase">
            Shop
          </p>
          <ul className="mb-8 space-y-1">
            {SHOP_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="block py-2.5 font-display text-lg text-rejesha-black transition-colors hover:text-rejesha-red"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Collections section */}
          <p className="mb-3 font-mono-brand text-[0.6rem] tracking-[0.25em] text-rejesha-muted-gray uppercase">
            Collections
          </p>
          <ul className="mb-8 space-y-1">
            {COLLECTION_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="block py-2.5 font-display text-lg text-rejesha-black transition-colors hover:text-rejesha-red"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Other links */}
          <div className="border-t border-rejesha-border pt-6">
            <ul className="space-y-1">
              {[
                { label: "Journal", href: "/blog" },
                { label: "Our Story", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Size Guide", href: "/size-guide" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className="block py-2 text-sm text-rejesha-muted-gray transition-colors hover:text-rejesha-black"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Bottom CTA */}
        <div className="border-t border-rejesha-border p-5">
          <button
            onClick={() => { onClose(); openDrawer(); }}
            className="w-full bg-rejesha-red py-3 font-mono-brand text-xs tracking-widest text-white uppercase transition-colors hover:bg-rejesha-black"
          >
            View Cart
          </button>
          <div className="mt-4 flex justify-center gap-5">
            {/* Social icons */}
            {[
              { label: "Instagram", href: "https://instagram.com/rejeshastore", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" },
              { label: "TikTok", href: "https://tiktok.com/@rejeshastore", path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" },
            ].map(({ label, href, path }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-rejesha-muted-gray transition-colors hover:text-rejesha-black"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
