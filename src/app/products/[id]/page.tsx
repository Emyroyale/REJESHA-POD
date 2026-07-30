import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProducts } from "@/lib/printify";
import type { PrintifyProduct } from "@/lib/printify";
import ProductDetail from "@/components/ProductDetail";
import BestSellers from "@/components/sections/BestSellers";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return {
      title: product.title,
      description: `Shop ${product.title} — original Kenyan-inspired design. Printed in the USA. Ships worldwide.`,
      openGraph: {
        title: `${product.title} | REJESHA`,
        images: product.images[0]
          ? [{ url: product.images[0].src, width: 800, height: 800 }]
          : [],
      },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  let product;
  try {
    product = await getProduct(id);
  } catch {
    notFound();
  }

  // Cross-sell: fetch all products for the "You May Also Like" row
  let allProducts: PrintifyProduct[] = [];
  try {
    const all = await getProducts();
    // Exclude current product; take up to 4
    allProducts = all.filter((p) => p.id !== product.id).slice(0, 8);
  } catch {
    allProducts = [];
  }

  return (
    <>
      <ProductDetail product={product} />

      {/* Cross-sell */}
      {allProducts.length > 0 && (
        <div className="border-t border-rejesha-border bg-rejesha-cream">
          <BestSellers
            products={allProducts}
            heading="You May Also Like"
            eyebrow="More from REJESHA"
            showTabs={false}
          />
        </div>
      )}
    </>
  );
}
