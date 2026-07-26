"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice, variantOptionValue } from "@/lib/product-utils";
import type { PrintifyProduct } from "@/lib/printify";
import { getPersonalizationConfig } from "@/lib/personalization-config";
import PersonalizeDesign, { type PersonalizeResult } from "@/components/PersonalizeDesign";

export default function ProductDetail({ product }: { product: PrintifyProduct }) {
  const router = useRouter();
  const { addItem } = useCart();

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
    fallback && colorOption ? variantOptionValue(product, fallback, "color")?.id : undefined
  );
  const [sizeId, setSizeId] = useState<number | undefined>(() =>
    fallback && sizeOption ? variantOptionValue(product, fallback, "size")?.id : undefined
  );

  const selected = useMemo(() => {
    return (
      enabled.find((v) => {
        const vColor = colorOption ? variantOptionValue(product, v, "color")?.id : undefined;
        const vSize = sizeOption ? variantOptionValue(product, v, "size")?.id : undefined;
        return (!colorOption || vColor === colorId) && (!sizeOption || vSize === sizeId);
      }) ?? fallback
    );
  }, [enabled, colorOption, sizeOption, colorId, sizeId, product, fallback]);

  const image = useMemo(() => {
    const forVariant = selected
      ? product.images.find((img) => img.variant_ids.includes(selected.id))
      : undefined;
    return forVariant ?? product.images.find((img) => img.is_default) ?? product.images[0];
  }, [product, selected]);

  const [added, setAdded] = useState(false);
  const [personalization, setPersonalization] = useState<PersonalizeResult | null>(null);
  const personalizationConfig = getPersonalizationConfig(product.id);

  if (!selected) {
    return <p className="text-sm text-rejesha-gray">This product has no available options.</p>;
  }

  return (
    <div className="grid gap-0 lg:grid-cols-2 lg:gap-12">
      <div className="relative h-[60vh] w-full lg:sticky lg:top-0 lg:h-screen">
        {image && (
          <Image
            src={image.src}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        )}
      </div>

      <div className="px-6 pt-8 lg:px-0 lg:pt-0">
        <h1 className="font-display text-2xl tracking-brand">{product.title}</h1>

        {personalizationConfig && (
          <PersonalizeDesign
            config={personalizationConfig}
            onReady={setPersonalization}
            onClear={() => setPersonalization(null)}
          />
        )}

        {colors.length > 1 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-rejesha-gray">
              Color
              {colorId != null && (
                <span className="ml-1 text-rejesha-black">
                  : {colors.find((c) => c.id === colorId)?.title}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorId(c.id)}
                  title={c.title}
                  aria-label={c.title}
                  className={`h-9 w-9 rounded-full border-2 transition-colors ${
                    colorId === c.id ? "border-rejesha-red" : "border-rejesha-line"
                  }`}
                  style={{ backgroundColor: c.colors?.[0] ?? "#cccccc" }}
                />
              ))}
            </div>
          </div>
        )}

        {sizes.length > 1 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-rejesha-gray">
              Size
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => {
                const isAvailable = enabled.some((v) => {
                  const vColor = colorOption
                    ? variantOptionValue(product, v, "color")?.id
                    : undefined;
                  const vSize = variantOptionValue(product, v, "size")?.id;
                  return vSize === s.id && (!colorOption || vColor === colorId);
                });
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => setSizeId(s.id)}
                    className={`min-w-12 rounded-full border-2 px-4 py-2 text-sm font-semibold uppercase transition-colors ${
                      sizeId === s.id
                        ? "border-rejesha-black bg-rejesha-black text-white"
                        : "border-rejesha-line text-rejesha-black hover:border-rejesha-black"
                    } ${!isAvailable ? "cursor-not-allowed opacity-30" : ""}`}
                  >
                    {s.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <p className="mt-6 text-2xl font-semibold text-rejesha-red">
          {formatPrice(selected.price)}
        </p>

        <div className="mt-8">
          <button
            onClick={() => {
              addItem({
                productId: product.id,
                variantId: selected.id,
                title: product.title,
                variantTitle: selected.title,
                price: selected.price,
                image: image?.src ?? "",
                personalization: personalization
                  ? {
                      personalizationId: personalization.personalizationId,
                      previewUrl: personalization.previewUrl,
                    }
                  : undefined,
              });
              setAdded(true);
              setPersonalization(null);
            }}
            className="w-full rounded-full bg-rejesha-black py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rejesha-red"
          >
            Add to Cart
          </button>

          {added && (
            <button
              onClick={() => router.push("/cart")}
              className="mt-3 w-full rounded-full border-2 border-rejesha-red py-4 text-sm font-semibold uppercase tracking-widest text-rejesha-red transition-colors hover:bg-rejesha-red hover:text-white"
            >
              View Cart
            </button>
          )}
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 border-y border-rejesha-line py-6 text-center">
          <TrustBadge
            icon={
              <path d="M9 3h6l1 3h3a1 1 0 0 1 1 1v2a3 3 0 0 1-3 3 3 3 0 0 1-2-.78V19a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-7.78A3 3 0 0 1 7 12a3 3 0 0 1-3-3V7a1 1 0 0 1 1-1h3l1-3Z" />
            }
            label="Made to Order"
          />
          <TrustBadge
            icon={<path d="M6 9V4h12v5M6 18h12v3H6v-3ZM4 9h16v7a1 1 0 0 1-1 1h-2v-4H7v4H5a1 1 0 0 1-1-1V9Z" />}
            label="Printed in the USA"
          />
          <TrustBadge
            icon={
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
              </>
            }
            label="Shipped Worldwide"
          />
        </div>

        <div className="mt-6 divide-y divide-rejesha-line border-y border-rejesha-line pb-8">
          <AccordionItem title="Description" defaultOpen>
            <div
              className="max-w-prose text-[15px] leading-relaxed text-rejesha-black"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </AccordionItem>
          <AccordionItem title="Shipping & Returns">
            <p className="max-w-prose text-[15px] leading-relaxed text-rejesha-black">
              Every piece is made to order and printed just for you, so please allow
              a few extra days for production before it ships. Reach out any time if
              something isn&apos;t right &mdash; we&apos;ll make it right.
            </p>
          </AccordionItem>
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
  return (
    <details className="group py-5" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-widest text-rejesha-black">
        {title}
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-rejesha-black"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>
      <span className="text-xs font-semibold uppercase tracking-wide text-rejesha-gray">
        {label}
      </span>
    </div>
  );
}
