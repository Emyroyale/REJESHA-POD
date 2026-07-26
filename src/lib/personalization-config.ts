export type PersonalizationConfig = {
  productId: string;
  blueprintId: number;
  printProviderId: number;
  placeholderPosition: "front";
  /** Same-origin path under /public — avoids canvas CORS tainting. */
  baseDesignPath: string;
  /** Real Printify print-area pixel dimensions for this blueprint/provider/placeholder. */
  output: { width: number; height: number };
  text: { maxCharacters: number; minFontSize: number; maxFontSize: number };
  photo: { maxBytes: number; minWidth: number; minHeight: number };
};

export const PERSONALIZATION_PRODUCTS: Record<string, PersonalizationConfig> = {
  "69da1a6f9bb7d82038083130": {
    productId: "69da1a6f9bb7d82038083130",
    blueprintId: 6,
    printProviderId: 99,
    placeholderPosition: "front",
    baseDesignPath: "/personalization/cruise-squad-shirt/base-design.png",
    output: { width: 3951, height: 4919 },
    text: { maxCharacters: 30, minFontSize: 60, maxFontSize: 320 },
    photo: { maxBytes: 10 * 1024 * 1024, minWidth: 1200, minHeight: 1200 },
  },
};

export function getPersonalizationConfig(
  productId: string
): PersonalizationConfig | undefined {
  return PERSONALIZATION_PRODUCTS[productId];
}
