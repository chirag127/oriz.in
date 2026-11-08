import type { CalculatorSlug } from '../data/tools';
import {
  buildAmortization,
  calculateCagr,
  calculateCompound,
  calculateEmergencyFund,
  calculateLoan,
  calculatePrepayment,
  calculateSip,
  COMPOUNDING_OPTIONS,
} from './finance';
import {
  analyzeNumber,
  calculateAspectRatio,
  calculatePercentage,
  formatMoney,
  formatNumber,
  formatPercent,
  type PercentageMode,
} from './math';
import { parseNumberList, summarize } from './stats';
import { sampleIntegers } from './random';

export interface CalculatorField {
  name: string;
  label: string;
  type: 'number' | 'select' | 'textarea' | 'text';
  defaultValue: string;
  optional?: boolean;
  min?: number;
  max?: number;
  step?: number | 'any';
  placeholder?: string;
  help?: string;
  suffix?: string;
  options?: { value: string; label: string }[];
}

export interface CalculatorHeadline {
  label: string;
  value: string;
  hint?: string;
}

export interface CalculatorRow {
  label: string;
  value: string;
  hint?: string;
}

export interface CalculatorTable {
  caption?: string;
  columns: string[];
  rows: (string | number)[][];
  downloadName?: string;
}

export interface CalculatorOutput {
  headline: CalculatorHeadline[];
  rows?: CalculatorRow[];
  table?: CalculatorTable;
  notes?: string[];
  textOutput?: { label: string; value: string };
}

export interface CalculatorConfig {
  slug: CalculatorSlug;
  fields: CalculatorField[];
  calculate: (values: Record<string, string>) => CalculatorOutput;
}

function requiredNumber(
  values: Record<string, string>,
  name: string,
  label: string,
): number {
  const raw = values[name]?.trim() ?? '';
  if (!raw) throw new Error(`${label} is required.`);
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new Error(`${label} must be a valid number.`);
  return value;
}

function optionalNumber(
  values: Record<string, string>,
  name: string,
  label: string,
): number | undefined {
  const raw = values[name]?.trim() ?? '';
  if (!raw) return undefined;
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new Error(`${label} must be a valid number.`);
  return value;
}

function bounded(
  value: number,
  label: string,
  min: number,
  max: number,
): number {
  if (value < min || value > max) {
    throw new Error(`${label} must be between ${formatNumber(min)} and ${formatNumber(max)}.`);
  }
  return value;
}

function integer(value: number, label: string): number {
  if (!Number.isInteger(value)) throw new Error(`${label} must be a whole number.`);
  return value;
}

function money(value: number): string {
  return formatMoney(value);
}

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function rupees(value: number): string {
  return rupeeFormatter.format(value);
}

function yearsTableCaption(count: number): string {
  return `Year-by-year projection (${count} ${count === 1 ? 'year' : 'years'})`;
}

export const CALCULATORS: Record<CalculatorSlug, CalculatorConfig> = {
  percentage: {
    slug: 'percentage',
    fields: [
      {
        name: 'mode',
        label: 'Question',
        type: 'select',
        defaultValue: 'of',
        options: [
          { value: 'of', label: 'What is A% of B?' },
          { value: 'is-what-percent', label: 'A is what percent of B?' },
          { value: 'change', label: 'Percent change from A to B' },
        ],
      },
      { name: 'first', label: 'Value A', type: 'number', defaultValue: '25', step: 0.01 },
      { name: 'second', label: 'Value B', type: 'number', defaultValue: '200', step: 0.01 },
    ],
    calculate(values) {
      const mode = (values.mode ?? 'of') as PercentageMode;
      const result = calculatePercentage(
        mode,
        requiredNumber(values, 'first', 'Value A'),
        requiredNumber(values, 'second', 'Value B'),
      );
      const headlineLabel =
        mode === 'of'
          ? `${formatNumber(Number(values.first))}% of ${formatNumber(Number(values.second))}`
          : mode === 'is-what-percent'
            ? 'A is this percent of B'
            : 'Percentage change';
      return {
        headline: [
          {
            label: headlineLabel,
            value: `${formatNumber(result.value, { maxFractionDigits: 4 })}${result.suffix}`,
          },
        ],
        rows: [
          { label: 'Formula', value: result.formula },
          ...(result.note ? [{ label: 'Direction', value: result.note }] : []),
        ],
        notes: ['Percentage change compares against the absolute value of the original number.'],
      };
    },
  },
  'compound-interest': {
    slug: 'compound-interest',
    fields: [
      { name: 'principal', label: 'Starting balance', type: 'number', defaultValue: '10000', min: 0, step: 100 },
      { name: 'rate', label: 'Annual interest rate', type: 'number', defaultValue: '7', min: 0, max: 100, step: 0.01, suffix: '%' },
      { name: 'years', label: 'Term in years', type: 'number', defaultValue: '10', min: 1, max: 80, step: 1 },
      {
        name: 'frequency',
        label: 'Compounding',
        type: 'select',
        defaultValue: '12',
        options: COMPOUNDING_OPTIONS.map((option) => ({
          value: String(option.value),
          label: option.label,
        })),
      },
      {
        name: 'contribution',
        label: 'Contribution each period',
        type: 'number',
        defaultValue: '100',
        min: 0,
        step: 10,
        help: 'Applied at the end of each compounding period.',
      },
    ],
    calculate(values) {
      const years = integer(
        bounded(requiredNumber(values, 'years', 'Term in years'), 'Term in years', 1, 80),
        'Term in years',
      );
      const result = calculateCompound({
        principal: requiredNumber(values, 'principal', 'Starting balance'),
        annualRatePercent: bounded(requiredNumber(values, 'rate', 'Annual interest rate'), 'Annual interest rate', 0, 100),
        years,
        compoundsPerYear: Number(values.frequency ?? '12'),
        contributionPerPeriod: requiredNumber(values, 'contribution', 'Contribution each period'),
      });
      return {
        headline: [
          { label: 'Projected balance', value: money(result.futureValue) },
          { label: 'Total contributed', value: money(result.totalContributed) },
          { label: 'Interest earned', value: money(result.totalInterest) },
        ],
        table: {
          caption: yearsTableCaption(years),
          columns: ['Year', 'Contributions', 'Interest', 'Balance'],
          rows: result.schedule.map((row) => [
            row.year,
            money(row.contributions),
            money(row.interest),
            money(row.balance),
          ]),
          downloadName: 'compound-interest-schedule.csv',
        },
        notes: [
          'The annual rate is nominal and divided evenly across compounding periods.',
          'Contributions occur at the end of each period. Taxes, fees, inflation, and variable returns are excluded.',
          'Amounts are unitless; interpret them in your own currency.',
        ],
      };
    },
  },
  'loan-emi': {
    slug: 'loan-emi',
    fields: [
      { name: 'principal', label: 'Loan amount', type: 'number', defaultValue: '250000', min: 1, step: 1000 },
      { name: 'rate', label: 'Annual interest rate', type: 'number', defaultValue: '8.5', min: 0, max: 100, step: 0.01, suffix: '%' },
      { name: 'months', label: 'Term in months', type: 'number', defaultValue: '240', min: 1, max: 600, step: 1 },
    ],
    calculate(values) {
      const months = integer(
        bounded(requiredNumber(values, 'months', 'Term in months'), 'Term in months', 1, 600),
        'Term in months',
      );
      const result = calculateLoan(
        requiredNumber(values, 'principal', 'Loan amount'),
        bounded(requiredNumber(values, 'rate', 'Annual interest rate'), 'Annual interest rate', 0, 100),
        months,
      );
      const schedule = buildAmortization(
        requiredNumber(values, 'principal', 'Loan amount'),
        bounded(requiredNumber(values, 'rate', 'Annual interest rate'), 'Annual interest rate', 0, 100),
        months,
      );
      const yearly: (string | number)[][] = [];
      for (let start = 0; start < schedule.length; start += 12) {
        const chunk = schedule.slice(start, start + 12);
        const year = Math.floor(start / 12) + 1;
        yearly.push([
          year,
          money(chunk.reduce((sum, row) => sum + row.payment, 0)),
          money(chunk.reduce((sum, row) => sum + row.interest, 0)),
          money(chunk.reduce((sum, row) => sum + row.principal, 0)),
          money(chunk.at(-1)?.balance ?? 0),
        ]);
      }
      return {
        headline: [
          { label: 'Monthly payment', value: money(result.monthlyPayment) },
          { label: 'Total repayment', value: money(result.totalPayment) },
          { label: 'Total interest', value: money(result.totalInterest) },
        ],
        rows: [
          { label: 'Loan term', value: `${months} months` },
          { label: 'Interest share of total payments', value: formatPercent((result.totalInterest / result.totalPayment) * 100) },
        ],
        table: {
          caption: 'Annual summary',
          columns: ['Year', 'Payments', 'Interest', 'Principal', 'Ending balance'],
          rows: yearly,
          downloadName: 'loan-emi-yearly-summary.csv',
        },
        notes: [
          'Assumes a fixed rate, equal monthly payments, and no fees or prepayments.',
          'Uses the nominal annual rate divided by twelve; this is not an APR calculation.',
          'Amounts are unitless; interpret them in your own currency.',
        ],
      };
    },
  },
  amortization: {
    slug: 'amortization',
    fields: [
      { name: 'principal', label: 'Loan amount', type: 'number', defaultValue: '250000', min: 1, step: 1000 },
      { name: 'rate', label: 'Annual interest rate', type: 'number', defaultValue: '8.5', min: 0, max: 100, step: 0.01, suffix: '%' },
      { name: 'months', label: 'Term in months', type: 'number', defaultValue: '240', min: 1, max: 600, step: 1 },
    ],
    calculate(values) {
      const principal = requiredNumber(values, 'principal', 'Loan amount');
      const rate = bounded(requiredNumber(values, 'rate', 'Annual interest rate'), 'Annual interest rate', 0, 100);
      const months = integer(
        bounded(requiredNumber(values, 'months', 'Term in months'), 'Term in months', 1, 600),
        'Term in months',
      );
      const loan = calculateLoan(principal, rate, months);
      const schedule = buildAmortization(principal, rate, months);
      return {
        headline: [
          { label: 'Monthly payment', value: money(loan.monthlyPayment) },
          { label: 'Total interest', value: money(loan.totalInterest) },
          { label: 'Final balance', value: money(schedule.at(-1)?.balance ?? 0) },
        ],
        table: {
          caption: `Full amortization schedule (${months} months)`,
          columns: ['Month', 'Payment', 'Interest', 'Principal', 'Balance'],
          rows: schedule.map((row) => [
            row.month,
            money(row.payment),
            money(row.interest),
            money(row.principal),
            money(row.balance),
          ]),
          downloadName: 'loan-amortization-schedule.csv',
        },
        notes: [
          'Assumes a fixed rate, equal monthly payments, and no fees or extra payments.',
          'Displayed values are rounded to two decimals; the final row is adjusted to close the balance.',
          'This is an educational schedule, not a lender statement or payoff quote.',
        ],
      };
    },
  },
  cagr: {
    slug: 'cagr',
    fields: [
      { name: 'start', label: 'Starting value', type: 'number', defaultValue: '100000', min: 0.01, step: 100 },
      { name: 'end', label: 'Ending value', type: 'number', defaultValue: '250000', min: 0, step: 100 },
      { name: 'years', label: 'Time span in years', type: 'number', defaultValue: '5', min: 0.01, max: 100, step: 0.1 },
    ],
    calculate(values) {
      const start = requiredNumber(values, 'start', 'Starting value');
      const end = requiredNumber(values, 'end', 'Ending value');
      const years = bounded(requiredNumber(values, 'years', 'Time span in years'), 'Time span in years', 0.01, 100);
      const cagr = calculateCagr(start, end, years);
      return {
        headline: [
          { label: 'Compound annual growth rate', value: formatPercent(cagr) },
        ],
        rows: [
          { label: 'Growth multiple', value: `${formatNumber(end / start, { maxFractionDigits: 3 })}×` },
          { label: 'Total change', value: formatPercent(((end - start) / start) * 100) },
          { label: 'Formula', value: '(end ÷ start)^(1 ÷ years) − 1' },
        ],
        notes: [
          'CAGR smooths the path into one constant rate; actual values may have been volatile.',
          'No adjustment is made for inflation, taxes, fees, or contributions.',
        ],
      };
    },
  },
  sip: {
    slug: 'sip',
    fields: [
      { name: 'monthly', label: 'Monthly investment', type: 'number', defaultValue: '10000', min: 1, step: 500 },
      { name: 'rate', label: 'Expected annual return', type: 'number', defaultValue: '12', min: 0, max: 100, step: 0.01, suffix: '%' },
      { name: 'years', label: 'Term in years', type: 'number', defaultValue: '10', min: 1, max: 50, step: 1 },
    ],
    calculate(values) {
      const years = integer(
        bounded(requiredNumber(values, 'years', 'Term in years'), 'Term in years', 1, 50),
        'Term in years',
      );
      const result = calculateSip({
        monthlyInvestment: requiredNumber(values, 'monthly', 'Monthly investment'),
        annualReturnPercent: bounded(requiredNumber(values, 'rate', 'Expected annual return'), 'Expected annual return', 0, 100),
        years,
      });
      return {
        headline: [
          { label: 'Projected value', value: money(result.futureValue) },
          { label: 'Total invested', value: money(result.totalInvested) },
          { label: 'Estimated gains', value: money(result.totalGains) },
        ],
        table: {
          caption: yearsTableCaption(years),
          columns: ['Year', 'Invested', 'Gains', 'Value'],
          rows: result.schedule.map((row) => [
            row.year,
            money(row.invested),
            money(row.gains),
            money(row.value),
          ]),
          downloadName: 'sip-projection.csv',
        },
        notes: [
          'Assumes contributions at the start of each month and a constant nominal annual return.',
          'Market returns vary. This projection is not a guarantee or a prediction.',
          'Fees, exit loads, taxes, and inflation are excluded.',
        ],
      };
    },
  },
  'aspect-ratio': {
    slug: 'aspect-ratio',
    fields: [
      { name: 'width', label: 'Original width', type: 'number', defaultValue: '1920', min: 0.01, step: 1 },
      { name: 'height', label: 'Original height', type: 'number', defaultValue: '1080', min: 0.01, step: 1 },
      {
        name: 'newWidth',
        label: 'New width (optional)',
        type: 'number',
        defaultValue: '',
        optional: true,
        min: 0.01,
        step: 1,
        placeholder: 'e.g. 1280',
      },
      {
        name: 'newHeight',
        label: 'New height (optional)',
        type: 'number',
        defaultValue: '',
        optional: true,
        min: 0.01,
        step: 1,
        placeholder: 'Calculated if height is empty',
      },
    ],
    calculate(values) {
      const result = calculateAspectRatio(
        requiredNumber(values, 'width', 'Original width'),
        requiredNumber(values, 'height', 'Original height'),
        optionalNumber(values, 'newWidth', 'New width'),
        optionalNumber(values, 'newHeight', 'New height'),
      );
      const rows: CalculatorRow[] = [
        { label: 'Decimal ratio', value: formatNumber(result.decimal, { maxFractionDigits: 4 }) },
      ];
      if (result.scaledWidth !== undefined && result.scaledHeight !== undefined) {
        rows.push(
          { label: 'Scaled width', value: formatNumber(result.scaledWidth, { maxFractionDigits: 3 }) },
          { label: 'Scaled height', value: formatNumber(result.scaledHeight, { maxFractionDigits: 3 }) },
        );
      }
      if (result.mismatch) {
        rows.push({
          label: 'Warning',
          value: 'The supplied target dimensions do not match the original ratio.',
        });
      }
      return {
        headline: [{ label: 'Simplified ratio', value: result.simplified }],
        rows,
        notes: [
          'Scaled dimensions are mathematical values; round to whole pixels when producing assets.',
          'The calculator does not crop or resize files.',
        ],
      };
    },
  },
  statistics: {
    slug: 'statistics',
    fields: [
      {
        name: 'values',
        label: 'Numbers',
        type: 'textarea',
        defaultValue: '12, 15, 9, 22, 15, 18, 30, 15, 24, 11',
        help: 'Separate values with commas, spaces, or new lines.',
      },
    ],
    calculate(values) {
      const data = parseNumberList(values.values ?? '');
      const summary = summarize(data);
      return {
        headline: [
          { label: 'Count', value: formatNumber(summary.count) },
          { label: 'Mean', value: formatNumber(summary.mean, { maxFractionDigits: 6 }) },
          { label: 'Median', value: formatNumber(summary.median, { maxFractionDigits: 6 }) },
        ],
        rows: [
          { label: 'Sum', value: formatNumber(summary.sum, { maxFractionDigits: 6 }) },
          { label: 'Minimum', value: formatNumber(summary.min, { maxFractionDigits: 6 }) },
          { label: 'Maximum', value: formatNumber(summary.max, { maxFractionDigits: 6 }) },
          { label: 'Range', value: formatNumber(summary.range, { maxFractionDigits: 6 }) },
          { label: 'Mode', value: summary.modes.length ? summary.modes.map((value) => formatNumber(value, { maxFractionDigits: 6 })).join(', ') : 'No repeated values' },
          { label: 'Q1', value: formatNumber(summary.q1, { maxFractionDigits: 6 }) },
          { label: 'Q3', value: formatNumber(summary.q3, { maxFractionDigits: 6 }) },
          { label: 'IQR', value: formatNumber(summary.iqr, { maxFractionDigits: 6 }) },
          {
            label: 'Sample variance',
            value:
              summary.varianceSample === null
                ? 'Requires at least two values'
                : formatNumber(summary.varianceSample, { maxFractionDigits: 6 }),
          },
          {
            label: 'Sample standard deviation',
            value:
              summary.standardDeviationSample === null
                ? 'Requires at least two values'
                : formatNumber(summary.standardDeviationSample, { maxFractionDigits: 6 }),
          },
          { label: 'Population variance', value: formatNumber(summary.variancePopulation, { maxFractionDigits: 6 }) },
          { label: 'Population standard deviation', value: formatNumber(summary.standardDeviationPopulation, { maxFractionDigits: 6 }) },
        ],
        notes: [
          'Quartiles use linear interpolation between adjacent sorted values.',
          'Sample statistics divide by n − 1; population statistics divide by n.',
        ],
      };
    },
  },
  'scientific-notation': {
    slug: 'scientific-notation',
    fields: [
      {
        name: 'number',
        label: 'Number',
        type: 'text',
        defaultValue: '3.2e-5',
        step: 'any',
        help: 'Decimal or e-notation, such as 0.000032 or 3.2e-5.',
      },
      {
        name: 'precision',
        label: 'Display precision',
        type: 'select',
        defaultValue: '8',
        options: [
          { value: '4', label: '4 significant digits' },
          { value: '6', label: '6 significant digits' },
          { value: '8', label: '8 significant digits' },
          { value: '10', label: '10 significant digits' },
        ],
      },
    ],
    calculate(values) {
      const result = analyzeNumber(
        values.number ?? '',
        Number(values.precision ?? '8'),
      );
      return {
        headline: [{ label: 'Scientific notation', value: result.scientific }],
        rows: [
          { label: 'E notation', value: result.eNotation },
          { label: 'Engineering notation', value: result.engineering },
          { label: 'Decimal', value: result.decimal },
          { label: 'Exponent', value: String(result.exponent) },
          { label: 'Significant figures detected', value: String(result.significantFigures) },
        ],
        notes: [
          'Values are parsed as JavaScript floating-point numbers, so binary rounding limits apply.',
          'Significant figures are inferred from the normalized numeric value, not from a measured input.',
        ],
      };
    },
  },
  'random-sample': {
    slug: 'random-sample',
    fields: [
      { name: 'min', label: 'Minimum (inclusive)', type: 'number', defaultValue: '1', step: 1 },
      { name: 'max', label: 'Maximum (inclusive)', type: 'number', defaultValue: '100', step: 1 },
      { name: 'count', label: 'How many values', type: 'number', defaultValue: '10', min: 1, max: 1000, step: 1 },
      {
        name: 'unique',
        label: 'Duplicates',
        type: 'select',
        defaultValue: 'yes',
        options: [
          { value: 'yes', label: 'No duplicates' },
          { value: 'no', label: 'Allow duplicates' },
        ],
      },
    ],
    calculate(values) {
      const min = integer(requiredNumber(values, 'min', 'Minimum'), 'Minimum');
      const max = integer(requiredNumber(values, 'max', 'Maximum'), 'Maximum');
      const count = integer(
        bounded(requiredNumber(values, 'count', 'How many values'), 'How many values', 1, 1000),
        'How many values',
      );
      const unique = (values.unique ?? 'yes') === 'yes';
      const result = sampleIntegers({ min, max, count, unique });
      return {
        headline: [
          { label: 'Generated values', value: formatNumber(result.length) },
          { label: 'Inclusive range', value: `${formatNumber(min)} to ${formatNumber(max)}` },
        ],
        rows: [
          { label: 'Duplicates', value: unique ? 'Not allowed' : 'Allowed' },
          { label: 'Random source', value: 'Web Crypto rejection sampling' },
        ],
        textOutput: { label: 'Result', value: result.join(', ') },
        notes: [
          'Uses the browser’s cryptographic random source with rejection sampling to reduce modulo bias.',
          'This is not a lottery, gambling service, or audited hardware random generator.',
        ],
      };
    },
  },

  'emergency-fund': {
    slug: 'emergency-fund',
    fields: [
      {
        name: 'expenses',
        label: 'Monthly essential expenses (₹)',
        type: 'number',
        defaultValue: '45000',
        min: 1,
        step: 1000,
        help: 'Rent, food, utilities, insurance, school fees, and debt payments—not discretionary spending.',
      },
      {
        name: 'months',
        label: 'Target cover (months)',
        type: 'number',
        defaultValue: '6',
        min: 1,
        max: 60,
        step: 1,
      },
      {
        name: 'corpus',
        label: 'Existing liquid corpus (₹)',
        type: 'number',
        defaultValue: '100000',
        min: 0,
        step: 1000,
        help: 'Savings account, overnight/liquid funds, and fixed deposits you can access quickly.',
      },
      {
        name: 'savings',
        label: 'Monthly contribution (₹)',
        type: 'number',
        defaultValue: '15000',
        min: 0,
        step: 1000,
      },
    ],
    calculate(values) {
      const expenses = requiredNumber(values, 'expenses', 'Monthly essential expenses');
      const months = integer(
        bounded(requiredNumber(values, 'months', 'Target cover'), 'Target cover', 1, 60),
        'Target cover',
      );
      const result = calculateEmergencyFund({
        monthlyEssentialExpenses: expenses,
        months,
        existingCorpus: requiredNumber(values, 'corpus', 'Existing liquid corpus'),
        monthlySavings: requiredNumber(values, 'savings', 'Monthly contribution'),
      });
      return {
        headline: [
          { label: 'Target corpus', value: rupees(result.targetCorpus) },
          {
            label: 'Current gap',
            value: result.gap === 0 ? 'Fully funded' : rupees(result.gap),
          },
          {
            label: 'Current cover',
            value: `${formatNumber(result.coverageMonths, { maxFractionDigits: 1 })} months`,
          },
        ],
        rows: [
          { label: 'Essential expenses', value: rupees(expenses) },
          { label: 'Target cover', value: `${months} months` },
          {
            label: 'Progress to target',
            value: formatPercent(result.percentCovered),
          },
          {
            label: 'Months to close the gap',
            value:
              result.monthsToClose === null
                ? 'Add a monthly contribution to estimate this'
                : result.monthsToClose === 0
                  ? 'No gap'
                  : `${result.monthsToClose} months`,
          },
        ],
        notes: [
          'This is an arithmetic estimate, not a recommendation about which savings products to use.',
          'It assumes the monthly contribution is actually available every month and does not model interest, tax, or inflation.',
          'Retirement accounts, property, and volatile investments are not treated as liquid emergency reserves by default.',
          'Households with a single income, dependants, or irregular income may want a larger buffer than the selected target.',
        ],
      };
    },
  },
  'loan-prepayment': {
    slug: 'loan-prepayment',
    fields: [
      {
        name: 'principal',
        label: 'Outstanding loan amount (₹)',
        type: 'number',
        defaultValue: '5000000',
        min: 1,
        step: 10000,
      },
      {
        name: 'rate',
        label: 'Annual interest rate',
        type: 'number',
        defaultValue: '8.5',
        min: 0,
        max: 100,
        step: 0.01,
        suffix: '%',
      },
      {
        name: 'months',
        label: 'Remaining term (months)',
        type: 'number',
        defaultValue: '240',
        min: 1,
        max: 600,
        step: 1,
      },
      {
        name: 'extra',
        label: 'Extra monthly payment (₹)',
        type: 'number',
        defaultValue: '10000',
        min: 0,
        step: 1000,
      },
    ],
    calculate(values) {
      const principal = requiredNumber(values, 'principal', 'Outstanding loan amount');
      const rate = bounded(requiredNumber(values, 'rate', 'Annual interest rate'), 'Annual interest rate', 0, 100);
      const months = integer(
        bounded(requiredNumber(values, 'months', 'Remaining term'), 'Remaining term', 1, 600),
        'Remaining term',
      );
      const extra = requiredNumber(values, 'extra', 'Extra monthly payment');
      const result = calculatePrepayment({
        principal,
        annualRatePercent: rate,
        months,
        extraMonthlyPayment: extra,
      });
      return {
        headline: [
          { label: 'Interest saved', value: rupees(result.interestSaved) },
          {
            label: 'New payoff time',
            value: `${result.payoffMonths} months`,
          },
          { label: 'Total interest with extra payment', value: rupees(result.totalInterest) },
        ],
        rows: [
          { label: 'Original monthly EMI', value: rupees(result.basePayment) },
          { label: 'Monthly outlay with extra payment', value: rupees(result.newPayment) },
          { label: 'Original total interest', value: rupees(result.baseTotalInterest) },
          { label: 'Months saved', value: `${result.monthsSaved} months` },
        ],
        table: {
          caption: 'Accelerated repayment schedule',
          columns: ['Year', 'Payments', 'Interest', 'Principal', 'Balance'],
          rows: result.schedule.map((row) => [
            row.year,
            rupees(row.payments),
            rupees(row.interest),
            rupees(row.principal),
            rupees(row.balance),
          ]),
          downloadName: 'loan-prepayment-schedule.csv',
        },
        notes: [
          'Assumes a fixed rate, equal monthly payments, and the same extra payment every month.',
          'Prepayment fees, lender rounding, changing rates, and tax effects are not included.',
          'The monthly outlay must remain affordable alongside a fully funded emergency reserve; this is not a recommendation to prepay.',
        ],
      };
    },
  },

};
