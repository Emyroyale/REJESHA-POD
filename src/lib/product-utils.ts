import type { PrintifyProduct, PrintifyVariant } from "@/lib/printify";

/** Printify prices are in cents. */
export function formatPrice(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function defaultVariant(product: PrintifyProduct): PrintifyVariant | undefined {
  const enabled = product.variants.filter((v) => v.is_enabled);
  return enabled.find((v) => v.is_default) ?? enabled[0] ?? product.variants[0];
}
