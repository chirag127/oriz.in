import { describe, expect, it } from 'vitest';
import {
  buildAmortization,
  calculateCagr,
  calculateCompound,
  calculateLoan,
  calculateSip,
  loanPayment,
} from '../src/lib/finance';

describe('loan mathematics', () => {
  it('calculates a standard fixed-rate payment', () => {
    expect(loanPayment(1200, 12, 12)).toBeCloseTo(106.62, 1);
    expect(loanPayment(1200, 0, 12)).toBe(100);
  });

  it('reports total payment and interest', () => {
    const result = calculateLoan(100_000, 8, 120);
    expect(result.months).toBe(120);
    expect(result.monthlyPayment).toBeGreaterThan(1000);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalPayment).toBeCloseTo(result.monthlyPayment * 120, 6);
  });

  it('builds an amortization schedule that ends at zero', () => {
    const schedule = buildAmortization(1200, 12, 12);
    expect(schedule).toHaveLength(12);
    expect(schedule.at(-1)?.balance).toBe(0);
    expect(schedule.reduce((sum, row) => sum + row.principal, 0)).toBeCloseTo(
      1200,
      0,
    );
    expect(schedule[0]?.interest).toBeCloseTo(12, 2);
  });

  it('rejects invalid terms and rates', () => {
    expect(() => loanPayment(-1, 5, 12)).toThrow();
    expect(() => loanPayment(1000, -1, 12)).toThrow();
    expect(() => loanPayment(1000, 5, 0)).toThrow();
    expect(() => loanPayment(1000, 5, 12.5)).toThrow();
  });
});

describe('compound interest', () => {
  it('matches annual compounding', () => {
    const result = calculateCompound({
      principal: 1000,
      annualRatePercent: 10,
      years: 2,
      compoundsPerYear: 1,
      contributionPerPeriod: 0,
    });
    expect(result.futureValue).toBeCloseTo(1210, 6);
    expect(result.totalInterest).toBeCloseTo(210, 6);
    expect(result.schedule).toHaveLength(2);
  });

  it('handles monthly compounding and contributions', () => {
    const result = calculateCompound({
      principal: 1000,
      annualRatePercent: 12,
      years: 1,
      compoundsPerYear: 12,
      contributionPerPeriod: 100,
    });
    expect(result.futureValue).toBeCloseTo(1000 * 1.01 ** 12 + 100 * ((1.01 ** 12 - 1) / 0.01), 4);
    expect(result.totalContributed).toBe(2200);
  });

  it('handles a zero rate', () => {
    const result = calculateCompound({
      principal: 500,
      annualRatePercent: 0,
      years: 1,
      compoundsPerYear: 12,
      contributionPerPeriod: 100,
    });
    expect(result.futureValue).toBe(1700);
    expect(result.totalInterest).toBe(0);
  });
});

describe('SIP and CAGR', () => {
  it('calculates a monthly SIP with start-of-month contributions', () => {
    const result = calculateSip({
      monthlyInvestment: 1000,
      annualReturnPercent: 12,
      years: 1,
    });
    expect(result.totalInvested).toBe(12_000);
    expect(result.futureValue).toBeCloseTo(12_809.33, 1);
    expect(result.futureValue).toBeGreaterThan(result.totalInvested);
  });

  it('handles a zero-return SIP', () => {
    const result = calculateSip({
      monthlyInvestment: 500,
      annualReturnPercent: 0,
      years: 2,
    });
    expect(result.futureValue).toBe(12_000);
    expect(result.totalGains).toBe(0);
  });

  it('calculates compound annual growth rate', () => {
    expect(calculateCagr(100, 200, 2)).toBeCloseTo(41.421, 2);
    expect(calculateCagr(100, 50, 1)).toBeCloseTo(-50, 6);
    expect(() => calculateCagr(0, 10, 1)).toThrow();
    expect(() => calculateCagr(100, 200, 0)).toThrow();
  });
});

describe('India-specific finance helpers', () => {
  it('calculates the emergency-fund gap and coverage', async () => {
    const { calculateEmergencyFund } = await import('../src/lib/finance');
    const result = calculateEmergencyFund({
      monthlyEssentialExpenses: 60000,
      months: 6,
      existingCorpus: 120000,
      monthlySavings: 20000,
    });
    expect(result.targetCorpus).toBe(360000);
    expect(result.gap).toBe(240000);
    expect(result.coverageMonths).toBe(2);
    expect(result.monthsToClose).toBe(12);
    expect(result.percentCovered).toBeCloseTo(33.333, 2);
  });

  it('reports a fully funded reserve and an unset contribution', async () => {
    const { calculateEmergencyFund } = await import('../src/lib/finance');
    const funded = calculateEmergencyFund({
      monthlyEssentialExpenses: 50000,
      months: 3,
      existingCorpus: 200000,
      monthlySavings: 0,
    });
    expect(funded.gap).toBe(0);
    expect(funded.monthsToClose).toBe(0);
    const incomplete = calculateEmergencyFund({
      monthlyEssentialExpenses: 50000,
      months: 6,
      existingCorpus: 0,
      monthlySavings: 0,
    });
    expect(incomplete.monthsToClose).toBeNull();
  });

  it('shows that extra monthly payments reduce interest and term', async () => {
    const { calculatePrepayment } = await import('../src/lib/finance');
    const baseline = calculatePrepayment({
      principal: 5000000,
      annualRatePercent: 8.5,
      months: 240,
      extraMonthlyPayment: 0,
    });
    const accelerated = calculatePrepayment({
      principal: 5000000,
      annualRatePercent: 8.5,
      months: 240,
      extraMonthlyPayment: 10000,
    });
    expect(baseline.payoffMonths).toBe(240);
    expect(baseline.interestSaved).toBe(0);
    expect(accelerated.payoffMonths).toBeLessThan(240);
    expect(accelerated.interestSaved).toBeGreaterThan(0);
    expect(accelerated.totalInterest).toBeLessThan(baseline.baseTotalInterest);
    expect(accelerated.totalPayments).toBeGreaterThan(0);
    expect(accelerated.schedule.at(-1)?.balance).toBe(0);
  });

  it('rejects invalid emergency and prepayment inputs', async () => {
    const { calculateEmergencyFund, calculatePrepayment } = await import('../src/lib/finance');
    expect(() =>
      calculateEmergencyFund({
        monthlyEssentialExpenses: 0,
        months: 6,
        existingCorpus: 0,
        monthlySavings: 0,
      }),
    ).toThrow();
    expect(() =>
      calculatePrepayment({
        principal: 1000000,
        annualRatePercent: 8.5,
        months: 0,
        extraMonthlyPayment: 0,
      }),
    ).toThrow();
  });
});
