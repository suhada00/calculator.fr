import { describe, it, expect } from 'vitest';
import { convertLength, convertWeight, convertTemperature } from '../../src/lib/formulas/conversion';

describe('Conversion Formulas', () => {
  describe('convertLength', () => {
    it('converts meters to centimeters', () => {
      const result = convertLength({ value: 2.5, fromUnit: 'm', toUnit: 'cm' });
      expect(result.convertedValue).toBe(250);
    });

    it('converts inches to meters', () => {
      const result = convertLength({ value: 39.3701, fromUnit: 'in', toUnit: 'm' });
      expect(result.convertedValue).toBe(1);
    });
  });

  describe('convertWeight', () => {
    it('converts kilograms to pounds', () => {
      const result = convertWeight({ value: 10, fromUnit: 'kg', toUnit: 'lb' });
      expect(result.convertedValue).toBe(22.0462);
    });

    it('converts ounces to grams', () => {
      const result = convertWeight({ value: 5, fromUnit: 'oz', toUnit: 'g' });
      expect(result.convertedValue).toBe(141.7476);
    });
  });

  describe('convertTemperature', () => {
    it('converts Celsius to Fahrenheit', () => {
      const result = convertTemperature({ value: 25, fromUnit: 'C', toUnit: 'F' });
      expect(result.convertedValue).toBe(77);
    });

    it('converts Fahrenheit to Celsius', () => {
      const result = convertTemperature({ value: 98.6, fromUnit: 'F', toUnit: 'C' });
      expect(result.convertedValue).toBe(37);
    });

    it('converts Celsius to Kelvin', () => {
      const result = convertTemperature({ value: 0, fromUnit: 'C', toUnit: 'K' });
      expect(result.convertedValue).toBe(273.15);
    });
  });
});
