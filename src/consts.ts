export const SITE = {
  name: 'ORIZ.IN',
  title: 'ORIZ.IN — Knowledge, tools, and references',
  description:
    'A growing library of practical articles, privacy-first browser tools, calculators, and reference guides for people who build and think for a living.',
  longDescription:
    'ORIZ.IN is an independent, static-first knowledge and tools platform. Every calculator and formatter runs locally in your browser, every article lives in Git, and nothing requires an account.',
  url: 'https://oriz.in',
  locale: 'en',
  language: 'en',
  author: 'Chirag Singhal',
  authorUrl: '/author/chirag-singhal/',
  email: 'chirag@oriz.in',
  supportUrl: 'https://buymeacoffee.com/chirag127',
  copyrightYear: 2026,
  repoUrl: 'https://github.com/chirag127/oriz.in',
  issuesUrl: 'https://github.com/chirag127/oriz.in/issues',
  ogImage: '/og-default.png',
  contentLicense: 'CC BY 4.0',
  codeLicense: 'MIT',
} as const;

export const NAV_LINKS = [
  { label: 'Articles', href: '/articles/' },
  { label: 'Tools', href: '/tools/' },
  { label: 'Learn', href: '/learn/' },
  { label: 'Developers', href: '/developers/' },
  { label: 'APIs', href: '/apis/' },
  { label: 'Diagrams', href: '/diagrams/' },
  { label: 'About', href: '/about/' },
] as const;

export const PRIMARY_NAV = NAV_LINKS.filter((link) => link.href !== '/about/');

export const FOOTER_GROUPS = [
  {
    title: 'Explore',
    links: [
      { label: 'All articles', href: '/articles/' },
      { label: 'Browse the library', href: '/library/' },
      { label: 'Tool directory', href: '/tools/' },
      { label: 'Learning paths', href: '/learn/' },
      { label: 'Glossary', href: '/glossary/' },
    ],
  },
  {
    title: 'Build',
    links: [
      { label: 'Developer resources', href: '/developers/' },
      { label: 'API directory', href: '/apis/' },
      { label: 'Diagrams & explainers', href: '/diagrams/' },
      { label: 'Search', href: '/search/' },
    ],
  },
  {
    title: 'The project',
    links: [
      { label: 'About ORIZ.IN', href: '/about/' },
      { label: 'Chirag Singhal', href: '/author/chirag-singhal/' },
      { label: 'Contact', href: '/contact/' },
      { label: 'Support ORIZ.IN', href: '/support/' },
      { label: 'Source code', href: SITE.repoUrl, external: true },
      { label: 'RSS feed', href: '/rss.xml' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'GitHub', href: 'https://github.com/chirag127', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/chirag127/', external: true },
      { label: 'X / Twitter', href: 'https://x.com/singhal127', external: true },
      { label: 'YouTube', href: 'https://www.youtube.com/@ChiragSinghal127', external: true },
      { label: 'Buy me a coffee', href: 'https://buymeacoffee.com/chirag127', external: true },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Privacy', href: '/privacy/' },
      { label: 'Terms of use', href: '/terms/' },
      { label: 'Editorial policy', href: '/editorial-policy/' },
      { label: 'Corrections', href: '/corrections/' },
      { label: 'Accessibility', href: '/accessibility/' },
      { label: 'Copyright', href: '/copyright/' },
      { label: 'Cookies & analytics', href: '/cookies/' },
    ],
  },
] as const;
