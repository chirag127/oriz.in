import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-5 py-3 backdrop-blur transition-all duration-300 ${
          scrolled
            ? "border-white/80 bg-white/88 shadow-soft"
            : "border-white/60 bg-white/70"
        }`}
      >
        <a href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-aqua text-base font-bold text-white shadow-soft">
            O
          </span>
          <span>ORIZ</span>
        </a>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate hover:bg-brand/8 hover:text-brand"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://finance.oriz.in"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand"
          >
            Finance Tools
          </a>
        </nav>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className="space-y-1">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>
      </div>
      {open && (
        <div className="mx-auto mt-3 max-w-7xl rounded-3xl border border-white/85 bg-white/95 p-3 shadow-panel backdrop-blur md:hidden">
          <nav className="grid gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate hover:bg-brand/5 hover:text-brand"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://finance.oriz.in"
              className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white"
            >
              Explore Finance Tools
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
