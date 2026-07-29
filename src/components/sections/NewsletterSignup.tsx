"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Please try again.");
    }
  }

  return (
    <section
      className="bg-rejesha-cream py-16 sm:py-20"
      aria-labelledby="newsletter-heading"
    >
      <div className="mx-auto max-w-xl px-6 text-center">
        {/* Eyebrow */}
        <p className="font-mono-brand text-[0.6rem] tracking-[0.25em] text-rejesha-muted-gray uppercase">
          Stay Connected
        </p>

        {/* Accent */}
        <div className="mx-auto my-4 h-0.5 w-10 bg-gradient-to-r from-rejesha-red to-rejesha-green" />

        <h2
          id="newsletter-heading"
          className="font-display text-3xl text-rejesha-black sm:text-4xl"
        >
          Stay Connected to Home
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-rejesha-muted-gray">
          New drops, diaspora stories, group shirt inspiration, and a little bit of
          home — straight to your inbox. No spam. Unsubscribe any time.
        </p>

        {status === "success" ? (
          <div className="mt-10 rounded border border-rejesha-green bg-rejesha-green/10 px-6 py-5 text-center">
            <p className="font-display text-xl text-rejesha-green">
              Asante! 🇰🇪
            </p>
            <p className="mt-1 text-sm text-rejesha-muted-gray">
              You&apos;re on the list. Welcome to the community.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10"
            noValidate
            aria-label="Newsletter signup form"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
                className="flex-1 border border-rejesha-border bg-white px-4 py-3 text-sm text-rejesha-black placeholder:text-rejesha-muted-gray focus:border-rejesha-black focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-rejesha-black px-8 py-3 font-mono-brand text-xs tracking-widest text-white uppercase transition-colors hover:bg-rejesha-red disabled:opacity-60"
              >
                {status === "loading" ? "Joining…" : "Join REJESHA"}
              </button>
            </div>

            {status === "error" && (
              <p className="mt-3 text-xs text-rejesha-red" role="alert">
                {errorMsg}
              </p>
            )}

            <p className="mt-4 text-xs text-rejesha-muted-gray">
              By subscribing, you agree to our{" "}
              <a href="/privacy" className="underline hover:text-rejesha-black">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
