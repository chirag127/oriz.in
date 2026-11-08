export interface GlossaryLink {
  label: string;
  href: string;
}

export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  links: GlossaryLink[];
  source?: string;
  category: string;
}

export const GLOSSARY_CATEGORIES = [
  'Web fundamentals',
  'Data & encoding',
  'AI & data',
  'Backend & security',
  'Law & fraud',
  'Finance & math',
  'Networking',
  'Accessibility',
] as const;

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'API',
    slug: 'api',
    category: 'Web fundamentals',
    definition:
      'An application programming interface is a defined way for one program to request data or actions from another. An API can be a network service, a library interface, or a local contract between modules.',
    links: [
      { label: 'API directory', href: '/apis/' },
      { label: 'Developer resources', href: '/developers/' },
    ],
    source: 'https://developer.mozilla.org/en-US/docs/Glossary/API',
  },
  {
    term: 'Base64',
    slug: 'base64',
    category: 'Data & encoding',
    definition:
      'A reversible encoding that represents binary data with a 64-character alphabet. It keeps data intact through text-only channels but provides no secrecy.',
    links: [
      { label: 'Base64 tool', href: '/tools/base64-encoder/' },
      { label: 'Base64 is not encryption', href: '/technology/developer-craft/base64-is-not-encryption/' },
    ],
    source: 'https://developer.mozilla.org/en-US/docs/Glossary/Base64',
  },
  {
    term: 'CAGR',
    slug: 'cagr',
    category: 'Finance & math',
    definition:
      'Compound annual growth rate is the constant yearly rate that would turn a starting value into an ending value over a stated number of years. It smooths the actual path into one rate.',
    links: [
      { label: 'CAGR calculator', href: '/tools/cagr-calculator/' },
      { label: 'Compound interest guide', href: '/money-finance/personal-finance/compound-interest-guide/' },
    ],
    source: 'https://www.investor.gov/introduction-investing/investing-basics/glossary',
  },
  {
    term: 'CIDR',
    slug: 'cidr',
    category: 'Networking',
    definition:
      'Classless Inter-Domain Routing notation writes an IPv4 address and its prefix length together, such as 192.0.2.10/24. The prefix says how many leading bits identify the network.',
    links: [
      { label: 'Subnet calculator', href: '/tools/subnet-calculator/' },
      { label: 'IPv4 subnetting guide', href: '/technology/networking/ipv4-subnetting-guide/' },
    ],
    source: 'https://www.rfc-editor.org/rfc/rfc4632',
  },
  {
    term: 'Cron',
    slug: 'cron',
    category: 'Networking',
    definition:
      'A time-based job scheduler convention. A standard five-field expression describes minute, hour, day of month, month, and day of week.',
    links: [
      { label: 'Cron explainer', href: '/tools/cron-explainer/' },
      { label: 'Cron guide', href: '/technology/developer-craft/cron-expressions-guide/' },
    ],
    source: 'https://man7.org/linux/man-pages/man5/crontab.5.html',
  },
  {
    term: 'Emergency fund',
    slug: 'emergency-fund',
    category: 'Finance & math',
    definition:
      'A liquid reserve covering essential household outflows during an income shock or unexpected expense. It is held in accessible, low-risk instruments rather than long-term investments.',
    links: [
      { label: 'Emergency fund calculator', href: '/tools/emergency-fund-calculator/' },
      { label: 'Emergency fund guide', href: '/money-finance/personal-finance/emergency-fund-sizing/' },
    ],
    source: 'https://www.rbi.org.in/financialeducation/home.aspx',
  },
  {
    term: 'EMI',
    slug: 'emi',
    category: 'Finance & math',
    definition:
      'Equated monthly instalment is the fixed payment that repays a loan and its interest over a set number of months. Early payments contain more interest than principal.',
    links: [
      { label: 'Loan EMI calculator', href: '/tools/loan-emi/' },
      { label: 'EMI guide', href: '/money-finance/loans-credit/home-loan-emi-breakup-principal-interest/' },
    ],
    source: 'https://www.rbi.org.in/',
  },
  {
    term: 'Error budget',
    slug: 'error-budget',
    category: 'Backend & security',
    definition:
      'The amount of unreliability a service-level objective permits over a period. A 99.9% monthly availability objective allows about 43 minutes of failure in a 30-day month.',
    links: [
      { label: 'Reliability budget guide', href: '/technology/backend-apis/backend-reliability-budget/' },
    ],
    source: 'https://sre.google/workbook/error-budget-policy/',
  },
  {
    term: 'Hash',
    slug: 'hash',
    category: 'Data & encoding',
    definition:
      'A fixed-size digest produced from input data by a hash function. A useful cryptographic hash is deterministic, fast to compute, and infeasible to reverse. A hash verifies integrity; it does not encrypt.',
    links: [
      { label: 'Hash calculator', href: '/tools/hash-calculator/' },
      { label: 'Base64 is not encryption', href: '/technology/developer-craft/base64-is-not-encryption/' },
    ],
    source: 'https://developer.mozilla.org/en-US/docs/Glossary/Hash_function',
  },
  {
    term: 'HTTP status code',
    slug: 'http-status-code',
    category: 'Web fundamentals',
    definition:
      'A three-digit code in an HTTP response that classifies the outcome: informational, success, redirection, client error, or server error. The code is a machine-readable summary, not the whole error message.',
    links: [
      { label: 'HTTP status reference', href: '/tools/http-status-reference/' },
      { label: 'HTTP status article', href: '/technology/backend-apis/http-status-codes/' },
    ],
    source: 'https://www.rfc-editor.org/rfc/rfc9110',
  },
  {
    term: 'Idempotency',
    slug: 'idempotency',
    category: 'Backend & security',
    definition:
      'A property of an operation that produces the same result when repeated with the same inputs. Idempotency keys let clients retry a write without duplicating effects such as a refund.',
    links: [
      { label: 'Secure API design guide', href: '/technology/backend-apis/secure-api-design/' },
      { label: 'Reliability budget guide', href: '/technology/backend-apis/backend-reliability-budget/' },
    ],
    source: 'https://www.rfc-editor.org/rfc/rfc9110#name-idempotent-methods',
  },
  {
    term: 'JSON',
    slug: 'json',
    category: 'Data & encoding',
    definition:
      'JavaScript Object Notation is a strict text format for objects, arrays, strings, numbers, booleans, and null. It forbids comments and trailing commas.',
    links: [
      { label: 'JSON formatter', href: '/tools/json-formatter/' },
      { label: 'JSON guide', href: '/technology/data-storage/json-formatting-and-validation/' },
    ],
    source: 'https://www.rfc-editor.org/rfc/rfc8259',
  },
  {
    term: 'JWT',
    slug: 'jwt',
    category: 'Backend & security',
    definition:
      'A compact token format with a header, payload, and signature, usually signed rather than encrypted. Decoding shows claims; only server-side signature and claim verification establishes trust.',
    links: [
      { label: 'JWT decoder', href: '/tools/jwt-decoder/' },
      { label: 'Secure API design guide', href: '/technology/backend-apis/secure-api-design/' },
    ],
    source: 'https://www.rfc-editor.org/rfc/rfc7519',
  },
  {
    term: 'Mermaid',
    slug: 'mermaid',
    category: 'Web fundamentals',
    definition:
      'A text-to-diagram syntax and renderer for flowcharts, sequence diagrams, state diagrams, entity relationships, timelines, and other visual explanations.',
    links: [
      { label: 'Mermaid editor', href: '/tools/mermaid-editor/' },
      { label: 'Diagramming guide', href: '/technology/developer-craft/diagramming-with-mermaid/' },
    ],
    source: 'https://mermaid.js.org/intro/',
  },
  {
    term: 'MIME type',
    slug: 'mime-type',
    category: 'Web fundamentals',
    definition:
      'A media type label such as text/html or application/json that tells a recipient how to interpret a file or response body. It describes the format, not whether the content is safe.',
    links: [
      { label: 'MIME reference', href: '/tools/mime-reference/' },
    ],
    source: 'https://developer.mozilla.org/en-US/docs/Glossary/MIME_type',
  },
  {
    term: 'Percentage change',
    slug: 'percentage-change',
    category: 'Finance & math',
    definition:
      'The difference between two values expressed relative to the original value: (new − old) ÷ |old| × 100. It is undefined when the original value is zero.',
    links: [
      { label: 'Percentage calculator', href: '/tools/percentage-calculator/' },
    ],
    source: 'https://www.mathsisfun.com/numbers/percentage-change.html',
  },
  {
    term: 'Prepayment',
    slug: 'prepayment',
    category: 'Finance & math',
    definition:
      'An extra payment toward a loan principal before the scheduled term. It reduces the outstanding balance and may shorten the tenure or lower the EMI, depending on the lender and instruction.',
    links: [
      { label: 'Prepayment calculator', href: '/tools/loan-prepayment-calculator/' },
      { label: 'Prepayment guide', href: '/money-finance/loans-credit/prepay-home-loan-or-invest-the-surplus/' },
    ],
    source: 'https://www.rbi.org.in/financialeducation/home.aspx',
  },
  {
    term: 'Retrieval-augmented generation',
    slug: 'retrieval-augmented-generation',
    category: 'AI & data',
    definition:
      'An architecture that retrieves relevant documents or records before generating an answer, so the model can ground its response in supplied evidence and cite sources.',
    links: [
      { label: 'RAG guide', href: '/ai-data/ai-engineering/rag-retrieval-augmented-generation/' },
      { label: 'LLM evaluation guide', href: '/ai-data/ai-engineering/evaluating-llm-applications/' },
    ],
    source: 'https://arxiv.org/abs/2005.11401',
  },
  {
    term: 'SIP',
    slug: 'sip',
    category: 'Finance & math',
    definition:
      'A systematic investment plan invests a fixed amount at regular intervals. A future-value illustration depends on assumed returns; actual market returns vary.',
    links: [
      { label: 'SIP calculator', href: '/tools/sip-calculator/' },
      { label: 'Compound interest guide', href: '/money-finance/personal-finance/compound-interest-guide/' },
    ],
    source: 'https://www.investor.gov/introduction-investing/investing-basics/glossary',
  },
  {
    term: 'Slug',
    slug: 'slug',
    category: 'Web fundamentals',
    definition:
      'A readable, stable identifier used in a URL, usually derived from a title. Good slugs are lowercase, concise, and avoid unnecessary symbols.',
    links: [
      { label: 'Text to slug', href: '/tools/text-to-slug/' },
    ],
    source: 'https://developer.mozilla.org/en-US/docs/Glossary/Slug',
  },
  {
    term: 'Subnet mask',
    slug: 'subnet-mask',
    category: 'Networking',
    definition:
      'A 32-bit IPv4 mask that identifies which bits of an address belong to the network prefix and which identify a host. CIDR prefix /24 is equivalent to 255.255.255.0.',
    links: [
      { label: 'Subnet calculator', href: '/tools/subnet-calculator/' },
    ],
    source: 'https://www.rfc-editor.org/rfc/rfc950',
  },
  {
    term: 'Unicode',
    slug: 'unicode',
    category: 'Data & encoding',
    definition:
      'A universal character encoding standard. Unicode assigns code points to characters; UTF-8, UTF-16, and other encodings determine how those code points become bytes.',
    links: [
      { label: 'Unicode inspector', href: '/tools/unicode-inspector/' },
    ],
    source: 'https://home.unicode.org/basic-info/overview/',
  },
  {
    term: 'UTF-8',
    slug: 'utf-8',
    category: 'Data & encoding',
    definition:
      'A variable-length Unicode encoding that is byte-compatible with ASCII. It is the dominant encoding on the web and uses one to four bytes per code point.',
    links: [
      { label: 'Unicode inspector', href: '/tools/unicode-inspector/' },
    ],
    source: 'https://www.rfc-editor.org/rfc/rfc3629',
  },
  {
    term: 'UUID',
    slug: 'uuid',
    category: 'Data & encoding',
    definition:
      'A universally unique identifier. Version 4 UUIDs are generated from random bits and are suitable as opaque identifiers, though uniqueness remains probabilistic.',
    links: [
      { label: 'UUID v4 generator', href: '/tools/uuid-generator/' },
    ],
    source: 'https://www.rfc-editor.org/rfc/rfc9562',
  },
  {
    term: 'WCAG contrast ratio',
    slug: 'wcag-contrast-ratio',
    category: 'Accessibility',
    definition:
      'A ratio between the relative luminance of two colors, ranging from 1:1 to 21:1. WCAG sets thresholds such as 4.5:1 for normal text at level AA.',
    links: [
      { label: 'Contrast checker', href: '/tools/contrast-checker/' },
      { label: 'Color formats guide', href: '/design-accessibility/color-accessibility/css-color-formats/' },
    ],
    source: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
  },
  {
    term: 'YAML',
    slug: 'yaml',
    category: 'Data & encoding',
    definition:
      'YAML is a human-friendly data serialization language often used for configuration. Its indentation rules and flexible scalars make syntax errors easy to miss, so validation matters.',
    links: [
      { label: 'YAML validator', href: '/tools/yaml-validator/' },
    ],
    source: 'https://yaml.org/spec/1.2.2/',
  },
  {
    term: "Advance Tax",
    slug: 'advance-tax',
    category: 'Finance & math',
    definition:
      "Tax paid in instalments during the year (15% Jun, 45% Sep, 75% Dec, 100% Mar) when total liability exceeds ₹10,000. Missing instalments attracts interest under sections 234B/234C.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "AIF",
    slug: 'aif',
    category: 'Finance & math',
    definition:
      "Alternative Investment Fund — a SEBI-registered pooled vehicle for private equity, hedge-fund-style or debt strategies. Category I/II need ₹1 crore minimum; Category III often more. High minimums, high risk, and performance fees.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "AMC",
    slug: 'amc',
    category: 'Finance & math',
    definition:
      "Asset Management Company — the firm that runs a mutual fund scheme (e.g. the fund house). The AMC earns the expense ratio; your money is held separately by the custodian and trustee.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Annuity",
    slug: 'annuity',
    category: 'Finance & math',
    definition:
      "A product that pays a fixed income for life or a set period in exchange for a lump sum, typically bought at NPS exit or retirement. Annuity rates are locked at purchase — compare insurers before buying.",
    links: [
      { label: 'Retirement guide', href: '/money-finance/retirement/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "AUM",
    slug: 'aum',
    category: 'Finance & math',
    definition:
      "Assets Under Management — total market value a fund manages. AUM says nothing about future returns; a large scheme can still be a poor performer, and a very small one can be shut down or merged.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Balance Transfer",
    slug: 'balance-transfer',
    category: 'Finance & math',
    definition:
      "Moving an outstanding loan to another lender at a lower rate. Worth it only when the rate gap exceeds ~0.5% after processing fees and stamp duty; otherwise the fee eats the saving.",
    links: [
      { label: 'Loans & credit guide', href: '/money-finance/loans-credit/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Benami",
    slug: 'benami',
    category: 'Law & fraud',
    definition:
      "Property held in one person's name but paid for and enjoyed by another. Prohibited by the Benami Transactions (Prohibition) Act; confiscation is possible and prosecution carries up to 7 years' imprisonment plus penalties.",
    links: [
      { label: 'Law & fraud guide', href: '/law-rights-fraud/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Capital Gains",
    slug: 'capital-gains',
    category: 'Finance & math',
    definition:
      "Profit on selling a capital asset. Post-2024 rules: listed equity and equity funds held over 12 months are long-term (LTCG) taxed at 12.5% above ₹1.25 lakh/year; shorter holding is STCG at 20%. Most other assets: 24 months for long-term, 12.5% without indexation.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "CIBIL Score",
    slug: 'cibil-score',
    category: 'Finance & math',
    definition:
      "A 300–900 credit score from TransUnion CIBIL, driven by repayment history (heaviest weight), credit utilisation, credit mix and hard enquiries. Above 750 gets the best loan pricing; every loan application by a lender leaves a hard enquiry footprint.",
    links: [
      { label: 'Loans & credit guide', href: '/money-finance/loans-credit/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Corporate FD",
    slug: 'corporate-fd',
    category: 'Finance & math',
    definition:
      "A fixed deposit from a company (NBFCs, HFCs, manufacturers). Rates beat bank FDs by 0.5–1.5% because risk is higher — deposits are largely uninsured beyond the ₹5 lakh DICGC cover and rating downgrades hurt at exit.",
    links: [
      { label: 'Insurance guide', href: '/health-insurance/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Coupon",
    slug: 'coupon',
    category: 'Finance & math',
    definition:
      "The fixed interest rate a bond pays on its face value. A 7.1% coupon on a ₹1,000 bond pays ₹71/year regardless of what you paid for the bond in the market.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Credit Utilisation Ratio",
    slug: 'credit-utilisation-ratio',
    category: 'Finance & math',
    definition:
      "Card balance as a percentage of total credit limit. Above ~30–40% per cycle, scores dip even if bills are paid in full — the bureaus read high utilisation as credit hunger.",
    links: [
      { label: 'Loans & credit guide', href: '/money-finance/loans-credit/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Debt Fund",
    slug: 'debt-fund',
    category: 'Finance & math',
    definition:
      "A mutual fund holding bonds, treasuries or money-market paper. Not \"fixed deposit-like\": NAVs move daily with interest rates and credit events, and 2020 showed that even \"low risk\" funds can freeze withdrawals.",
    links: [
      { label: 'Loans & credit guide', href: '/money-finance/loans-credit/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Demat Account",
    slug: 'demat-account',
    category: 'Finance & math',
    definition:
      "The electronic locker that holds shares, ETFs and bonds, maintained by a depository (NSDL/CDSL) through a DP. Charges to audit: AMC fees, transaction charges and DP charges on every sell — compare before opening.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Drawdown",
    slug: 'drawdown',
    category: 'Finance & math',
    definition:
      "The peak-to-trough fall in value. A fund with 14% CAGR and a 45% drawdown is a harder hold than one with 12% CAGR and a 20% drawdown — behaviour, not math, decides which investor keeps more.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "DTAA",
    slug: 'dtaa',
    category: 'Finance & math',
    definition:
      "Double Taxation Avoidance Agreement — the treaty that decides which country taxes which income for non-residents, and at what capped rate. Requires a Tax Residency Certificate to claim relief.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "ELSS",
    slug: 'elss',
    category: 'Finance & math',
    definition:
      "Equity Linked Savings Scheme — equity mutual funds with a 3-year lock-in per instalment that qualify for 80C in the old regime. The shortest lock-in among 80C options; growth instalments each have their own clock.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "EPF",
    slug: 'epf',
    category: 'Finance & math',
    definition:
      "Employees' Provident Fund — 12% of basic + DA goes in, with a matching employer contribution (of which 8.33% goes to the pension scheme, EPS). Interest (~8.25% recently) is tax-free up to conditions; contributions above ₹2.5 lakh/year (₹5 lakh without employer contribution) are taxed.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "ETF",
    slug: 'etf',
    category: 'Finance & math',
    definition:
      "Exchange Traded Fund — a fund that trades on the stock exchange at live prices. Tracking error and trading spread are the real costs; an ETF with a low TER but wide spreads can cost more than an index fund.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Expense Ratio",
    slug: 'expense-ratio',
    category: 'Finance & math',
    definition:
      "The annual fee a fund charges, deducted daily from NAV. A direct plan is typically 0.6–1% cheaper than regular (agent-commission) plans — over 25 years that gap can exceed the value of an entire flat EMI.",
    links: [
      { label: 'Loans & credit guide', href: '/money-finance/loans-credit/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "FCNR",
    slug: 'fcnr',
    category: 'Finance & math',
    definition:
      "Foreign Currency Non-Resident deposit — an NRI term deposit held in foreign currency (USD, GBP, EUR etc.), so the depositor carries no INR depreciation risk. Interest is tax-free in India when paid to an NRI account.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "FD Ladder",
    slug: 'fd-ladder',
    category: 'Law & fraud',
    definition:
      "Splitting a deposit across several FDs with staggered maturities so part of the money matures regularly and premature breakage (with penalty) is rarely needed. The standard structure for emergency reserves.",
    links: [
      { label: 'Banking guide', href: '/money-finance/banking/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Free Look Period",
    slug: 'free-look-period',
    category: 'Finance & math',
    definition:
      "15 days (30 days for policies sold at a distance/online) to cancel a new insurance policy and get a premium refund minus proportionate risk cost and medical expenses. Use it to actually read the exclusions.",
    links: [
      { label: 'Insurance guide', href: '/health-insurance/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "G-Sec",
    slug: 'g-sec',
    category: 'Finance & math',
    definition:
      "Government Security — a bond issued by the central or state government. Sovereign credit risk, tradable via RBI Retail Direct; state loans (SDLs) typically pay 20–40 bps over central govt paper.",
    links: [
      { label: 'Loans & credit guide', href: '/money-finance/loans-credit/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Grace Period",
    slug: 'grace-period',
    category: 'Finance & math',
    definition:
      "Days after the premium due date during which the policy stays alive (usually 30 days for health, 15/30 for term). Pay inside it; a lapse can restart waiting periods and impose fresh exclusions.",
    links: [
      { label: 'Insurance guide', href: '/health-insurance/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Grey Area",
    slug: 'grey-area',
    category: 'Finance & math',
    definition:
      "A practice not expressly prohibited and not expressly permitted — cash rent with no documentation, a laptop gifted to a relative before a buyback, an HUF created at the airport. Outcomes depend on documentation, amounts and the officer. Rated case by case on this site.",
    links: [
      { label: 'Money & Finance library', href: '/money-finance/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "GST Input Credit",
    slug: 'gst-input-credit',
    category: 'Law & fraud',
    definition:
      "Credit for GST paid on business purchases, set off against GST collected on sales. Claiming it without an actual supplier invoice, or on exempt supplies, is a false claim — penalties run 100% of tax plus interest, and Section 132 prosecution applies to larger frauds.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "HUF",
    slug: 'huf',
    category: 'Finance & math',
    definition:
      "Hindu Undivided Family — a separate taxable person recognised for Hindus, Jains, Sikhs and Buddhists, with its own PAN and 80C/other slabs. Legitimate when formed with actual family property and corpus; a salary-diverting \"HUF\" with no corpus invites reassessment.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Index Fund",
    slug: 'index-fund',
    category: 'Finance & math',
    definition:
      "A fund that simply holds the index's stocks at index weights. Costs almost nothing, has no fund-manager risk, and reliably owns roughly the top 80% of the market's return — the default core holding for most investors.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Inflation",
    slug: 'inflation',
    category: 'Finance & math',
    definition:
      "The erosion of money's purchasing power, ~6% average in India over decades. At 6%, ₹1 crore buys what ₹17.4 lakh buys today after 30 years. Every long-term target must be inflated, not just saved toward.",
    links: [
      { label: 'Money & Finance library', href: '/money-finance/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "ITR",
    slug: 'itr',
    category: 'Finance & math',
    definition:
      "Income Tax Return — the annual filing. ITR-1 for salary+one house+interest; ITR-2 for capital gains/multiple properties/foreign assets; ITR-3 for business income; ITR-4 (presumptive) for eligible small business. Late filing beyond the due date costs a fee under 234F.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Lien",
    slug: 'lien',
    category: 'Finance & math',
    definition:
      "A lender's recorded right over an asset until its loan is repaid — the bank's mark on your car's RC or your demat shares pledged for a loan-over-securities. Selling or borrowing again requires the lien to be lifted first.",
    links: [
      { label: 'Loans & credit guide', href: '/money-finance/loans-credit/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Lock-in",
    slug: 'lock-in',
    category: 'Finance & math',
    definition:
      "The period an investment cannot be redeemed: 3 years ELSS, 5 years tax-saver FD and NSC, 15 years PPF, till 60 for NPS Tier-1. Lock-in is a feature priced into tax benefits; breaking it early usually costs the benefit itself.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "LRS",
    slug: 'lrs',
    category: 'Finance & math',
    definition:
      "Liberalised Remittance Scheme — residents may remit up to $250,000 per financial year abroad for any permitted purpose, including foreign investments. TCS of 5%/20% applies above thresholds on some remittances (claimable as credit at filing).",
    links: [
      { label: 'Insurance guide', href: '/health-insurance/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "LTCG",
    slug: 'ltcg',
    category: 'Finance & math',
    definition:
      "Long-Term Capital Gain. Listed equity: 12.5% above ₹1.25 lakh/year. Property, gold, debt: 12.5% without indexation (for transfers on/after 23 July 2024), with slab-rate relief preserved for certain resident property options.",
    links: [
      { label: 'Gold guide', href: '/money-finance/gold/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Moratorium",
    slug: 'moratorium',
    category: 'Finance & math',
    definition:
      "A temporary pause on loan EMIs announced by the regulator (as in COVID-19). Interest keeps accruing during the pause — the \"free EMI holiday\" extends the loan and raises total interest paid.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "NPS",
    slug: 'nps',
    category: 'Finance & math',
    definition:
      "National Pension System — a low-cost retirement account open to all citizens, with equity exposure up to 75%. Extra ₹50,000 deduction under 80CCD(1B) in the old regime. Tier-1 locks till 60 (with limited early-exit rules); 40–60% of the corpus must be annuitised at exit.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "NRE / NRO",
    slug: 'nre-nro',
    category: 'Finance & math',
    definition:
      "NRE holds foreign earnings in rupees, fully repatriable, interest tax-free in India. NRO holds Indian income (rent, dividends, pension), interest taxable at 30% plus cess, repatriable up to $1 million/year with paperwork. Never mix the two — the TDS and compliance profiles differ completely.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "NAV",
    slug: 'nav',
    category: 'Finance & math',
    definition:
      "Net Asset Value — the per-unit price of a mutual fund. A ₹15 NAV fund is not \"cheaper\" than a ₹300 one; returns depend on growth, not the entry price. NAV is the result of value, not the driver of it.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Nominee",
    slug: 'nominee',
    category: 'Law & fraud',
    definition:
      "The person an account or policy pays on death — a custodian, not automatically the owner. Legal heirs may still claim a share; nomination plus a will is how families avoid probate disputes.",
    links: [
      { label: 'Insurance guide', href: '/health-insurance/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "P2P Lending",
    slug: 'p2p-lending',
    category: 'Finance & math',
    definition:
      "Platforms (RBI-regulated as NBFC-P2P) matching retail lenders with borrowers at 8–15%+ returns. Principal risk is real: defaults eat returns, diversification across many borrowers is the only defence, and no DICGC-style insurance exists.",
    links: [
      { label: 'Insurance guide', href: '/health-insurance/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "PPF",
    slug: 'ppf',
    category: 'Finance & math',
    definition:
      "Public Provident Fund — 15-year government-backed account, currently ~7.1% tax-free, ₹1.5 lakh/year max, 80C deductible in the old regime. Partial withdrawal from year 7; extension possible in 5-year blocks.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Premature Withdrawal",
    slug: 'premature-withdrawal',
    category: 'Law & fraud',
    definition:
      "Breaking an FD or closing a deposit before maturity: the bank pays the rate applicable to the period completed minus a penalty (typically 0.5–1%). Tax-saver FDs cannot be broken at all.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "RERA",
    slug: 'rera',
    category: 'Finance & math',
    definition:
      "Real Estate (Regulation and Development) Act — requires project registration, 70% of buyer money escrowed against construction, and disclosure of carpet area and timelines. Check the project on the state RERA site before paying any booking amount.",
    links: [
      { label: 'Money & Finance library', href: '/money-finance/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Repo Rate",
    slug: 'repo-rate',
    category: 'Finance & math',
    definition:
      "The rate at which RBI lends to banks — the base of every floating-rate loan in India (home loans link to it via an external benchmark spread). Repo cuts ease EMIs; hikes raise them within a quarter.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Rebalancing",
    slug: 'rebalancing',
    category: 'Finance & math',
    definition:
      "Selling what over-performed to top up what lagged, restoring the target asset allocation (e.g. 60:40). Once a year or on a 5% band is enough; every rebalance in taxable accounts can trigger capital gains.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Rider",
    slug: 'rider',
    category: 'Finance & math',
    definition:
      "A bolt-on to an insurance policy — critical illness, accidental death, waiver of premium. Cheap ones add real value; gimmick riders rarely do. Riders cap at 30–50% of the base sum assured per IRDAI norms.",
    links: [
      { label: 'Insurance guide', href: '/health-insurance/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "RNOR",
    slug: 'rnor',
    category: 'Finance & math',
    definition:
      "Resident but Not Ordinarily Resident — a transitional status for returning NRIs: foreign income stays outside Indian tax for a limited window. The only window in which keeping foreign assets and income abroad is fully legitimate for a returnee.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Round-tripping",
    slug: 'round-tripping',
    category: 'Law & fraud',
    definition:
      "Money sent abroad (often via tax havens) and reinvested back into India as \"foreign investment\". Legal in structure, illegal in effect if it conceals the origin of funds; the MDT/GFRA nets catch unexplained round-trips with penalties and prosecution.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "SGB",
    slug: 'sgb',
    category: 'Finance & math',
    definition:
      "Sovereign Gold Bond — government gold bonds denominated in grams, 2.5% interest, capital gains on redemption at maturity tax-free. Issued in windows; secondary market liquidity is thin, so size purchases to your holding horizon.",
    links: [
      { label: 'Gold guide', href: '/money-finance/gold/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "STCG",
    slug: 'stcg',
    category: 'Finance & math',
    definition:
      "Short-Term Capital Gain. Listed equity/equity funds: 20% (transfers on/after 23 July 2024). Most other assets: taxed at your slab rate.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "STP",
    slug: 'stp',
    category: 'Finance & math',
    definition:
      "Systematic Transfer Plan — moving a fixed amount from one fund (usually liquid) to another (usually equity) on a schedule. The standard way to deploy a lump sum over 6–12 months without timing a single entry.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "SWP",
    slug: 'swp',
    category: 'Finance & math',
    definition:
      "Systematic Withdrawal Plan — withdrawing a fixed amount monthly from a fund. The retiree's replacement for an FD interest payout: tax-efficient (only gains portion taxed), flexible, and rate-agnostic.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Sweep-in FD",
    slug: 'sweep-in-fd',
    category: 'Law & fraud',
    definition:
      "A savings-plus-FD arrangement that auto-carves FDs from idle savings above a threshold, and auto-breaks them (no penalty) when the account needs funds. The best of both worlds at most banks — enable it.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "TDS",
    slug: 'tds',
    category: 'Finance & math',
    definition:
      "Tax Deducted at Source — tax the payer withholds: 10% on FD interest over ₹40,000 (₹1 lakh for seniors), 1% on property purchases over ₹50 lakh, 20–30% on NRO interest and rent paid to NRIs, and on many other streams. Deducted ≠ final tax; reconcile in the ITR.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Term Plan",
    slug: 'term-plan',
    category: 'Finance & math',
    definition:
      "Pure life insurance: a premium buys a death benefit for a term, with no maturity value. The cheapest way to cover human-life value — ₹1 crore for a healthy 30-year-old costs ₹10–15k/year. \"Investment + insurance\" products bundle the two badly.",
    links: [
      { label: 'Insurance guide', href: '/health-insurance/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "T+1 Settlement",
    slug: 't-1-settlement',
    category: 'Finance & math',
    definition:
      "Trades settle one day after execution, so sale proceeds reach your bank on T+1 (equity) and shares hit your demat the same cycle. Withdrawal from an equity fund takes longer: T+3 redemption cycle.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Under-insurance",
    slug: 'under-insurance',
    category: 'Finance & math',
    definition:
      "Being insured for less than the loss. In health, insurers apply proportional deduction: pay ₹3 lakh hospital bill on a ₹5 lakh policy when costs were ₹6 lakh and the insurer pays only ₹2.5 lakh. Re-price cover every 3 years with medical inflation.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "VPF",
    slug: 'vpf',
    category: 'Finance & math',
    definition:
      "Voluntary Provident Fund — contributions to EPF beyond the statutory 12%, earning the same ~8.25% tax-free (up to the ₹5 lakh aggregate rule). The best risk-free rate available to most salaried people.",
    links: [
      { label: 'Tax guide', href: '/money-finance/tax/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Waiting Period",
    slug: 'waiting-period',
    category: 'Finance & math',
    definition:
      "In health insurance: 30 days for illness, 2–4 years for named pre-existing conditions, 1–2 years for specific procedures. Claims inside the window are rejected; porting can credit earned waiting periods if applied for correctly.",
    links: [
      { label: 'Insurance guide', href: '/health-insurance/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
  {
    term: "Yield to Maturity",
    slug: 'yield-to-maturity',
    category: 'Finance & math',
    definition:
      "The total return if a bond is held to maturity, accounting for coupon and purchase price. A bond bought at a discount to face shows a YTM above its coupon; that is the number to compare, not the coupon.",
    links: [
      { label: 'Investing guide', href: '/money-finance/investing/' },
    ],
    source: 'https://github.com/chirag127/arac',
  },
];
