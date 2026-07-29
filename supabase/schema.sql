-- Run this once in the Supabase SQL editor for your project.
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null,
  printify_order_id text,
  customer_email text not null default '',
  amount_total integer not null,
  currency text not null default 'usd',
  line_items jsonb not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists orders_stripe_session_id_idx on orders (stripe_session_id);

-- The app only ever talks to this table via the service role key from
-- server-side code, so row-level security stays enabled with no public
-- policies (service role bypasses RLS).
alter table orders enable row level security;

-- Holds an uploaded personalization (flattened design) until checkout
-- validates and snapshots it into orders.line_items. The client only ever
-- gets an opaque id back for this row, never the raw Printify upload id.
create table if not exists personalizations (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  printify_upload_id text not null,
  preview_url text not null,
  configuration jsonb not null,
  status text not null default 'draft', -- draft | attached_to_cart | purchased
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days')
);

alter table personalizations enable row level security;

-- Newsletter subscribers
-- Run: ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
-- after creating this table in the Supabase SQL editor.
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;
