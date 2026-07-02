/**
 * Conversion Formulas
 */

export interface ConverterInput {
  value: number;
  fromUnit: string;
  toUnit: string;
}

export interface ConverterOutput {
  convertedValue: number;
}

// Length conversion rates to meters
const LENGTH_RATES: Record<string, number> = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344
};

export function convertLength(input: ConverterInput): ConverterOutput {
  const { value, fromUnit, toUnit } = input;
  const fromRate = LENGTH_RATES[fromUnit];
  const toRate = LENGTH_RATES[toUnit];

  if (!fromRate || !toRate) {
    return { convertedValue: value };
  }

  // Convert to base unit (meters), then to target unit
  const valueInMeters = value * fromRate;
  const convertedValue = valueInMeters / toRate;

  return {
    convertedValue: Math.round(convertedValue * 10000) / 10000 // 4 decimal places precision
  };
}

// Weight conversion rates to kilograms
const WEIGHT_RATES: Record<string, number> = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  lb: 0.45359237,
  oz: 0.028349523
};

export function convertWeight(input: ConverterInput): ConverterOutput {
  const { value, fromUnit, toUnit } = input;
  const fromRate = WEIGHT_RATES[fromUnit];
  const toRate = WEIGHT_RATES[toUnit];

  if (!fromRate || !toRate) {
    return { convertedValue: value };
  }

  // Convert to base unit (kg), then to target unit
  const valueInKg = value * fromRate;
  const convertedValue = valueInKg / toRate;

  return {
    convertedValue: Math.round(convertedValue * 10000) / 10000 // 4 decimal places precision
  };
}

export function convertTemperature(input: ConverterInput): ConverterOutput {
  const { value, fromUnit, toUnit } = input;
  
  if (fromUnit === toUnit) {
    return { convertedValue: value };
  }

  // Convert to Celsius first
  let celsius = 0;
  if (fromUnit === 'C') {
    celsius = value;
  } else if (fromUnit === 'F') {
    celsius = (value - 32) * (5 / 9);
  } else if (fromUnit === 'K') {
    celsius = value - 273.15;
  } else {
    return { convertedValue: value };
  }

  // Convert from Celsius to target unit
  let convertedValue = 0;
  if (toUnit === 'C') {
    convertedValue = celsius;
  } else if (toUnit === 'F') {
    convertedValue = (celsius * 9/5) + 32;
  } else if (toUnit === 'K') {
    convertedValue = celsius + 273.15;
  } else {
    return { convertedValue: value };
  }

  return {
    convertedValue: Math.round(convertedValue * 100) / 100 // 2 decimal places precision
  };
}
