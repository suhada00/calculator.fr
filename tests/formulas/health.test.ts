import { describe, it, expect } from 'vitest';
import { calculateBmi, calculateBmr, calculateCalories } from '../../src/lib/formulas/health';

describe('Health Formulas', () => {
  describe('calculateBmi', () => {
    it('calculates BMI and maps to underweight', () => {
      const result = calculateBmi({ weight: 50, height: 170 });
      expect(result.bmi).toBe(17.3);
      expect(result.category).toBe('underweight');
    });

    it('calculates BMI and maps to normal', () => {
      const result = calculateBmi({ weight: 65, height: 170 });
      expect(result.bmi).toBe(22.5);
      expect(result.category).toBe('normal');
    });

    it('calculates BMI and maps to overweight', () => {
      const result = calculateBmi({ weight: 80, height: 170 });
      expect(result.bmi).toBe(27.7);
      expect(result.category).toBe('overweight');
    });

    it('calculates BMI and maps to obese', () => {
      const result = calculateBmi({ weight: 95, height: 170 });
      expect(result.bmi).toBe(32.9);
      expect(result.category).toBe('obese');
    });
  });

  describe('calculateBmr', () => {
    it('calculates BMR for male', () => {
      const result = calculateBmr({ weight: 70, height: 175, age: 30, gender: 'male' });
      expect(result.bmr).toBe(1696);
    });

    it('calculates BMR for female', () => {
      const result = calculateBmr({ weight: 60, height: 165, age: 30, gender: 'female' });
      expect(result.bmr).toBe(1384);
    });
  });

  describe('calculateCalories', () => {
    it('calculates daily calorie requirements based on activity', () => {
      const result = calculateCalories({
        weight: 70,
        height: 175,
        age: 30,
        gender: 'male',
        activityLevel: 'moderate'
      });
      expect(result.maintenance).toBe(2629);
      expect(result.weightLoss).toBe(2129);
      expect(result.weightGain).toBe(3129);
    });
  });
});
