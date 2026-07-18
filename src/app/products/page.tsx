import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/printify";

export const metadata = { title: "Shop All — REJESHA" };

export default async function ProductsPage() {
  let products;
  try {
    products = await getProducts();
  } catch {
    products = null;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-display mb-10 text-3xl tracking-brand">SHOP ALL</h1>

      {products === null && (
        <p className="text-sm text-rejesha-gray">
          Products will appear here once Printify is connected. See README for setup.
        </p>
      )}

      {products !== null && products.length === 0 && (
        <p className="text-sm text-rejesha-gray">No products published yet.</p>
      )}

      {products && products.length > 0 && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
