export interface SummaryStatistics {
  count: number;
  sum: number;
  mean: number;
  median: number;
  modes: number[];
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  varianceSample: number | null;
  standardDeviationSample: number | null;
  variancePopulation: number;
  standardDeviationPopulation: number;
}

export function parseNumberList(input: string): number[] {
  const tokens = input
    .split(/[\s,;]+/u)
    .map((token) => token.trim())
    .filter(Boolean);
  if (tokens.length === 0) {
    throw new Error('Enter at least one number.');
  }
  if (tokens.length > 100000) {
    throw new Error('Limit the list to 100,000 numbers.');
  }
  const values = tokens.map((token) => {
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/u.test(token)) {
      throw new Error(`“${token}” is not a valid number.`);
    }
    const value = Number(token);
    if (!Number.isFinite(value)) {
      throw new Error(`“${token}” is outside the supported numeric range.`);
    }
    return value;
  });
  return values;
}

export function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) throw new Error('Cannot calculate a percentile of no values.');
  if (p < 0 || p > 1) throw new Error('Percentile must be between 0 and 1.');
  if (sorted.length === 1) return sorted[0]!;
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower]! * (1 - weight) + sorted[upper]! * weight;
}

export function summarize(values: number[]): SummaryStatistics {
  if (values.length === 0) throw new Error('Enter at least one number.');
  if (values.length > 100000) throw new Error('Limit the list to 100,000 numbers.');
  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error('Every value must be finite.');
  }

  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((total, value) => total + value, 0);
  const mean = sum / count;
  const median =
    count % 2 === 1
      ? sorted[(count - 1) / 2]!
      : (sorted[count / 2 - 1]! + sorted[count / 2]!) / 2;

  const frequencies = new Map<number, number>();
  for (const value of sorted) {
    frequencies.set(value, (frequencies.get(value) ?? 0) + 1);
  }
  const highestFrequency = Math.max(...frequencies.values());
  const modes =
    highestFrequency <= 1
      ? []
      : [...frequencies.entries()]
          .filter(([, frequency]) => frequency === highestFrequency)
          .map(([value]) => value)
          .sort((a, b) => a - b);

  const squaredDifferences = sorted.reduce(
    (total, value) => total + (value - mean) ** 2,
    0,
  );
  const variancePopulation = squaredDifferences / count;
  const varianceSample = count > 1 ? squaredDifferences / (count - 1) : null;
  const q1 = percentile(sorted, 0.25);
  const q3 = percentile(sorted, 0.75);

  return {
    count,
    sum,
    mean,
    median,
    modes,
    min: sorted[0]!,
    max: sorted[count - 1]!,
    range: sorted[count - 1]! - sorted[0]!,
    q1,
    q3,
    iqr: q3 - q1,
    varianceSample,
    standardDeviationSample:
      varianceSample === null ? null : Math.sqrt(varianceSample),
    variancePopulation,
    standardDeviationPopulation: Math.sqrt(variancePopulation),
  };
}
