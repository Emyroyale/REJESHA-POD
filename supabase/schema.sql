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
