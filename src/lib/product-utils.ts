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

/** Resolves a variant's selected value for a given Printify option type (e.g. "color", "size"). */
export function variantOptionValue(
  product: PrintifyProduct,
  variant: PrintifyVariant,
  type: string
) {
  for (const optionId of variant.options ?? []) {
    for (const option of product.options ?? []) {
      if (option.type !== type) continue;
      const value = option.values.find((v) => v.id === optionId);
      if (value) return value;
    }
  }
  return undefined;
}
