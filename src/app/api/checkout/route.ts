import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/lib/printify";
import { getSupabaseAdmin } from "@/lib/supabase";

type CheckoutItem = {
  productId: string;
  variantId: number;
  quantity: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as { items: CheckoutItem[] };

  if (!body.items?.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  // Re-derive prices and titles from Printify server-side — never trust
  // amounts sent from the client.
  const lineItems: {
    productId: string;
    variantId: number;
    quantity: number;
    title: string;
    variantTitle: string;
    price: number;
    image: string;
  }[] = [];

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
    lineItems.push({
      productId: product.id,
      variantId: variant.id,
      quantity: item.quantity,
      title: product.title,
      variantTitle: variant.title,
      price: variant.price,
      image: image?.src ?? "",
    });
  }

  const amountTotal = lineItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const supabase = getSupabaseAdmin();
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

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: "usd",
        unit_amount: i.price,
        product_data: {
          name: `${i.title} — ${i.variantTitle}`,
          images: i.image ? [i.image] : undefined,
        },
      },
    })),
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
