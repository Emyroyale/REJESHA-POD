"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // Clear once on mount after a successful redirect from Stripe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl tracking-brand text-rejesha-red">
        ORDER CONFIRMED
      </h1>
      <p className="mt-4 text-sm text-rejesha-gray">
        Thank you for shopping REJESHA. Your order is headed to production and
        you&apos;ll receive a shipping confirmation by email.
      </p>
      <Link
        href="/products"
        className="mt-10 inline-block border-2 border-rejesha-black bg-rejesha-black px-10 py-3 text-sm font-semibold uppercase tracking-widest text-white hover:bg-rejesha-red hover:border-rejesha-red"
      >
        Keep Shopping
      </Link>
    </div>
  );
}
