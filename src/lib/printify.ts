const PRINTIFY_API_BASE = "https://api.printify.com/v1";

export type PrintifyImage = {
  src: string;
  is_default: boolean;
  variant_ids: number[];
};

export type PrintifyVariant = {
  id: number;
  title: string;
  price: number;
  is_enabled: boolean;
  is_default: boolean;
};

export type PrintifyPlaceholderImage = {
  id: string;
  x: number;
  y: number;
  scale: number;
  angle: number;
  src?: string;
};

export type PrintifyPlaceholder = {
  position: string;
  images: PrintifyPlaceholderImage[];
};

export type PrintifyPrintArea = {
  variant_ids: number[];
  placeholders: PrintifyPlaceholder[];
};

export type PrintifyProduct = {
  id: string;
  title: string;
  description: string;
  images: PrintifyImage[];
  variants: PrintifyVariant[];
  visible: boolean;
  tags: string[];
  blueprint_id?: number;
  print_provider_id?: number;
  print_areas?: PrintifyPrintArea[];
};

type PrintifyProductsResponse = {
  data: PrintifyProduct[];
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.local.example.`
    );
  }
  return value;
}

async function printifyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = requireEnv("PRINTIFY_API_TOKEN");
  const res = await fetch(`${PRINTIFY_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    // Printify's product list payload regularly exceeds Next.js's 2MB data
    // cache entry limit, so persistent revalidation isn't used here — each
    // request fetches fresh (still deduped within a single render pass).
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Printify API error ${res.status} on ${path}: ${body.slice(0, 500)}`
    );
  }

  return res.json() as Promise<T>;
}

export async function getProducts(): Promise<PrintifyProduct[]> {
  const shopId = requireEnv("PRINTIFY_SHOP_ID");
  const data = await printifyFetch<PrintifyProductsResponse>(
    `/shops/${shopId}/products.json`
  );
  return data.data.filter((p) => p.visible);
}

export async function getProduct(productId: string): Promise<PrintifyProduct> {
  const shopId = requireEnv("PRINTIFY_SHOP_ID");
  return printifyFetch<PrintifyProduct>(`/shops/${shopId}/products/${productId}.json`);
}

export type PrintifyOrderLineItem = {
  product_id: string;
  variant_id: number;
  quantity: number;
};

export type PrintifyShippingAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
};

export type PrintifyUpload = {
  id: string;
  file_name: string;
  preview_url: string;
  width: number;
  height: number;
};

/** Uploads a flattened design PNG to Printify by base64 contents. */
export async function uploadPrintifyImage(
  fileName: string,
  base64Contents: string
): Promise<PrintifyUpload> {
  return printifyFetch<PrintifyUpload>("/uploads/images.json", {
    method: "POST",
    body: JSON.stringify({ file_name: fileName, contents: base64Contents }),
  });
}

/**
 * Creates a hidden (visible:false) one-off product carrying a customer's
 * personalized design, so it can be referenced by product_id/variant_id
 * when placing a Printify order. Printify has no way to attach a custom
 * image directly to an order line item — a real product must exist first.
 */
export async function createPersonalizedProduct(params: {
  title: string;
  blueprintId: number;
  printProviderId: number;
  variantId: number;
  variantPrice: number;
  placeholderPosition: string;
  uploadId: string;
}): Promise<{ productId: string; variantId: number }> {
  const shopId = requireEnv("PRINTIFY_SHOP_ID");
  const product = await printifyFetch<{ id: string; variants: PrintifyVariant[] }>(
    `/shops/${shopId}/products.json`,
    {
      method: "POST",
      body: JSON.stringify({
        title: params.title,
        blueprint_id: params.blueprintId,
        print_provider_id: params.printProviderId,
        visible: false,
        variants: [
          {
            id: params.variantId,
            price: params.variantPrice,
            is_enabled: true,
          },
        ],
        print_areas: [
          {
            variant_ids: [params.variantId],
            placeholders: [
              {
                position: params.placeholderPosition,
                images: [
                  {
                    id: params.uploadId,
                    x: 0.5,
                    y: 0.5,
                    scale: 1,
                    angle: 0,
                  },
                ],
              },
            ],
          },
        ],
      }),
    }
  );

  return { productId: product.id, variantId: params.variantId };
}

/** Submits a paid order to Printify for production and fulfillment. */
export async function createPrintifyOrder(params: {
  externalId: string;
  lineItems: PrintifyOrderLineItem[];
  shippingAddress: PrintifyShippingAddress;
  shippingMethod?: number;
}): Promise<{ id: string }> {
  const shopId = requireEnv("PRINTIFY_SHOP_ID");
  return printifyFetch<{ id: string }>(`/shops/${shopId}/orders.json`, {
    method: "POST",
    body: JSON.stringify({
      external_id: params.externalId,
      line_items: params.lineItems,
      shipping_method: params.shippingMethod ?? 1,
      send_shipping_notification: true,
      address_to: params.shippingAddress,
    }),
  });
}
