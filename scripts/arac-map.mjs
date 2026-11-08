/**
 * Mapping from the Rupee Realism source library into the ORIZ.IN taxonomy.
 * Track defaults are used unless a slug-level override exists.
 */
export const SERIES_BY_TRACK = {
  foundations: 'money-finance/personal-finance/money-foundations',
  banking: 'money-finance/banking/banking-basics',
  investing: 'money-finance/investing/mutual-funds',
  'stock-picking': 'money-finance/stocks/reading-companies',
  tax: 'money-finance/tax/income-tax',
  insurance: 'health-insurance/health-insurance/health-cover',
  retirement: 'money-finance/retirement/retirement-building',
  'loans-credit': 'money-finance/loans-credit/credit-and-borrowing',
  'gold-real-estate': 'money-finance/gold/gold-in-india',
  'alt-investments': 'money-finance/alternatives/alternative-assets',
  nri: 'money-finance/nri/nri-money',
  scams: 'law-rights-fraud/scams-fraud/scam-playbooks',
  'legal-grey': 'law-rights-fraud/financial-crime/grey-zone-finance',
  tools: 'money-finance/money-tools/tracking-and-audit',
  'family-money': 'home-family/family-money/family-dependants',
  'income-side-hustles': 'business/side-income/creator-and-service-income',
  'student-young-earner': 'work-career/early-career/first-salary',
  'women-money': 'home-family/women-money/women-and-money',
};

export const SERIES_OVERRIDES = {
  'emergency-fund-sizing': 'money-finance/personal-finance/emergency-funds',
  'lifestyle-inflation-early-career': 'work-career/early-career/first-salary',

  'bond-market-for-retail-rbi-retail-direct': 'money-finance/investing/portfolio-management',
  'p2p-lending-platforms-risks': 'money-finance/investing/portfolio-management',
  'dividend-income-taxation-slab-tds': 'money-finance/investing/portfolio-management',

  'capital-gains-fy-2025-26-rates': 'money-finance/tax/capital-gains',
  'form-26as-and-ais-reconciliation': 'money-finance/tax/compliance',
  'got-a-tax-notice-next-steps': 'money-finance/tax/compliance',

  'home-loan-emi-breakup-principal-interest': 'money-finance/loans-credit/home-loans',
  'prepay-home-loan-or-invest-the-surplus': 'money-finance/loans-credit/home-loans',
  'cibil-score-mechanics-factors': 'money-finance/loans-credit/credit-reports',
  'cibil-free-annual-report': 'money-finance/loans-credit/credit-reports',
  'credit-score-build-at-22-cibil-mechanics': 'money-finance/loans-credit/credit-reports',

  'rera-what-it-protects-and-does-not': 'money-finance/real-estate/property-decisions',
  'land-title-due-diligence-encumbrance': 'money-finance/real-estate/property-decisions',
  'rental-yield-reality-check-india': 'money-finance/real-estate/property-decisions',
  'rental-income-tax-house-property-arithmetic': 'money-finance/real-estate/property-decisions',
  'benami-property-act-prohibition': 'law-rights-fraud/financial-crime/grey-zone-finance',
  'fractional-real-estate-platforms': 'money-finance/alternatives/alternative-assets',

  'term-insurance-claim-rejection-reasons': 'health-insurance/life-insurance/life-cover',
  'motor-insurance-zero-dep-vs-comprehensive': 'health-insurance/motor-insurance/motor-cover',

  'marriage-money-conversations-before': 'home-family/marriage-money/marriage-and-money',
  'joint-accounts-or-not-india': 'home-family/marriage-money/marriage-and-money',
  'spousal-contribution-salary-gap-plan': 'home-family/marriage-money/marriage-and-money',
  'money-in-marriage-prenup-joint-accounts': 'home-family/marriage-money/marriage-and-money',
  'kids-education-corpus-planning': 'education-learning/education-financing/paying-for-education',
  'education-loan-moratorium-80e-collateral':
    'education-learning/education-financing/paying-for-education',
  'career-break-financial-plan-sabbatical': 'work-career/early-career/first-salary',
  'gold-sgb-etf-jewellery-allocation': 'money-finance/gold/gold-in-india',
  'stridhan-inheritance-womens-property-rights': 'home-family/inheritance/inheritance-and-succession',
  'nri-demise-nomination-poa-power-of-attorney':
    'home-family/inheritance/inheritance-and-succession',

  'freelance-income-tax-44ada-presumptive-gst': 'business/small-business/business-compliance',
  'gst-registration-side-income-threshold': 'business/small-business/business-compliance',
  'selling-online-marketplace-gst-tcs-compliance':
    'business/side-income/creator-and-service-income',
  'youtube-creator-income-tax-gst': 'business/side-income/creator-and-service-income',

  'student-budget-hostel-pg-flat-costs': 'work-career/early-career/student-money',
  'student-investing-500-sip-minor-accounts': 'work-career/early-career/student-money',
  'credit-score-build-at-22-cibil-mechanics': 'money-finance/loans-credit/credit-reports',

  'financial-independence-women-own-account-infrastructure':
    'home-family/women-money/women-and-money',
  'single-woman-financial-playbook': 'home-family/women-money/women-and-money',

  'fear-greed-index-api-tickertape': 'money-finance/money-tools/tracking-and-audit',
  'portfolio-rebalancing-spreadsheet-method': 'money-finance/money-tools/tracking-and-audit',
  'two-year-audit-your-own-portfolio': 'money-finance/money-tools/tracking-and-audit',
  'excel-vs-apps-tracking-net-worth': 'money-finance/money-tools/tracking-and-audit',
  'official-portals-bookmark-list': 'civic-public-services/government-portals/official-portals',
};

export const SERIES_ORDER = {
  'money-finance/personal-finance/money-foundations': [
    'zero-based-budgeting-india',
    'salary-arrivals-splitting-the-first-10000',
    'inflation-the-real-number',
    'sinking-funds-irregular-expenses',
    'money-blueprint-monthly-review-ritual',
  ],
  'money-finance/personal-finance/emergency-funds': ['emergency-fund-sizing'],
  'money-finance/banking/banking-basics': [
    'savings-account-maximising-interest',
    'fixed-deposit-laddering-rates',
    'rd-vs-flexi-rd',
    'deposit-insurance-dicgc-5-lakh',
    'bank-charges-minimum-balance-penalty',
    'upi-autopay-mandates-control',
  ],
  'money-finance/investing/mutual-funds': [
    'mutual-fund-direct-vs-regular',
    'index-funds-india-nifty-50-vs-nifty-500',
    'sip-timing-myth-and-math',
    'how-to-read-a-factsheet',
  ],
  'money-finance/investing/portfolio-management': [
    'bond-market-for-retail-rbi-retail-direct',
    'p2p-lending-platforms-risks',
    'dividend-income-taxation-slab-tds',
  ],
  'money-finance/stocks/reading-companies': [
    'reading-annual-report-first-hour',
    'screen-and-shortlist-process',
    'value-traps-low-pe-stocks',
    'promoter-pledging-red-flags',
    'related-party-transaction-detection',
    'demerger-and-bonus-issue-mechanics',
  ],
  'money-finance/tax/income-tax': [
    'old-vs-new-regime-calculator-walkthrough',
    'tds-sections-salaried-must-know',
    'advance-tax-instalment-schedule',
  ],
  'money-finance/tax/compliance': [
    'form-26as-and-ais-reconciliation',
    'got-a-tax-notice-next-steps',
  ],
  'money-finance/retirement/retirement-building': [
    'epf-withdrawal-rules-and-taxes',
    'nps-tier-1-vs-tier-2-decoded',
    'ppf-vs-elss-15-year-licence',
    'retirement-corpus-25x-30x-rule-india',
    'annuity-options-lic-of-utility',
    'vrs-and-gratuity-tax-treatment',
  ],
  'money-finance/loans-credit/home-loans': [
    'home-loan-emi-breakup-principal-interest',
    'prepay-home-loan-or-invest-the-surplus',
  ],
  'money-finance/loans-credit/credit-and-borrowing': [
    'credit-card-bill-cycle-math-minimum-due-trap',
    'personal-loan-vs-gold-loan-cost',
    'buy-now-pay-later-bnpl-fine-print',
  ],
  'money-finance/loans-credit/credit-reports': [
    'cibil-score-mechanics-factors',
    'cibil-free-annual-report',
    'credit-score-build-at-22-cibil-mechanics',
  ],
  'money-finance/gold/gold-in-india': [
    'digital-gold-vs-etf-vs-physical',
    'sgb-2-5-interest-and-tax-freedom',
    'gold-monetisation-scheme-gms',
    'gold-sgb-etf-jewellery-allocation',
  ],
  'money-finance/real-estate/property-decisions': [
    'rera-what-it-protects-and-does-not',
    'land-title-due-diligence-encumbrance',
    'rental-yield-reality-check-india',
    'rental-income-tax-house-property-arithmetic',
  ],
  'money-finance/alternatives/alternative-assets': [
    'crypto-tax-30-percent-vda-india',
    'pms-vs-aif-minimum-tickets',
    'invoice-discounting-platforms-returns',
    'fractional-real-estate-platforms',
    'startup-equity-esop-valuation-truth',
    'whisky-wine-crowdfunding-platforms',
    '32-avenues-20-percent-returns-compared',
  ],
  'money-finance/nri/nri-money': [
    'nre-vs-nro-accounts-explained',
    'nri-tax-status-rnor-window',
    'tds-on-nro-interest-and-rent',
    'lrs-remittances-250k-usd',
    'dtaa-benefit-form-10f',
  ],
  'money-finance/money-tools/tracking-and-audit': [
    'excel-vs-apps-tracking-net-worth',
    'fear-greed-index-api-tickertape',
    'portfolio-rebalancing-spreadsheet-method',
    'two-year-audit-your-own-portfolio',
  ],
  'work-career/early-career/first-salary': [
    'first-salary-allocation-system',
    'lifestyle-inflation-50-percent-raise-rule',
    'lifestyle-inflation-early-career',
    'career-break-financial-plan-sabbatical',
  ],
  'work-career/early-career/student-money': [
    'student-budget-hostel-pg-flat-costs',
    'student-investing-500-sip-minor-accounts',
  ],
  'business/side-income/creator-and-service-income': [
    'youtube-creator-income-tax-gst',
    'selling-online-marketplace-gst-tcs-compliance',
  ],
  'business/small-business/business-compliance': [
    'freelance-income-tax-44ada-presumptive-gst',
    'gst-registration-side-income-threshold',
  ],
  'health-insurance/health-insurance/health-cover': [
    'health-insurance-room-rent-capping',
    'waiting-periods-health-insurance',
    'super-topup-health-plans',
    'riders-worth-buying-and-worthless-ones',
  ],
  'health-insurance/life-insurance/life-cover': ['term-insurance-claim-rejection-reasons'],
  'health-insurance/motor-insurance/motor-cover': ['motor-insurance-zero-dep-vs-comprehensive'],
  'home-family/marriage-money/marriage-and-money': [
    'marriage-money-conversations-before',
    'joint-accounts-or-not-india',
    'spousal-contribution-salary-gap-plan',
    'money-in-marriage-prenup-joint-accounts',
  ],
  'home-family/family-money/family-dependants': [
    'pocket-money-teaching-money-habits',
    'supporting-parents-financially-boundaries',
  ],
  'home-family/women-money/women-and-money': [
    'financial-independence-women-own-account-infrastructure',
    'single-woman-financial-playbook',
  ],
  'home-family/inheritance/inheritance-and-succession': [
    'stridhan-inheritance-womens-property-rights',
    'nri-demise-nomination-poa-power-of-attorney',
  ],
  'law-rights-fraud/scams-fraud/scam-playbooks': [
    'digital-arrest-scam-playbook',
    'kyc-expiry-call-fraud',
    'apk-file-whatsapp-forward-scam',
    'fake-customer-care-numbers-google-ads',
    'ponzi-anatomy-red-flags-india',
    'telegram-stock-tips-groups',
  ],
  'law-rights-fraud/financial-crime/grey-zone-finance': [
    'cash-salary-unrecorded-employment',
    'benami-property-act-prohibition',
    'hawala-deals-informal-fx',
    'round-tripping-shells-explained',
    'gst-input-credit-fraud-patterns',
    'mule-accounts-renting-your-bank-account',
  ],
  'education-learning/education-financing/paying-for-education': [
    'education-loan-moratorium-80e-collateral',
    'kids-education-corpus-planning',
  ],
  'civic-public-services/government-portals/official-portals': ['official-portals-bookmark-list'],
};

export function targetSeries(track, slug) {
  return SERIES_OVERRIDES[slug] ?? SERIES_BY_TRACK[track] ?? '';
}
