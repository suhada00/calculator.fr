import { describe, it, expect } from 'vitest';
import { calculateAge, calculateTip, calculateDiscount } from '../../src/lib/formulas/everyday';

describe('Everyday Formulas', () => {
  describe('calculateAge', () => {
    it('calculates age in years, months, and days', () => {
      const result = calculateAge({ birthDate: '1990-06-15', targetDate: '2026-07-02' });
      expect(result.years).toBe(36);
      expect(result.months).toBe(0);
      expect(result.days).toBe(17);
    });

    it('calculates days to next birthday', () => {
      const result = calculateAge({ birthDate: '1990-07-15', targetDate: '2026-07-02' });
      expect(result.daysToNextBirthday).toBe(13);
    });
  });

  describe('calculateTip', () => {
    it('calculates tip amount and splits bill', () => {
      const result = calculateTip({ billAmount: 100, tipPercentage: 15, numberOfPeople: 4 });
      expect(result.tipAmount).toBe(15);
      expect(result.totalAmount).toBe(115);
      expect(result.amountPerPerson).toBe(28.75);
      expect(result.tipPerPerson).toBe(3.75);
    });
  });

  describe('calculateDiscount', () => {
    it('calculates savings and final discounted price with tax', () => {
      const result = calculateDiscount({ originalPrice: 100, discountPercentage: 20, taxPercentage: 10 });
      expect(result.savings).toBe(20);
      expect(result.finalPrice).toBe(88);
    });
  });
});
