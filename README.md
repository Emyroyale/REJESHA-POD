# REJESHA

Custom storefront built with Next.js (App Router), Printify (print-on-demand
catalog + fulfillment), Stripe (checkout), and Supabase (order records).

## Stack

- **Next.js 16** — server-rendered product pages, no client-side framework
  bloat, fast by default.
- **Printify API** — product catalog is fetched server-side and cached
  (5 min revalidation); orders are pushed to Printify for production once
  payment is confirmed.
- **Stripe Checkout** — hosted, PCI-compliant payment page. Prices are
  re-verified against Printify server-side before a session is created, so a
  tampered client request can't check out at the wrong price.
- **Supabase (Postgres)** — stores order records so you have order history
  independent of Stripe/Printify dashboards.

## Setup

1. Install dependencies (already done): `npm install`
2. Copy `.env.local.example` to `.env.local` and fill in:
   - `PRINTIFY_API_TOKEN`, `PRINTIFY_SHOP_ID` — from your Printify account
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
     `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from your Stripe dashboard
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — from your Supabase project
3. In the Supabase SQL editor, run `supabase/schema.sql` to create the
   `orders` table.
4. In Printify, publish at least one product to your shop so
   `/products` has something to render.
5. Run the dev server: `npm run dev`

### Testing the Stripe webhook locally

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed signing secret into `STRIPE_WEBHOOK_SECRET` in
`.env.local`, then use a Stripe test card (`4242 4242 4242 4242`) to
complete checkout.

### Going live

- Add a webhook endpoint in the Stripe dashboard pointing at
  `https://yourdomain.com/api/webhooks/stripe`, subscribed to
  `checkout.session.completed`, and use its signing secret in production.
- Set `shipping_address_collection.allowed_countries` in
  `src/app/api/checkout/route.ts` to match where you actually ship.
- Swap the brand colors/fonts in `src/app/globals.css` and
  `src/app/layout.tsx` if you want to adjust the black/red/white theme.

## Project structure

- `src/lib/printify.ts` — Printify API client (products + order creation)
- `src/lib/stripe.ts` — Stripe server client
- `src/lib/supabase.ts` — Supabase admin client (server-only)
- `src/lib/cart-context.tsx` — client-side cart, persisted to localStorage
- `src/app/api/checkout/route.ts` — creates a Stripe Checkout Session
- `src/app/api/webhooks/stripe/route.ts` — on payment success, creates the
  Printify order and marks the Supabase order record as paid
