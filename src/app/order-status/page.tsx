"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function OrderStatusPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "not_found">("idle");
  const [order, setOrder] = useState<Record<string, string> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId && !email) return;
    setStatus("loading");

    try {
      const res = await fetch(
        `/api/order-status?${new URLSearchParams({
          ...(orderId ? { orderId } : {}),
          ...(email ? { email } : {}),
        })}`
      );
      if (!res.ok) throw new Error("not_found");
      const data = await res.json();
      setOrder(data);
      setStatus("found");
    } catch {
      setStatus("not_found");
      setOrder(null);
    }

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending:    { label: "Pending",          color: "text-rejesha-gold"       },
    production: { label: "In Production",    color: "text-rejesha-black"      },
    shipped:    { label: "Shipped",          color: "text-rejesha-green"      },
    delivered:  { label: "Delivered",        color: "text-rejesha-green"      },
    cancelled:  { label: "Cancelled",        color: "text-rejesha-muted-gray" },
  };

  return (
    <div className="min-h-screen bg-rejesha-white">
      {/* Header */}
      <div className="border-b border-rejesha-border bg-rejesha-cream py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">
              <li>
                <Link href="/" className="hover:text-rejesha-black transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">·</li>
              <li aria-current="page" className="text-rejesha-black">
                Order Status
              </li>
            </ol>
          </nav>
          <h1 className="font-display text-4xl text-rejesha-black sm:text-5xl">
            Track Your Order
          </h1>
          <p className="mt-3 text-sm text-rejesha-muted-gray">
            Enter your order ID or the email address you used at checkout.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {/* Lookup form */}
        <form onSubmit={handleLookup} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="order-id"
              className="mb-1.5 block font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase"
            >
              Order ID
            </label>
            <input
              id="order-id"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. RJ-20240001"
              className="w-full border border-rejesha-border bg-white px-4 py-3 text-sm text-rejesha-black placeholder:text-rejesha-muted-gray focus:border-rejesha-black focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 text-rejesha-muted-gray">
            <div className="h-px flex-1 bg-rejesha-border" />
            <span className="font-mono-brand text-[0.6rem] tracking-widest uppercase">
              or
            </span>
            <div className="h-px flex-1 bg-rejesha-border" />
          </div>

          <div>
            <label
              htmlFor="order-email"
              className="mb-1.5 block font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase"
            >
              Email Address
            </label>
            <input
              id="order-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-rejesha-border bg-white px-4 py-3 text-sm text-rejesha-black placeholder:text-rejesha-muted-gray focus:border-rejesha-black focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || (!orderId && !email)}
            className="w-full bg-rejesha-black py-3.5 font-mono-brand text-xs tracking-widest text-white uppercase transition-colors hover:bg-rejesha-red disabled:opacity-50"
          >
            {status === "loading" ? "Looking up…" : "Track Order"}
          </button>
        </form>

        {/* Result */}
        <div ref={resultRef} className="mt-10">
          {status === "not_found" && (
            <div className="border border-rejesha-red bg-rejesha-red/5 p-6 text-center">
              <p className="font-display text-lg text-rejesha-black">Order not found</p>
              <p className="mt-2 text-sm text-rejesha-muted-gray">
                Double-check your order ID or email. If you need help,{" "}
                <Link href="/contact" className="text-rejesha-black underline">
                  contact us
                </Link>
                .
              </p>
            </div>
          )}

          {status === "found" && order && (
            <div className="border border-rejesha-border bg-rejesha-cream p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">
                    Order
                  </p>
                  <p className="mt-1 font-display text-xl text-rejesha-black">
                    #{order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">
                    Status
                  </p>
                  <p
                    className={`mt-1 font-semibold ${
                      STATUS_LABELS[order.status]?.color ?? "text-rejesha-black"
                    }`}
                  >
                    {STATUS_LABELS[order.status]?.label ?? order.status}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-rejesha-border border-t border-rejesha-border">
                {[
                  { label: "Email", value: order.customer_email },
                  { label: "Total", value: order.amount_total ? `$${(parseInt(order.amount_total) / 100).toFixed(2)}` : "—" },
                  { label: "Placed", value: order.created_at ? new Date(order.created_at).toLocaleDateString() : "—" },
                  { label: "Tracking", value: order.tracking_url ? "Available" : "Pending" },
                ]
                  .filter((r) => r.value)
                  .map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3">
                      <span className="text-xs text-rejesha-muted-gray">{label}</span>
                      <span className="text-sm font-semibold text-rejesha-black">{value}</span>
                    </div>
                  ))}
              </div>

              {order.tracking_url && (
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 block w-full border border-rejesha-black py-3 text-center font-mono-brand text-xs tracking-widest text-rejesha-black uppercase transition-colors hover:bg-rejesha-black hover:text-white"
                >
                  Track Shipment →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Help callout */}
        <div className="mt-10 border border-rejesha-border bg-rejesha-cream p-6 text-center">
          <p className="font-display text-lg text-rejesha-black">Need more help?</p>
          <p className="mt-1 text-sm text-rejesha-muted-gray">
            We&apos;re a small team and we always reply.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block border border-rejesha-black px-6 py-2.5 font-mono-brand text-xs tracking-widest uppercase transition-colors hover:bg-rejesha-black hover:text-white"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
