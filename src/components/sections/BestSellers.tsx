"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PrintifyProduct } from "@/lib/printify";
import { formatPrice, defaultVariant } from "@/lib/product-utils";
import { useCart } from "@/lib/cart-context";

const PER_PAGE = 4;

function isWomens(p: PrintifyProduct) {
  return /\bwomen'?s\b|\bgirls?'?\b/i.test(p.title);
}

function isTee(p: PrintifyProduct) {
  return /t-?shirt|\btee\b/i.test(p.title);
}

type Props = {
  products: PrintifyProduct[];
  heading?: string;
  eyebrow?: string;
  /** Filter to a specific tag (placeholder — will work once tags are in Printify) */
  tag?: string;
  showTabs?: boolean;
};

export default function BestSellers({
  products,
  heading = "Best Sellers",
  eyebrow = "Most Loved",
  tag,
  showTabs = true,
}: Props) {
  const [tab, setTab] = useState<"unisex" | "womens">("unisex");
  const [page, setPage] = useState(0);

  const tees = useMemo(() => {
    const all = products.filter(isTee);
    // When tags are added in Printify, filter by tag here
    if (tag) return all.filter((p) => p.tags?.includes(tag));
    return all;
  }, [products, tag]);

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
    <section
      className="bg-white py-16 sm:py-20"
      aria-labelledby="bestsellers-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading row */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono-brand text-[0.6rem] tracking-[0.25em] text-rejesha-muted-gray uppercase">
              {eyebrow}
            </p>
            <h2
              id="bestsellers-heading"
              className="mt-2 font-display text-3xl text-rejesha-black sm:text-4xl"
            >
              {heading}
            </h2>
          </div>

          {/* Tabs */}
          {showTabs && (
            <div className="flex gap-4 text-sm font-semibold">
              {(["unisex", "womens"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => selectTab(t)}
                  disabled={t === "womens" && womens.length === 0}
                  aria-pressed={tab === t}
                  className={`border-b-2 pb-1 font-mono-brand text-[0.65rem] tracking-widest uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                    tab === t
                      ? "border-rejesha-red text-rejesha-black"
                      : "border-transparent text-rejesha-muted-gray hover:text-rejesha-black"
                  }`}
                >
                  {t === "unisex" ? "Unisex" : "Women's"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {visible.map((product) => (
            <BestSellerCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination dots */}
        {pageCount > 1 && (
          <div className="mt-8 flex justify-center gap-2" role="group" aria-label="Product pages">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
                aria-current={i === page ? "true" : undefined}
                className={`h-2 rounded-full transition-all ${
                  i === page ? "w-6 bg-rejesha-red" : "w-2 bg-rejesha-border hover:bg-rejesha-muted-gray"
                }`}
              />
            ))}
          </div>
        )}

        {/* View all */}
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border border-rejesha-black px-8 py-3 font-mono-brand text-xs tracking-widest text-rejesha-black uppercase transition-colors hover:bg-rejesha-black hover:text-white"
          >
            View All T-Shirts
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function BestSellerCard({ product }: { product: PrintifyProduct }) {
  const { addItem, openDrawer } = useCart();
  const images = product.images;
  const defaultImg = images.find((i) => i.is_default) ?? images[0];
  const hoverImg = images.find((i) => !i.is_default && i !== defaultImg) ?? null;
  const variant = defaultVariant(product);
  const [hovered, setHovered] = useState(false);

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!variant || !defaultImg) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      variantTitle: variant.title,
      price: variant.price,
      image: defaultImg.src,
    });
    openDrawer();
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-rejesha-cream">
        {defaultImg && (
          <Image
            src={defaultImg.src}
            alt={product.title}
            fill
            className={`object-cover transition-all duration-500 ${
              hovered && hoverImg ? "opacity-0" : "opacity-100"
            }`}
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        )}
        {hoverImg && (
          <Image
            src={hoverImg.src}
            alt={`${product.title} — alternate view`}
            fill
            className={`object-cover transition-all duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        )}

        {/* Quick add */}
        <button
          onClick={quickAdd}
          aria-label={`Quick add ${product.title} to cart`}
          className="absolute bottom-0 left-0 right-0 translate-y-full bg-rejesha-black py-2.5 font-mono-brand text-[0.6rem] tracking-widest text-white uppercase transition-transform duration-300 group-hover:translate-y-0 hover:bg-rejesha-red"
        >
          + Add to Cart
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <h3 className="text-sm font-semibold leading-tight text-rejesha-black group-hover:text-rejesha-red transition-colors">
          {product.title}
        </h3>
        {variant && (
          <p className="mt-1 text-sm font-semibold text-rejesha-red">
            {formatPrice(variant.price)}
          </p>
        )}
      </div>
    </Link>
  );
}
