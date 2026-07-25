"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PrintifyProduct } from "@/lib/printify";
import { formatPrice, defaultVariant } from "@/lib/product-utils";
import { useCart } from "@/lib/cart-context";

const PER_PAGE = 3;

function isWomens(product: PrintifyProduct): boolean {
  return /\bwomen'?s\b|\bgirls?'?\b/i.test(product.title);
}

function isTee(product: PrintifyProduct): boolean {
  return /t-?shirt|\btee\b/i.test(product.title);
}

export default function TeesSection({
  products,
}: {
  products: PrintifyProduct[];
}) {
  const [tab, setTab] = useState<"unisex" | "womens">("unisex");
  const [page, setPage] = useState(0);

  const tees = useMemo(() => products.filter(isTee), [products]);
  const unisex = useMemo(() => tees.filter((p) => !isWomens(p)), [tees]);
  const womens = useMemo(() => tees.filter(isWomens), [tees]);

  const active = tab === "unisex" ? unisex : womens;
  const pageCount = Math.max(1, Math.ceil(active.length / PER_PAGE));
  const visible = active.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  function selectTab(next: "unisex" | "womens") {
    setTab(next);
    setPage(0);
  }

  if (tees.length === 0) return null;

  return (
    <section className="bg-[#f5f5f5] px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-display text-3xl tracking-wide text-rejesha-black sm:text-4xl">
          Kenyan Pride T-Shirts
        </h2>

        <div className="mt-6 flex justify-center gap-8 text-sm font-semibold uppercase tracking-widest">
          <button
            onClick={() => selectTab("unisex")}
            className={`border-b-2 pb-1 transition-colors ${
              tab === "unisex"
                ? "border-rejesha-red text-rejesha-black"
                : "border-transparent text-rejesha-gray hover:text-rejesha-black"
            }`}
          >
            Unisex T-Shirts
          </button>
          <button
            onClick={() => selectTab("womens")}
            disabled={womens.length === 0}
            className={`border-b-2 pb-1 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              tab === "womens"
                ? "border-rejesha-red text-rejesha-black"
                : "border-transparent text-rejesha-gray hover:text-rejesha-black"
            }`}
          >
            Women&apos;s T-Shirts
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {visible.map((product) => (
            <TeeCard key={product.id} product={product} />
          ))}
        </div>

        {pageCount > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === page ? "bg-rejesha-black" : "bg-rejesha-black/20"
                }`}
              />
            ))}
          </div>
        )}

        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-rejesha-black transition-colors hover:text-rejesha-red"
        >
          View All
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
            <path
              d="M7.5 4.5 13 10l-5.5 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}

function TeeCard({ product }: { product: PrintifyProduct }) {
  const { addItem } = useCart();
  const image = product.images.find((i) => i.is_default) ?? product.images[0];
  const variant = defaultVariant(product);

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!variant || !image) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      variantTitle: variant.title,
      price: variant.price,
      image: image.src,
    });
  }

  return (
    <Link href={`/products/${product.id}`} className="group block bg-white">
      <div className="relative aspect-square overflow-hidden">
        {image && (
          <Image
            src={image.src}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        )}
        <button
          onClick={quickAdd}
          aria-label={`Quick add ${product.title} to cart`}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-rejesha-black shadow transition-colors hover:bg-rejesha-black hover:text-rejesha-white"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
            <path
              d="M5 7h10l-.8 8.2a1 1 0 0 1-1 .8H6.8a1 1 0 0 1-1-.8L5 7Z"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M7.5 7V5.5a2.5 2.5 0 0 1 5 0V7"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path d="M10 9.5v4M8 11.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="px-2 py-4 text-center">
        <h3 className="text-sm font-semibold text-rejesha-black">
          {product.title}
        </h3>
        {variant && (
          <span className="mt-1 block text-sm font-semibold text-rejesha-red">
            {formatPrice(variant.price)}
          </span>
        )}
      </div>
    </Link>
  );
}
