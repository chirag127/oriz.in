export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  months: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function loanPayment(
  principal: number,
  annualRatePercent: number,
  months: number,
): number {
  assertPositiveFinite(principal, 'Loan amount');
  assertNonNegativeFinite(annualRatePercent, 'Annual interest rate');
  if (!Number.isFinite(months) || months <= 0) {
    throw new Error('Loan term must be a positive number of months.');
  }
  const periods = Math.round(months);
  if (periods !== months) {
    throw new Error('Loan term must be a whole number of months.');
  }

  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) return principal / periods;

  const growth = Math.pow(1 + monthlyRate, periods);
  return (principal * monthlyRate * growth) / (growth - 1);
}

export function calculateLoan(
  principal: number,
  annualRatePercent: number,
  months: number,
): LoanResult {
  const payment = loanPayment(principal, annualRatePercent, months);
  const totalPayment = payment * months;
  return {
    monthlyPayment: payment,
    totalPayment,
    totalInterest: totalPayment - principal,
    months,
  };
}

export function buildAmortization(
  principal: number,
  annualRatePercent: number,
  months: number,
): AmortizationRow[] {
  const payment = loanPayment(principal, annualRatePercent, months);
  const monthlyRate = annualRatePercent / 100 / 12;
  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate;
    let principalPart = payment - interest;
    let actualPayment = payment;

    if (month === months || principalPart > balance) {
      principalPart = balance;
      actualPayment = balance + interest;
    }

    balance = Math.max(0, balance - principalPart);
    rows.push({
      month,
      payment: round2(actualPayment),
      interest: round2(interest),
      principal: round2(principalPart),
      balance: round2(balance),
    });
  }

  return rows;
}

export interface CompoundInput {
  principal: number;
  annualRatePercent: number;
  years: number;
  compoundsPerYear: number;
  contributionPerPeriod: number;
}

export interface CompoundRow {
  year: number;
  contributions: number;
  interest: number;
  balance: number;
}

export interface CompoundResult {
  futureValue: number;
  totalContributed: number;
  totalInterest: number;
  schedule: CompoundRow[];
}

const COMPOUND_FREQUENCIES = new Set([1, 2, 4, 12, 52, 365]);

export function calculateCompound(input: CompoundInput): CompoundResult {
  assertNonNegativeFinite(input.principal, 'Starting balance');
  assertNonNegativeFinite(input.annualRatePercent, 'Annual interest rate');
  assertNonNegativeFinite(input.contributionPerPeriod, 'Contribution');
  if (!Number.isFinite(input.years) || input.years <= 0 || input.years > 120) {
    throw new Error('Term must be between 1 and 120 years.');
  }
  if (!Number.isInteger(input.years)) {
    throw new Error('Term must be a whole number of years.');
  }
  if (!COMPOUND_FREQUENCIES.has(input.compoundsPerYear)) {
    throw new Error('Choose a supported compounding frequency.');
  }

  const periodsPerYear = input.compoundsPerYear;
  const rate = input.annualRatePercent / 100 / periodsPerYear;
  const schedule: CompoundRow[] = [];
  let previousBalance = input.principal;

  for (let year = 1; year <= input.years; year += 1) {
    const periods = year * periodsPerYear;
    const growth = Math.pow(1 + rate, periods);
    const contributionValue =
      rate === 0
        ? input.contributionPerPeriod * periods
        : input.contributionPerPeriod * ((growth - 1) / rate);
    const balance = input.principal * growth + contributionValue;
    const contributionThisYear =
      input.contributionPerPeriod * periodsPerYear;
    schedule.push({
      year,
      contributions: contributionThisYear,
      interest: balance - previousBalance - contributionThisYear,
      balance,
    });
    previousBalance = balance;
  }

  const futureValue = schedule.at(-1)?.balance ?? input.principal;
  const totalContributed =
    input.principal + input.contributionPerPeriod * input.years * periodsPerYear;

  return {
    futureValue,
    totalContributed,
    totalInterest: futureValue - totalContributed,
    schedule,
  };
}

export interface SipInput {
  monthlyInvestment: number;
  annualReturnPercent: number;
  years: number;
}

export interface SipRow {
  year: number;
  invested: number;
  gains: number;
  value: number;
}

export interface SipResult {
  futureValue: number;
  totalInvested: number;
  totalGains: number;
  schedule: SipRow[];
}

export function calculateSip(input: SipInput): SipResult {
  assertPositiveFinite(input.monthlyInvestment, 'Monthly investment');
  assertNonNegativeFinite(input.annualReturnPercent, 'Expected annual return');
  if (!Number.isInteger(input.years) || input.years <= 0 || input.years > 80) {
    throw new Error('Term must be between 1 and 80 whole years.');
  }

  const monthlyRate = input.annualReturnPercent / 100 / 12;
  const schedule: SipRow[] = [];

  for (let year = 1; year <= input.years; year += 1) {
    const months = year * 12;
    const futureValue =
      monthlyRate === 0
        ? input.monthlyInvestment * months
        : input.monthlyInvestment *
          ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate);
    const invested = input.monthlyInvestment * months;
    schedule.push({
      year,
      invested,
      gains: futureValue - invested,
      value: futureValue,
    });
  }

  const futureValue = schedule.at(-1)?.value ?? 0;
  const totalInvested = input.monthlyInvestment * input.years * 12;

  return {
    futureValue,
    totalInvested,
    totalGains: futureValue - totalInvested,
    schedule,
  };
}

export function calculateCagr(
  startingValue: number,
  endingValue: number,
  years: number,
): number {
  assertPositiveFinite(startingValue, 'Starting value');
  assertNonNegativeFinite(endingValue, 'Ending value');
  if (!Number.isFinite(years) || years <= 0) {
    throw new Error('Time span must be greater than zero years.');
  }
  if (startingValue <= 0) {
    throw new Error('Starting value must be greater than zero.');
  }
  return (Math.pow(endingValue / startingValue, 1 / years) - 1) * 100;
}

function assertPositiveFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be greater than zero.`);
  }
}

function assertNonNegativeFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be zero or greater.`);
  }
}

export const COMPOUNDING_OPTIONS = [
  { value: 1, label: 'Annually' },
  { value: 2, label: 'Semi-annually' },
  { value: 4, label: 'Quarterly' },
  { value: 12, label: 'Monthly' },
  { value: 52, label: 'Weekly' },
  { value: 365, label: 'Daily' },
] as const;

export interface EmergencyFundInput {
  monthlyEssentialExpenses: number;
  months: number;
  existingCorpus: number;
  monthlySavings: number;
}

export interface EmergencyFundResult {
  targetCorpus: number;
  gap: number;
  coverageMonths: number;
  monthsToClose: number | null;
  percentCovered: number;
}

export function calculateEmergencyFund(
  input: EmergencyFundInput,
): EmergencyFundResult {
  assertPositiveFinite(input.monthlyEssentialExpenses, 'Monthly essential expenses');
  assertNonNegativeFinite(input.existingCorpus, 'Existing corpus');
  assertNonNegativeFinite(input.monthlySavings, 'Monthly savings');
  if (!Number.isInteger(input.months) || input.months < 1 || input.months > 60) {
    throw new Error('Target coverage must be between 1 and 60 whole months.');
  }
  const targetCorpus = input.monthlyEssentialExpenses * input.months;
  const gap = Math.max(0, targetCorpus - input.existingCorpus);
  const coverageMonths = input.existingCorpus / input.monthlyEssentialExpenses;
  const monthsToClose =
    gap === 0 ? 0 : input.monthlySavings > 0 ? Math.ceil(gap / input.monthlySavings) : null;

  return {
    targetCorpus,
    gap,
    coverageMonths,
    monthsToClose,
    percentCovered: Math.min(100, (input.existingCorpus / targetCorpus) * 100),
  };
}

export interface PrepaymentInput {
  principal: number;
  annualRatePercent: number;
  months: number;
  extraMonthlyPayment: number;
}

export interface PrepaymentYearRow {
  year: number;
  payments: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface PrepaymentResult {
  basePayment: number;
  newPayment: number;
  baseTotalInterest: number;
  totalInterest: number;
  interestSaved: number;
  payoffMonths: number;
  monthsSaved: number;
  totalPayments: number;
  schedule: PrepaymentYearRow[];
}

function simulateRepayment(
  principal: number,
  annualRatePercent: number,
  months: number,
  extraMonthlyPayment: number,
): { interest: number; payoffMonths: number; totalPayments: number; schedule: PrepaymentYearRow[] } {
  const basePayment = loanPayment(principal, annualRatePercent, months);
  const monthlyRate = annualRatePercent / 100 / 12;
  let balance = principal;
  let interestTotal = 0;
  let paymentsTotal = 0;
  let payoffMonths = 0;
  const yearly: PrepaymentYearRow[] = [];
  let yearPayments = 0;
  let yearInterest = 0;
  let yearPrincipal = 0;

  for (let month = 1; month <= months && balance > 0.005; month += 1) {
    const interest = balance * monthlyRate;
    let payment = basePayment + extraMonthlyPayment;
    if (payment <= interest) {
      throw new Error('The monthly payment does not cover the interest at this rate.');
    }
    let principalPaid = payment - interest;
    if (principalPaid >= balance) {
      principalPaid = balance;
      payment = principalPaid + interest;
    }
    balance = Math.max(0, balance - principalPaid);
    interestTotal += interest;
    paymentsTotal += payment;
    payoffMonths = month;
    yearPayments += payment;
    yearInterest += interest;
    yearPrincipal += principalPaid;

    if (month % 12 === 0 || balance <= 0.005 || month === months) {
      yearly.push({
        year: Math.ceil(month / 12),
        payments: round2(yearPayments),
        interest: round2(yearInterest),
        principal: round2(yearPrincipal),
        balance: round2(balance),
      });
      yearPayments = 0;
      yearInterest = 0;
      yearPrincipal = 0;
    }
  }

  return {
    interest: interestTotal,
    payoffMonths,
    totalPayments: paymentsTotal,
    schedule: yearly,
  };
}

export function calculatePrepayment(input: PrepaymentInput): PrepaymentResult {
  assertPositiveFinite(input.principal, 'Loan amount');
  assertNonNegativeFinite(input.annualRatePercent, 'Annual interest rate');
  assertNonNegativeFinite(input.extraMonthlyPayment, 'Extra monthly payment');
  if (!Number.isInteger(input.months) || input.months < 1 || input.months > 600) {
    throw new Error('Loan term must be between 1 and 600 whole months.');
  }

  const baseline = simulateRepayment(
    input.principal,
    input.annualRatePercent,
    input.months,
    0,
  );
  const accelerated = simulateRepayment(
    input.principal,
    input.annualRatePercent,
    input.months,
    input.extraMonthlyPayment,
  );

  return {
    basePayment: loanPayment(input.principal, input.annualRatePercent, input.months),
    newPayment:
      loanPayment(input.principal, input.annualRatePercent, input.months) +
      input.extraMonthlyPayment,
    baseTotalInterest: baseline.interest,
    totalInterest: accelerated.interest,
    interestSaved: baseline.interest - accelerated.interest,
    payoffMonths: accelerated.payoffMonths,
    monthsSaved: input.months - accelerated.payoffMonths,
    totalPayments: accelerated.totalPayments,
    schedule: accelerated.schedule,
  };
}
