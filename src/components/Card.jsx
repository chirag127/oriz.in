export default function Card({ eyebrow, title, description, href, cta = "Learn more", accent = "brand" }) {
  const accents = {
    brand: "from-brand/16 to-aqua/16",
    mint: "from-mint/16 to-brand/10",
    ink: "from-ink/10 to-brand/10"
  };

  return (
    <a
      href={href}
      className="group relative overflow-hidden rounded-[28px] border border-white/90 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-panel"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accents[accent] || accents.brand}`} />
      <div className="space-y-4">
        {eyebrow && (
          <span className="inline-flex rounded-full bg-brand/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {eyebrow}
          </span>
        )}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight text-ink">{title}</h3>
          <p className="text-sm leading-7 text-slate">{description}</p>
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
          {cta}
          <span aria-hidden="true" className="transition group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </a>
  );
}
