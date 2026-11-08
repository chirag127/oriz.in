import type { IconName } from '../lib/icons';

export type ShelfId = 'money-work' | 'technology-ai' | 'life-learning' | 'world-ideas';
export type DomainStatus = 'live' | 'planned';

export interface TaxonomyShelf {
  id: ShelfId;
  title: string;
  description: string;
  order: number;
}

export interface TaxonomyDomain {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  shelf: ShelfId;
  status: DomainStatus;
  icon: IconName;
  order: number;
  featuredCategories: string[];
}

export interface TaxonomyCategory {
  slug: string;
  domain: string;
  title: string;
  description: string;
  icon: IconName;
  order: number;
  live: boolean;
}

export interface TaxonomySeries {
  slug: string;
  category: string;
  title: string;
  description: string;
  order: number;
}

export const SHELVES: TaxonomyShelf[] = [
  {
    id: 'money-work',
    title: 'Money & Work',
    description: 'Earning, saving, investing, borrowing, and building a working life in India.',
    order: 1,
  },
  {
    id: 'technology-ai',
    title: 'Technology & AI',
    description: 'Software, systems, data, design, and the tools that make them legible.',
    order: 2,
  },
  {
    id: 'life-learning',
    title: 'Life & Learning',
    description: 'Health, education, family, law, and the decisions that shape a household.',
    order: 3,
  },
  {
    id: 'world-ideas',
    title: 'World & Ideas',
    description: 'Civic life, science, travel, food, and the practical knowledge around them.',
    order: 4,
  },
];

export const DOMAINS: TaxonomyDomain[] = [
  {
    slug: 'money-finance',
    title: 'Money & Finance',
    description:
      'India-first personal finance: budgeting, banking, investing, tax, insurance, loans, gold, property, NRI money, and financial safety.',
    heroImage: '/images/library/categories/gold.jpg',
    heroImageAlt: 'Editorial still life of gold coins, an ingot, and a fine jewellery strand on a cream plinth.',
    shelf: 'money-work',
    status: 'live',
    icon: 'calculator',
    order: 1,
    featuredCategories: ['personal-finance', 'gold', 'loans-credit', 'tax', 'investing'],
  },
  {
    slug: 'work-career',
    title: 'Work & Career',
    description:
      'Starting work, building a career, negotiating pay, changing direction, and making the money side of work legible.',
    heroImage: '/images/library/domains/work-career.jpg',
    heroImageAlt: 'Abstract editorial illustration of cream steps, a charcoal desk, and an orange folder.',
    shelf: 'money-work',
    status: 'live',
    icon: 'layers',
    order: 2,
    featuredCategories: ['early-career'],
  },
  {
    slug: 'business',
    title: 'Business & Entrepreneurship',
    description:
      'Freelancing, creator businesses, e-commerce, GST, pricing, and the financial plumbing behind independent work.',
    heroImage: '/images/library/domains/business.jpg',
    heroImageAlt: 'Abstract editorial illustration of shipping boxes, a storefront frame, and an orange ledger.',
    shelf: 'money-work',
    status: 'live',
    icon: 'chart',
    order: 3,
    featuredCategories: ['side-income', 'small-business'],
  },
  {
    slug: 'technology',
    title: 'Technology',
    description:
      'Programming, APIs, the web, data, networking, developer craft, and the computer science underneath everyday software.',
    heroImage: '/images/articles/secure-api-design.jpg',
    heroImageAlt: 'Editorial illustration of a cream doorway with an orange keyed mechanism and charcoal walls.',
    shelf: 'technology-ai',
    status: 'live',
    icon: 'terminal',
    order: 4,
    featuredCategories: ['backend-apis', 'programming', 'data-storage'],
  },
  {
    slug: 'ai-data',
    title: 'AI & Data',
    description:
      'Practical AI engineering, retrieval, evaluation, data workflows, and the discipline behind systems that work on real data.',
    heroImage: '/images/articles/rag-retrieval-augmented-generation.jpg',
    heroImageAlt: 'Editorial illustration of paper records connected by fine threads to a scanning lens.',
    shelf: 'technology-ai',
    status: 'live',
    icon: 'spark',
    order: 5,
    featuredCategories: ['ai-engineering', 'data-engineering'],
  },
  {
    slug: 'design-accessibility',
    title: 'Design & Accessibility',
    description:
      'Color, contrast, visual systems, and interfaces that more people can use without guesswork.',
    heroImage: '/images/library/domains/design-accessibility.jpg',
    heroImageAlt: 'Abstract editorial composition of cream and charcoal planes, orange circles, and a focus ring.',
    shelf: 'technology-ai',
    status: 'live',
    icon: 'palette',
    order: 6,
    featuredCategories: ['color-accessibility'],
  },
  {
    slug: 'health-insurance',
    title: 'Health & Insurance',
    description:
      'Health cover, life and term insurance, motor policies, claims, exclusions, and the fine print that decides what gets paid.',
    heroImage: '/images/library/categories/health-insurance.jpg',
    heroImageAlt: 'Editorial illustration of a cream shield, orange circle, and a protected boundary.',
    shelf: 'life-learning',
    status: 'live',
    icon: 'shield',
    order: 7,
    featuredCategories: ['health-insurance', 'life-insurance', 'motor-insurance'],
  },
  {
    slug: 'education-learning',
    title: 'Education & Learning',
    description:
      'Paying for education, education loans, study planning, and the learning paths that turn scattered reading into a sequence.',
    heroImage: '/images/library/domains/education-learning.jpg',
    heroImageAlt: 'Abstract editorial still life of books, a bookmark, a geometric cap, and a path.',
    shelf: 'life-learning',
    status: 'live',
    icon: 'book-open',
    order: 8,
    featuredCategories: ['education-financing'],
  },
  {
    slug: 'home-family',
    title: 'Home & Family',
    description:
      'Marriage, joint accounts, children, parents, inheritance, and the money conversations that keep a household intact.',
    heroImage: '/images/library/domains/home-family.jpg',
    heroImageAlt: 'Abstract editorial still life of a house frame, table, bowls, and a chair.',
    shelf: 'life-learning',
    status: 'live',
    icon: 'file-text',
    order: 9,
    featuredCategories: ['marriage-money', 'women-money', 'family-money', 'inheritance'],
  },
  {
    slug: 'law-rights-fraud',
    title: 'Law, Rights & Fraud',
    description:
      'Scams, financial crime, grey-area schemes, consumer rights, and the legal consequences behind the pitch.',
    heroImage: '/images/articles/secure-api-design.jpg',
    heroImageAlt: 'Editorial illustration of a cream doorway with an orange keyed mechanism and charcoal walls.',
    shelf: 'life-learning',
    status: 'live',
    icon: 'shield',
    order: 10,
    featuredCategories: ['scams-fraud', 'financial-crime'],
  },
  {
    slug: 'civic-public-services',
    title: 'Civic & Public Services',
    description:
      'Official portals, government paperwork, public services, and the practical route through Indian civic infrastructure.',
    heroImage: '/images/library/domains/civic-public-services.jpg',
    heroImageAlt: 'Abstract editorial still life of a civic facade, sealed envelope, and verified document.',
    shelf: 'world-ideas',
    status: 'live',
    icon: 'globe',
    order: 11,
    featuredCategories: ['government-portals'],
  },
  {
    slug: 'productivity',
    title: 'Productivity & Organisation',
    description:
      'Text, files, schedules, references, and the systems that keep everyday work from turning into clutter.',
    heroImage: '/og-default.png',
    heroImageAlt: 'ORIZ.IN editorial illustration for a planned library domain.',
    shelf: 'world-ideas',
    status: 'planned',
    icon: 'settings',
    order: 12,
    featuredCategories: [],
  },
  {
    slug: 'science-environment',
    title: 'Science & Environment',
    description:
      'How the physical world works, the evidence behind claims, and the environmental trade-offs that shape daily life.',
    heroImage: '/og-default.png',
    heroImageAlt: 'ORIZ.IN editorial illustration for a planned library domain.',
    shelf: 'world-ideas',
    status: 'planned',
    icon: 'globe',
    order: 13,
    featuredCategories: [],
  },
  {
    slug: 'travel-places',
    title: 'Travel & Places',
    description:
      'Moving through India and beyond with better information, fewer surprises, and respect for the places visited.',
    heroImage: '/og-default.png',
    heroImageAlt: 'ORIZ.IN editorial illustration for a planned library domain.',
    shelf: 'world-ideas',
    status: 'planned',
    icon: 'globe',
    order: 14,
    featuredCategories: [],
  },
  {
    slug: 'food-nutrition',
    title: 'Food & Nutrition',
    description:
      'Cooking, nutrition, food safety, and the everyday decisions behind what ends up on the table.',
    heroImage: '/og-default.png',
    heroImageAlt: 'ORIZ.IN editorial illustration for a planned library domain.',
    shelf: 'world-ideas',
    status: 'planned',
    icon: 'list',
    order: 15,
    featuredCategories: [],
  },
];

export const CATEGORIES: TaxonomyCategory[] = [
  {
    slug: 'personal-finance',
    domain: 'money-finance',
    title: 'Personal Finance',
    description:
      'The money foundations: budgeting, emergency funds, inflation, sinking funds, monthly reviews, and the habits that make every other decision easier.',
    icon: 'calculator',
    order: 1,
    live: true,
  },
  {
    slug: 'banking',
    domain: 'money-finance',
    title: 'Banking & Savings',
    description:
      'Savings accounts, fixed and recurring deposits, deposit insurance, nomination, and the charges that quietly reduce the interest you earn.',
    icon: 'database',
    order: 2,
    live: true,
  },
  {
    slug: 'investing',
    domain: 'money-finance',
    title: 'Investing & Markets',
    description:
      'Mutual funds, index funds, bonds, SIPs, portfolio construction, and the arithmetic behind long-term investing in India.',
    icon: 'chart',
    order: 3,
    live: true,
  },
  {
    slug: 'stocks',
    domain: 'money-finance',
    title: 'Stocks & Company Analysis',
    description:
      'Annual reports, screening, valuation traps, promoter behaviour, related-party transactions, and corporate actions.',
    icon: 'chart',
    order: 4,
    live: true,
  },
  {
    slug: 'tax',
    domain: 'money-finance',
    title: 'Tax',
    description:
      'Income tax, capital gains, TDS, advance tax, notices, AIS reconciliation, and the rules that decide what a rupee actually keeps.',
    icon: 'file-text',
    order: 5,
    live: true,
  },
  {
    slug: 'retirement',
    domain: 'money-finance',
    title: 'Retirement & PF',
    description:
      'EPF, NPS, PPF, annuities, gratuity, and the corpus question behind building a salary you pay yourself.',
    icon: 'clock',
    order: 6,
    live: true,
  },
  {
    slug: 'loans-credit',
    domain: 'money-finance',
    title: 'Loans & Credit',
    description:
      'Home loans, personal and gold loans, credit cards, CIBIL reports, BNPL, and the difference between affordable credit and a trap.',
    icon: 'calculator',
    order: 7,
    live: true,
  },
  {
    slug: 'gold',
    domain: 'money-finance',
    title: 'Gold',
    description:
      'Every route to owning gold in India: physical metal, jewellery, digital gold, ETFs, Sovereign Gold Bonds, the Gold Monetisation Scheme, allocations, taxes, and liquidity.',
    icon: 'chart',
    order: 8,
    live: true,
  },
  {
    slug: 'real-estate',
    domain: 'money-finance',
    title: 'Real Estate',
    description:
      'Buying property, RERA, land title due diligence, rental yields, and the costs that a property brochure leaves out.',
    icon: 'database',
    order: 9,
    live: true,
  },
  {
    slug: 'alternatives',
    domain: 'money-finance',
    title: 'Alternative Investments',
    description:
      'Crypto, P2P lending, invoice discounting, PMS, AIF, fractional ownership, startup equity, and the risks behind the headline return.',
    icon: 'layers',
    order: 10,
    live: true,
  },
  {
    slug: 'nri',
    domain: 'money-finance',
    title: 'NRI Money',
    description:
      'NRE and NRO accounts, RNOR status, DTAA, remittances, LRS, TDS, property, and succession for Indian money across borders.',
    icon: 'globe',
    order: 11,
    live: true,
  },
  {
    slug: 'money-tools',
    domain: 'money-finance',
    title: 'Money Tools & Reference',
    description:
      'Portfolio tracking, official portals, market sentiment, rebalancing, audits, and the calculators that make the arithmetic visible.',
    icon: 'settings',
    order: 12,
    live: true,
  },
  {
    slug: 'early-career',
    domain: 'work-career',
    title: 'Early Career & Transitions',
    description:
      'First salaries, student budgets, early investing, education loans, lifestyle inflation, career breaks, and the money decisions that compound early.',
    icon: 'layers',
    order: 1,
    live: true,
  },
  {
    slug: 'side-income',
    domain: 'business',
    title: 'Side Income & Creator Business',
    description:
      'Freelancing, creator income, dividends, rental income, marketplace selling, and the tax and cash-flow reality of independent work.',
    icon: 'chart',
    order: 1,
    live: true,
  },
  {
    slug: 'small-business',
    domain: 'business',
    title: 'Small Business & Compliance',
    description:
      'GST registration, presumptive tax, invoicing, e-commerce compliance, and the paperwork that keeps a small business legitimate.',
    icon: 'file-text',
    order: 2,
    live: true,
  },
  {
    slug: 'health-insurance',
    domain: 'health-insurance',
    title: 'Health Insurance',
    description:
      'Room-rent caps, deductibles, waiting periods, super top-ups, riders, and the policy wording that decides a hospital bill.',
    icon: 'shield',
    order: 1,
    live: true,
  },
  {
    slug: 'life-insurance',
    domain: 'health-insurance',
    title: 'Life Insurance',
    description:
      'Term cover, claim rejections, riders, and the difference between insurance and an investment product.',
    icon: 'shield',
    order: 2,
    live: true,
  },
  {
    slug: 'motor-insurance',
    domain: 'health-insurance',
    title: 'Motor Insurance',
    description:
      'Comprehensive versus zero-depreciation cover, IDV, add-ons, and the arithmetic of a vehicle claim.',
    icon: 'shield',
    order: 3,
    live: true,
  },
  {
    slug: 'education-financing',
    domain: 'education-learning',
    title: 'Education Financing',
    description:
      'Education loans, moratorium periods, Section 80E, collateral, and building an education corpus without sacrificing retirement.',
    icon: 'book-open',
    order: 1,
    live: true,
  },
  {
    slug: 'marriage-money',
    domain: 'home-family',
    title: 'Marriage & Money',
    description:
      'The money conversation before marriage, joint accounts, prenuptial questions, spousal contribution, and what the law does when a marriage ends.',
    icon: 'file-text',
    order: 1,
    live: true,
  },
  {
    slug: 'family-money',
    domain: 'home-family',
    title: 'Family & Dependants',
    description:
      'Children, pocket money, education corpus, supporting parents, sibling contributions, and the fixed transfers that keep a family plan honest.',
    icon: 'list',
    order: 2,
    live: true,
  },
  {
    slug: 'women-money',
    domain: 'home-family',
    title: 'Women & Money',
    description:
      'Financial independence, own-account infrastructure, career breaks, Stridhan, inheritance, and the paperwork that protects a woman’s money.',
    icon: 'accessibility',
    order: 3,
    live: true,
  },
  {
    slug: 'inheritance',
    domain: 'home-family',
    title: 'Inheritance & Succession',
    description:
      'Nomination, wills, succession certificates, NRI inheritance, and the documents that decide who actually receives the money.',
    icon: 'file-text',
    order: 4,
    live: true,
  },
  {
    slug: 'scams-fraud',
    domain: 'law-rights-fraud',
    title: 'Scams & Fraud',
    description:
      'Digital arrest, KYC calls, APK malware, fake customer care, Ponzi schemes, and the first 30 minutes after a fraud.',
    icon: 'shield',
    order: 1,
    live: true,
  },
  {
    slug: 'financial-crime',
    domain: 'law-rights-fraud',
    title: 'Financial Crime & Grey Areas',
    description:
      'Benami property, hawala, round-tripping, mule accounts, fake input credit, and the legal consequences behind informal money.',
    icon: 'shield',
    order: 2,
    live: true,
  },
  {
    slug: 'programming',
    domain: 'technology',
    title: 'Programming Languages',
    description:
      'Type systems, language trade-offs, idiomatic code, and the patterns that survive beyond a single framework.',
    icon: 'code',
    order: 1,
    live: true,
  },
  {
    slug: 'backend-apis',
    domain: 'technology',
    title: 'Backend & APIs',
    description:
      'API design, authentication, reliability, timeouts, retries, queues, and honest HTTP semantics.',
    icon: 'terminal',
    order: 2,
    live: true,
  },
  {
    slug: 'web-development',
    domain: 'technology',
    title: 'Web Development',
    description:
      'The standards, static-site patterns, and browser behaviour that keep the web open and understandable.',
    icon: 'code',
    order: 3,
    live: true,
  },
  {
    slug: 'data-storage',
    domain: 'technology',
    title: 'Data & Storage',
    description:
      'SQL, JSON, data formats, validation, and the practical work of moving structured data between systems.',
    icon: 'database',
    order: 4,
    live: true,
  },
  {
    slug: 'networking',
    domain: 'technology',
    title: 'Networking',
    description:
      'IP addressing, subnets, HTTP, DNS, and the conventions that let networked systems find each other.',
    icon: 'network',
    order: 5,
    live: true,
  },
  {
    slug: 'developer-craft',
    domain: 'technology',
    title: 'Developer Craft',
    description:
      'Git history, diagramming, text diffs, encoding, scheduling, and the small tools that make engineering work legible.',
    icon: 'settings',
    order: 6,
    live: true,
  },
  {
    slug: 'computer-science',
    domain: 'technology',
    title: 'Computer Science',
    description:
      'Algorithms, complexity, comparison, and the ideas underneath everyday software.',
    icon: 'layers',
    order: 7,
    live: true,
  },
  {
    slug: 'ai-engineering',
    domain: 'ai-data',
    title: 'AI Engineering',
    description:
      'Retrieval-augmented generation, evaluation, grounding, citations, and the operational discipline behind useful AI systems.',
    icon: 'spark',
    order: 1,
    live: true,
  },
  {
    slug: 'data-engineering',
    domain: 'ai-data',
    title: 'Data Engineering',
    description:
      'Ingesting messy files, validating schemas, reconciling totals, and building data workflows that survive reruns.',
    icon: 'database',
    order: 2,
    live: true,
  },
  {
    slug: 'color-accessibility',
    domain: 'design-accessibility',
    title: 'Color & Accessibility',
    description:
      'Color formats, contrast, visual systems, and the accessibility decisions that make an interface readable.',
    icon: 'palette',
    order: 1,
    live: true,
  },
  {
    slug: 'government-portals',
    domain: 'civic-public-services',
    title: 'Government Portals & Documents',
    description:
      'Official portals, identity documents, EPFO, income tax, DigiLocker, RBI Ombudsman, and the safest route through public services.',
    icon: 'globe',
    order: 1,
    live: true,
  },
];

export const SERIES: TaxonomySeries[] = [
  {
    slug: 'money-foundations',
    category: 'personal-finance',
    title: 'Money Foundations',
    description: 'Budgeting, sinking funds, inflation, reviews, and the habits that make the rest of the library usable.',
    order: 1,
  },
  {
    slug: 'emergency-funds',
    category: 'personal-finance',
    title: 'Emergency Funds',
    description: 'Sizing, parking, spending, and rebuilding the reserve that keeps a household out of expensive debt.',
    order: 2,
  },
  {
    slug: 'banking-basics',
    category: 'banking',
    title: 'Banking Basics',
    description: 'Accounts, deposits, insurance, mandates, and the charges that decide what savings actually earn.',
    order: 1,
  },
  {
    slug: 'mutual-funds',
    category: 'investing',
    title: 'Mutual Funds & SIPs',
    description: 'Factsheets, direct plans, index funds, SIP timing, and the costs that compound alongside returns.',
    order: 1,
  },
  {
    slug: 'portfolio-management',
    category: 'investing',
    title: 'Portfolio Management',
    description: 'Bonds, allocation, rebalancing, market sentiment, and the review ritual that keeps a portfolio honest.',
    order: 2,
  },
  {
    slug: 'reading-companies',
    category: 'stocks',
    title: 'Reading Companies',
    description: 'Annual reports, screening, valuation traps, promoter behaviour, and related-party transactions.',
    order: 1,
  },
  {
    slug: 'income-tax',
    category: 'tax',
    title: 'Income Tax & Filing',
    description: 'Regime choice, ITR mechanics, TDS, advance tax, AIS reconciliation, and what to do with a notice.',
    order: 1,
  },
  {
    slug: 'capital-gains',
    category: 'tax',
    title: 'Capital Gains',
    description: 'Holding periods, rate cards, and the traps between the two for Indian investors.',
    order: 2,
  },
  {
    slug: 'compliance',
    category: 'tax',
    title: 'Tax Compliance',
    description: 'The routine records and reconciliations that stop a small oversight becoming an expensive notice.',
    order: 3,
  },
  {
    slug: 'retirement-building',
    category: 'retirement',
    title: 'Retirement Building',
    description: 'EPF, NPS, PPF, annuities, gratuity, and the corpus arithmetic behind retirement income.',
    order: 1,
  },
  {
    slug: 'home-loans',
    category: 'loans-credit',
    title: 'Home Loan Decisions',
    description: 'EMI breakup, prepayment, rate changes, and the comparison between repaying and investing.',
    order: 1,
  },
  {
    slug: 'credit-and-borrowing',
    category: 'loans-credit',
    title: 'Credit & Borrowing',
    description: 'Cards, personal loans, gold loans, BNPL, and the difference between a facility and a trap.',
    order: 2,
  },
  {
    slug: 'credit-reports',
    category: 'loans-credit',
    title: 'Credit Reports',
    description: 'CIBIL mechanics, free reports, disputes, and the habits that build a score over time.',
    order: 3,
  },
  {
    slug: 'gold-in-india',
    category: 'gold',
    title: 'Gold in India',
    description: 'Physical, digital, ETF, SGB, monetisation, jewellery, allocation, tax, and liquidity.',
    order: 1,
  },
  {
    slug: 'property-decisions',
    category: 'real-estate',
    title: 'Property Decisions',
    description: 'Title, RERA, rental yield, and the costs that a property purchase actually carries.',
    order: 1,
  },
  {
    slug: 'alternative-assets',
    category: 'alternatives',
    title: 'Alternative Assets',
    description: 'Crypto, P2P, invoice discounting, PMS, AIF, fractional ownership, and startup equity.',
    order: 1,
  },
  {
    slug: 'nri-money',
    category: 'nri',
    title: 'NRI Money',
    description: 'Accounts, residency, treaties, remittances, property, and succession across borders.',
    order: 1,
  },
  {
    slug: 'tracking-and-audit',
    category: 'money-tools',
    title: 'Tracking & Audit',
    description: 'Portfolio tracking, official portals, market sentiment, rebalancing, and the two-year audit.',
    order: 1,
  },
  {
    slug: 'first-salary',
    category: 'early-career',
    title: 'First Salary',
    description: 'The first ₹10,000, the first credit card, lifestyle inflation, and the habits that survive a raise.',
    order: 1,
  },
  {
    slug: 'student-money',
    category: 'early-career',
    title: 'Student Money',
    description: 'Hostel budgets, small investments, education loans, and the cost sheet behind student life.',
    order: 2,
  },
  {
    slug: 'creator-and-service-income',
    category: 'side-income',
    title: 'Creator & Service Income',
    description: 'Freelance work, creator revenue, marketplace sales, and the cash-flow reality of independent income.',
    order: 1,
  },
  {
    slug: 'business-compliance',
    category: 'small-business',
    title: 'Business Compliance',
    description: 'GST, presumptive tax, e-commerce TCS, and the records a small business needs.',
    order: 1,
  },
  {
    slug: 'health-cover',
    category: 'health-insurance',
    title: 'Health Cover',
    description: 'Room-rent caps, deductibles, top-ups, waiting periods, riders, and claim mechanics.',
    order: 1,
  },
  {
    slug: 'life-cover',
    category: 'life-insurance',
    title: 'Life Cover',
    description: 'Term insurance, claim rejections, riders, and the protection a family actually needs.',
    order: 1,
  },
  {
    slug: 'motor-cover',
    category: 'motor-insurance',
    title: 'Motor Cover',
    description: 'Comprehensive versus zero-depreciation cover, IDV, add-ons, and claim arithmetic.',
    order: 1,
  },
  {
    slug: 'paying-for-education',
    category: 'education-financing',
    title: 'Paying for Education',
    description: 'Education loans, moratoriums, tax treatment, and building a corpus before the admission letter.',
    order: 1,
  },
  {
    slug: 'marriage-and-money',
    category: 'marriage-money',
    title: 'Marriage & Money',
    description: 'The conversation before marriage, joint accounts, prenups, and what the law does at the end.',
    order: 1,
  },
  {
    slug: 'family-dependants',
    category: 'family-money',
    title: 'Family & Dependants',
    description: 'Children, parents, education, pocket money, and the fixed transfers that keep the household plan clear.',
    order: 1,
  },
  {
    slug: 'women-and-money',
    category: 'women-money',
    title: 'Women & Money',
    description: 'Own accounts, career breaks, gold, Stridhan, and the paperwork that protects financial independence.',
    order: 1,
  },
  {
    slug: 'inheritance-and-succession',
    category: 'inheritance',
    title: 'Inheritance & Succession',
    description: 'Nomination, wills, succession certificates, NRI inheritance, and the documents that decide who receives what.',
    order: 1,
  },
  {
    slug: 'scam-playbooks',
    category: 'scams-fraud',
    title: 'Scam Playbooks',
    description: 'The script, the pressure clock, and the first actions after a scam.',
    order: 1,
  },
  {
    slug: 'grey-zone-finance',
    category: 'financial-crime',
    title: 'Grey-Zone Finance',
    description: 'Benami, hawala, round-tripping, mule accounts, and the legal consequences behind informal money.',
    order: 1,
  },
  {
    slug: 'typescript',
    category: 'programming',
    title: 'TypeScript',
    description: 'Types, runtime boundaries, branded money, and the compiler flags that catch real payment bugs.',
    order: 1,
  },
  {
    slug: 'reliable-apis',
    category: 'backend-apis',
    title: 'Reliable APIs',
    description: 'Identity, authorization, timeouts, retries, queues, and honest HTTP failures.',
    order: 1,
  },
  {
    slug: 'static-web',
    category: 'web-development',
    title: 'Static Web',
    description: 'Static JSON APIs, file-based data, and the patterns that keep a small site portable.',
    order: 1,
  },
  {
    slug: 'sql-and-data',
    category: 'data-storage',
    title: 'SQL & Data',
    description: 'Reading queries, structured data, validation, and the shape of data that moves between systems.',
    order: 1,
  },
  {
    slug: 'indexing-and-access-paths',
    category: 'data-storage',
    title: 'Indexing & Access Paths',
    description: 'How the storage engine and query planner actually choose between a scan and an index, and what it costs.',
    order: 2,
  },
  {
    slug: 'transactions-and-consistency',
    category: 'data-storage',
    title: 'Transactions & Consistency',
    description: 'Isolation levels, MVCC, locking, and what a database really guarantees under concurrency.',
    order: 3,
  },
  {
    slug: 'ip-addressing',
    category: 'networking',
    title: 'IP Addressing',
    description: 'Prefixes, usable ranges, subnets, and the addressing details behind confusing network failures.',
    order: 1,
  },
  {
    slug: 'core-protocols',
    category: 'networking',
    title: 'Core Protocols',
    description: 'DNS, TLS, and the request path: what actually happens between a name and a response.',
    order: 2,
  },
  {
    slug: 'git-and-history',
    category: 'developer-craft',
    title: 'Git & History',
    description: 'Branches, merges, rebases, and choosing a history that a future reader can understand.',
    order: 1,
  },
  {
    slug: 'text-and-diagrams',
    category: 'developer-craft',
    title: 'Text & Diagrams',
    description: 'Encoding, diffs, Mermaid diagrams, and the text tools that make systems easier to inspect.',
    order: 2,
  },
  {
    slug: 'scheduling',
    category: 'developer-craft',
    title: 'Scheduling',
    description: 'Cron expressions, time zones, and the schedule bugs that show up only in production.',
    order: 3,
  },
  {
    slug: 'algorithms',
    category: 'computer-science',
    title: 'Algorithms',
    description: 'Comparison, diff algorithms, and the cost of the shortcuts underneath everyday tools.',
    order: 1,
  },
  {
    slug: 'distributed-systems',
    category: 'computer-science',
    title: 'Distributed Systems',
    description: 'Consensus, replication, partitioning, and the failure models that make distribution hard.',
    order: 2,
  },
  {
    slug: 'production-ai',
    category: 'ai-engineering',
    title: 'Production AI',
    description: 'Retrieval, grounding, evaluation, citations, and the operational constraints behind useful AI products.',
    order: 1,
  },
  {
    slug: 'python-data',
    category: 'data-engineering',
    title: 'Python Data',
    description: 'Messy files, validation, reconciliation, chunking, and data workflows that survive real inputs.',
    order: 1,
  },
  {
    slug: 'color-and-contrast',
    category: 'color-accessibility',
    title: 'Color & Contrast',
    description: 'Color formats, contrast ratios, dark mode, and the visual decisions that keep interfaces readable.',
    order: 1,
  },
  {
    slug: 'official-portals',
    category: 'government-portals',
    title: 'Official Portals',
    description: 'The official websites and documents that actually get Indian money and identity work done.',
    order: 1,
  },
];

export const SHELF_BY_ID = new Map(SHELVES.map((shelf) => [shelf.id, shelf]));
export const DOMAIN_BY_SLUG = new Map(DOMAINS.map((domain) => [domain.slug, domain]));
export const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((category) => [category.slug, category]));
export const SERIES_BY_KEY = new Map(
  SERIES.map((series) => [`${series.category}/${series.slug}`, series]),
);

export function getShelf(id: string): TaxonomyShelf | undefined {
  return SHELF_BY_ID.get(id as ShelfId);
}

export function getDomain(slug: string): TaxonomyDomain | undefined {
  return DOMAIN_BY_SLUG.get(slug);
}

export function getCategory(slug: string): TaxonomyCategory | undefined {
  return CATEGORY_BY_SLUG.get(slug);
}

export function getCategoriesForDomain(domain: string): TaxonomyCategory[] {
  return CATEGORIES.filter((category) => category.domain === domain && category.live).sort(
    (a, b) => a.order - b.order,
  );
}

export function getSeriesForCategory(category: string): TaxonomySeries[] {
  return SERIES.filter((series) => series.category === category).sort((a, b) => a.order - b.order);
}

export function getSeries(category: string, slug: string): TaxonomySeries | undefined {
  return SERIES_BY_KEY.get(`${category}/${slug}`);
}

export function getDomainPath(domain: string): string {
  return `/${domain}/`;
}

export function getCategoryPath(category: string): string | undefined {
  const entry = getCategory(category);
  return entry ? `/${entry.domain}/${entry.slug}/` : undefined;
}

export function getGuidePath(category: string): string | undefined {
  return getCategoryPath(category);
}

export function getCategoryName(slug: string): string {
  return getCategory(slug)?.title ?? slug;
}

export function getDomainName(slug: string): string {
  return getDomain(slug)?.title ?? slug;
}

export function liveDomains(): TaxonomyDomain[] {
  return DOMAINS.filter((domain) => domain.status === 'live').sort((a, b) => a.order - b.order);
}

export function liveCategories(): TaxonomyCategory[] {
  return CATEGORIES.filter((category) => category.live).sort((a, b) => {
    const domainOrder = getDomain(a.domain)?.order ?? 99;
    const otherOrder = getDomain(b.domain)?.order ?? 99;
    return domainOrder - otherOrder || a.order - b.order;
  });
}
