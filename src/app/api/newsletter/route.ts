import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email as string | undefined)?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email, subscribed_at: new Date().toISOString() }, { onConflict: "email" });

    if (error) {
      // If the table doesn't exist yet, fail gracefully
      console.error("Newsletter upsert error:", error.message);
      return NextResponse.json(
        { error: "Could not save your subscription. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter route error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
