export const PROFILE = {
  name: 'Chirag Singhal',
  firstName: 'Chirag',
  role: 'Software engineer and AI engineer',
  currentRole: 'Software Engineering Specialist at TCS',
  location: 'India',
  email: 'chirag@oriz.in',
  personalSite: 'https://me.oriz.in',
  availability:
    'Open to software engineering and AI engineering opportunities.',
  shortBio:
    'Software engineer and AI engineer building privacy-first tools and practical knowledge at ORIZ.IN. I work across AI agents, MCP, React Native, Astro, TypeScript, and Python.',
  longBio: [
    'I am a software engineer and AI engineer based in India. I currently work as a Software Engineering Specialist at TCS, and I build ORIZ.IN as an independent, static-first library of tools and technical writing.',
    'My public work spans AI agents and MCP servers, browser-first utilities, financial data dashboards, and product engineering with Astro, React Native, TypeScript, and Python. I care about software that is fast, understandable, privacy-respecting, and honest about its limitations.',
    'I am open to software engineering and AI engineering opportunities. If you are working on useful developer tools, AI systems, or product engineering, I would like to hear about it.',
  ],
  knowsAbout: [
    'Software engineering',
    'AI engineering',
    'AI agents',
    'Model Context Protocol (MCP)',
    'Astro',
    'React Native',
    'TypeScript',
    'Python',
    'Browser-first tools',
    'Static site architecture',
    'Financial data dashboards',
  ],
  socials: [
    {
      label: 'GitHub',
      handle: '@chirag127',
      url: 'https://github.com/chirag127',
    },
    {
      label: 'LinkedIn',
      handle: 'in/chirag127',
      url: 'https://www.linkedin.com/in/chirag127/',
    },
    {
      label: 'X',
      handle: '@singhal127',
      url: 'https://x.com/singhal127',
    },
    {
      label: 'YouTube',
      handle: '@ChiragSinghal127',
      url: 'https://www.youtube.com/@ChiragSinghal127',
    },
    {
      label: 'Instagram',
      handle: '@chiragsinghal127',
      url: 'https://www.instagram.com/chiragsinghal127/',
    },
    {
      label: 'Reddit',
      handle: 'u/Far_Macaron_9910',
      url: 'https://www.reddit.com/user/Far_Macaron_9910/',
    },
    {
      label: 'Facebook',
      handle: 'singhal127',
      url: 'https://www.facebook.com/singhal127',
    },
    {
      label: 'Email',
      handle: 'chirag@oriz.in',
      url: 'mailto:chirag@oriz.in',
    },
  ],
  supportUrl: 'https://buymeacoffee.com/chirag127',
  supportLabel: 'Buy me a coffee',
  profileSource:
    'Public GitHub profile and repositories, reviewed 25 October 2026.',
} as const;

export type ProfileSocial = (typeof PROFILE.socials)[number];

export const SOCIAL_LINKS = PROFILE.socials.filter(
  (social) => social.label !== 'Email',
);
