const TRUST_ITEMS = [
  {
    id: "printed-usa",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="24" cy="24" r="20" />
        <path d="M24 4 C16 12 12 18 12 24 C12 30 16 36 24 44 C32 36 36 30 36 24 C36 18 32 12 24 4Z" />
        <path d="M4 24 L44 24" />
      </svg>
    ),
    title: "Printed in the USA",
    description: "Every shirt is printed on demand by US-based print partners.",
  },
  {
    id: "ships-worldwide",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 32 L40 32 L36 20 L28 20 L28 14 L20 14 L20 20 L12 20 Z" />
        <circle cx="16" cy="37" r="4" />
        <circle cx="32" cy="37" r="4" />
        <path d="M4 20 L8 20 M40 20 L44 20" strokeLinecap="round" />
      </svg>
    ),
    title: "Ships Worldwide",
    description: "To Kenya, the UK, Canada, Australia — wherever home took you.",
  },
  {
    id: "made-to-order",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 10 C16 7 19 6 24 6 C29 6 32 7 32 10 L38 13 L38 40 L10 40 L10 13 Z" />
        <path d="M19 10 L29 10" strokeLinecap="round" />
        <path d="M18 24 L22 28 L30 20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    title: "Made to Order",
    description: "No warehouse, no waste. Your shirt is made specifically for you.",
  },
  {
    id: "secure-checkout",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M24 6 L38 12 L38 26 C38 34 32 40 24 44 C16 40 10 34 10 26 L10 12 Z" />
        <path d="M18 24 L22 28 L30 20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
    title: "Secure Checkout",
    description: "Stripe-powered payments. Your data is always safe.",
  },
];

export default function TrustBar() {
  return (
    <section
      className="border-y border-rejesha-border bg-rejesha-cream py-14 sm:py-16"
      aria-label="Why shop with REJESHA"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center">
              <div className="text-rejesha-black/70">{item.icon}</div>
              <h3 className="mt-4 font-display text-sm text-rejesha-black sm:text-base">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-rejesha-muted-gray sm:text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
