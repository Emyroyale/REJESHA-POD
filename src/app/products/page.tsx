import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/printify";
import type { PrintifyProduct } from "@/lib/printify";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop All T-Shirts | REJESHA",
  description:
    "Browse all REJESHA Kenyan-inspired T-shirts. Sheng & Swahili graphics, Kenyan Pride prints, travel tees, and more. Unisex and women's fits.",
};

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "alpha-asc", label: "A – Z" },
];

const COLLECTIONS = [
  { label: "All", value: "" },
  { label: "Kenyan Pride", value: "kenyan-pride" },
  { label: "Sheng & Swahili", value: "sheng-swahili" },
  { label: "Travel & Cruise", value: "travel-cruise" },
  { label: "Faith", value: "faith" },
  { label: "Custom Group", value: "custom" },
];

function sortProducts(
  products: PrintifyProduct[],
  sort: string
): PrintifyProduct[] {
  const copy = [...products];
  if (sort === "price-asc")
    return copy.sort((a, b) => {
      const aPrice =
        a.variants.find((v) => v.is_enabled && v.is_default)?.price ??
        a.variants.find((v) => v.is_enabled)?.price ??
        0;
      const bPrice =
        b.variants.find((v) => v.is_enabled && v.is_default)?.price ??
        b.variants.find((v) => v.is_enabled)?.price ??
        0;
      return aPrice - bPrice;
    });
  if (sort === "price-desc")
    return copy.sort((a, b) => {
      const aPrice =
        a.variants.find((v) => v.is_enabled && v.is_default)?.price ??
        a.variants.find((v) => v.is_enabled)?.price ??
        0;
      const bPrice =
        b.variants.find((v) => v.is_enabled && v.is_default)?.price ??
        b.variants.find((v) => v.is_enabled)?.price ??
        0;
      return bPrice - aPrice;
    });
  if (sort === "alpha-asc")
    return copy.sort((a, b) => a.title.localeCompare(b.title));
  return copy;
}

type Props = {
  searchParams: Promise<{ sort?: string; collection?: string; fit?: string; category?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = params.sort ?? "default";
  const fit = params.fit ?? "";
  const category = params.category ?? "";

  let allProducts: PrintifyProduct[] = [];
  let error = false;

  try {
    allProducts = await getProducts();
  } catch {
    error = true;
  }

  // Basic client-side filtering stubs (expand with real tags from Printify)
  let filtered = allProducts;
  if (fit === "womens")
    filtered = filtered.filter((p) => /women'?s|girls?/i.test(p.title));
  if (fit === "unisex")
    filtered = filtered.filter((p) => !/women'?s|girls?/i.test(p.title));

  const sorted = sortProducts(filtered, sort);
  const count = sorted.length;

  const activeCollection = params.collection ?? "";
  const activeSort = SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0];

  return (
    <div className="min-h-screen bg-rejesha-white">
      {/* Page header banner */}
      <div className="border-b border-rejesha-border bg-rejesha-cream py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">
              <li>
                <Link href="/" className="hover:text-rejesha-black transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li aria-current="page" className="text-rejesha-black">
                Shop
              </li>
            </ol>
          </nav>

          <h1 className="font-display text-4xl text-rejesha-black sm:text-5xl">
            {category === "best-sellers"
              ? "Best Sellers"
              : category === "new"
              ? "Just Dropped"
              : fit === "womens"
              ? "Women's Tees"
              : fit === "unisex"
              ? "Unisex Tees"
              : "Shop All T-Shirts"}
          </h1>
          <p className="mt-3 text-sm text-rejesha-muted-gray">
            Kenyan-inspired designs for the diaspora — wherever home took you.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Filter / sort toolbar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Collection pills */}
          <div className="flex flex-wrap items-center gap-2">
            {COLLECTIONS.map(({ label, value }) => (
              <Link
                key={value}
                href={value ? `/products?collection=${value}` : "/products"}
                className={`border px-3 py-1 font-mono-brand text-[0.6rem] tracking-widest uppercase transition-colors ${
                  activeCollection === value
                    ? "border-rejesha-black bg-rejesha-black text-white"
                    : "border-rejesha-border text-rejesha-muted-gray hover:border-rejesha-black hover:text-rejesha-black"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right: Count + Sort */}
          <div className="flex shrink-0 items-center gap-4">
            <span className="font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">
              {count} product{count !== 1 ? "s" : ""}
            </span>

            {/* Sort select */}
            <div className="relative">
              <select
                defaultValue={sort}
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("sort", e.target.value);
                  window.location.href = url.toString();
                }}
                className="appearance-none border border-rejesha-border bg-white py-1.5 pl-3 pr-7 font-mono-brand text-[0.6rem] tracking-widest text-rejesha-black uppercase focus:border-rejesha-black focus:outline-none"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 16 16"
                className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-rejesha-muted-gray"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 6l4 4 4-4" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Fit tabs */}
        <div className="mb-8 flex gap-6 border-b border-rejesha-border pb-0">
          {[
            { label: "All Fits", value: "" },
            { label: "Unisex", value: "unisex" },
            { label: "Women's", value: "womens" },
          ].map(({ label, value }) => {
            const isActive = fit === value;
            const href = value
              ? `/products?fit=${value}${sort !== "default" ? `&sort=${sort}` : ""}`
              : `/products${sort !== "default" ? `?sort=${sort}` : ""}`;
            return (
              <Link
                key={value}
                href={href}
                className={`-mb-px border-b-2 pb-3 font-mono-brand text-[0.65rem] tracking-widest uppercase transition-colors ${
                  isActive
                    ? "border-rejesha-red text-rejesha-black"
                    : "border-transparent text-rejesha-muted-gray hover:text-rejesha-black"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* States */}
        {error && (
          <div className="py-20 text-center">
            <p className="font-display text-2xl text-rejesha-black">
              Products loading…
            </p>
            <p className="mt-3 text-sm text-rejesha-muted-gray">
              Connect your Printify store in{" "}
              <code className="rounded bg-rejesha-cream px-1">.env.local</code>{" "}
              to see products here.
            </p>
          </div>
        )}

        {!error && sorted.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-display text-2xl text-rejesha-black">
              No products yet
            </p>
            <p className="mt-3 text-sm text-rejesha-muted-gray">
              Check back soon — new designs drop regularly.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block border border-rejesha-black px-6 py-2.5 font-mono-brand text-xs tracking-widest uppercase transition-colors hover:bg-rejesha-black hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        )}

        {!error && sorted.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-6">
            {sorted.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
