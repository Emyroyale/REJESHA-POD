import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/printify";
import AddToCartForm from "@/components/AddToCartForm";

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

  const image = product.images.find((i) => i.is_default) ?? product.images[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square bg-rejesha-line">
          {image && (
            <Image
              src={image.src}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          )}
        </div>

        <div>
          <h1 className="font-display text-2xl tracking-brand">{product.title}</h1>
          <div
            className="mt-4 max-w-prose text-sm leading-relaxed text-rejesha-gray"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
          <div className="mt-8">
            <AddToCartForm
              productId={product.id}
              productTitle={product.title}
              image={image?.src ?? ""}
              variants={product.variants}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
