"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BlogHeader from "@/components/BlogHeader";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { count } = useCart();
  const pathname = usePathname();

  if (pathname?.startsWith("/blog")) {
    return <BlogHeader />;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-rejesha-black bg-rejesha-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-2xl tracking-brand text-rejesha-black"
        >
          REJESHA
          <svg
            viewBox="0 0 24 28"
            className="h-4 w-auto shrink-0"
            aria-hidden="true"
          >
            <path
              d="M12 0 L23 4 V14 C23 21 18 25.5 12 28 C6 25.5 1 21 1 14 V4 Z"
              fill="#000"
            />
            <path
              d="M12 2.2 L21 5.4 V14 C21 19.8 17 23.6 12 25.8 C7 23.6 3 19.8 3 14 V5.4 Z"
              fill="#BB0000"
            />
            <path
              d="M12 4.6 L19 7 V14 C19 18.6 16 21.8 12 23.6 C8 21.8 5 18.6 5 14 V7 Z"
              fill="#006600"
            />
            <line x1="6" y1="6" x2="18" y2="20" stroke="#fff" strokeWidth="1" />
            <line x1="18" y1="6" x2="6" y2="20" stroke="#fff" strokeWidth="1" />
          </svg>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-widest sm:flex">
          <Link href="/products" className="transition-colors hover:text-rejesha-red">
            Shop All
          </Link>
          <Link href="/products?category=new" className="transition-colors hover:text-rejesha-red">
            New
          </Link>
          <Link href="/products?category=best-sellers" className="transition-colors hover:text-rejesha-red">
            Best Sellers
          </Link>
          <Link href="/blog" className="transition-colors hover:text-rejesha-red">
            Blog
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 text-sm font-semibold uppercase tracking-widest"
        >
          Cart
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rejesha-red text-xs font-bold text-rejesha-white">
            {count}
          </span>
        </Link>
      </div>
    </header>
  );
}
