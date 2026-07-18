import Image from "next/image";
import Link from "next/link";
import type { PrintifyProduct } from "@/lib/printify";
import { formatPrice, defaultVariant } from "@/lib/product-utils";

export default function ProductCard({ product }: { product: PrintifyProduct }) {
  const image = product.images.find((i) => i.is_default) ?? product.images[0];
  const variant = defaultVariant(product);

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-rejesha-line">
        {image && (
          <Image
            src={image.src}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-rejesha-black">
          {product.title}
        </h3>
        {variant && (
          <span className="whitespace-nowrap text-sm font-semibold text-rejesha-red">
            {formatPrice(variant.price)}
          </span>
        )}
      </div>
    </Link>
  );
}
