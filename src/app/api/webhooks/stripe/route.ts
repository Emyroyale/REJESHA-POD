import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  createPersonalizedProduct,
  createPrintifyOrder,
  type PrintifyOrderLineItem,
} from "@/lib/printify";
import { getSupabaseAdmin } from "@/lib/supabase";

type StoredLineItem = {
  productId: string;
  variantId: number;
  quantity: number;
  title: string;
  price: number;
  personalization?: {
    personalizationId: string;
    printifyUploadId: string;
    placeholderPosition: string;
    blueprintId: number;
    printProviderId: number;
    personalizedProductId?: string;
    personalizedVariantId?: number;
  };
};

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.order_id;
  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id metadata." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // Idempotency: Stripe may retry webhook delivery.
  if (order.status === "paid") {
    return NextResponse.json({ received: true });
  }

  const shipping = session.collected_information?.shipping_details;
  const customerEmail = session.customer_details?.email ?? "";
  const [firstName, ...rest] = (shipping?.name ?? customerEmail).split(" ");
  const address = shipping?.address;

  // Mutable working copy — persisted back to Supabase after each
  // personalized product is created, so a retried delivery (or a crash
  // partway through) never creates a duplicate Printify product for a
  // line item that already has one.
  const storedLineItems = order.line_items as StoredLineItem[];

  for (let i = 0; i < storedLineItems.length; i++) {
    const item = storedLineItems[i];
    if (!item.personalization || item.personalization.personalizedProductId) {
      continue;
    }

    const created = await createPersonalizedProduct({
      title: `Custom – ${item.title}`,
      blueprintId: item.personalization.blueprintId,
      printProviderId: item.personalization.printProviderId,
      variantId: item.variantId,
      variantPrice: item.price,
      placeholderPosition: item.personalization.placeholderPosition,
      uploadId: item.personalization.printifyUploadId,
    });

    storedLineItems[i] = {
      ...item,
      personalization: {
        ...item.personalization,
        personalizedProductId: created.productId,
        personalizedVariantId: created.variantId,
      },
    };

    await supabase
      .from("orders")
      .update({ line_items: storedLineItems })
      .eq("id", orderId);
  }

  let printifyOrderId: string | null = null;
  if (address) {
    const printifyLineItems: PrintifyOrderLineItem[] = storedLineItems.map((i) => ({
      product_id: i.personalization?.personalizedProductId ?? i.productId,
      variant_id: i.personalization?.personalizedVariantId ?? i.variantId,
      quantity: i.quantity,
    }));

    const printifyOrder = await createPrintifyOrder({
      externalId: order.id,
      lineItems: printifyLineItems,
      shippingAddress: {
        first_name: firstName || "Customer",
        last_name: rest.join(" ") || "-",
        email: customerEmail,
        country: address.country ?? "US",
        region: address.state ?? undefined,
        address1: address.line1 ?? "",
        address2: address.line2 ?? undefined,
        city: address.city ?? "",
        zip: address.postal_code ?? "",
      },
    });
    printifyOrderId = printifyOrder.id;

    const personalizationIds = storedLineItems
      .map((i) => i.personalization?.personalizationId)
      .filter((id): id is string => Boolean(id));
    if (personalizationIds.length > 0) {
      await supabase
        .from("personalizations")
        .update({ status: "purchased" })
        .in("id", personalizationIds);
    }
  }

  await supabase
    .from("orders")
    .update({
      status: "paid",
      customer_email: customerEmail,
      printify_order_id: printifyOrderId,
    })
    .eq("id", orderId);

  return NextResponse.json({ received: true });
}
