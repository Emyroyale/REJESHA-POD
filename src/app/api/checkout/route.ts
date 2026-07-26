import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/lib/printify";
import { getSupabaseAdmin, type PersonalizationRecord } from "@/lib/supabase";
import { getPersonalizationConfig } from "@/lib/personalization-config";

type CheckoutItem = {
  productId: string;
  variantId: number;
  quantity: number;
  personalizationId?: string;
};

type StoredLineItem = {
  productId: string;
  variantId: number;
  quantity: number;
  title: string;
  variantTitle: string;
  price: number;
  image: string;
  personalization?: {
    personalizationId: string;
    printifyUploadId: string;
    previewUrl: string;
    placeholderPosition: string;
    blueprintId: number;
    printProviderId: number;
  };
};

export async function POST(request: Request) {
  try {
    return await handleCheckout(request);
  } catch (err) {
    console.error("Checkout failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed." },
      { status: 500 }
    );
  }
}

async function handleCheckout(request: Request) {
  const body = (await request.json()) as { items: CheckoutItem[] };

  if (!body.items?.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Phase 1: validate everything and build line items, without mutating
  // anything yet — a failure partway through must not leave a
  // personalization row flipped to attached_to_cart with nothing to show
  // for it.
  const lineItems: StoredLineItem[] = [];
  const personalizationRows: PersonalizationRecord[] = [];

  for (const item of body.items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity." }, { status: 400 });
    }
    const product = await getProduct(item.productId);
    const variant = product.variants.find(
      (v) => v.id === item.variantId && v.is_enabled
    );
    if (!variant) {
      return NextResponse.json(
        { error: `Variant unavailable for ${product.title}.` },
        { status: 400 }
      );
    }
    const image = product.images.find((i) => i.is_default) ?? product.images[0];

    let personalization: StoredLineItem["personalization"];
    if (item.personalizationId) {
      const config = getPersonalizationConfig(item.productId);
      if (!config) {
        return NextResponse.json(
          { error: "This product does not support personalization." },
          { status: 400 }
        );
      }
      const { data: row, error } = await supabase
        .from("personalizations")
        .select("*")
        .eq("id", item.personalizationId)
        .single<PersonalizationRecord>();

      if (error || !row) {
        return NextResponse.json({ error: "Personalization not found." }, { status: 400 });
      }
      if (row.product_id !== item.productId) {
        return NextResponse.json(
          { error: "Personalization does not match the submitted product." },
          { status: 400 }
        );
      }
      if (row.status !== "draft") {
        return NextResponse.json(
          { error: "This personalization has already been used." },
          { status: 400 }
        );
      }
      if (new Date(row.expires_at).getTime() < Date.now()) {
        return NextResponse.json({ error: "This personalization has expired." }, { status: 400 });
      }

      personalizationRows.push(row);
      personalization = {
        personalizationId: row.id,
        printifyUploadId: row.printify_upload_id,
        previewUrl: row.preview_url,
        placeholderPosition: config.placeholderPosition,
        blueprintId: config.blueprintId,
        printProviderId: config.printProviderId,
      };
    }

    lineItems.push({
      productId: product.id,
      variantId: variant.id,
      quantity: item.quantity,
      title: product.title,
      variantTitle: variant.title,
      price: variant.price,
      image: image?.src ?? "",
      personalization,
    });
  }

  // Phase 2: everything validated — now write.
  const amountTotal = lineItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      stripe_session_id: "pending",
      printify_order_id: null,
      customer_email: "",
      amount_total: amountTotal,
      currency: "usd",
      line_items: lineItems,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !order) {
    return NextResponse.json(
      { error: "Could not create order record." },
      { status: 500 }
    );
  }

  if (personalizationRows.length > 0) {
    await supabase
      .from("personalizations")
      .update({ status: "attached_to_cart" })
      .in("id", personalizationRows.map((r) => r.id));
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems.map((i) => {
      const displayImage = i.personalization?.previewUrl || i.image;
      return {
        quantity: i.quantity,
        price_data: {
          currency: "usd",
          unit_amount: i.price,
          product_data: {
            name: `${i.title} — ${i.variantTitle}`,
            images: displayImage ? [displayImage] : undefined,
          },
        },
      };
    }),
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU"],
    },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel`,
    metadata: { order_id: order.id },
  });

  await supabase
    .from("orders")
    .update({ stripe_session_id: session.id })
    .eq("id", order.id);

  return NextResponse.json({ url: session.url });
}
