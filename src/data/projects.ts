export interface Project {
  name: string;
  description: string;
  language: string;
  stars: number;
  repo: string;
  homepage?: string;
  tags: string[];
  status?: string;
}

/**
 * Facts from the public GitHub repositories. Star counts were observed on
 * 25 October 2026 and are shown with that date wherever they appear.
 */
export const PROJECTS_CHECKED = '25 October 2026';

export const PROJECTS: Project[] = [
  {
    name: 'Clear-Thought MCP Server',
    description:
      'An MCP server that gives language models structured thinking tools, mental models, and debugging approaches for harder problem solving.',
    language: 'TypeScript',
    stars: 37,
    repo: 'https://github.com/chirag127/Clear-Thought-MCP-server',
    tags: ['AI', 'MCP', 'TypeScript'],
  },
  {
    name: 'Bookmark Mind',
    description:
      'A browser extension that organizes bookmarks with any OpenAI-compatible model, retaining a bring-your-own-key design and zero telemetry.',
    language: 'JavaScript',
    stars: 10,
    repo: 'https://github.com/chirag127/bookmark-mind',
    homepage: 'https://bookmark-mind.oriz.in',
    tags: ['AI', 'Browser extension', 'Privacy'],
  },
  {
    name: 'i2i Yield Watch',
    description:
      'A Python service that monitors peer-to-peer lending opportunities, alerts through Telegram, ntfy, email, and Discord, and serves a live dashboard.',
    language: 'Python',
    stars: 4,
    repo: 'https://github.com/chirag127/i2i-yield-watch',
    tags: ['Python', 'Automation', 'Finance'],
  },
  {
    name: 'ORIZ Design System',
    description:
      'A framework-agnostic design system with atomic packages for tokens, themes, and web-component primitives used across ORIZ projects.',
    language: 'TypeScript',
    stars: 1,
    repo: 'https://github.com/chirag127/design-system',
    tags: ['Design systems', 'TypeScript', 'Web components'],
  },
  {
    name: 'ORIZ Portfolio Lab',
    description:
      'A browser-only portfolio allocation studio exploring risk-adjusted returns for Indian equity, international funds, gold, and other asset classes.',
    language: 'TypeScript',
    stars: 0,
    repo: 'https://github.com/chirag127/oriz-portfolio-lab',
    tags: ['Finance', 'Browser tools', 'TypeScript'],
  },
  {
    name: 'FII/DII Activity Pipeline',
    description:
      'A data pipeline that gathers daily foreign and domestic institutional activity for Indian equity markets and publishes it as static JSON.',
    language: 'Python',
    stars: 0,
    repo: 'https://github.com/chirag127/fii-dii-activity-api',
    tags: ['Python', 'Finance', 'Data pipelines'],
    status: 'Deployment needs review before it is promoted as a live API.',
  },
  {
    name: 'ORIZ TTS',
    description:
      'Browser-based text-to-speech with selectable voices and live word highlighting. Processing stays on the device.',
    language: 'JavaScript',
    stars: 0,
    repo: 'https://github.com/chirag127/oriz-tts',
    homepage: 'https://tts.oriz.in',
    tags: ['Privacy', 'Browser APIs', 'JavaScript'],
  },
];

export const OPEN_API_FAMILY = {
  title: 'Oriz Free Public APIs',
  githubUrl:
    'https://github.com/chirag127?tab=repositories&q=-api&type=source&sort=updated',
  status: 'Early-stage collection',
  repoCount: '80+',
  description:
    'A collection of small, schema-first static JSON API projects designed to run at zero cost on GitHub Pages. Each project uses the same pattern: versioned JSON data, a JSON Schema, metadata, a search index, and an OpenAPI description.',
  honestNote:
    'Most repositories in this family are still scaffolds containing a single schema fixture rather than a complete dataset. The HTTP Status Codes API currently has a small starter set and the India PIN Code API has pilot records. They are presented here as an open work in progress, not as production-grade services.',
  liveExamples: [
    {
      name: 'HTTP Status Codes API',
      url: 'https://chirag127.github.io/http-status-api/',
      status: 'Starter dataset',
      note: 'Seven records at the time of review; the ORIZ.IN reference is more complete.',
    },
    {
      name: 'India PIN Code API',
      url: 'https://chirag127.github.io/india-pincode-api/',
      status: 'Pilot',
      note: 'Two pilot records demonstrating the format and schema.',
    },
  ],
} as const;
