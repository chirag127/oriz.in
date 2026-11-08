export interface LearningStep {
  kind: 'article' | 'tool';
  slug: string;
  note?: string;
}

export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  audience: string;
  level: 'Beginner' | 'Intermediate' | 'Mixed';
  time: string;
  steps: LearningStep[];
  updated: string;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: 'practical-web-foundation',
    title: 'A Practical Web Foundation',
    description:
      'Understand the layer underneath everyday web work: HTTP responses, structured data, color, encoding, and the tools that make each one tangible.',
    audience:
      'Developers early in their career, or anyone who wants fewer magical explanations of the web.',
    level: 'Beginner',
    time: 'About 2 hours',
    updated: '2026-10-25',
    steps: [
      {
        kind: 'article',
        slug: 'http-status-codes',
        note: 'Start with what a server is actually saying.',
      },
      {
        kind: 'tool',
        slug: 'http-status-reference',
        note: 'Keep the reference open while you read.',
      },
      {
        kind: 'article',
        slug: 'json-formatting-and-validation',
        note: 'Learn to read structured data instead of guessing.',
      },
      {
        kind: 'tool',
        slug: 'json-formatter',
        note: 'Practice with a malformed document.',
      },
      {
        kind: 'article',
        slug: 'css-color-formats',
        note: 'Connect color syntax to contrast and accessibility.',
      },
      {
        kind: 'article',
        slug: 'base64-is-not-encryption',
        note: 'Finish with encoding, a concept that is often confused with security.',
      },
    ],
  },
  {
    slug: 'personal-finance-without-hype',
    title: 'Personal Finance, Without Hype',
    description:
      'Build a durable mental model of interest, loan repayment, and long-term growth. Every calculation states its assumptions and avoids return promises.',
    audience:
      'Anyone comparing savings, loans, or investment illustrations and wanting to understand the arithmetic.',
    level: 'Beginner',
    time: 'About 90 minutes',
    updated: '2026-10-25',
    steps: [
      {
        kind: 'article',
        slug: 'compound-interest-guide',
        note: 'See why frequency and time matter.',
      },
      {
        kind: 'tool',
        slug: 'compound-interest',
        note: 'Try two rates that differ by one percentage point.',
      },
      {
        kind: 'article',
        slug: 'home-loan-emi-breakup-principal-interest',
        note: 'Understand the interest-first shape of an amortization schedule.',
      },
      {
        kind: 'tool',
        slug: 'loan-emi',
        note: 'Compare a 20-year and a 30-year term.',
      },
      {
        kind: 'tool',
        slug: 'cagr-calculator',
        note: 'Translate total growth into an annual rate.',
      },
      {
        kind: 'tool',
        slug: 'sip-calculator',
        note: 'Treat the result as an illustration, not a forecast.',
      },
    ],
  },
  {
    slug: 'network-debugging-essentials',
    title: 'Network & Debugging Essentials',
    description:
      'A compact route through the addressing and scheduling details that explain many confusing application failures.',
    audience:
      'Backend, full-stack, and DevOps practitioners who debug across machines.',
    level: 'Intermediate',
    time: 'About 2 hours',
    updated: '2026-10-25',
    steps: [
      {
        kind: 'article',
        slug: 'ipv4-subnetting-guide',
        note: 'Build intuition for prefixes and usable ranges.',
      },
      {
        kind: 'tool',
        slug: 'subnet-calculator',
        note: 'Check the network and broadcast boundaries yourself.',
      },
      {
        kind: 'article',
        slug: 'http-status-codes',
        note: 'Separate client mistakes from server failures.',
      },
      {
        kind: 'article',
        slug: 'cron-expressions-guide',
        note: 'Understand the five fields and their surprising OR rule.',
      },
      {
        kind: 'tool',
        slug: 'cron-explainer',
        note: 'Preview the next matching times in local time.',
      },
      {
        kind: 'tool',
        slug: 'timestamp-converter',
        note: 'Tie schedule behavior back to exact instants.',
      },
    ],
  },
  {
    slug: 'india-money-decisions',
    title: 'India Money Decisions',
    description:
      'A practical route through emergency reserves, loan repayment, and long-term compounding, using Indian rupees and explicitly stated assumptions.',
    audience:
      'Salaried professionals and households making loan, savings, and investment decisions in India.',
    level: 'Beginner',
    time: 'About 2 hours',
    updated: '2026-10-26',
    steps: [
      {
        kind: 'article',
        slug: 'emergency-fund-sizing',
        note: 'Size the reserve before optimising returns.',
      },
      {
        kind: 'tool',
        slug: 'emergency-fund-calculator',
        note: 'Put a target and a monthly contribution on it.',
      },
      {
        kind: 'article',
        slug: 'compound-interest-guide',
        note: 'Understand the arithmetic behind long-term growth.',
      },
      {
        kind: 'article',
        slug: 'home-loan-emi-breakup-principal-interest',
        note: 'Read the interest-first shape of a home loan.',
      },
      {
        kind: 'article',
        slug: 'prepay-home-loan-or-invest-the-surplus',
        note: 'Compare prepayment with liquidity and opportunity cost.',
      },
      {
        kind: 'tool',
        slug: 'loan-prepayment-calculator',
        note: 'Model an extra monthly payment under stated assumptions.',
      },
    ],
  },
  {
    slug: 'backend-reliability-and-security',
    title: 'Backend Reliability & Security',
    description:
      'Design APIs that fail honestly, survive retries, and make authorization decisions visible. A compact path for small engineering teams.',
    audience:
      'Backend and full-stack engineers responsible for production services and APIs.',
    level: 'Intermediate',
    time: 'About 2 hours',
    updated: '2026-10-26',
    steps: [
      {
        kind: 'article',
        slug: 'secure-api-design',
        note: 'Start with identity, authorization, and failure boundaries.',
      },
      {
        kind: 'article',
        slug: 'backend-reliability-budget',
        note: 'Add timeouts, retries, queues, and observability without a platform team.',
      },
      {
        kind: 'article',
        slug: 'http-status-codes',
        note: 'Make the protocol carry the outcome honestly.',
      },
      {
        kind: 'tool',
        slug: 'jwt-decoder',
        note: 'Inspect a token locally, then verify it on the server.',
      },
      {
        kind: 'tool',
        slug: 'http-status-reference',
        note: 'Keep response semantics close at hand.',
      },
    ],
  },
];

export function getLearningPath(slug: string): LearningPath | undefined {
  return LEARNING_PATHS.find((path) => path.slug === slug);
}
