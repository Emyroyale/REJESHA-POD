export default function BrandStatement() {
  return (
    <section
      className="relative overflow-hidden bg-rejesha-black py-20 sm:py-28"
      aria-labelledby="brand-statement-heading"
    >
      {/* Background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Ccircle cx='30' cy='30' r='1' fill='%23fff'/%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Red/green accent bars */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-rejesha-red via-rejesha-white/20 to-rejesha-green" />
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-rejesha-green via-rejesha-white/20 to-rejesha-red" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Eyebrow */}
        <p className="font-mono-brand text-[0.6rem] tracking-[0.3em] text-rejesha-gold uppercase">
          The REJESHA Way
        </p>

        {/* Main statement */}
        <h2
          id="brand-statement-heading"
          className="mt-6 font-display text-4xl leading-[1.1] text-rejesha-white sm:text-5xl lg:text-7xl"
        >
          Different Country.
          <br />
          <span className="text-rejesha-red">Same</span>{" "}
          <span className="text-rejesha-green">Heart.</span>
        </h2>

        {/* Supporting copy */}
        <p className="mx-auto mt-8 max-w-xl font-poppins text-base leading-relaxed text-white/60 sm:text-lg">
          You left home, but home never left you. REJESHA is for the Kenyan in
          Boston, the one in London, the family on a cruise ship in the
          Caribbean — all of us, still carrying that flag in our chest.
        </p>

        {/* Divider */}
        <div className="mx-auto my-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-script text-2xl text-rejesha-gold">Rejesha</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* CTA */}
        <a
          href="/about"
          className="inline-block border border-white/30 px-8 py-3 font-mono-brand text-xs tracking-widest text-white uppercase transition-colors hover:border-rejesha-gold hover:text-rejesha-gold"
        >
          Our Story →
        </a>
      </div>
    </section>
  );
}
