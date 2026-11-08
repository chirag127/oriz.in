export interface UnitDefinition {
  id: string;
  label: string;
  symbol: string;
  factor?: number;
}

export interface UnitCategory {
  id: string;
  name: string;
  baseSymbol: string;
  units: UnitDefinition[];
  temperature?: boolean;
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    baseSymbol: 'm',
    units: [
      { id: 'm', label: 'Metre', symbol: 'm', factor: 1 },
      { id: 'km', label: 'Kilometre', symbol: 'km', factor: 1000 },
      { id: 'cm', label: 'Centimetre', symbol: 'cm', factor: 0.01 },
      { id: 'mm', label: 'Millimetre', symbol: 'mm', factor: 0.001 },
      { id: 'mi', label: 'Mile', symbol: 'mi', factor: 1609.344 },
      { id: 'yd', label: 'Yard', symbol: 'yd', factor: 0.9144 },
      { id: 'ft', label: 'Foot', symbol: 'ft', factor: 0.3048 },
      { id: 'in', label: 'Inch', symbol: 'in', factor: 0.0254 },
      { id: 'nmi', label: 'Nautical mile', symbol: 'nmi', factor: 1852 },
    ],
  },
  {
    id: 'mass',
    name: 'Mass',
    baseSymbol: 'kg',
    units: [
      { id: 'kg', label: 'Kilogram', symbol: 'kg', factor: 1 },
      { id: 'g', label: 'Gram', symbol: 'g', factor: 0.001 },
      { id: 'mg', label: 'Milligram', symbol: 'mg', factor: 0.000001 },
      { id: 't', label: 'Metric tonne', symbol: 't', factor: 1000 },
      { id: 'lb', label: 'Pound', symbol: 'lb', factor: 0.45359237 },
      { id: 'oz', label: 'Ounce', symbol: 'oz', factor: 0.028349523125 },
      { id: 'st', label: 'Stone', symbol: 'st', factor: 6.35029318 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    baseSymbol: 'K',
    temperature: true,
    units: [
      { id: 'c', label: 'Celsius', symbol: '°C' },
      { id: 'f', label: 'Fahrenheit', symbol: '°F' },
      { id: 'k', label: 'Kelvin', symbol: 'K' },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    baseSymbol: 'm²',
    units: [
      { id: 'm2', label: 'Square metre', symbol: 'm²', factor: 1 },
      { id: 'km2', label: 'Square kilometre', symbol: 'km²', factor: 1_000_000 },
      { id: 'cm2', label: 'Square centimetre', symbol: 'cm²', factor: 0.0001 },
      { id: 'ha', label: 'Hectare', symbol: 'ha', factor: 10_000 },
      { id: 'acre', label: 'Acre', symbol: 'ac', factor: 4046.8564224 },
      { id: 'ft2', label: 'Square foot', symbol: 'ft²', factor: 0.09290304 },
      { id: 'in2', label: 'Square inch', symbol: 'in²', factor: 0.00064516 },
      { id: 'yd2', label: 'Square yard', symbol: 'yd²', factor: 0.83612736 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    baseSymbol: 'L',
    units: [
      { id: 'l', label: 'Litre', symbol: 'L', factor: 1 },
      { id: 'ml', label: 'Millilitre', symbol: 'mL', factor: 0.001 },
      { id: 'm3', label: 'Cubic metre', symbol: 'm³', factor: 1000 },
      { id: 'cm3', label: 'Cubic centimetre', symbol: 'cm³', factor: 0.001 },
      { id: 'galus', label: 'US gallon', symbol: 'US gal', factor: 3.785411784 },
      { id: 'qtus', label: 'US quart', symbol: 'US qt', factor: 0.946352946 },
      { id: 'ptus', label: 'US pint', symbol: 'US pt', factor: 0.473176473 },
      { id: 'cupus', label: 'US cup', symbol: 'US cup', factor: 0.2365882365 },
      { id: 'flozus', label: 'US fluid ounce', symbol: 'US fl oz', factor: 0.0295735295625 },
      { id: 'galuk', label: 'Imperial gallon', symbol: 'imp gal', factor: 4.54609 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    baseSymbol: 'm/s',
    units: [
      { id: 'mps', label: 'Metres per second', symbol: 'm/s', factor: 1 },
      { id: 'kmh', label: 'Kilometres per hour', symbol: 'km/h', factor: 1 / 3.6 },
      { id: 'mph', label: 'Miles per hour', symbol: 'mph', factor: 0.44704 },
      { id: 'knot', label: 'Knot', symbol: 'kn', factor: 0.514444444444 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    baseSymbol: 's',
    units: [
      { id: 's', label: 'Second', symbol: 's', factor: 1 },
      { id: 'ms', label: 'Millisecond', symbol: 'ms', factor: 0.001 },
      { id: 'min', label: 'Minute', symbol: 'min', factor: 60 },
      { id: 'h', label: 'Hour', symbol: 'h', factor: 3600 },
      { id: 'day', label: 'Day', symbol: 'd', factor: 86400 },
      { id: 'week', label: 'Week', symbol: 'wk', factor: 604800 },
    ],
  },
  {
    id: 'data',
    name: 'Digital storage',
    baseSymbol: 'B',
    units: [
      { id: 'b', label: 'Byte', symbol: 'B', factor: 1 },
      { id: 'kb', label: 'Kilobyte (decimal)', symbol: 'kB', factor: 1000 },
      { id: 'mb', label: 'Megabyte (decimal)', symbol: 'MB', factor: 1_000_000 },
      { id: 'gb', label: 'Gigabyte (decimal)', symbol: 'GB', factor: 1_000_000_000 },
      { id: 'tb', label: 'Terabyte (decimal)', symbol: 'TB', factor: 1_000_000_000_000 },
      { id: 'kib', label: 'Kibibyte (binary)', symbol: 'KiB', factor: 1024 },
      { id: 'mib', label: 'Mebibyte (binary)', symbol: 'MiB', factor: 1024 ** 2 },
      { id: 'gib', label: 'Gibibyte (binary)', symbol: 'GiB', factor: 1024 ** 3 },
      { id: 'tib', label: 'Tebibyte (binary)', symbol: 'TiB', factor: 1024 ** 4 },
    ],
  },
];

export function getUnitCategory(id: string): UnitCategory {
  const category = UNIT_CATEGORIES.find((entry) => entry.id === id);
  if (!category) throw new Error('Unknown unit category.');
  return category;
}

export function convertUnit(
  categoryId: string,
  fromId: string,
  toId: string,
  value: number,
): number {
  if (!Number.isFinite(value)) throw new Error('Enter a finite number.');
  const category = getUnitCategory(categoryId);
  const from = category.units.find((unit) => unit.id === fromId);
  const to = category.units.find((unit) => unit.id === toId);
  if (!from || !to) throw new Error('Choose valid source and destination units.');

  if (category.temperature) {
    const kelvin = toKelvin(value, from.id);
    if (kelvin < 0) throw new Error('Temperature cannot be below absolute zero.');
    return fromKelvin(kelvin, to.id);
  }

  if (!from.factor || !to.factor) {
    throw new Error('This unit is missing a conversion factor.');
  }
  return (value * from.factor) / to.factor;
}

function toKelvin(value: number, unitId: string): number {
  if (unitId === 'c') return value + 273.15;
  if (unitId === 'f') return (value - 32) * (5 / 9) + 273.15;
  return value;
}

function fromKelvin(kelvin: number, unitId: string): number {
  if (unitId === 'c') return kelvin - 273.15;
  if (unitId === 'f') return (kelvin - 273.15) * (9 / 5) + 32;
  return kelvin;
}

export function formatUnitValue(value: number, maxFractionDigits = 8): string {
  if (!Number.isFinite(value)) return '—';
  const absolute = Math.abs(value);
  if (absolute !== 0 && (absolute >= 1e15 || absolute < 1e-6)) {
    return value.toExponential(6);
  }
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFractionDigits,
    useGrouping: true,
  }).format(value);
}
