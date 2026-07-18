import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-2xl tracking-brand">CHECKOUT CANCELED</h1>
      <p className="mt-4 text-sm text-rejesha-gray">
        Your cart is still saved. Head back whenever you&apos;re ready.
      </p>
      <Link
        href="/cart"
        className="mt-10 inline-block border-2 border-rejesha-black bg-rejesha-black px-10 py-3 text-sm font-semibold uppercase tracking-widest text-white hover:bg-rejesha-red hover:border-rejesha-red"
      >
        Back to Cart
      </Link>
    </div>
  );
}
