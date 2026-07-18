import { createClient } from "@supabase/supabase-js";

/**
 * Server-only client using the service role key — bypasses RLS.
 * Never import this from a Client Component.
 */
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. See .env.local.example."
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export type OrderRecord = {
  id?: string;
  stripe_session_id: string;
  printify_order_id: string | null;
  customer_email: string;
  amount_total: number;
  currency: string;
  line_items: unknown;
  status: string;
  created_at?: string;
};
