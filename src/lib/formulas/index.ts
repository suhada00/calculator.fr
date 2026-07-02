import { runFormula as runFinanceFormula } from './finance';
import { calculateBmi, calculateBmr, calculateCalories } from './health';
import { convertLength, convertWeight, convertTemperature } from './conversion';
import { calculateAge, calculateTip, calculateDiscount } from './everyday';

export function runFormula(formulaId: string, inputs: Record<string, any>): Record<string, any> {
  switch (formulaId) {
    // Finance Formulas (delegated to finance.ts)
    case 'mortgage-amortization':
    case 'loan-repayment':
    case 'savings-interest':
    case 'gross-to-net':
    case 'income-tax':
    case 'vat-calculator':
    case 'notary-fees':
    case 'rent-vs-buy':
    case 'capital-gains':
    case 'retirement-projection':
      return runFinanceFormula(formulaId, inputs);

    // Health Formulas
    case 'bmi-calculator':
      return calculateBmi({
        weight: Number(inputs.weight || 0),
        height: Number(inputs.height || 0),
      });
    case 'bmr-calculator':
      return calculateBmr({
        weight: Number(inputs.weight || 0),
        height: Number(inputs.height || 0),
        age: Number(inputs.age || 0),
        gender: inputs.gender || 'male',
      });
    case 'calorie-calculator':
      return calculateCalories({
        weight: Number(inputs.weight || 0),
        height: Number(inputs.height || 0),
        age: Number(inputs.age || 0),
        gender: inputs.gender || 'male',
        activityLevel: inputs.activityLevel || 'sedentary',
      });

    // Conversion Formulas
    case 'length-converter':
      return convertLength({
        value: Number(inputs.value || 0),
        fromUnit: inputs.fromUnit || 'm',
        toUnit: inputs.toUnit || 'cm',
      });
    case 'weight-converter':
      return convertWeight({
        value: Number(inputs.value || 0),
        fromUnit: inputs.fromUnit || 'kg',
        toUnit: inputs.toUnit || 'g',
      });
    case 'temperature-converter':
      return convertTemperature({
        value: Number(inputs.value || 0),
        fromUnit: inputs.fromUnit || 'C',
        toUnit: inputs.toUnit || 'F',
      });

    // Everyday Formulas
    case 'age-calculator':
      return calculateAge({
        birthDate: inputs.birthDate || '',
        targetDate: inputs.targetDate || undefined,
      });
    case 'tip-calculator':
      return calculateTip({
        billAmount: Number(inputs.billAmount || 0),
        tipPercentage: Number(inputs.tipPercentage || 0),
        numberOfPeople: Number(inputs.numberOfPeople || 1),
      });
    case 'discount-calculator':
      return calculateDiscount({
        originalPrice: Number(inputs.originalPrice || 0),
        discountPercentage: Number(inputs.discountPercentage || 0),
        taxPercentage: Number(inputs.taxPercentage || 0),
      });

    default:
      throw new Error(`Unknown formula: ${formulaId}`);
  }
}
export { calculateBmi, calculateBmr, calculateCalories } from './health';
export { convertLength, convertWeight, convertTemperature } from './conversion';
export { calculateAge, calculateTip, calculateDiscount } from './everyday';
