"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/product-utils";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, setQuantity, subtotal, count } =
    useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus trap & keyboard handler
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first)?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    firstFocusableRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const FREE_SHIPPING_THRESHOLD = 7500; // $75 in cents
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="rj-fade-in fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-rejesha-white shadow-2xl transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rejesha-border px-6 py-4">
          <h2 className="font-display text-lg tracking-wide">
            Your Bag
            {count > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rejesha-red text-xs font-bold text-white">
                {count}
              </span>
            )}
          </h2>
          <button
            ref={firstFocusableRef}
            onClick={closeDrawer}
            aria-label="Close cart"
            className="rounded p-1 transition-colors hover:bg-rejesha-cream"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Shipping progress bar */}
        {subtotal > 0 && (
          <div className="border-b border-rejesha-border bg-rejesha-cream px-6 py-3">
            {remaining === 0 ? (
              <p className="font-mono-brand text-[0.65rem] tracking-widest text-rejesha-green uppercase">
                🎉 You&apos;ve unlocked free shipping!
              </p>
            ) : (
              <p className="font-mono-brand text-[0.65rem] tracking-widest uppercase text-rejesha-black/70">
                Add {formatPrice(remaining)} more for free shipping
              </p>
            )}
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-rejesha-border">
              <div
                className="h-full rounded-full bg-rejesha-green transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <svg viewBox="0 0 48 48" className="h-14 w-14 text-rejesha-border" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 14h24l-2.5 18a2 2 0 0 1-2 1.7H16.5a2 2 0 0 1-2-1.7L12 14Z" />
                <path d="M19 14v-3a5 5 0 0 1 10 0v3" />
              </svg>
              <p className="font-display text-lg">Your bag is empty</p>
              <p className="text-sm text-rejesha-muted-gray">
                Find something you love — shirts that tell your story.
              </p>
              <button
                onClick={closeDrawer}
                className="mt-2 border border-rejesha-black bg-rejesha-black px-6 py-2 font-mono-brand text-xs tracking-widest text-white uppercase transition-colors hover:bg-rejesha-charcoal"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-rejesha-border">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-rejesha-cream">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm font-semibold leading-tight">{item.title}</p>
                    <p className="text-xs text-rejesha-muted-gray">{item.variantTitle}</p>
                    {item.personalization && (
                      <p className="text-xs text-rejesha-green">✓ Custom design</p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border border-rejesha-border">
                        <button
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center transition-colors hover:bg-rejesha-cream text-sm"
                        >
                          −
                        </button>
                        <span className="flex h-7 w-7 items-center justify-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center transition-colors hover:bg-rejesha-cream text-sm"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-rejesha-red">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="text-rejesha-muted-gray transition-colors hover:text-rejesha-red"
                        >
                          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                            <path d="M12.7 3.3a1 1 0 0 0-1.4 0L8 6.6 4.7 3.3a1 1 0 0 0-1.4 1.4L6.6 8 3.3 11.3a1 1 0 1 0 1.4 1.4L8 9.4l3.3 3.3a1 1 0 0 0 1.4-1.4L9.4 8l3.3-3.3a1 1 0 0 0 0-1.4Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-rejesha-border px-6 pb-6 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-rejesha-muted-gray">Subtotal</span>
              <span className="font-display text-xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="mb-4 text-xs text-rejesha-muted-gray">
              Taxes and shipping calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block w-full bg-rejesha-red py-3.5 text-center font-mono-brand text-xs tracking-widest text-white uppercase transition-colors hover:bg-rejesha-black"
            >
              Checkout
            </Link>
            <button
              onClick={closeDrawer}
              className="mt-3 block w-full text-center font-mono-brand text-xs tracking-widest text-rejesha-muted-gray uppercase underline-offset-2 hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
