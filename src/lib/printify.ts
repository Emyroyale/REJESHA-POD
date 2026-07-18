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

export type PrintifyProduct = {
  id: string;
  title: string;
  description: string;
  images: PrintifyImage[];
  variants: PrintifyVariant[];
  visible: boolean;
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
