import { notFound } from "next/navigation";
import { getProduct } from "@/lib/printify";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product;
  try {
    product = await getProduct(id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1600px] py-8 lg:py-12">
      <ProductDetail product={product} />
    </div>
  );
}
