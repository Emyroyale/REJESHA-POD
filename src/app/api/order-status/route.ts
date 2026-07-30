import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId")?.trim();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!orderId && !email) {
    return NextResponse.json({ error: "orderId or email required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("orders")
    .select("id, customer_email, amount_total, currency, status, created_at, line_items")
    .limit(1);

  if (orderId) {
    // Try matching stripe_session_id or the uuid id column
    query = query.or(`id.eq.${orderId},stripe_session_id.eq.${orderId}`);
  } else if (email) {
    query = query.eq("customer_email", email).order("created_at", { ascending: false });
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("Order status lookup error:", error.message);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
