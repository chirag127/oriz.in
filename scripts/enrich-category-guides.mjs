import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

const metadata = {
  'data-engineering': {
    questions: [
      ['How should a messy CSV be read?', 'Read it as text first, choose the encoding explicitly, preserve identifiers and pincodes as strings, then convert dates and money with tested rules.'],
      ['Why is binary floating point wrong for money?', 'Binary floats cannot represent every decimal exactly. Store integer paise or use Decimal for financial totals, and reconcile against a control total.'],
    ],
    faqs: [
      ['Should I use pandas or Polars?', 'Both can work. Choose based on file size, the transformations you need and your team’s familiarity. A tested script matters more than the engine.'],
      ['How do I handle a rerun?', 'Use a source hash, a transformation version and a deterministic key or atomic partition replacement so a retry does not duplicate rows.'],
    ],
  },
  'side-income': {
    questions: [
      ['How is freelance income taxed?', 'Freelance income is generally business or professional income. Presumptive taxation under 44ADA may apply if the conditions are met; verify the current thresholds and keep the records.'],
      ['Do I need GST for a side income?', 'It depends on turnover, the nature of the supply and the platform. The threshold is not the only test; check the current GST rules for the activity.'],
    ],
    faqs: [
      ['Should I open a separate bank account?', 'A separate account makes income, expenses and tax records easier to reconcile. It does not by itself change the legal treatment.'],
      ['How do I handle a client who pays late?', 'Invoice with clear due dates, keep proof of delivery, follow up in writing and plan a cash buffer. A large unpaid invoice is a credit risk, not just an accounting delay.'],
    ],
  },
  'small-business': {
    questions: [
      ['When is GST registration required?', 'Registration depends on turnover, the type of supply, inter-state activity and platform rules. Check the current threshold for your activity; voluntary registration may still make sense for input credit.'],
      ['What records should a small business keep?', 'Sales invoices, purchase bills, bank statements, GST returns, expense proofs, contracts and payroll records. The record should let someone reconstruct the transaction.'],
    ],
    faqs: [
      ['Can I claim input tax credit on every purchase?', 'No. The purchase must be used for the business and meet the GST conditions. Personal use, blocked credits and missing documents can disqualify a claim.'],
      ['Is a proprietary business separate from me?', 'For many small proprietorships the legal and tax identity is not fully separate. Keep business records separate and understand the liability before signing contracts.'],
    ],
  },
  'government-portals': {
    questions: [
      ['Where should I start for an official government service?', 'Start from the department’s official domain or the relevant national portal, not from a search advertisement. Verify the URL and keep the acknowledgement number.'],
      ['How do I check a portal is genuine?', 'Use the official domain, cross-check the link from the department’s site and avoid sites that ask for OTPs, fees or documents through unofficial channels.'],
    ],
    faqs: [
      ['What should I keep after submitting a form?', 'The acknowledgement number, a PDF or screenshot of the submission, the fee receipt and any reference number. These are the proof if a status query goes wrong.'],
      ['Are private “agent” portals safe?', 'They may be convenient but add a data and fraud risk. Prefer the official portal, and never share an OTP or password with an agent.'],
    ],
  },
  'color-accessibility': {
    questions: [
      ['What contrast ratio should normal text meet?', 'WCAG 2 AA sets 4.5:1 for normal text and 3:1 for large text. Check the current WCAG guidance and test the actual foreground and background colors.'],
      ['Does a color palette automatically pass accessibility?', 'No. Contrast, focus states, disabled states, charts and text alternatives all need separate checks. Color is information, not decoration alone.'],
    ],
    faqs: [
      ['What is the difference between sRGB and Display P3?', 'They are color spaces with different gamuts. A color can look different when the browser or device does not support the space; provide fallbacks.'],
      ['How do I test color without relying on my eyes?', 'Use a contrast calculator and browser dev tools, then run axe or manual checks with zoom, grayscale and dark mode.'],
    ],
  },
  'education-financing': {
    questions: [
      ['Should I use an education loan or build a corpus?', 'It depends on the course, the moratorium, the interest cost and the family’s liquidity. A loan preserves investments but adds repayment risk; a corpus avoids debt but may be exhausted.'],
      ['What is Section 80E?', 'It provides a deduction for interest on specified education loans under the Income-tax Act, subject to conditions. Verify current eligibility and the tax regime before assuming the benefit.'],
    ],
    faqs: [
      ['Is collateral always required?', 'No. Some loans are collateral-free up to a limit or under a scheme. The lender’s credit assessment and the course matter.'],
      ['What is a moratorium?', 'A period, often during the course plus a short window after it, when repayment may be deferred. Interest may still accrue; read the loan agreement.'],
    ],
  },
  'life-insurance': {
    questions: [
      ['How much term cover does a family need?', 'Enough to replace the income dependants rely on and cover liabilities, education and a transition period. The number depends on existing assets, cover and goals.'],
      ['Why do term claims get rejected?', 'Common reasons include non-disclosure, lapsed premiums, incorrect nominee details and policy conditions. Answer the proposal truthfully and keep the policy records.'],
    ],
    faqs: [
      ['Is term insurance an investment?', 'No. It pays a benefit on death; it does not build a corpus. Keep insurance and investing separate.'],
      ['What is a rider?', 'An add-on benefit with an extra premium. Buy one only when it covers a real need and the terms are clear.'],
    ],
  },
  'motor-insurance': {
    questions: [
      ['What is zero-depreciation cover?', 'It can replace parts without deducting depreciation, subject to the policy terms. It usually costs more than comprehensive cover and may have limits.'],
      ['What is IDV?', 'Insured Declared Value is the maximum sum insured for the vehicle, based on its market value. A low IDV reduces premium but also the claim.'],
    ],
    faqs: [
      ['Does comprehensive cover everything?', 'No. It covers a defined set of risks, subject to exclusions, deductibles and add-ons. Read the policy wording.'],
      ['Should I buy an add-on?', 'Buy an add-on when the excluded cost is material and the add-on is priced sensibly. Do not buy a bundle you do not understand.'],
    ],
  },
  'family-money': {
    questions: [
      ['How do I support parents without derailing retirement?', 'Treat the support as a fixed monthly obligation, agree the amount with the household, and protect retirement contributions. A separate transfer makes the commitment visible.'],
      ['How do I plan a child’s education corpus?', 'Estimate the future cost, choose a horizon and contribution, and keep the goal separate from retirement. Review the plan as fees and circumstances change.'],
    ],
    faqs: [
      ['Should siblings contribute equally?', 'Equal amounts are not always fair if incomes differ. Agree the principle in writing and revisit it when circumstances change.'],
      ['Should pocket money be linked to chores?', 'It can teach money habits, but the design matters. Separate household responsibilities from optional earning opportunities and let the child practise decisions.'],
    ],
  },
  inheritance: {
    questions: [
      ['Is nomination the same as inheritance?', 'No. A nominee receives the asset from the institution, but succession law and a valid will decide the ultimate beneficiary. Keep both aligned.'],
      ['What is a succession certificate?', 'A court-issued certificate that establishes the heirs’ authority to collect certain assets. The need and process depend on the asset and the applicable law.'],
    ],
    faqs: [
      ['Do I need a will if nominations exist?', 'A will is the clearest way to record your wishes and can reduce disputes, but it must be valid and consistent with nomination records. Seek legal advice.'],
      ['How do NRIs deal with Indian inheritance?', 'They usually need identity, address, nomination and succession documents, often with notarisation or apostille. The exact process depends on the asset and institution.'],
    ],
  },
  'marriage-money': {
    questions: [
      ['Should couples keep joint or separate accounts?', 'Many households use a hybrid: a joint account for shared expenses and separate accounts for personal spending. The right split depends on trust, income and goals.'],
      ['Is a prenuptial agreement enforceable in India?', 'Prenuptial agreements are not automatically enforceable as contracts in India, though their terms may be relevant in some proceedings. Get legal advice for your situation.'],
    ],
    faqs: [
      ['Who should pay for what?', 'There is no single rule. A contribution model based on shared obligations and proportional income is one option; write it down and review it when circumstances change.'],
      ['What documents should both partners know about?', 'Bank accounts, nominations, insurance, loans, property and tax records. Shared knowledge is part of financial safety.'],
    ],
  },
  'women-money': {
    questions: [
      ['Why does an own account matter?', 'It gives direct control over income and savings, builds a financial record and avoids dependence on a joint signatory in an emergency.'],
      ['What is Stridhan?', 'Stridhan refers to a woman’s own property, including gifts and assets received in certain relationships. Its legal treatment is distinct; consult a lawyer for a specific dispute.'],
    ],
    faqs: [
      ['Should a woman have a separate emergency fund?', 'A personal reserve can be useful even in a joint household. It is not a statement about the marriage; it is a practical layer of safety.'],
      ['How does a career break affect finances?', 'It can reduce current income, retirement contributions and credit history. Plan the reserve, insurance, EPF/NPS and re-entry before the break.'],
    ],
  },
  'financial-crime': {
    questions: [
      ['What is benami property?', 'Property held in one person’s name but paid for and enjoyed by another can fall under the benami law. The consequences can include confiscation and prosecution.'],
      ['What is hawala?', 'An informal value-transfer system that moves money without a conventional banking trail. It carries legal, tax and fraud risks; this library explains it for awareness, not participation.'],
    ],
    faqs: [
      ['Is a grey-area scheme safe because it has not been prosecuted?', 'No. Enforcement can arrive later, and the counterparty risk is high. The legality rating is part of the information.'],
      ['What should I do if I receive a suspicious offer?', 'Do not transfer money or share documents. Verify the entity through official channels and report suspected fraud to the appropriate authority.'],
    ],
  },
  'scams-fraud': {
    questions: [
      ['What should I do in the first 30 minutes after a fraud?', 'Call the bank’s official number, block the card or account, preserve messages and transaction IDs, and report to the cybercrime portal or police. Do not pay a “recovery agent”.'],
      ['How can I verify a KYC call?', 'Hang up, call the bank’s official number from the card or website, and never share an OTP, PIN, CVV or screen access. A genuine bank does not need them.'],
    ],
    faqs: [
      ['Can money be recovered after a UPI fraud?', 'Recovery is not guaranteed. Fast reporting improves the chance of a freeze, but the outcome depends on the bank, the beneficiary and the investigation.'],
      ['Are Telegram stock tips safe?', 'Unsolicited tips are a common pump-and-dump or fee-fraud pattern. Verify the adviser’s registration and never send money to a group.'],
    ],
  },
  alternatives: {
    questions: [
      ['Why do P2P platforms advertise high yields?', 'The yield reflects credit risk, platform risk and limited liquidity. A high headline return can coexist with defaults and delayed recovery.'],
      ['What is the difference between PMS and AIF?', 'Both are pooled or managed investment vehicles regulated by SEBI, with different minimum tickets, strategies and fee structures. Read the scheme documents.'],
    ],
    faqs: [
      ['Is fractional real estate liquid?', 'Usually not. The platform may offer a secondary market, but pricing and exit can be uncertain. Treat it as a long-horizon, illiquid asset.'],
      ['Should I invest in crypto?', 'It is volatile, tax-heavy and operationally risky. If you do, use only money you can lose, secure the keys and understand the tax rules.'],
    ],
  },
  banking: {
    questions: [
      ['What does DICGC insurance cover?', 'Deposits in insured banks are protected up to ₹5 lakh per depositor per bank, subject to conditions. Confirm current coverage and the institution’s status.'],
      ['Is a fixed deposit always better than a savings account?', 'A fixed deposit may pay more but locks the money and may charge a penalty for early withdrawal. A savings account or sweep gives liquidity.'],
    ],
    faqs: [
      ['What is a sweep-in deposit?', 'A facility that moves excess savings into a deposit and back when needed. Check the minimum balance, interest tiers and access terms.'],
      ['How do I compare bank charges?', 'Read the schedule of charges for minimum balance, cash transactions, SMS, debit cards and failed mandates. Small fees compound.'],
    ],
  },
  'money-tools': {
    questions: [
      ['How often should I review my portfolio?', 'A short monthly check and a deeper annual review are enough for many households. Review after a major life change, not after every market move.'],
      ['Is a spreadsheet better than an app?', 'A spreadsheet is transparent and portable; an app is convenient but may hide assumptions. The better tool is the one you will update consistently.'],
    ],
    faqs: [
      ['What should a net-worth tracker include?', 'Bank balances, investments, property, loans and other liabilities. Keep the valuation dates consistent.'],
      ['What is a good rebalancing rule?', 'A calendar review or a band-based threshold can work. Rebalance to control risk, not to predict the market.'],
    ],
  },
  nri: {
    questions: [
      ['What is the difference between NRE and NRO accounts?', 'NRE accounts hold foreign-currency earnings and generally offer repatriation; NRO accounts hold India-source income and have different tax and repatriation rules. Verify the current FEMA rules.'],
      ['What is RNOR status?', 'Resident but Not Ordinarily Resident is a tax status for returning NRIs or new residents. It can affect which foreign income is taxed in India; the window and conditions matter.'],
    ],
    faqs: [
      ['Can I repatriate the sale proceeds of Indian property?', 'Repatriation depends on the asset, the buyer, the funds and the FEMA rules. Keep the purchase and sale documents and get professional advice.'],
      ['What is DTAA relief?', 'A tax treaty can reduce double taxation, but you usually need a tax residency certificate and the prescribed forms. Follow the current process.'],
    ],
  },
  'real-estate': {
    questions: [
      ['What does RERA protect?', 'RERA requires project registration and disclosures, and provides a complaint route for delays and defects. It does not eliminate construction, title or market risk.'],
      ['How do I check land title?', 'Review the title chain, encumbrance certificate, survey records, tax receipts and approvals, and have a property lawyer examine the documents.'],
    ],
    faqs: [
      ['What is a good rental yield?', 'It depends on the city, property and costs. Compute annual rent net of vacancy, maintenance and taxes against the all-in purchase price.'],
      ['Should I buy a pre-launch property?', 'Pre-launch can offer a lower price but carries approval, delay and developer risk. Verify the RERA registration and the payment schedule.'],
    ],
  },
  retirement: {
    questions: [
      ['EPF or NPS: which should I use?', 'They serve different purposes. EPF is employment-linked retirement saving; NPS adds market-linked accumulation and an annuity requirement. Compare liquidity, tax, cost and the retirement income you need.'],
      ['How large a retirement corpus do I need?', 'A common starting point is 25–30 times annual expenses, adjusted for pension, rental income, health costs and the length of retirement. It is a planning heuristic, not a guarantee.'],
    ],
    faqs: [
      ['When can I withdraw EPF?', 'Withdrawal rules depend on the reason, the length of service and the remaining balance. Check the current EPFO rules before applying.'],
      ['Is PPF better than ELSS?', 'PPF is a long-term fixed-income savings scheme; ELSS is market-linked equity with a shorter lock-in. They answer different risk and liquidity needs.'],
    ],
  },
  stocks: {
    questions: [
      ['What should I read first in an annual report?', 'Start with the auditor’s report, cash-flow statement, related-party disclosures and the notes behind revenue and debt. The glossy opening is the least useful part.'],
      ['What does promoter pledging signal?', 'It means shares are pledged as collateral. A high pledge can amplify downside risk and signal liquidity pressure; read the disclosure and the reasons.'],
    ],
    faqs: [
      ['Is a low PE always cheap?', 'No. A low multiple can reflect a value trap, cyclical peak earnings or governance risk. Compare the business quality and the earnings path.'],
      ['What is a related-party transaction?', 'A transaction with an entity connected to the company or its promoters. It is not automatically wrong, but the terms and disclosures need scrutiny.'],
    ],
  },
  'computer-science': {
    questions: [
      ['What does a diff algorithm do?', 'It finds a sequence of insertions, deletions or replacements that turns one text into another. The result depends on the algorithm and the cost model.'],
      ['Why does the same change produce different diffs?', 'Different tools use different alignment rules, tokenisation and move detection. The output is an aid to review, not a mathematical proof of minimal change.'],
    ],
    faqs: [
      ['What is LCS?', 'The longest common subsequence is a sequence that appears in both inputs in order. It is a common basis for line diffs.'],
      ['Are diffs always optimal?', 'No. Tools trade optimality for speed and readability, and they may not detect moved blocks.'],
    ],
  },
  'data-storage': {
    questions: [
      ['JSON or YAML: which should I use?', 'JSON is strict and widely supported; YAML is easier for configuration but has more syntax ambiguity. Choose based on the consumer and validate either format.'],
      ['Why does SQL clause order differ from execution order?', 'A SQL query is written SELECT … FROM … WHERE, but the database logically evaluates FROM, WHERE, GROUP BY, HAVING, SELECT and ORDER BY. Reading it in execution order makes joins and filters clearer.'],
    ],
    faqs: [
      ['Is JSON valid YAML?', 'Most JSON is valid YAML, but YAML’s flexibility can create surprises. Do not assume a YAML parser accepts every JSON edge case without testing.'],
      ['Should I store money as a float?', 'No. Use integer minor units or a decimal type. Binary floating point cannot represent every decimal amount exactly.'],
    ],
  },
  'developer-craft': {
    questions: [
      ['Merge or rebase?', 'Merge preserves history and records integration; rebase rewrites local commits into a linear sequence. Rebase only unpublished work and prefer merge for shared branches.'],
      ['When should I use a diagram?', 'When the relationships or sequence are harder to explain in prose than to show. A diagram should remain readable without color and have a text fallback.'],
    ],
    faqs: [
      ['Why copy code with a button?', 'It makes examples usable and reduces transcription errors. The tool should not send the code anywhere.'],
      ['What makes a good commit?', 'A focused change with a message that explains why. Small commits are easier to review, revert and understand later.'],
    ],
  },
  networking: {
    questions: [
      ['What does /24 mean?', 'It is a prefix length: the first 24 bits identify the network. The remaining bits identify hosts. A /24 IPv4 network has 256 addresses, with network and broadcast reserved.'],
      ['Why use CIDR?', 'CIDR allows variable prefix lengths and route aggregation. It replaced fixed class-based allocation and makes address planning more efficient.'],
    ],
    faqs: [
      ['What is a private IP address?', 'An address in a reserved range such as 10.0.0.0/8, 172.16.0.0/12 or 192.168.0.0/16. It is not routed on the public internet.'],
      ['Why can two devices have the same private IP?', 'Private ranges are reused in separate networks. NAT translates them at the boundary, but overlapping networks can still cause routing confusion.'],
    ],
  },
  programming: {
    questions: [
      ['What does TypeScript erase at runtime?', 'Types, interfaces and type annotations disappear. Runtime checks, schema validation and authorization must be implemented separately.'],
      ['When should a branded type be used?', 'When two values share a primitive representation but must not be mixed, such as rupees and paise. The brand is a compile-time aid, not runtime validation.'],
    ],
    faqs: [
      ['Does strict mode catch every bug?', 'No. It catches more than the default, but runtime data, logic and authorization still need tests and validation.'],
      ['Why use `unknown` instead of `any`?', '`unknown` forces a check before use; `any` disables checking and spreads through the code.'],
    ],
  },
  'web-development': {
    questions: [
      ['What is a static JSON API?', 'A JSON file served with the right headers and refreshed by a build or workflow. It can be cheap and reliable for read-only data, but it has no server-side authorization or writes.'],
      ['Why do cache headers matter?', 'They decide whether a browser or CDN reuses a response. A wrong cache policy can serve stale authenticated data or waste bandwidth on unchanging assets.'],
    ],
    faqs: [
      ['Is a static site secure by default?', 'It has a smaller server surface, but client-side code, third-party scripts, secrets in public files and unsafe HTML still create risk.'],
      ['When should I add a backend?', 'When the product needs authenticated writes, server-side secrets, transactional state or authorization that cannot be enforced in the browser.'],
    ],
  },
  'early-career': {
    questions: [
      ['How should I split my first salary?', 'Cover essentials, start a small emergency reserve, avoid carrying a credit-card balance and automate a contribution before lifestyle spending expands.'],
      ['Why does a credit score matter at 22?', 'It can affect loan pricing and access for years. Pay on time, keep utilisation moderate and avoid unnecessary hard enquiries.'],
    ],
    faqs: [
      ['Should I invest or build an emergency fund first?', 'Build a one-month starter reserve first, then balance the full reserve with regular investing. A small automated investment can start early without replacing the reserve.'],
      ['Is a student credit card a good idea?', 'It can build a credit history if paid in full. It becomes expensive when the minimum due becomes a financing plan.'],
    ],
  },
};

const toolsData = JSON.parse(await readFile('dist/data/tools.json', 'utf8'));
const toolsByCategory = new Map();
for (const tool of toolsData.tools) {
  const list = toolsByCategory.get(tool.category) ?? [];
  list.push(tool.slug);
  toolsByCategory.set(tool.category, list);
}

const guides = [
  'ai-data/data-engineering',
  'business/side-income',
  'business/small-business',
  'civic-public-services/government-portals',
  'design-accessibility/color-accessibility',
  'education-learning/education-financing',
  'health-insurance/life-insurance',
  'health-insurance/motor-insurance',
  'home-family/family-money',
  'home-family/inheritance',
  'home-family/marriage-money',
  'home-family/women-money',
  'law-rights-fraud/financial-crime',
  'law-rights-fraud/scams-fraud',
  'money-finance/alternatives',
  'money-finance/banking',
  'money-finance/money-tools',
  'money-finance/nri',
  'money-finance/real-estate',
  'money-finance/retirement',
  'money-finance/stocks',
  'technology/computer-science',
  'technology/data-storage',
  'technology/developer-craft',
  'technology/networking',
  'technology/programming',
  'technology/web-development',
  'work-career/early-career',
];

for (const relative of guides) {
  const file = path.join('src/content/guides', `${relative}.md`);
  const text = await readFile(file, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u);
  if (!match) throw new Error(`Missing frontmatter in ${file}`);
  const data = YAML.parse(match[1]);
  const category = relative.split('/').pop();
  const extra = metadata[category];
  if (!extra) throw new Error(`No metadata for ${category}`);
  if (data.keyQuestions.length === 0) {
    data.keyQuestions = extra.questions.map(([question, answer]) => ({ question, answer }));
  }
  if (data.faq.length === 0) {
    data.faq = extra.faqs.map(([question, answer]) => ({ question, answer }));
  }
  const categoryTools = toolsByCategory.get(category) ?? [];
  if (data.tools.length === 0 && categoryTools.length > 0) {
    data.tools = categoryTools.slice(0, 4);
  }
  const frontmatter = YAML.stringify(data, { lineWidth: 0 });
  await writeFile(file, `---\n${frontmatter}---\n\n${text.slice(match[0].length)}`, 'utf8');
}

console.log(`Enriched ${guides.length} category guides.`);
