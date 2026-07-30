"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, variantOptionValue } from "@/lib/product-utils";
import type { PrintifyProduct } from "@/lib/printify";
import { getPersonalizationConfig } from "@/lib/personalization-config";
import PersonalizeDesign, { type PersonalizeResult } from "@/components/PersonalizeDesign";

export default function ProductDetail({ product }: { product: PrintifyProduct }) {
  const { addItem, openDrawer } = useCart();

  const enabled = useMemo(
    () => product.variants.filter((v) => v.is_enabled),
    [product]
  );
  const fallback = enabled.find((v) => v.is_default) ?? enabled[0];

  const colorOption = product.options?.find((o) => o.type === "color");
  const sizeOption = product.options?.find((o) => o.type === "size");

  const colors = useMemo(() => {
    if (!colorOption) return [];
    const ids = new Set(enabled.flatMap((v) => v.options ?? []));
    return colorOption.values.filter((v) => ids.has(v.id));
  }, [colorOption, enabled]);

  const sizes = useMemo(() => {
    if (!sizeOption) return [];
    const ids = new Set(enabled.flatMap((v) => v.options ?? []));
    return sizeOption.values.filter((v) => ids.has(v.id));
  }, [sizeOption, enabled]);

  const [colorId, setColorId] = useState<number | undefined>(() =>
    fallback && colorOption
      ? variantOptionValue(product, fallback, "color")?.id
      : undefined
  );
  const [sizeId, setSizeId] = useState<number | undefined>(() =>
    fallback && sizeOption
      ? variantOptionValue(product, fallback, "size")?.id
      : undefined
  );
  const [sizeError, setSizeError] = useState(false);

  const selected = useMemo(() => {
    return (
      enabled.find((v) => {
        const vColor = colorOption
          ? variantOptionValue(product, v, "color")?.id
          : undefined;
        const vSize = sizeOption
          ? variantOptionValue(product, v, "size")?.id
          : undefined;
        return (
          (!colorOption || vColor === colorId) &&
          (!sizeOption || vSize === sizeId)
        );
      }) ?? fallback
    );
  }, [enabled, colorOption, sizeOption, colorId, sizeId, product, fallback]);

  // Image gallery
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const galleryImages = useMemo(() => {
    const all = product.images;
    const variantImgs = selected
      ? all.filter((img) => img.variant_ids.includes(selected.id))
      : [];
    if (variantImgs.length > 0) {
      const rest = all.filter((img) => !img.variant_ids.includes(selected.id));
      return [...variantImgs, ...rest];
    }
    const defaultFirst = [
      ...(all.filter((i) => i.is_default)),
      ...all.filter((i) => !i.is_default),
    ];
    return defaultFirst;
  }, [product, selected]);

  const activeImage = galleryImages[activeImageIdx] ?? galleryImages[0];

  const [added, setAdded] = useState(false);
  const [personalization, setPersonalization] = useState<PersonalizeResult | null>(null);
  const personalizationConfig = getPersonalizationConfig(product.id);

  if (!selected) {
    return (
      <p className="px-6 py-12 text-sm text-rejesha-muted-gray">
        This product has no available options.
      </p>
    );
  }

  function handleAddToCart() {
    if (sizeOption && !sizeId) {
      setSizeError(true);
      document.getElementById("size-selector")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    addItem({
      productId: product.id,
      variantId: selected!.id,
      title: product.title,
      variantTitle: selected!.title,
      price: selected!.price,
      image: activeImage?.src ?? "",
      personalization: personalization
        ? {
            personalizationId: personalization.personalizationId,
            previewUrl: personalization.previewUrl,
          }
        : undefined,
    });
    setAdded(true);
    setPersonalization(null);
    openDrawer();
    setTimeout(() => setAdded(false), 3000);
  }

  return (
    <div className="min-h-screen bg-rejesha-white">
      {/* Breadcrumb */}
      <div className="border-b border-rejesha-border bg-rejesha-cream py-3">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-7xl px-4 sm:px-6"
        >
          <ol className="flex items-center gap-2 font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">
            <li>
              <Link href="/" className="hover:text-rejesha-black transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">·</li>
            <li>
              <Link href="/products" className="hover:text-rejesha-black transition-colors">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">·</li>
            <li
              aria-current="page"
              className="max-w-[180px] truncate text-rejesha-black"
            >
              {product.title}
            </li>
          </ol>
        </nav>
      </div>

      {/* Main content */}
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1fr_480px] lg:gap-0 xl:grid-cols-[1fr_520px]">
        {/* ── Left: Image gallery ── */}
        <div className="lg:sticky lg:top-[112px] lg:self-start">
          {/* Main image */}
          <div className="relative aspect-square w-full overflow-hidden bg-rejesha-cream">
            {activeImage && (
              <Image
                src={activeImage.src}
                alt={product.title}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
              />
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3 rj-snap-x">
              {galleryImages.slice(0, 8).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`rj-snap-start relative h-16 w-16 shrink-0 overflow-hidden border-2 transition-colors ${
                    i === activeImageIdx
                      ? "border-rejesha-black"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={`${product.title} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Product info ── */}
        <div className="border-l border-rejesha-border px-6 py-10 lg:px-10">
          {/* Title + price */}
          <h1 className="font-display text-2xl leading-tight text-rejesha-black sm:text-3xl">
            {product.title}
          </h1>

          <p className="mt-3 font-display text-2xl text-rejesha-red">
            {formatPrice(selected.price)}
          </p>

          {/* Mini trust badges */}
          <div className="mt-4 flex flex-wrap gap-3">
            {["Made to Order", "Printed in USA", "Ships Worldwide"].map((b) => (
              <span
                key={b}
                className="border border-rejesha-border px-2 py-0.5 font-mono-brand text-[0.55rem] tracking-widest text-rejesha-muted-gray uppercase"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="my-8 h-px bg-rejesha-border" />

          {/* Personalize */}
          {personalizationConfig && (
            <div className="mb-6">
              <PersonalizeDesign
                config={personalizationConfig}
                onReady={setPersonalization}
                onClear={() => setPersonalization(null)}
              />
            </div>
          )}

          {/* Color selector */}
          {colors.length > 1 && (
            <div className="mb-6">
              <p className="mb-3 font-mono-brand text-[0.65rem] tracking-widest text-rejesha-muted-gray uppercase">
                Color
                {colorId != null && (
                  <span className="ml-2 text-rejesha-black">
                    — {colors.find((c) => c.id === colorId)?.title}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorId(c.id)}
                    title={c.title}
                    aria-label={`Color: ${c.title}`}
                    aria-pressed={colorId === c.id}
                    className={`h-9 w-9 rounded-full border-2 transition-all ${
                      colorId === c.id
                        ? "border-rejesha-red ring-2 ring-rejesha-red ring-offset-2"
                        : "border-rejesha-border hover:border-rejesha-black"
                    }`}
                    style={{ backgroundColor: c.colors?.[0] ?? "#cccccc" }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {sizes.length > 1 && (
            <div id="size-selector" className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono-brand text-[0.65rem] tracking-widest text-rejesha-muted-gray uppercase">
                  Size
                </p>
                <Link
                  href="/size-guide"
                  className="font-mono-brand text-[0.6rem] tracking-wider text-rejesha-muted-gray underline-offset-2 hover:text-rejesha-black hover:underline"
                >
                  Size Guide
                </Link>
              </div>
              {sizeError && !sizeId && (
                <p className="mb-2 text-xs text-rejesha-red" role="alert">
                  Please select a size.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const isAvailable = enabled.some((v) => {
                    const vColor = colorOption
                      ? variantOptionValue(product, v, "color")?.id
                      : undefined;
                    const vSize = variantOptionValue(product, v, "size")?.id;
                    return (
                      vSize === s.id && (!colorOption || vColor === colorId)
                    );
                  });
                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => {
                        setSizeId(s.id);
                        setSizeError(false);
                      }}
                      aria-pressed={sizeId === s.id}
                      className={`min-w-[3rem] border-2 px-4 py-2.5 font-mono-brand text-xs tracking-wider uppercase transition-colors ${
                        sizeId === s.id
                          ? "border-rejesha-black bg-rejesha-black text-white"
                          : "border-rejesha-border text-rejesha-black hover:border-rejesha-black"
                      } ${!isAvailable ? "cursor-not-allowed opacity-30 line-through" : ""}`}
                    >
                      {s.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 font-mono-brand text-xs tracking-widest uppercase transition-colors ${
                added
                  ? "bg-rejesha-green text-white"
                  : "bg-rejesha-red text-white hover:bg-rejesha-black"
              }`}
            >
              {added ? "✓ Added to Your Bag" : "Add to Bag"}
            </button>

            <Link
              href="/products"
              className="block w-full border border-rejesha-border py-3.5 text-center font-mono-brand text-xs tracking-widest text-rejesha-muted-gray uppercase transition-colors hover:border-rejesha-black hover:text-rejesha-black"
            >
              ← Continue Shopping
            </Link>
          </div>

          <div className="my-8 h-px bg-rejesha-border" />

          {/* Accordion details */}
          <div className="divide-y divide-rejesha-border border-t border-rejesha-border">
            <AccordionItem title="Product Details" defaultOpen>
              <div
                className="prose prose-sm max-w-none text-rejesha-muted-gray [&_p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </AccordionItem>

            <AccordionItem title="Sizing & Fit">
              <p className="text-sm leading-relaxed text-rejesha-muted-gray">
                This style runs true to size. Unisex tees are cut with a relaxed
                fit — size down for a slimmer look. Women's styles are cut for a
                fitted silhouette.
              </p>
              <Link
                href="/size-guide"
                className="mt-3 inline-block font-mono-brand text-[0.6rem] tracking-wider text-rejesha-black underline-offset-2 hover:underline uppercase"
              >
                Full Size Guide →
              </Link>
            </AccordionItem>

            <AccordionItem title="Shipping & Returns">
              <ul className="space-y-2 text-sm leading-relaxed text-rejesha-muted-gray">
                <li>
                  ⏱ <strong className="text-rejesha-black">Production:</strong>{" "}
                  3–7 business days (made to order).
                </li>
                <li>
                  🚚 <strong className="text-rejesha-black">USA shipping:</strong>{" "}
                  5–8 business days via USPS / UPS.
                </li>
                <li>
                  🌍 <strong className="text-rejesha-black">International:</strong>{" "}
                  10–20 business days. Duties may apply.
                </li>
                <li>
                  🔄 <strong className="text-rejesha-black">Returns:</strong>{" "}
                  Issues with print quality? We&apos;ll replace it.
                </li>
              </ul>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left font-mono-brand text-[0.65rem] tracking-widest text-rejesha-black uppercase"
      >
        {title}
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" />
        </svg>
      </button>
      {open && <div className="mt-4 pb-1">{children}</div>}
    </div>
  );
}
