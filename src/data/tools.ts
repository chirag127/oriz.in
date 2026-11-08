import type { IconName } from '../lib/icons';
import type { TagSlug } from './tags';

export type ToolStatus = 'stable' | 'beta';

export type TextMode =
  | 'url'
  | 'base64'
  | 'html-entities'
  | 'case'
  | 'whitespace'
  | 'slug'
  | 'word-stats'
  | 'reading-time';

export type JsonMode = 'format' | 'minify';
export type CsvMode = 'preview' | 'json-to-csv';
export type SqlMode = 'format' | 'explain';

export type CalculatorSlug =
  | 'percentage'
  | 'compound-interest'
  | 'loan-emi'
  | 'cagr'
  | 'sip'
  | 'amortization'
  | 'aspect-ratio'
  | 'statistics'
  | 'scientific-notation'
  | 'random-sample'
  | 'emergency-fund'
  | 'loan-prepayment';

export type ReferenceSlug = 'http-status' | 'mime' | 'git' | 'docker' | 'regex';

export type ToolEngine =
  | 'text'
  | 'hash'
  | 'uuid'
  | 'unicode'
  | 'json'
  | 'csv'
  | 'yaml'
  | 'xml'
  | 'markdown'
  | 'jwt'
  | 'regex'
  | 'diff'
  | 'timestamp'
  | 'date-diff'
  | 'timezone'
  | 'cron'
  | 'calculator'
  | 'number-base'
  | 'unit'
  | 'color'
  | 'gradient'
  | 'contrast'
  | 'mermaid'
  | 'subnet'
  | 'reference'
  | 'playground'
  | 'sql'
  | 'decision-table';

export interface ToolOptions {
  mode?: TextMode | JsonMode | CsvMode | SqlMode;
  calculator?: CalculatorSlug;
  reference?: ReferenceSlug;
}

export interface ToolDefinition {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: TagSlug[];
  keywords: string[];
  icon: IconName;
  engine: ToolEngine;
  options?: ToolOptions;
  status: ToolStatus;
  privacy: 'local';
  steps: string[];
  limitations: string[];
  related: string[];
  docs?: string;
  featured?: boolean;
  added: string;
  updated: string;
}

export interface ToolClientConfig {
  title: string;
  engine: ToolEngine;
  options?: ToolOptions;
}

const date = '2026-10-25';

export const TOOLS: ToolDefinition[] = [
  {
    slug: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description:
      'Format, indent, and validate JSON in your browser. Clear line and column errors help you find syntax mistakes quickly.',
    category: 'data-storage',
    tags: ['json', 'validation', 'formatting'],
    keywords: ['json beautify', 'json pretty print', 'json lint', 'validate json'],
    icon: 'braces',
    engine: 'json',
    options: { mode: 'format' },
    status: 'stable',
    privacy: 'local',
    featured: true,
    steps: [
      'Paste or type JSON into the input panel.',
      'The formatter validates continuously and reports the first syntax error with its location.',
      'Copy or download the indented result, or switch the indentation size.',
    ],
    limitations: [
      'Only strict JSON is accepted; comments and trailing commas are not valid JSON.',
      'Very large documents may be slow to render because they are processed in the browser.',
    ],
    related: ['json-minifier', 'json-to-csv', 'csv-previewer'],
    docs: 'json-formatting-and-validation',
    added: date,
    updated: date,
  },
  {
    slug: 'json-minifier',
    title: 'JSON Minifier',
    description:
      'Remove insignificant whitespace from JSON while keeping the data valid. See exactly how many bytes you save.',
    category: 'data-storage',
    tags: ['json', 'formatting'],
    keywords: ['minify json', 'compress json', 'json one line'],
    icon: 'braces',
    engine: 'json',
    options: { mode: 'minify' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste JSON into the input panel.',
      'The minified output updates as you type, and the byte comparison shows the reduction.',
      'Copy or download the compact JSON.',
    ],
    limitations: [
      'Minification changes formatting only; it does not compress HTTP responses or encrypt data.',
      'Invalid JSON produces an error instead of an output.',
    ],
    related: ['json-formatter', 'json-to-csv', 'base64-encoder'],
    docs: 'json-formatting-and-validation',
    added: date,
    updated: date,
  },
  {
    slug: 'json-to-csv',
    title: 'JSON to CSV Converter',
    description:
      'Convert an array of JSON objects into CSV, with a preview table and proper escaping for commas, quotes, and newlines.',
    category: 'data-storage',
    tags: ['json', 'csv', 'conversion'],
    keywords: ['json csv', 'convert json to csv', 'export json'],
    icon: 'braces',
    engine: 'csv',
    options: { mode: 'json-to-csv' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste a JSON array of objects with consistent keys.',
      'Review the detected columns in the preview table.',
      'Download the CSV or copy it to your clipboard.',
    ],
    limitations: [
      'The top level must be an array of objects; wrap a single object in an array first.',
      'Nested objects and arrays are serialized as compact JSON inside their CSV cell.',
      'Column order follows the order of keys in the first object, with later keys appended.',
    ],
    related: ['csv-previewer', 'json-formatter', 'json-minifier'],
    docs: 'json-formatting-and-validation',
    added: date,
    updated: date,
  },
  {
    slug: 'csv-previewer',
    title: 'CSV Previewer',
    description:
      'Parse and inspect CSV locally. Preview rows in a table, check the detected shape, and catch quoting errors before importing.',
    category: 'data-storage',
    tags: ['csv', 'validation', 'conversion'],
    keywords: ['csv viewer', 'csv parser', 'preview csv', 'delimiter'],
    icon: 'list',
    engine: 'csv',
    options: { mode: 'preview' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste CSV text and choose the delimiter that matches the file.',
      'Review the parsed preview table and the reported row and column counts.',
      'Load the sample data to see how quoted fields and embedded newlines are handled.',
    ],
    limitations: [
      'The preview shows the first 500 rows to keep the page responsive.',
      'Type inference is not applied; every displayed cell is text.',
      'Encoding detection is not performed. Paste text that your browser has already decoded.',
    ],
    related: ['json-to-csv', 'json-formatter'],
    added: date,
    updated: date,
  },
  {
    slug: 'yaml-validator',
    title: 'YAML Validator',
    description:
      'Validate YAML 1.2 syntax and inspect the parsed document as JSON. Errors include the line and column where parsing stopped.',
    category: 'data-storage',
    tags: ['yaml', 'validation', 'json'],
    keywords: ['yaml lint', 'validate yaml', 'yaml parser', 'yaml to json'],
    icon: 'file-text',
    engine: 'yaml',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste a YAML document into the editor.',
      'The validator reports syntax errors with line and column details.',
      'Valid documents can be inspected as JSON directly in the page.',
    ],
    limitations: [
      'Multiple YAML documents are parsed separately and displayed as an array.',
      'Custom tags and application-specific schema semantics are not validated.',
      'Anchors and merge keys follow the behavior of the js-yaml parser.',
    ],
    related: ['json-formatter', 'xml-formatter', 'csv-previewer'],
    added: date,
    updated: date,
  },
  {
    slug: 'xml-formatter',
    title: 'XML Formatter',
    description:
      'Check that XML is well formed and pretty-print it with consistent indentation. Parsing errors are shown in plain language.',
    category: 'data-storage',
    tags: ['xml', 'formatting', 'validation'],
    keywords: ['xml beautify', 'format xml', 'pretty print xml'],
    icon: 'code',
    engine: 'xml',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste an XML document into the input.',
      'The browser parser checks well-formedness and the formatter indents the tree.',
      'Copy or download the result.',
    ],
    limitations: [
      'Formatting changes whitespace between elements, which can matter for documents that treat whitespace as significant.',
      'It validates well-formedness, not a DTD, XSD, or business-specific schema.',
      'Processing instructions and comments are preserved as reported by the browser parser.',
    ],
    related: ['json-formatter', 'yaml-validator'],
    added: date,
    updated: date,
  },
  {
    slug: 'markdown-previewer',
    title: 'Markdown Previewer',
    description:
      'Write Markdown and see a sanitized HTML preview side by side. Copy the rendered HTML when you need portable markup.',
    category: 'developer-craft',
    tags: ['markdown', 'writing', 'html'],
    keywords: ['markdown editor', 'markdown preview', 'md to html'],
    icon: 'file-text',
    engine: 'markdown',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Type or paste Markdown in the editor.',
      'The preview updates as you write; raw HTML is removed by the sanitizer before display.',
      'Copy the sanitized HTML if you need it in another tool.',
    ],
    limitations: [
      'The tool implements standard CommonMark behavior through marked, not every extension.',
      'Preview styling is illustrative and does not include your site’s own CSS.',
      'Raw HTML in the source is sanitized and may be removed or altered.',
      'Remote images are not fetched in the preview for privacy; only data-image URLs are displayed.',
    ],
    related: ['word-counter', 'text-diff', 'text-to-slug'],
    added: date,
    updated: date,
  },
  {
    slug: 'html-entity-encoder',
    title: 'HTML Entity Encoder & Decoder',
    description:
      'Escape HTML special characters for safe display, or decode common named and numeric entities back to plain text.',
    category: 'developer-craft',
    tags: ['html', 'encoding', 'web'],
    keywords: ['html entities', 'escape html', 'decode html', 'ampersand'],
    icon: 'code',
    engine: 'text',
    options: { mode: 'html-entities' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Choose whether to encode plain text or decode entity references.',
      'Paste text into the input panel.',
      'Copy the converted output. Encoding covers the five predefined HTML characters.',
    ],
    limitations: [
      'Decoding supports common named entities and numeric references, not the full HTML entity database.',
      'Encoding does not sanitize HTML; it only replaces special characters with entity references.',
    ],
    related: ['url-encoder', 'base64-encoder', 'markdown-previewer'],
    added: date,
    updated: date,
  },
  {
    slug: 'url-encoder',
    title: 'URL Encoder & Decoder',
    description:
      'Percent-encode text for URL components or query strings, and decode existing percent-encoded values with error detection.',
    category: 'developer-craft',
    tags: ['url', 'encoding', 'web'],
    keywords: ['urlencode', 'percent encoding', 'decode url', 'query string'],
    icon: 'link',
    engine: 'text',
    options: { mode: 'url' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Choose component encoding, full-URL encoding, or decoding.',
      'Paste the value into the input panel.',
      'Use the output as a query parameter value or path component.',
    ],
    limitations: [
      'Component mode encodes reserved characters such as / and ?; full-URL mode preserves them.',
      'Decoding malformed percent sequences reports an error instead of guessing.',
    ],
    related: ['base64-encoder', 'json-formatter', 'text-to-slug'],
    added: date,
    updated: date,
  },
  {
    slug: 'base64-encoder',
    title: 'Base64 Encoder & Decoder',
    description:
      'Encode UTF-8 text as Base64 or decode Base64 back to text. URL-safe alphabet and strict error reporting are supported.',
    category: 'developer-craft',
    tags: ['base64', 'encoding', 'security'],
    keywords: ['base64 encode', 'base64 decode', 'url safe base64', 'utf-8'],
    icon: 'shield',
    engine: 'text',
    options: { mode: 'base64' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Choose encode or decode and, if needed, the URL-safe alphabet.',
      'Paste text into the input; conversion happens locally as you type.',
      'Copy the result. Base64 is an encoding, not encryption.',
    ],
    limitations: [
      'Base64 increases size by roughly one third and provides no confidentiality.',
      'Decoding expects valid UTF-8 text output; arbitrary binary data is not supported.',
    ],
    related: ['hash-calculator', 'url-encoder', 'html-entity-encoder'],
    docs: 'base64-is-not-encryption',
    added: date,
    updated: date,
  },
  {
    slug: 'unicode-inspector',
    title: 'Unicode Inspector',
    description:
      'Inspect text code point by code point. See hexadecimal values, UTF-8 byte sequences, and UTF-16 units for each character.',
    category: 'developer-craft',
    tags: ['unicode', 'encoding', 'text'],
    keywords: ['unicode code point', 'utf-8 bytes', 'character inspector', 'emoji codepoint'],
    icon: 'globe',
    engine: 'unicode',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste the text you want to inspect.',
      'Read the summary counts, then inspect each code point in the table.',
      'Use the hexadecimal values in documentation, parsers, or debugging notes.',
    ],
    limitations: [
      'Character names and Unicode general categories are not included because browsers do not expose them consistently.',
      'Very long input is truncated in the table to keep rendering responsive.',
    ],
    related: ['html-entity-encoder', 'text-to-slug', 'whitespace-cleaner'],
    added: date,
    updated: date,
  },
  {
    slug: 'uuid-generator',
    title: 'UUID v4 Generator',
    description:
      'Generate cryptographically random RFC 4122 version 4 UUIDs in batches. Runs entirely on your device with no tracking.',
    category: 'developer-craft',
    tags: ['uuid', 'security', 'developer-tools'],
    keywords: ['guid generator', 'uuid v4', 'random uuid'],
    icon: 'hash',
    engine: 'uuid',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Choose how many UUIDs you need.',
      'Select uppercase output if your system requires it.',
      'Generate and copy the list, or download it as text.',
    ],
    limitations: [
      'Only version 4 random UUIDs are generated; time-based and namespace UUIDs are not supported.',
      'Uniqueness is probabilistic. The generator relies on the browser’s cryptographic random source.',
    ],
    related: ['hash-calculator', 'random-sample'],
    added: date,
    updated: date,
  },
  {
    slug: 'hash-calculator',
    title: 'Hash Calculator',
    description:
      'Compute SHA-1, SHA-256, SHA-384, SHA-512, and MD5 digests of text locally. Compare outputs and copy the hex digest.',
    category: 'developer-craft',
    tags: ['hashing', 'security', 'privacy'],
    keywords: ['sha256', 'md5', 'hash text', 'checksum'],
    icon: 'shield',
    engine: 'hash',
    status: 'stable',
    privacy: 'local',
    featured: true,
    steps: [
      'Type or paste the text you want to hash.',
      'Select one or more algorithms.',
      'Copy a digest, or use the output to verify that two inputs match.',
    ],
    limitations: [
      'MD5 and SHA-1 are included for compatibility and checksums, not for password storage or new security designs.',
      'Text is hashed as UTF-8. File hashing is not supported in this tool.',
      'A hash verifies integrity; it does not encrypt or recover the original content.',
    ],
    related: ['base64-encoder', 'uuid-generator', 'regex-tester'],
    docs: 'base64-is-not-encryption',
    added: date,
    updated: date,
  },
  {
    slug: 'regex-tester',
    title: 'Regular Expression Tester',
    description:
      'Test JavaScript regular expressions against sample text. Inspect matches, capture groups, indices, and replacement output.',
    category: 'developer-craft',
    tags: ['regex', 'text', 'developer-tools'],
    keywords: ['regex tester', 'regular expression', 'javascript regex', 'replace regex'],
    icon: 'code',
    engine: 'regex',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Enter a pattern and select flags.',
      'Paste sample text and review all matches, groups, and positions.',
      'Optionally enter a replacement string to preview the substituted result.',
    ],
    limitations: [
      'The tool uses the JavaScript regular expression engine and its syntax differences.',
      'Catastrophic backtracking can make the page unresponsive; avoid untrusted, pathological patterns.',
      'Zero-width matches are reported but highlighting may be hard to see.',
    ],
    related: ['regex-reference', 'text-diff', 'text-to-slug'],
    added: date,
    updated: date,
  },
  {
    slug: 'text-diff',
    title: 'Text Diff Viewer',
    description:
      'Compare two blocks of text by line or word. See additions, deletions, unchanged sections, and a compact change summary.',
    category: 'computer-science',
    tags: ['diff', 'text', 'algorithms'],
    keywords: ['text compare', 'diff checker', 'compare files', 'line diff'],
    icon: 'layers',
    engine: 'diff',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste the original text on the left and the revised text on the right.',
      'Choose line-level or word-level comparison.',
      'Review inserted and removed content, then copy the summary if needed.',
    ],
    limitations: [
      'The comparison uses a longest-common-subsequence algorithm and can be slow beyond a few thousand tokens.',
      'Diff output is not a patch file and does not include Git metadata.',
      'Whitespace differences are significant in line mode.',
    ],
    related: ['whitespace-cleaner', 'git-reference', 'word-counter'],
    docs: 'diff-algorithms',
    added: date,
    updated: date,
  },
  {
    slug: 'word-counter',
    title: 'Word & Character Counter',
    description:
      'Count words, characters, sentences, lines, and paragraphs as you type. Get a local reading-time estimate in the same panel.',
    category: 'developer-craft',
    tags: ['text', 'writing', 'productivity'],
    keywords: ['word count', 'character count', 'letters count', 'reading time'],
    icon: 'type',
    engine: 'text',
    options: { mode: 'word-stats' },
    status: 'stable',
    privacy: 'local',
    featured: true,
    steps: [
      'Paste or write text in the editor.',
      'Review live counts for words, characters, sentences, paragraphs, and lines.',
      'Use the reading-time estimate as a rough editorial guide, not a deadline.',
    ],
    limitations: [
      'Word boundaries are heuristic and may differ from word-processor counts for languages without spaces.',
      'The reading-time estimate uses a fixed words-per-minute average.',
    ],
    related: ['reading-time', 'case-converter', 'whitespace-cleaner'],
    added: date,
    updated: date,
  },
  {
    slug: 'case-converter',
    title: 'Case Converter',
    description:
      'Convert text between sentence case, title case, upper case, lower case, camelCase, PascalCase, snake_case, and kebab-case.',
    category: 'developer-craft',
    tags: ['text', 'conversion', 'writing'],
    keywords: ['uppercase', 'title case', 'camelcase', 'snake case', 'kebab case'],
    icon: 'type',
    engine: 'text',
    options: { mode: 'case' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste the text you want to transform.',
      'Choose a case style. Identifier styles split words on spaces, punctuation, underscores, and hyphens.',
      'Copy the converted result.',
    ],
    limitations: [
      'Title case follows a compact English style and does not claim to be a full style-guide implementation.',
      'Accented characters are preserved where the transformation permits them.',
    ],
    related: ['text-to-slug', 'whitespace-cleaner', 'word-counter'],
    added: date,
    updated: date,
  },
  {
    slug: 'whitespace-cleaner',
    title: 'Whitespace Cleaner',
    description:
      'Tidy pasted text by trimming lines, collapsing repeated spaces, removing empty lines, and normalizing line endings.',
    category: 'developer-craft',
    tags: ['text', 'formatting', 'writing'],
    keywords: ['remove whitespace', 'trim lines', 'remove blank lines', 'clean text'],
    icon: 'type',
    engine: 'text',
    options: { mode: 'whitespace' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste text into the input panel.',
      'Choose a cleanup action, from trimming each line to collapsing all whitespace.',
      'Review the result before copying so that intentional indentation is not lost.',
    ],
    limitations: [
      'Whitespace can be semantically meaningful in code and preformatted text; review before applying.',
      'The tool cannot infer which spaces or tabs were intentional.',
    ],
    related: ['word-counter', 'case-converter', 'text-diff'],
    added: date,
    updated: date,
  },
  {
    slug: 'timestamp-converter',
    title: 'Unix Timestamp Converter',
    description:
      'Convert between Unix timestamps and readable dates. Handles seconds and milliseconds, UTC and your local time zone.',
    category: 'developer-craft',
    tags: ['dates', 'time', 'conversion'],
    keywords: ['unix time', 'epoch converter', 'timestamp to date', 'milliseconds'],
    icon: 'clock',
    engine: 'timestamp',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste a Unix timestamp or a date string.',
      'The tool detects seconds or milliseconds and shows ISO 8601, local time, and additional representations.',
      'Use “Now” to inspect the current instant without leaving the page.',
    ],
    limitations: [
      'Timestamp autodetection uses digit count and can be ambiguous; use the explicit unit selector when needed.',
      'Displayed local time comes from your device time zone.',
      'Dates outside the JavaScript Date range are rejected.',
    ],
    related: ['date-difference', 'timezone-converter', 'cron-explainer'],
    added: date,
    updated: date,
  },
  {
    slug: 'date-difference',
    title: 'Date Difference Calculator',
    description:
      'Calculate the exact number of days between two dates, plus weeks, business days, and a calendar year–month–day breakdown.',
    category: 'developer-craft',
    tags: ['dates', 'time', 'calculators'],
    keywords: ['days between dates', 'date duration', 'business days', 'age calculator'],
    icon: 'clock',
    engine: 'date-diff',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Choose a start date and an end date.',
      'Review total calendar days, weekday-only business days, and the year–month–day breakdown.',
      'Use the result for planning only; no public-holiday calendar is applied.',
    ],
    limitations: [
      'Business-day counts exclude Saturdays and Sundays and do not account for holidays.',
      'Dates are treated as calendar dates without a time of day or time zone.',
      'The end date can be earlier than the start date; the sign of the difference indicates direction.',
    ],
    related: ['timestamp-converter', 'timezone-converter'],
    added: date,
    updated: date,
  },
  {
    slug: 'timezone-converter',
    title: 'Time Zone Converter',
    description:
      'Translate a wall-clock date and time from one IANA time zone to several others, with daylight-saving transitions handled by the browser.',
    category: 'developer-craft',
    tags: ['time', 'dates', 'conversion'],
    keywords: ['timezone converter', 'utc time', 'meeting planner', 'iana timezone'],
    icon: 'globe',
    engine: 'timezone',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Choose the source date, time, and IANA time zone.',
      'Review the same instant in UTC and common business time zones.',
      'Enter any additional IANA zone to add it to the comparison.',
    ],
    limitations: [
      'The source wall time is interpreted using the browser’s time-zone data; unusual daylight-saving gaps or overlaps are resolved by the browser conventions.',
      'Not every IANA zone identifier is offered as a preset, but valid custom identifiers are accepted.',
      'The tool converts instants; it does not schedule recurring meetings or account for calendar rules.',
    ],
    related: ['timestamp-converter', 'date-difference', 'cron-explainer'],
    added: date,
    updated: date,
  },
  {
    slug: 'cron-explainer',
    title: 'Cron Expression Explainer',
    description:
      'Explain five-field cron schedules in plain English and preview the next matching times in your local time zone.',
    category: 'developer-craft',
    tags: ['cron', 'dates', 'reference'],
    keywords: ['cron expression', 'crontab', 'cron generator', 'schedule explain'],
    icon: 'clock',
    engine: 'cron',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Enter a standard five-field cron expression or choose an example.',
      'Read the field-by-field explanation and validation messages.',
      'Review the next five matching times in your local time zone.',
    ],
    limitations: [
      'Only standard five-field cron (minute, hour, day of month, month, day of week) is supported; seconds and year fields are not.',
      'Standard cron treats day-of-month and day-of-week restrictions with OR semantics when both are restricted.',
      'The next-run preview is calculated locally and does not account for a specific cron daemon’s quirks.',
    ],
    related: ['timestamp-converter', 'timezone-converter', 'git-reference'],
    docs: 'cron-expressions-guide',
    added: date,
    updated: date,
  },
  {
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    description:
      'Calculate a percentage of a number, find what percent one value is of another, or measure percentage increase and decrease.',
    category: 'money-tools',
    tags: ['math', 'calculators', 'conversion'],
    keywords: ['percent of', 'percentage change', 'percent increase', 'discount'],
    icon: 'sigma',
    engine: 'calculator',
    options: { calculator: 'percentage' },
    status: 'stable',
    privacy: 'local',
    featured: true,
    steps: [
      'Choose the percentage question you need to answer.',
      'Enter the two known values.',
      'Read the result together with the formula used.',
    ],
    limitations: [
      'Percentage change is undefined when the original value is zero.',
      'Results are numeric values, not currency-formatted financial advice.',
    ],
    related: ['compound-interest', 'cagr-calculator', 'statistical-summary'],
    added: date,
    updated: date,
  },
  {
    slug: 'compound-interest',
    title: 'Compound Interest Calculator',
    description:
      'Project compound growth with regular contributions, choose the compounding frequency, and see a year-by-year breakdown.',
    category: 'investing',
    tags: ['finance', 'interest', 'investing'],
    keywords: ['compound interest', 'savings calculator', 'future value', 'contribution'],
    icon: 'calculator',
    engine: 'calculator',
    options: { calculator: 'compound-interest' },
    status: 'stable',
    privacy: 'local',
    featured: true,
    steps: [
      'Enter the starting balance, annual rate, term, compounding frequency, and contribution per period.',
      'Review the projected balance, total contributed, and interest earned.',
      'Inspect or download the yearly schedule to understand how the result is built.',
    ],
    limitations: [
      'Contributions are applied at the end of each compounding period.',
      'The annual rate is treated as a nominal rate divided evenly across compounding periods.',
      'Taxes, fees, inflation, and variable returns are excluded. This is a mathematical illustration, not investment advice.',
    ],
    related: ['loan-emi', 'cagr-calculator', 'sip-calculator', 'percentage-calculator'],
    docs: 'compound-interest-guide',
    added: date,
    updated: date,
  },
  {
    slug: 'loan-emi',
    title: 'Loan EMI Calculator',
    description:
      'Calculate the monthly payment on a fixed-rate loan and see the total interest, plus a complete amortization schedule.',
    category: 'loans-credit',
    tags: ['finance', 'loans', 'interest'],
    keywords: ['emi calculator', 'loan payment', 'monthly installment', 'mortgage'],
    icon: 'calculator',
    engine: 'calculator',
    options: { calculator: 'loan-emi' },
    status: 'stable',
    privacy: 'local',
    featured: true,
    steps: [
      'Enter the loan amount, annual interest rate, and term in months.',
      'Review the monthly EMI, total repayment, and total interest.',
      'Download the amortization schedule to see the principal-to-interest split over time.',
    ],
    limitations: [
      'Assumes a fixed interest rate and equal monthly payments with no fees or prepayments.',
      'Uses the nominal annual rate divided by twelve; it does not calculate APR or effective annual cost.',
      'The final payment may be adjusted by a few cents to close a rounded schedule.',
    ],
    related: ['loan-amortization', 'compound-interest', 'cagr-calculator', 'percentage-calculator'],
    docs: 'home-loan-emi-breakup-principal-interest',
    added: date,
    updated: date,
  },
  {
    slug: 'cagr-calculator',
    title: 'CAGR Calculator',
    description:
      'Calculate compound annual growth rate from a starting value, ending value, and elapsed years, with a worked formula.',
    category: 'investing',
    tags: ['finance', 'investing', 'math'],
    keywords: ['cagr', 'annual growth rate', 'investment return', 'compound growth'],
    icon: 'chart',
    engine: 'calculator',
    options: { calculator: 'cagr' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Enter the starting value, ending value, and number of years.',
      'Read the compound annual growth rate as a percentage.',
      'Review the displayed formula to reproduce the calculation yourself.',
    ],
    limitations: [
      'CAGR smooths growth into one rate; it does not show volatility or the path taken.',
      'Starting values must be positive, and the time span must be greater than zero.',
      'The result is not adjusted for inflation, taxes, or contributions.',
    ],
    related: ['compound-interest', 'sip-calculator', 'percentage-calculator'],
    docs: 'compound-interest-guide',
    added: date,
    updated: date,
  },
  {
    slug: 'sip-calculator',
    title: 'SIP Future Value Calculator',
    description:
      'Estimate the future value of a monthly investment plan at a constant expected return, with clear assumptions and a yearly breakdown.',
    category: 'investing',
    tags: ['finance', 'investing', 'interest'],
    keywords: ['sip calculator', 'systematic investment', 'monthly investment', 'future value'],
    icon: 'chart',
    engine: 'calculator',
    options: { calculator: 'sip' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Enter the monthly investment, expected annual return, and term.',
      'Review the projected value, total invested, and estimated gains.',
      'Use the schedule as an illustration of compounding, not a return guarantee.',
    ],
    limitations: [
      'Assumes contributions at the start of each month and a constant nominal annual return.',
      'Does not model fund fees, exit loads, taxes, or inflation.',
      'Market returns vary. A positive result does not predict actual investment performance.',
    ],
    related: ['compound-interest', 'cagr-calculator', 'percentage-calculator'],
    docs: 'compound-interest-guide',
    added: date,
    updated: date,
  },
  {
    slug: 'number-base-converter',
    title: 'Number Base Converter',
    description:
      'Convert integers between binary, octal, decimal, and hexadecimal with support for negative values and large integers.',
    category: 'money-tools',
    tags: ['math', 'conversion', 'developer-tools'],
    keywords: ['binary converter', 'hex to decimal', 'octal', 'base 2'],
    icon: 'hash',
    engine: 'number-base',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Enter a value and choose its base.',
      'The value is converted to binary, octal, decimal, and hexadecimal at once.',
      'Copy the representation you need.',
    ],
    limitations: [
      'Supports integers only, not fractional values.',
      'Very long inputs are accepted up to a practical display limit to keep the page responsive.',
      'A leading minus sign is supported; other prefixes are parsed only when the matching base is selected.',
    ],
    related: ['unit-converter', 'scientific-notation', 'hash-calculator'],
    added: date,
    updated: date,
  },
  {
    slug: 'unit-converter',
    title: 'Unit Converter',
    description:
      'Convert length, mass, temperature, area, volume, speed, time, and digital storage units with clear precision and definitions.',
    category: 'money-tools',
    tags: ['conversion', 'math', 'reference'],
    keywords: ['unit conversion', 'km to miles', 'celsius to fahrenheit', 'kg to pounds'],
    icon: 'sigma',
    engine: 'unit',
    status: 'stable',
    privacy: 'local',
    featured: true,
    steps: [
      'Choose a measurement category.',
      'Select the source and destination units, then enter a value.',
      'Swap units or review the full comparison table for the same quantity.',
    ],
    limitations: [
      'Conversion factors are standard exact or conventional values; temperature uses the standard affine formulas.',
      'Digital storage distinguishes decimal (kB) and binary (KiB) units explicitly.',
      'Results are rounded for display and are not a substitute for calibrated measurement.',
    ],
    related: ['number-base-converter', 'scientific-notation', 'aspect-ratio'],
    added: date,
    updated: date,
  },
  {
    slug: 'color-converter',
    title: 'Color Converter',
    description:
      'Convert colors between HEX, RGB, HSL, and HSV. Check the values and preview the color in light and dark interface contexts.',
    category: 'color-accessibility',
    tags: ['color', 'css', 'design'],
    keywords: ['hex to rgb', 'rgb to hsl', 'color picker', 'color converter'],
    icon: 'palette',
    engine: 'color',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Enter a HEX, RGB, or HSL color, or use the color picker.',
      'Review equivalent values in HEX, RGB, HSL, and HSV.',
      'Copy the syntax you need for CSS or design tooling.',
    ],
    limitations: [
      'Alpha transparency and HWB notation are not supported in the initial version.',
      'Displayed previews depend on the color profile of your screen.',
    ],
    related: ['contrast-checker', 'gradient-generator', 'aspect-ratio'],
    docs: 'css-color-formats',
    added: date,
    updated: date,
  },
  {
    slug: 'contrast-checker',
    title: 'Color Contrast Checker',
    description:
      'Measure WCAG 2 contrast ratios for foreground and background colors, with AA and AAA results for normal and large text.',
    category: 'color-accessibility',
    tags: ['accessibility', 'color', 'css'],
    keywords: ['wcag contrast', 'accessibility checker', 'contrast ratio', 'aa aaa'],
    icon: 'accessibility',
    engine: 'contrast',
    status: 'stable',
    privacy: 'local',
    featured: true,
    steps: [
      'Choose or enter a text color and a background color.',
      'Read the contrast ratio and the WCAG AA/AAA pass results for normal and large text.',
      'Swap the colors to compare the inverse arrangement.',
    ],
    limitations: [
      'The checker covers WCAG contrast for solid colors; gradients, transparency, images, and thin text need manual review.',
      'Passing a ratio is not a complete accessibility audit; focus states, font size, and usability still matter.',
      'Colors are interpreted as sRGB values.',
    ],
    related: ['color-converter', 'gradient-generator', 'aspect-ratio'],
    docs: 'css-color-formats',
    added: date,
    updated: date,
  },
  {
    slug: 'gradient-generator',
    title: 'CSS Gradient Generator',
    description:
      'Build linear and radial CSS gradients with draggable color stops, preview the result, and copy clean CSS.',
    category: 'color-accessibility',
    tags: ['css', 'color', 'design'],
    keywords: ['css gradient', 'background gradient', 'linear gradient generator'],
    icon: 'palette',
    engine: 'gradient',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Choose a linear or radial gradient type.',
      'Add, edit, or remove color stops and adjust their positions and colors.',
      'Copy the generated CSS, which is valid for modern browsers.',
    ],
    limitations: [
      'Generates standard linear-gradient() and radial-gradient() syntax without vendor prefixes.',
      'Interpolation follows the browser’s default color space; advanced interpolation methods are not exposed.',
      'A gradient can fail contrast requirements for text placed over it, so check the final composition.',
    ],
    related: ['color-converter', 'contrast-checker', 'aspect-ratio'],
    docs: 'css-color-formats',
    added: date,
    updated: date,
  },
  {
    slug: 'aspect-ratio',
    title: 'Aspect Ratio Calculator',
    description:
      'Simplify an aspect ratio or find a missing dimension when scaling an image, video, or layout box proportionally.',
    category: 'color-accessibility',
    tags: ['design', 'calculators', 'conversion'],
    keywords: ['aspect ratio', 'resize proportionally', '16:9', 'image dimensions'],
    icon: 'layers',
    engine: 'calculator',
    options: { calculator: 'aspect-ratio' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Enter the original width and height.',
      'Review the simplified ratio and decimal ratio.',
      'Enter a new width or height to calculate the matching dimension.',
    ],
    limitations: [
      'Dimensions are treated as unitless integer or decimal values; pixel rounding is shown where relevant.',
      'The tool does not crop, resize, or modify image files.',
    ],
    related: ['unit-converter', 'gradient-generator', 'color-converter'],
    added: date,
    updated: date,
  },
  {
    slug: 'mermaid-editor',
    title: 'Mermaid Diagram Editor',
    description:
      'Write Mermaid syntax and preview flowcharts, sequence diagrams, state diagrams, and more. Export the rendered SVG locally.',
    category: 'developer-craft',
    tags: ['diagram', 'mermaid', 'design'],
    keywords: ['mermaid live editor', 'flowchart maker', 'sequence diagram', 'diagram generator'],
    icon: 'chart',
    engine: 'mermaid',
    status: 'beta',
    privacy: 'local',
    featured: true,
    steps: [
      'Edit the Mermaid source or choose one of the provided examples.',
      'The diagram renders in the preview panel; syntax errors are reported below the editor.',
      'Download the rendered SVG or copy the source into your documentation.',
    ],
    limitations: [
      'Rendering uses the Mermaid library with strict security settings and sanitized SVG output.',
      'Some diagram types and browser-specific styling may differ from rendered documentation pipelines.',
      'Very large or complex diagrams can be slow to render.',
    ],
    related: ['markdown-previewer', 'text-diff'],
    docs: 'diagramming-with-mermaid',
    added: date,
    updated: date,
  },
  {
    slug: 'http-status-reference',
    title: 'HTTP Status Code Reference',
    description:
      'A searchable reference to HTTP status codes: what each code means, when to use it, and what the specification says.',
    category: 'backend-apis',
    tags: ['http', 'reference', 'web'],
    keywords: ['http 404', 'status codes', 'http 500', 'response codes'],
    icon: 'list',
    engine: 'reference',
    options: { reference: 'http-status' },
    status: 'stable',
    privacy: 'local',
    featured: true,
    steps: [
      'Search by status code or keyword such as cache or redirect.',
      'Review the class, meaning, and practical usage note for each status.',
      'Follow the specification reference when the exact semantics matter.',
    ],
    limitations: [
      'The reference focuses on registered HTTP status codes and common usage; vendor-specific status codes are not included.',
      'The usage note is practical guidance, not a replacement for the governing specification.',
    ],
    related: ['mime-reference', 'json-formatter', 'regex-reference'],
    docs: 'http-status-codes',
    added: date,
    updated: date,
  },
  {
    slug: 'mime-reference',
    title: 'MIME Type Reference',
    description:
      'Look up common media types and file extensions for serving files, configuring uploads, and setting content headers correctly.',
    category: 'web-development',
    tags: ['mime', 'reference', 'web'],
    keywords: ['content type', 'media type', 'mime lookup', 'file extension'],
    icon: 'list',
    engine: 'reference',
    options: { reference: 'mime' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Search by extension, media type, or description.',
      'Use the correct Content-Type value for web responses or upload validation.',
      'Follow the IANA registry for uncommon types.',
    ],
    limitations: [
      'The table covers common media types, not the complete IANA registry.',
      'Some extensions map to more than one media type depending on context.',
      'A media type describes a format; it does not authenticate or validate file contents.',
    ],
    related: ['http-status-reference', 'json-formatter'],
    added: date,
    updated: date,
  },
  {
    slug: 'subnet-calculator',
    title: 'IPv4 Subnet Calculator',
    description:
      'Calculate the network address, broadcast address, usable host range, subnet mask, and host count for an IPv4 CIDR block.',
    category: 'networking',
    tags: ['networking', 'ipv4', 'reference'],
    keywords: ['subnet calculator', 'cidr', 'network mask', 'ip range'],
    icon: 'network',
    engine: 'subnet',
    status: 'stable',
    privacy: 'local',
    featured: true,
    steps: [
      'Enter an IPv4 address with a CIDR prefix, such as 192.0.2.10/24.',
      'Review network and broadcast addresses, usable host range, and mask information.',
      'Use the reference table to compare common prefix sizes.',
    ],
    limitations: [
      'IPv4 only; IPv6 prefix calculations are not included.',
      'Special-purpose address ranges are not interpreted beyond standard subnet arithmetic.',
      '/31 point-to-point and /32 single-host prefixes are reported with their standard host-count conventions.',
    ],
    related: ['number-base-converter', 'http-status-reference'],
    docs: 'ipv4-subnetting-guide',
    added: date,
    updated: date,
  },
  {
    slug: 'sql-formatter',
    title: 'SQL Formatter',
    description:
      'Format SQL into a more readable layout with uppercase keywords and clause-aware indentation. Entirely local and deterministic.',
    category: 'data-storage',
    tags: ['sql', 'formatting'],
    keywords: ['sql beautify', 'format sql query', 'sql pretty print'],
    icon: 'database',
    engine: 'sql',
    options: { mode: 'format' },
    status: 'beta',
    privacy: 'local',
    steps: [
      'Paste a SQL statement into the editor.',
      'Review the formatted output; keywords and major clauses are given consistent structure.',
      'Copy the result into your codebase or documentation.',
    ],
    limitations: [
      'The formatter covers common SELECT, INSERT, UPDATE, DELETE, and join syntax; it is not a full SQL dialect parser.',
      'Stored procedures, vendor-specific extensions, and complex nested expressions may format imperfectly.',
      'Formatting changes whitespace only and does not validate SQL semantics.',
    ],
    related: ['sql-explainer', 'regex-tester'],
    docs: 'reading-sql-queries',
    added: date,
    updated: date,
  },
  {
    slug: 'sql-explainer',
    title: 'SQL Query Explainer',
    description:
      'Break a SQL query into its clauses and explain what each part does in plain language, using deterministic local rules.',
    category: 'data-storage',
    tags: ['sql', 'learning', 'reference'],
    keywords: ['explain sql', 'sql clause breakdown', 'learn sql query'],
    icon: 'database',
    engine: 'sql',
    options: { mode: 'explain' },
    status: 'beta',
    privacy: 'local',
    steps: [
      'Paste a SQL query.',
      'Read the clause-by-clause explanation and the detected tables and columns.',
      'Review the warnings for patterns worth checking, such as SELECT * or missing filters.',
    ],
    limitations: [
      'This is a deterministic teaching aid, not a database optimizer or execution planner.',
      'It uses pattern matching and cannot understand every dialect, subquery, or vendor extension.',
      'Explanations describe the written query, not performance or index behavior.',
    ],
    related: ['sql-formatter', 'http-status-reference'],
    docs: 'reading-sql-queries',
    added: date,
    updated: date,
  },
  {
    slug: 'git-reference',
    title: 'Git Command Reference',
    description:
      'A searchable reference to everyday Git commands, from status and diff to rebase, restore, and recovering work safely.',
    category: 'developer-craft',
    tags: ['git', 'reference', 'developer-tools'],
    keywords: ['git commands', 'git cheat sheet', 'git rebase', 'git restore'],
    icon: 'git-branch',
    engine: 'reference',
    options: { reference: 'git' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Search by task or command name.',
      'Read a short explanation and an example invocation.',
      'Follow linked documentation for the exact version of Git you use.',
    ],
    limitations: [
      'Commands are presented for modern Git versions and common workflows, not every option.',
      'Examples assume you understand the current branch and working-tree state; Git can discard work.',
    ],
    related: ['text-diff', 'docker-reference'],
    docs: 'git-merge-vs-rebase',
    added: date,
    updated: date,
  },
  {
    slug: 'docker-reference',
    title: 'Docker Command Reference',
    description:
      'Look up common Docker commands for building images, running containers, inspecting logs, cleaning up, and working with volumes.',
    category: 'developer-craft',
    tags: ['docker', 'reference', 'developer-tools'],
    keywords: ['docker commands', 'docker cheat sheet', 'docker run', 'docker compose'],
    icon: 'terminal',
    engine: 'reference',
    options: { reference: 'docker' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Search for a task such as logs, volumes, or cleanup.',
      'Review the example command and the caution note where one exists.',
      'Consult the official Docker documentation for flags specific to your installation.',
    ],
    limitations: [
      'Examples assume a working Docker installation and local permissions.',
      'Destructive commands such as prune or remove are flagged but not sandboxed.',
      'Compose and Swarm workflows are only partially covered.',
    ],
    related: ['git-reference', 'http-status-reference'],
    added: date,
    updated: date,
  },
  {
    slug: 'regex-reference',
    title: 'Regular Expression Reference',
    description:
      'A compact reference to JavaScript regular expression tokens, anchors, groups, quantifiers, and flags with examples.',
    category: 'developer-craft',
    tags: ['regex', 'reference', 'developer-tools'],
    keywords: ['regex cheat sheet', 'regular expression syntax', 'lookahead', 'regex flags'],
    icon: 'code',
    engine: 'reference',
    options: { reference: 'regex' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Search for a token or concept.',
      'Read the syntax explanation and try the pattern in the regex tester.',
      'Check engine differences before reusing JavaScript patterns in another language.',
    ],
    limitations: [
      'The reference describes JavaScript regular expressions; other engines have different feature sets.',
      'The table is a curated overview, not a complete specification.',
    ],
    related: ['regex-tester', 'text-diff'],
    added: date,
    updated: date,
  },
  {
    slug: 'html-playground',
    title: 'HTML, CSS & JavaScript Playground',
    description:
      'Run a small HTML, CSS, and JavaScript experiment in a sandboxed iframe. Nothing is uploaded and network access is blocked.',
    category: 'web-development',
    tags: ['web', 'html', 'css', 'javascript', 'sandbox'],
    keywords: ['html playground', 'js fiddle', 'css sandbox', 'code runner'],
    icon: 'terminal',
    engine: 'playground',
    status: 'beta',
    privacy: 'local',
    steps: [
      'Write HTML, CSS, and JavaScript in the three editors.',
      'Run the experiment to render it in an isolated sandbox.',
      'Reset to the starter example or copy your code out when finished.',
    ],
    limitations: [
      'The sandbox blocks network access and has an opaque origin; it cannot access this site’s storage or cookies.',
      'There is no console capture or error inspector in this version.',
      'Only modern browser APIs available inside a sandboxed iframe are usable.',
      'Do not paste secrets into the editor.',
    ],
    related: ['markdown-previewer', 'regex-tester', 'json-formatter'],
    added: date,
    updated: date,
  },
  {
    slug: 'reading-time',
    title: 'Reading Time Estimator',
    description:
      'Estimate reading time for an article using a configurable words-per-minute rate, with word and character counts included.',
    category: 'developer-craft',
    tags: ['text', 'writing', 'productivity'],
    keywords: ['reading time', 'words per minute', 'article length'],
    icon: 'clock',
    engine: 'text',
    options: { mode: 'reading-time' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste the article or section you want to estimate.',
      'Adjust the words-per-minute rate to match your intended audience.',
      'Use the rounded estimate as an editorial planning signal.',
    ],
    limitations: [
      'Real reading speed varies by topic, format, familiarity, and reader.',
      'The estimate does not account for code blocks, diagrams, tables, or images.',
    ],
    related: ['word-counter', 'markdown-previewer'],
    added: date,
    updated: date,
  },
  {
    slug: 'loan-amortization',
    title: 'Loan Amortization Schedule',
    description:
      'Generate a month-by-month amortization schedule for a fixed-rate loan and export it as CSV for your own analysis.',
    category: 'loans-credit',
    tags: ['finance', 'loans', 'interest'],
    keywords: ['amortization schedule', 'loan table', 'principal interest', 'repayment plan'],
    icon: 'calculator',
    engine: 'calculator',
    options: { calculator: 'amortization' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Enter the principal, annual rate, and term in months.',
      'Review each month’s payment, interest, principal, and remaining balance.',
      'Download the complete schedule as a CSV file.',
    ],
    limitations: [
      'Assumes a fixed rate, equal monthly payments, and no fees or extra payments.',
      'The schedule rounds displayed values to cents; the final row is adjusted to a zero balance.',
      'It is an educational schedule, not a lender statement or payoff quote.',
    ],
    related: ['loan-emi', 'compound-interest'],
    docs: 'home-loan-emi-breakup-principal-interest',
    added: date,
    updated: date,
  },
  {
    slug: 'statistical-summary',
    title: 'Statistical Summary Calculator',
    description:
      'Summarize a list of numbers with count, mean, median, mode, quartiles, variance, and standard deviation.',
    category: 'money-tools',
    tags: ['statistics', 'math', 'calculators'],
    keywords: ['mean median mode', 'standard deviation', 'quartiles', 'summary statistics'],
    icon: 'chart',
    engine: 'calculator',
    options: { calculator: 'statistics' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste numbers separated by commas, spaces, or new lines.',
      'Review the count, center, spread, and quartile values.',
      'Use the sample or population variance label to match your data context.',
    ],
    limitations: [
      'Variance and standard deviation are sample statistics (n − 1) by default; the population values are also shown.',
      'Quantiles use linear interpolation and may differ slightly from other software conventions.',
      'The tool summarizes values; it does not test hypotheses or detect invalid study designs.',
    ],
    related: ['percentage-calculator', 'random-sample', 'scientific-notation'],
    added: date,
    updated: date,
  },
  {
    slug: 'scientific-notation',
    title: 'Scientific Notation Converter',
    description:
      'Convert numbers between decimal and scientific notation, with engineering notation and significant-figure feedback.',
    category: 'money-tools',
    tags: ['math', 'conversion', 'reference'],
    keywords: ['scientific notation', 'engineering notation', 'e notation', 'standard form'],
    icon: 'sigma',
    engine: 'calculator',
    options: { calculator: 'scientific-notation' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Enter a decimal value or a value in e-notation such as 3.2e-5.',
      'Review scientific, engineering, and plain decimal representations.',
      'Choose the format required by your calculation or documentation.',
    ],
    limitations: [
      'Values are handled as JavaScript floating-point numbers, so binary floating-point precision limits apply.',
      'Significant figures in the input are counted from the written text, not inferred as measurement precision.',
    ],
    related: ['number-base-converter', 'statistical-summary', 'unit-converter'],
    added: date,
    updated: date,
  },
  {
    slug: 'random-sample',
    title: 'Random Sample Generator',
    description:
      'Draw random integers from a range using cryptographic randomness. Choose the sample size and whether duplicates are allowed.',
    category: 'money-tools',
    tags: ['statistics', 'math', 'security'],
    keywords: ['random number generator', 'random sample', 'pick numbers', 'lottery'],
    icon: 'hash',
    engine: 'calculator',
    options: { calculator: 'random-sample' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Enter the inclusive minimum and maximum values.',
      'Choose how many values to draw and whether repeats are allowed.',
      'Generate and copy the result. A fresh random source is used locally.',
    ],
    limitations: [
      'Uses rejection sampling over the browser’s cryptographic random values; it is not an audited hardware random generator.',
      'This is not a lottery, gambling, or cryptographic key generation product.',
      'Without replacement, the sample size cannot exceed the number of integers in the range.',
    ],
    related: ['uuid-generator', 'statistical-summary', 'hash-calculator'],
    added: date,
    updated: date,
  },
  {
    slug: 'decision-table',
    title: 'Decision Table Builder',
    description:
      'Draft a compact rule table in your browser, then copy it as Markdown or download it as CSV for documentation or review.',
    category: 'developer-craft',
    tags: ['planning', 'productivity', 'markdown'],
    keywords: ['decision table', 'rule table', 'logic planner', 'requirements table'],
    icon: 'list',
    engine: 'decision-table',
    status: 'beta',
    privacy: 'local',
    steps: [
      'Name the table and edit the column headers for conditions and outcomes.',
      'Add rows and fill in each rule.',
      'Copy the Markdown version or download CSV to keep the table with the project.',
    ],
    limitations: [
      'The builder edits a single table; it does not generate combinatorial rules or validate logical completeness.',
      'Changes are not saved after you leave the page; copy or download the result first.',
      'The beta interface is keyboard-friendly but does not yet support importing an existing table.',
    ],
    related: ['markdown-previewer', 'word-counter'],
    added: date,
    updated: date,
  },
  {
    slug: 'text-to-slug',
    title: 'Text to Slug Converter',
    description:
      'Turn titles and headings into clean, lowercase URL slugs with configurable accents, separators, and length limits.',
    category: 'developer-craft',
    tags: ['text', 'url', 'writing'],
    keywords: ['slug generator', 'url slug', 'permalink', 'seo slug'],
    icon: 'link',
    engine: 'text',
    options: { mode: 'slug' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste a title or phrase.',
      'Choose the separator and whether accents should be folded to ASCII.',
      'Copy the slug and confirm it is unique within its parent section.',
    ],
    limitations: [
      'Slug generation cannot guarantee uniqueness or search performance; those are editorial decisions.',
      'Non-Latin scripts may reduce to an empty slug unless the input includes transliterable Latin characters.',
    ],
    related: ['case-converter', 'url-encoder', 'word-counter'],
    added: date,
    updated: date,
  },
  {
    slug: 'jwt-decoder',
    title: 'JWT Decoder',
    description:
      'Decode a JSON Web Token locally to inspect its header, payload, and signature. Signature verification is deliberately not performed.',
    category: 'backend-apis',
    tags: ['jwt', 'security', 'api'],
    keywords: ['jwt decode', 'json web token', 'inspect jwt', 'jwt payload'],
    icon: 'shield',
    engine: 'jwt',
    status: 'stable',
    privacy: 'local',
    steps: [
      'Paste a JWT, or choose the sample token.',
      'Review the decoded header and payload. The signature is displayed as text, not verified.',
      'Check the claims against the issuer’s documentation and your server-side verification rules.',
    ],
    limitations: [
      'This tool does not verify the signature, issuer, audience, algorithm, or cryptographic trust chain.',
      'Decoded claims are not automatically safe or current; a future exp date does not prove a server will accept the token.',
      'Never paste a production token into a page you do not trust, even when processing is local.',
    ],
    related: ['hash-calculator', 'base64-encoder', 'regex-tester'],
    docs: 'secure-api-design',
    added: date,
    updated: date,
  },
  {
    slug: 'emergency-fund-calculator',
    title: 'Emergency Fund Calculator (India)',
    description:
      'Estimate an emergency corpus in rupees, see the gap against your current savings, and calculate how long it will take to close.',
    category: 'personal-finance',
    tags: ['finance', 'india', 'planning'],
    keywords: ['emergency fund', 'indian emergency fund', 'liquid savings', 'financial safety net'],
    icon: 'calculator',
    engine: 'calculator',
    options: { calculator: 'emergency-fund' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Enter essential monthly expenses, not total lifestyle spending.',
      'Choose the number of months you want the fund to cover.',
      'Add the liquid savings you already hold and a realistic monthly contribution.',
    ],
    limitations: [
      'The calculator does not prescribe which instruments to use or how much insurance you need.',
      'Interest, tax, and market returns on the reserve are excluded.',
      'A single-income household may need a different assumption from a dual-income household; the model is only an arithmetic aid.',
    ],
    related: ['compound-interest', 'sip-calculator', 'loan-prepayment-calculator'],
    docs: 'emergency-fund-sizing',
    added: date,
    updated: date,
  },
  {
    slug: 'loan-prepayment-calculator',
    title: 'Home Loan Prepayment Calculator',
    description:
      'Estimate how extra monthly payments shorten an Indian home loan, reduce total interest, and change the payoff month.',
    category: 'loans-credit',
    tags: ['finance', 'loans', 'india'],
    keywords: ['loan prepayment', 'home loan prepayment', 'extra emi', 'interest saved'],
    icon: 'calculator',
    engine: 'calculator',
    options: { calculator: 'loan-prepayment' },
    status: 'stable',
    privacy: 'local',
    steps: [
      'Enter the outstanding loan amount, annual rate, and remaining term in months.',
      'Add a monthly prepayment amount you can sustain without draining your emergency fund.',
      'Review the interest saved, the shortened payoff time, and the yearly schedule.',
    ],
    limitations: [
      'Assumes a fixed rate, a constant extra monthly payment, and no prepayment fees or lender-specific rounding.',
      'It does not decide whether prepaying is better than investing; that requires your liquidity, tax, and risk assumptions.',
      'The result is an illustration, not a lender payoff quote or financial advice.',
    ],
    related: ['loan-emi', 'loan-amortization', 'compound-interest'],
    docs: 'prepay-home-loan-or-invest-the-surplus',
    added: date,
    updated: date,
  },
];

export const TOOL_SLUGS = TOOLS.map((tool) => tool.slug);

export function getTool(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function getFeaturedTools(): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.featured);
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  return tool.related
    .map((slug) => getTool(slug))
    .filter((related): related is ToolDefinition => Boolean(related));
}

export function getToolClientConfig(tool: ToolDefinition): ToolClientConfig {
  return { title: tool.title, engine: tool.engine, options: tool.options };
}
