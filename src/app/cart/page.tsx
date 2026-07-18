"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/product-utils";

export default function CartPage() {
  const { items, removeItem, setQuantity, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl tracking-brand">YOUR CART IS EMPTY</h1>
        <Link
          href="/products"
          className="mt-8 inline-block border-2 border-rejesha-black bg-rejesha-black px-10 py-3 text-sm font-semibold uppercase tracking-widest text-white hover:bg-rejesha-red hover:border-rejesha-red"
        >
          Shop All
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display mb-8 text-2xl tracking-brand">CART</h1>

      <ul className="divide-y divide-rejesha-line border-y border-rejesha-line">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.variantId}`}
            className="flex gap-4 py-6"
          >
            <div className="relative h-24 w-24 shrink-0 bg-rejesha-line">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide">
                    {item.title}
                  </p>
                  <p className="text-xs text-rejesha-gray">{item.variantTitle}</p>
                </div>
                <p className="text-sm font-semibold text-rejesha-red">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    setQuantity(
                      item.productId,
                      item.variantId,
                      Number(e.target.value)
                    )
                  }
                  className="w-16 border border-rejesha-black px-2 py-1 text-sm"
                />
                <button
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="text-xs font-semibold uppercase tracking-widest text-rejesha-gray hover:text-rejesha-red"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-widest">
          Subtotal
        </span>
        <span className="text-xl font-semibold">{formatPrice(subtotal)}</span>
      </div>

      {error && <p className="mt-4 text-sm text-rejesha-red">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-8 w-full border-2 border-rejesha-red bg-rejesha-red py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-rejesha-black hover:border-rejesha-black disabled:opacity-50"
      >
        {loading ? "Redirecting to Checkout…" : "Checkout"}
      </button>
    </div>
  );
}
