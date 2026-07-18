"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/product-utils";
import type { PrintifyVariant } from "@/lib/printify";

export default function AddToCartForm({
  productId,
  productTitle,
  image,
  variants,
}: {
  productId: string;
  productTitle: string;
  image: string;
  variants: PrintifyVariant[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const enabled = variants.filter((v) => v.is_enabled);
  const [variantId, setVariantId] = useState(
    (enabled.find((v) => v.is_default) ?? enabled[0])?.id
  );
  const [added, setAdded] = useState(false);

  const selected = enabled.find((v) => v.id === variantId);

  if (!selected) {
    return <p className="text-sm text-rejesha-gray">This product has no available options.</p>;
  }

  return (
    <div>
      {enabled.length > 1 && (
        <div className="mb-6">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-rejesha-gray">
            Option
          </label>
          <select
            value={variantId}
            onChange={(e) => setVariantId(Number(e.target.value))}
            className="w-full border border-rejesha-black bg-white px-4 py-3 text-sm uppercase tracking-wide"
          >
            {enabled.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title} — {formatPrice(v.price)}
              </option>
            ))}
          </select>
        </div>
      )}

      <p className="mb-6 text-2xl font-semibold text-rejesha-red">
        {formatPrice(selected.price)}
      </p>

      <button
        onClick={() => {
          addItem({
            productId,
            variantId: selected.id,
            title: productTitle,
            variantTitle: selected.title,
            price: selected.price,
            image,
          });
          setAdded(true);
        }}
        className="w-full border-2 border-rejesha-black bg-rejesha-black py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rejesha-red hover:border-rejesha-red"
      >
        Add to Cart
      </button>

      {added && (
        <button
          onClick={() => router.push("/cart")}
          className="mt-3 w-full border-2 border-rejesha-red py-4 text-sm font-semibold uppercase tracking-widest text-rejesha-red transition-colors hover:bg-rejesha-red hover:text-white"
        >
          View Cart
        </button>
      )}
    </div>
  );
}
