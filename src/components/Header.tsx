"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-rejesha-black bg-rejesha-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-2xl tracking-brand text-rejesha-black"
        >
          REJESHA
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
