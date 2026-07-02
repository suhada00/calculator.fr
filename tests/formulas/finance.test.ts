import { describe, it, expect } from 'vitest';
import {
  calculateMortgage,
  calculateGrossToNet,
  calculateNotaryFees,
  calculateRentVsBuy,
  calculateLoan,
  calculateSavings,
  calculateCapitalGains,
  calculateIncomeTax,
  calculateVat,
  calculateRetirement
} from '../../src/lib/formulas/finance';

describe('Finance Calculator Formulas', () => {
  // 1. Mortgage
  describe('calculateMortgage', () => {
    it('calculates typical mortgage payments correctly', () => {
      const result = calculateMortgage({ loanAmount: 250000, interestRate: 3.5, termYears: 20 });
      expect(result.monthlyPayment).toBe(1449.90);
      expect(result.totalInterest).toBe(97975.83);
    });

    it('handles zero or negative inputs safely (edge/min)', () => {
      const result = calculateMortgage({ loanAmount: 0, interestRate: 3.5, termYears: 20 });
      expect(result.monthlyPayment).toBe(0);
    });

    it('calculates for maximum values correctly (edge/max)', () => {
      const result = calculateMortgage({ loanAmount: 5000000, interestRate: 15, termYears: 35 });
      expect(result.monthlyPayment).toBe(62840.66);
    });
  });

  // 2. Gross-to-Net
  describe('calculateGrossToNet', () => {
    it('calculates typical non-cadre salary correctly', () => {
      const result = calculateGrossToNet({ grossSalary: 40000, isCadre: false, period: 'annual' });
      expect(result.netSalary).toBe(31200);
      expect(result.contributions).toBe(8800);
    });

    it('calculates typical cadre salary correctly', () => {
      const result = calculateGrossToNet({ grossSalary: 40000, isCadre: true, period: 'annual' });
      expect(result.netSalary).toBe(30000);
      expect(result.contributions).toBe(10000);
    });

    it('handles zero values (edge/min)', () => {
      const result = calculateGrossToNet({ grossSalary: 0, isCadre: false, period: 'monthly' });
      expect(result.netSalary).toBe(0);
    });
  });

  // 3. Notary Fees
  describe('calculateNotaryFees', () => {
    it('calculates notary fees for older property', () => {
      const result = calculateNotaryFees({ propertyValue: 200000, propertyType: 'old' });
      expect(result.notaryFees).toBe(15000);
      expect(result.totalCost).toBe(215000);
    });

    it('calculates notary fees for new property', () => {
      const result = calculateNotaryFees({ propertyValue: 200000, propertyType: 'new' });
      expect(result.notaryFees).toBe(5000);
      expect(result.totalCost).toBe(205000);
    });

    it('handles zero property values (edge/min)', () => {
      const result = calculateNotaryFees({ propertyValue: 0, propertyType: 'old' });
      expect(result.notaryFees).toBe(0);
    });
  });

  // 4. Rent vs Buy
  describe('calculateRentVsBuy', () => {
    it('projects typical renting vs buying scenario', () => {
      const result = calculateRentVsBuy({
        propertyPrice: 300000,
        monthlyRent: 1200,
        rentEscalation: 2,
        investmentReturn: 4,
        holdPeriodYears: 10
      });
      expect(result.totalRentPaid).toBe(157676);
      // Buying cost: 300000 + maintenance (approx ~33k) - property value (approx ~365k) = ~ -32k (net gain)
      expect(result.totalBuyCost).toBeLessThan(0); 
      expect(result.opportunityCostDifference).toBeGreaterThan(0);
    });

    it('handles zero holding years (edge/min)', () => {
      const result = calculateRentVsBuy({
        propertyPrice: 300000,
        monthlyRent: 1200,
        rentEscalation: 2,
        investmentReturn: 4,
        holdPeriodYears: 0
      });
      expect(result.totalRentPaid).toBe(0);
    });
  });

  // 5. Loan Repayment
  describe('calculateLoan', () => {
    it('calculates standard loan amortization', () => {
      const result = calculateLoan({ loanAmount: 15000, interestRate: 5, termMonths: 36 });
      expect(result.monthlyPayment).toBe(449.56);
      expect(result.totalInterest).toBe(1184.28);
    });

    it('handles zero interest loans (edge/min)', () => {
      const result = calculateLoan({ loanAmount: 15000, interestRate: 0, termMonths: 30 });
      expect(result.monthlyPayment).toBe(500);
    });
  });

  // 6. Savings Interest
  describe('calculateSavings', () => {
    it('projects typical compound savings correctly', () => {
      const result = calculateSavings({
        initialDeposit: 10000,
        monthlyContribution: 200,
        annualInterestRate: 3,
        years: 5
      });
      expect(result.finalBalance).toBe(24545.51);
      expect(result.totalContributions).toBe(12000);
      expect(result.totalInterestEarned).toBe(2545.51);
    });

    it('handles zero years of savings (edge/min)', () => {
      const result = calculateSavings({
        initialDeposit: 1000,
        monthlyContribution: 100,
        annualInterestRate: 5,
        years: 0
      });
      expect(result.finalBalance).toBe(1000);
    });
  });

  // 7. Capital Gains
  describe('calculateCapitalGains', () => {
    it('calculates French capital gains tax (exempt under 30 years)', () => {
      const result = calculateCapitalGains({ purchasePrice: 150000, salePrice: 250000, holdingYears: 30 });
      expect(result.totalTaxDue).toBe(0);
      expect(result.netGain).toBe(100000);
    });

    it('calculates tax for a 10-year holding period (standard taper)', () => {
      const result = calculateCapitalGains({ purchasePrice: 150000, salePrice: 250000, holdingYears: 10 });
      // Gross gain: 100000
      // Tax Base: 100000 * (1 - 0.3) = 70000. Tax: 70000 * 0.19 = 13300
      // Social Base: 100000 * (1 - 0.0825) = 91750. Social: 91750 * 0.172 = 15781
      expect(result.capitalGainsTax).toBe(13300);
      expect(result.socialContributions).toBe(15781);
      expect(result.totalTaxDue).toBe(29081);
    });

    it('handles loss sales (edge/min)', () => {
      const result = calculateCapitalGains({ purchasePrice: 200000, salePrice: 180000, holdingYears: 5 });
      expect(result.grossGain).toBe(0);
      expect(result.totalTaxDue).toBe(0);
    });
  });

  // 8. Income Tax
  describe('calculateIncomeTax', () => {
    it('calculates French income tax for single part', () => {
      // 30000 taxable income
      // T1 (11600) @ 0% = 0
      // T2 (29579 - 11600 = 17979) @ 11% = 1977.69
      // T3 (30000 - 29579 = 421) @ 30% = 126.3
      // Total = 2103.99
      const result = calculateIncomeTax({ taxableIncome: 30000, householdParts: 1 });
      expect(result.incomeTax).toBe(2103.99);
    });

    it('handles income below taxable limit (edge/min)', () => {
      const result = calculateIncomeTax({ taxableIncome: 10000, householdParts: 1 });
      expect(result.incomeTax).toBe(0);
    });
  });

  // 9. VAT / TVA
  describe('calculateVat', () => {
    it('adds VAT to net amount (exclude)', () => {
      const result = calculateVat({ amount: 100, vatRate: 20, calculationType: 'exclude' });
      expect(result.grossAmount).toBe(120);
      expect(result.vatAmount).toBe(20);
    });

    it('extracts VAT from gross amount (include)', () => {
      const result = calculateVat({ amount: 120, vatRate: 20, calculationType: 'include' });
      expect(result.netAmount).toBe(100);
      expect(result.vatAmount).toBe(20);
    });

    it('handles 0% VAT rate (edge/min)', () => {
      const result = calculateVat({ amount: 150, vatRate: 0, calculationType: 'exclude' });
      expect(result.grossAmount).toBe(150);
    });
  });

  // 10. Retirement
  describe('calculateRetirement', () => {
    it('projects future retirement balance nominal and real', () => {
      const result = calculateRetirement({
        currentAge: 30,
        retirementAge: 65,
        currentSavings: 50000,
        monthlyContribution: 300,
        annualReturnRate: 6,
        inflationRate: 2
      });
      // Future balance nominal should be significantly higher than real due to 2% inflation adjustment
      expect(result.futureValueNominal).toBeGreaterThan(result.futureValueReal);
      expect(result.totalInvested).toBe(300 * 12 * 35);
    });

    it('handles zero years until retirement (edge/min)', () => {
      const result = calculateRetirement({
        currentAge: 62,
        retirementAge: 62,
        currentSavings: 100000,
        monthlyContribution: 500,
        annualReturnRate: 5,
        inflationRate: 2
      });
      expect(result.futureValueNominal).toBe(100000);
      expect(result.totalInvested).toBe(0);
    });
  });
});
