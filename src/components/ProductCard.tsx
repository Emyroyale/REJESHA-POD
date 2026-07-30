"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PrintifyProduct } from "@/lib/printify";
import { formatPrice, defaultVariant } from "@/lib/product-utils";
import { useCart } from "@/lib/cart-context";

type Props = {
  product: PrintifyProduct;
  priority?: boolean;
};

export default function ProductCard({ product, priority = false }: Props) {
  const { addItem, openDrawer } = useCart();
  const images = product.images;
  const defaultImg = images.find((i) => i.is_default) ?? images[0];
  const hoverImg = images.find((i) => !i.is_default && i !== defaultImg) ?? null;
  const variant = defaultVariant(product);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const colorCount = (() => {
    const opt = product.options?.find((o) => o.type === "color");
    if (!opt) return 0;
    const enabledIds = new Set(
      product.variants.filter((v) => v.is_enabled).flatMap((v) => v.options ?? [])
    );
    return opt.values.filter((v) => enabledIds.has(v.id)).length;
  })();

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
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-rejesha-cream">
        {/* Primary image */}
        {defaultImg && (
          <Image
            src={defaultImg.src}
            alt={product.title}
            fill
            priority={priority}
            className={`object-cover transition-all duration-500 ${
              hovered && hoverImg ? "scale-105 opacity-0" : "scale-100 opacity-100"
            }`}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        )}

        {/* Hover / alternate image */}
        {hoverImg && (
          <Image
            src={hoverImg.src}
            alt={`${product.title} — alternate view`}
            fill
            className={`object-cover transition-all duration-500 ${
              hovered ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        )}

        {/* Quick-add slide-up bar */}
        <button
          onClick={quickAdd}
          aria-label={`Quick add ${product.title} to cart`}
          className={`absolute bottom-0 left-0 right-0 py-3 font-mono-brand text-[0.6rem] tracking-widest text-white uppercase transition-all duration-300 ${
            added ? "bg-rejesha-green" : "bg-rejesha-black hover:bg-rejesha-red"
          } ${hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        >
          {added ? "✓ Added to Bag" : "+ Quick Add"}
        </button>

        {/* Color count badge */}
        {colorCount > 1 && (
          <div className="absolute left-2.5 top-2.5 bg-rejesha-white/90 px-2 py-0.5">
            <span className="font-mono-brand text-[0.55rem] tracking-wide text-rejesha-black">
              {colorCount} colors
            </span>
          </div>
        )}
      </div>

      {/* Title + price */}
      <div className="mt-3 px-0.5">
        <h3 className="text-sm font-semibold leading-tight text-rejesha-black transition-colors group-hover:text-rejesha-red">
          {product.title}
        </h3>
        {variant && (
          <p className="mt-1 text-sm font-bold text-rejesha-red">
            {formatPrice(variant.price)}
          </p>
        )}
      </div>
    </Link>
  );
}
