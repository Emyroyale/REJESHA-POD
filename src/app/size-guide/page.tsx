import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Guide | REJESHA",
  description: "Find your perfect fit with the REJESHA T-shirt size guide. Measurements for unisex and women's styles.",
};

const UNISEX_SIZES = [
  { size: "XS", chest: '32–34"', length: '27"', sleeve: '7.5"' },
  { size: "S",  chest: '34–36"', length: '28"', sleeve: '8"'   },
  { size: "M",  chest: '38–40"', length: '29"', sleeve: '8.5"' },
  { size: "L",  chest: '42–44"', length: '30"', sleeve: '9"'   },
  { size: "XL", chest: '46–48"', length: '31"', sleeve: '9.5"' },
  { size: "2XL",chest: '50–52"', length: '32"', sleeve: '10"'  },
  { size: "3XL",chest: '54–56"', length: '33"', sleeve: '10.5"'},
];

const WOMENS_SIZES = [
  { size: "XS", chest: '31–33"', length: '24.5"', sleeve: '6.5"' },
  { size: "S",  chest: '33–35"', length: '25"',   sleeve: '7"'   },
  { size: "M",  chest: '36–38"', length: '25.5"', sleeve: '7.5"' },
  { size: "L",  chest: '40–42"', length: '26"',   sleeve: '8"'   },
  { size: "XL", chest: '44–46"', length: '26.5"', sleeve: '8.5"' },
  { size: "2XL",chest: '48–50"', length: '27"',   sleeve: '9"'   },
];

const TIPS = [
  { label: "Chest", tip: "Measure around the fullest part of your chest, keeping the tape level." },
  { label: "Length", tip: "From the highest point of the shoulder down to the hem." },
  { label: "Sleeve", tip: "From the shoulder seam to the end of the sleeve." },
  { label: "Fit Advice", tip: "Unisex tees run true to size with a relaxed cut. Women's styles are fitted — size up if you prefer a looser look." },
];

function SizeTable({ rows, caption }: { rows: typeof UNISEX_SIZES; caption: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label={caption}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-rejesha-border">
            {["Size", "Chest", "Length", "Sleeve"].map((h) => (
              <th
                key={h}
                scope="col"
                className="py-3 pr-6 text-left font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase first:pl-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-rejesha-border">
          {rows.map((r) => (
            <tr key={r.size} className="hover:bg-rejesha-cream/50 transition-colors">
              <td className="py-3 pr-6 font-semibold text-rejesha-black">{r.size}</td>
              <td className="py-3 pr-6 text-rejesha-muted-gray">{r.chest}</td>
              <td className="py-3 pr-6 text-rejesha-muted-gray">{r.length}</td>
              <td className="py-3 text-rejesha-muted-gray">{r.sleeve}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-rejesha-white">
      {/* Header */}
      <div className="border-b border-rejesha-border bg-rejesha-cream py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 font-mono-brand text-[0.6rem] tracking-widest text-rejesha-muted-gray uppercase">
              <li><Link href="/" className="hover:text-rejesha-black transition-colors">Home</Link></li>
              <li aria-hidden="true">·</li>
              <li aria-current="page" className="text-rejesha-black">Size Guide</li>
            </ol>
          </nav>
          <h1 className="font-display text-4xl text-rejesha-black sm:text-5xl">Size Guide</h1>
          <p className="mt-3 text-sm text-rejesha-muted-gray max-w-lg">
            All measurements are in inches. If you&apos;re between sizes, we recommend sizing up for a more relaxed fit.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-14">
        {/* Measurement tips */}
        <section aria-labelledby="tips-heading">
          <h2 id="tips-heading" className="font-display text-2xl text-rejesha-black mb-6">How to Measure</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TIPS.map((t) => (
              <div key={t.label} className="border border-rejesha-border bg-rejesha-cream p-5">
                <p className="font-mono-brand text-[0.65rem] tracking-widest text-rejesha-red uppercase mb-1">{t.label}</p>
                <p className="text-sm text-rejesha-muted-gray leading-relaxed">{t.tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Unisex table */}
        <section aria-labelledby="unisex-heading">
          <div className="mb-5 flex items-center gap-4">
            <h2 id="unisex-heading" className="font-display text-2xl text-rejesha-black">Unisex T-Shirts</h2>
            <div className="h-px flex-1 bg-rejesha-border" />
          </div>
          <SizeTable rows={UNISEX_SIZES} caption="Unisex T-shirt size chart with chest, length, and sleeve measurements" />
        </section>

        {/* Women's table */}
        <section aria-labelledby="womens-heading">
          <div className="mb-5 flex items-center gap-4">
            <h2 id="womens-heading" className="font-display text-2xl text-rejesha-black">Women&apos;s T-Shirts</h2>
            <div className="h-px flex-1 bg-rejesha-border" />
          </div>
          <SizeTable rows={WOMENS_SIZES} caption="Women's T-shirt size chart with chest, length, and sleeve measurements" />
        </section>

        {/* Still unsure */}
        <section className="border border-rejesha-border bg-rejesha-cream p-8 text-center">
          <p className="font-display text-xl text-rejesha-black">Still not sure?</p>
          <p className="mt-2 text-sm text-rejesha-muted-gray max-w-sm mx-auto">
            Reach out and we&apos;ll help you pick the right size.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block bg-rejesha-black px-8 py-3 font-mono-brand text-xs tracking-widest text-white uppercase transition-colors hover:bg-rejesha-red"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
}
