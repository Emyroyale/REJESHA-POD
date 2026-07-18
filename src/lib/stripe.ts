import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "Missing STRIPE_SECRET_KEY environment variable. See .env.local.example."
      );
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}
