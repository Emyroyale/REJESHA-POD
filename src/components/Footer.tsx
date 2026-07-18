export default function Footer() {
  return (
    <footer className="border-t border-rejesha-black bg-rejesha-black text-rejesha-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl tracking-brand">REJESHA</p>
            <p className="mt-3 max-w-xs text-sm text-white/60">
              Bold essentials, made to order.
            </p>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold uppercase tracking-widest text-rejesha-red">
              Shop
            </p>
            <ul className="space-y-2 text-white/70">
              <li>All Products</li>
              <li>New Arrivals</li>
              <li>Best Sellers</li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold uppercase tracking-widest text-rejesha-red">
              Support
            </p>
            <ul className="space-y-2 text-white/70">
              <li>Shipping &amp; Returns</li>
              <li>Contact</li>
              <li>Order Status</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} REJESHA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
