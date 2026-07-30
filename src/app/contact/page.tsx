"use client";

import { useState } from "react";
import Link from "next/link";

const SUBJECTS = [
  "Order Question",
  "Custom / Group Shirts",
  "Size or Fit Help",
  "Return or Exchange",
  "Partnership Inquiry",
  "Something Else",
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    // For now, mailto fallback. Replace with Resend / Supabase edge function later.
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`
    );
    window.location.href = `mailto:hello@rejesha.store?subject=${encodeURIComponent(`[${form.subject}] from ${form.name}`)}&body=${body}`;
    setStatus("success");
  }

  return (
    <div className="min-h-screen bg-rejesha-white">
      {/* Header */}
      <div className="border-b border-rejesha-border bg-rejesha-cream py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">
              <li><Link href="/" className="hover:text-rejesha-black transition-colors">Home</Link></li>
              <li aria-hidden="true">·</li>
              <li aria-current="page" className="text-rejesha-black">Contact</li>
            </ol>
          </nav>
          <h1 className="font-display text-4xl text-rejesha-black sm:text-5xl">Get in Touch</h1>
          <p className="mt-3 max-w-md text-sm text-rejesha-muted-gray">
            Questions about an order, custom shirts, or anything else? We usually reply within 24 hours.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-4xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="sr-only">Contact form</h2>

          {status === "success" ? (
            <div className="rounded border border-rejesha-green bg-rejesha-green/10 p-8 text-center">
              <p className="font-display text-2xl text-rejesha-green">Asante! 🇰🇪</p>
              <p className="mt-2 text-sm text-rejesha-muted-gray">
                Your message is on its way. We&apos;ll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">
                    Your Name <span className="text-rejesha-red">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className="w-full border border-rejesha-border bg-white px-4 py-3 text-sm text-rejesha-black placeholder:text-rejesha-muted-gray focus:border-rejesha-black focus:outline-none"
                    placeholder="e.g. Wanjiru K."
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">
                    Email <span className="text-rejesha-red">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="w-full border border-rejesha-border bg-white px-4 py-3 text-sm text-rejesha-black placeholder:text-rejesha-muted-gray focus:border-rejesha-black focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="mb-1.5 block font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">
                  Subject
                </label>
                <select
                  id="contact-subject"
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                  className="w-full border border-rejesha-border bg-white px-4 py-3 text-sm text-rejesha-black focus:border-rejesha-black focus:outline-none"
                >
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">
                  Message <span className="text-rejesha-red">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  className="w-full border border-rejesha-border bg-white px-4 py-3 text-sm text-rejesha-black placeholder:text-rejesha-muted-gray focus:border-rejesha-black focus:outline-none"
                  placeholder="Tell us what's on your mind…"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-rejesha-red py-3.5 font-mono-brand text-xs tracking-widest text-white uppercase transition-colors hover:bg-rejesha-black disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </section>

        {/* Sidebar info */}
        <aside className="space-y-6">
          {[
            {
              icon: "📧",
              title: "Email Us",
              body: "hello@rejesha.store",
              note: "Reply within 24 hours on business days.",
            },
            {
              icon: "📸",
              title: "Instagram DMs",
              body: "@rejeshastore",
              href: "https://instagram.com/rejeshastore",
              note: "Great for quick questions and custom shirt inspo.",
            },
            {
              icon: "🕒",
              title: "Response Times",
              body: "Mon–Fri, 9am–5pm EST",
              note: "We&apos;re a small team but we always reply.",
            },
          ].map(({ icon, title, body, note, href }) => (
            <div key={title} className="border border-rejesha-border bg-rejesha-cream p-5">
              <p className="mb-1 text-xl">{icon}</p>
              <p className="font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">{title}</p>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer"
                  className="mt-1 block font-semibold text-rejesha-black hover:text-rejesha-red">{body}</a>
              ) : (
                <p className="mt-1 font-semibold text-rejesha-black">{body}</p>
              )}
              <p className="mt-1 text-xs text-rejesha-muted-gray" dangerouslySetInnerHTML={{ __html: note }} />
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
