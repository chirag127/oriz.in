const links = [
  { href: "/about", label: "About" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" }
];

const social = [
  { href: "https://x.com/orizhq", label: "X" },
  { href: "https://www.linkedin.com/company/oriz", label: "in" },
  { href: "https://github.com/orizhq", label: "GH" }
];

export default function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/70 backdrop-blur">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <a href="/" className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-ink">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-aqua text-base font-bold text-white">
              O
            </span>
            <span>ORIZ</span>
          </a>
          <p className="max-w-md text-sm leading-7 text-slate">
            Oriz is a technology holding company building practical tools across finance,
            developer workflows, and digital identity.
          </p>
          <div className="flex gap-3">
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-xs font-semibold text-slate hover:border-brand hover:text-brand"
                aria-label={item.label}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-3xl border border-line bg-white px-5 py-4 text-sm font-medium text-slate hover:border-brand hover:text-brand"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
