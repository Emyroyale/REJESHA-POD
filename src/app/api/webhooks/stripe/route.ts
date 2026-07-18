import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createPrintifyOrder, type PrintifyOrderLineItem } from "@/lib/printify";
import { getSupabaseAdmin } from "@/lib/supabase";

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

  type StoredLineItem = {
    productId: string;
    variantId: number;
    quantity: number;
  };
  const storedLineItems = order.line_items as StoredLineItem[];

  let printifyOrderId: string | null = null;
  if (address) {
    const printifyLineItems: PrintifyOrderLineItem[] = storedLineItems.map((i) => ({
      product_id: i.productId,
      variant_id: i.variantId,
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
