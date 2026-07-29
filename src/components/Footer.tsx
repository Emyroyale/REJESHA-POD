import Link from "next/link";

const SHOP_LINKS = [
  { label: "All T-Shirts", href: "/products" },
  { label: "Best Sellers", href: "/products?category=best-sellers" },
  { label: "New Arrivals", href: "/products?category=new" },
  { label: "Customize a Shirt", href: "/customize" },
];

const HELP_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Order Status", href: "/order-status" },
  { label: "Custom Order FAQ", href: "/customize#faq" },
];

const ABOUT_LINKS = [
  { label: "Our Story", href: "/about" },
  { label: "Journal", href: "/blog" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SOCIAL = [
  {
    label: "Instagram",
    href: "https://instagram.com/rejeshastore",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@rejeshastore",
    path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/rejeshastore",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
];

// Payment method icons as simple text labels (replace with SVG sprites in production)
const PAYMENTS = ["Visa", "MC", "Amex", "Apple Pay", "Google Pay", "Stripe"];

export default function Footer() {
  return (
    <footer className="border-t border-rejesha-border bg-rejesha-black text-rejesha-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1 — Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-2xl tracking-brand text-rejesha-white"
            >
              REJESHA
              <svg viewBox="0 0 24 28" className="h-4 w-auto" aria-hidden="true">
                <path d="M12 0 L23 4 V14 C23 21 18 25.5 12 28 C6 25.5 1 21 1 14 V4 Z" fill="#fff" />
                <path d="M12 2.2 L21 5.4 V14 C21 19.8 17 23.6 12 25.8 C7 23.6 3 19.8 3 14 V5.4 Z" fill="#B51F2E" />
                <path d="M12 4.6 L19 7 V14 C19 18.6 16 21.8 12 23.6 C8 21.8 5 18.6 5 14 V7 Z" fill="#176B45" />
                <line x1="6" y1="6" x2="18" y2="20" stroke="#fff" strokeWidth="1" />
                <line x1="18" y1="6" x2="6" y2="20" stroke="#fff" strokeWidth="1" />
              </svg>
            </Link>
            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-white/60">
              Bold Kenyan-inspired T-shirts for the diaspora.
              <br />
              <span className="font-editorial italic text-white/40">
                Different Country. Same Heart.
              </span>
            </p>
            {/* Social */}
            <div className="mt-6 flex gap-4">
              {SOCIAL.map(({ label, href, path }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/50 transition-colors hover:text-rejesha-gold"
                >
                  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Shop */}
          <div>
            <p className="mb-4 font-mono-brand text-[0.6rem] tracking-[0.25em] text-rejesha-red uppercase">
              Shop
            </p>
            <ul className="space-y-2.5 text-sm">
              {SHOP_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Help */}
          <div>
            <p className="mb-4 font-mono-brand text-[0.6rem] tracking-[0.25em] text-rejesha-red uppercase">
              Help
            </p>
            <ul className="space-y-2.5 text-sm">
              {HELP_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — About */}
          <div>
            <p className="mb-4 font-mono-brand text-[0.6rem] tracking-[0.25em] text-rejesha-red uppercase">
              About
            </p>
            <ul className="space-y-2.5 text-sm">
              {ABOUT_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} REJESHA. All rights reserved.
          </p>
          {/* Payment methods */}
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENTS.map((name) => (
              <span
                key={name}
                className="rounded border border-white/15 bg-white/5 px-2 py-0.5 text-[0.55rem] font-semibold tracking-wide text-white/40 uppercase"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
