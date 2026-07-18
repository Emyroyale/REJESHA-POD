import Link from "next/link";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/printify";

export default function Home() {
  return (
    <div>
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-rejesha-black px-6 text-center text-rejesha-white">
        <span className="mb-4 text-xs font-semibold uppercase tracking-brand text-rejesha-red">
          Made to Order
        </span>
        <h1 className="font-display max-w-3xl text-4xl leading-tight sm:text-6xl">
          BOLD BY DEFAULT
        </h1>
        <p className="mt-6 max-w-md text-sm text-white/70">
          REJESHA is statement pieces, printed on demand and shipped worldwide.
          No stock. No waste. Just the drop.
        </p>
        <Link
          href="/products"
          className="mt-10 border-2 border-rejesha-red bg-rejesha-red px-10 py-3 text-sm font-semibold uppercase tracking-widest text-rejesha-white transition-colors hover:bg-rejesha-black hover:border-rejesha-white"
        >
          Shop All
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-brand">FEATURED</h2>
          <Link
            href="/products"
            className="text-sm font-semibold uppercase tracking-widest text-rejesha-red hover:underline"
          >
            View all
          </Link>
        </div>
        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </section>
    </div>
  );
}

async function FeaturedProducts() {
  let products;
  try {
    products = (await getProducts()).slice(0, 4);
  } catch {
    return (
      <p className="text-sm text-rejesha-gray">
        Products will appear here once Printify is connected. See README for setup.
      </p>
    );
  }

  if (products.length === 0) {
    return <p className="text-sm text-rejesha-gray">No products published yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="aspect-square animate-pulse bg-rejesha-line" />
      ))}
    </div>
  );
}
