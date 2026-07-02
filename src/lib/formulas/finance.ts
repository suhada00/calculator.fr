/**
 * Mortgage Amortization Formula
 */
export interface MortgageInput {
  loanAmount: number;
  interestRate: number; // e.g., 3.5 for 3.5%
  termYears: number;
}

export interface MortgageOutput {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export function calculateMortgage(input: MortgageInput): MortgageOutput {
  const { loanAmount, interestRate, termYears } = input;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = termYears * 12;

  if (loanAmount <= 0 || termYears <= 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
  }

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / totalMonths;
  } else {
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}

/**
 * Gross to Net Salary Formula (France)
 */
export interface GrossToNetInput {
  grossSalary: number;
  isCadre: boolean;
  period: 'monthly' | 'annual';
}

export interface GrossToNetOutput {
  netSalary: number;
  contributions: number;
}

export function calculateGrossToNet(input: GrossToNetInput): GrossToNetOutput {
  const { grossSalary, isCadre, period } = input;
  
  if (grossSalary <= 0) {
    return { netSalary: 0, contributions: 0 };
  }

  // Employee social contribution rate is approx 22% for non-cadre, 25% for cadre in France
  const contributionRate = isCadre ? 0.25 : 0.22;
  const contributions = grossSalary * contributionRate;
  const netSalary = grossSalary - contributions;

  return {
    netSalary: Math.round(netSalary * 100) / 100,
    contributions: Math.round(contributions * 100) / 100,
  };
}

/**
 * Notary Fees Formula (France)
 */
export interface NotaryFeesInput {
  propertyValue: number;
  propertyType: 'old' | 'new';
}

export interface NotaryFeesOutput {
  notaryFees: number;
  totalCost: number;
}

export function calculateNotaryFees(input: NotaryFeesInput): NotaryFeesOutput {
  const { propertyValue, propertyType } = input;

  if (propertyValue <= 0) {
    return { notaryFees: 0, totalCost: 0 };
  }

  // Average notary fee rate: ~7.5% for older houses, ~2.5% for brand new constructions
  const rate = propertyType === 'new' ? 0.025 : 0.075;
  const notaryFees = propertyValue * rate;
  const totalCost = propertyValue + notaryFees;

  return {
    notaryFees: Math.round(notaryFees * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
  };
}

/**
 * Rent vs Buy Comparison Formula
 */
export interface RentVsBuyInput {
  propertyPrice: number;
  monthlyRent: number;
  rentEscalation: number; // e.g., 2 for 2%
  investmentReturn: number; // e.g., 4 for 4%
  holdPeriodYears: number;
}

export interface RentVsBuyOutput {
  totalRentPaid: number;
  totalBuyCost: number;
  opportunityCostDifference: number; // positive means buying is cheaper, negative means renting is cheaper
}

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyOutput {
  const { propertyPrice, monthlyRent, rentEscalation, investmentReturn, holdPeriodYears } = input;

  if (propertyPrice <= 0 || monthlyRent <= 0 || holdPeriodYears <= 0) {
    return { totalRentPaid: 0, totalBuyCost: 0, opportunityCostDifference: 0 };
  }

  // Rent projection
  let totalRentPaid = 0;
  let currentRent = monthlyRent;
  for (let year = 1; year <= holdPeriodYears; year++) {
    totalRentPaid += currentRent * 12;
    currentRent *= (1 + rentEscalation / 100);
  }

  // Buying projection (approx maintenance 1% yearly, property value growth 2% yearly)
  const maintenanceRate = 0.01;
  const growthRate = 0.02;
  
  let totalBuyCost = propertyPrice;
  let propertyValue = propertyPrice;
  
  for (let year = 1; year <= holdPeriodYears; year++) {
    totalBuyCost += propertyValue * maintenanceRate;
    propertyValue *= (1 + growthRate);
  }
  
  // subtract final asset value from buy cost
  totalBuyCost -= propertyValue;

  // Opportunity cost of capital (investing down payment instead)
  // Assume buyer pays 10% downpayment + 8% fees = 18% cash, rest is mortgage-neutralized for simplification,
  // or that renter invests the full house value of cash. Let's compare simple direct costs.
  const opportunityCostDifference = totalRentPaid - totalBuyCost;

  return {
    totalRentPaid: Math.round(totalRentPaid),
    totalBuyCost: Math.round(totalBuyCost),
    opportunityCostDifference: Math.round(opportunityCostDifference),
  };
}

/**
 * Standard Loan Repayment
 */
export interface LoanInput {
  loanAmount: number;
  interestRate: number; // Annual %
  termMonths: number;
}

export interface LoanOutput {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export function calculateLoan(input: LoanInput): LoanOutput {
  const { loanAmount, interestRate, termMonths } = input;
  const monthlyRate = interestRate / 100 / 12;

  if (loanAmount <= 0 || termMonths <= 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
  }

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / termMonths;
  } else {
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - loanAmount;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}

/**
 * Savings / Compound Interest
 */
export interface SavingsInput {
  initialDeposit: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
}

export interface SavingsOutput {
  finalBalance: number;
  totalContributions: number;
  totalInterestEarned: number;
}

export function calculateSavings(input: SavingsInput): SavingsOutput {
  const { initialDeposit, monthlyContribution, annualInterestRate, years } = input;
  const months = years * 12;
  const r = annualInterestRate / 100 / 12;

  if (years <= 0) {
    return { finalBalance: initialDeposit, totalContributions: 0, totalInterestEarned: 0 };
  }

  let finalBalance = initialDeposit;
  let totalContributions = 0;

  for (let i = 0; i < months; i++) {
    finalBalance = finalBalance * (1 + r) + monthlyContribution;
    totalContributions += monthlyContribution;
  }

  const totalInterestEarned = finalBalance - (initialDeposit + totalContributions);

  return {
    finalBalance: Math.round(finalBalance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterestEarned: Math.round(totalInterestEarned * 100) / 100,
  };
}

/**
 * Capital Gains Tax on Property Sale (France)
 */
export interface CapitalGainsInput {
  purchasePrice: number;
  salePrice: number;
  holdingYears: number;
}

export interface CapitalGainsOutput {
  grossGain: number;
  taxBase: number;
  socialBase: number;
  capitalGainsTax: number;      // 19%
  socialContributions: number;  // 17.2%
  totalTaxDue: number;
  netGain: number;
}

export function calculateCapitalGains(input: CapitalGainsInput): CapitalGainsOutput {
  const { purchasePrice, salePrice, holdingYears } = input;
  const grossGain = Math.max(0, salePrice - purchasePrice);

  if (grossGain <= 0 || holdingYears <= 0) {
    return { grossGain: 0, taxBase: 0, socialBase: 0, capitalGainsTax: 0, socialContributions: 0, totalTaxDue: 0, netGain: 0 };
  }

  // Taper relief calculations for French capital gains
  // 19% Tax taper relief:
  // - 0 to 5 years: 0%
  // - 6 to 21 years: 6% per year
  // - 22 years: 4% (which gives 100% total)
  let taxDiscount = 0;
  if (holdingYears > 5) {
    taxDiscount = Math.min(1, (Math.min(21, holdingYears) - 5) * 0.06 + (holdingYears >= 22 ? 0.04 : 0));
  }
  const taxBase = grossGain * (1 - taxDiscount);

  // 17.2% Social contribution taper relief:
  // - 0 to 5 years: 0%
  // - 6 to 21 years: 1.65% per year
  // - 22 to 29 years: 1.6% per year
  // - 30 years: 9% (which gives 100% total)
  let socialDiscount = 0;
  if (holdingYears > 5) {
    if (holdingYears >= 30) {
      socialDiscount = 1;
    } else {
      const yearsPhase1 = Math.min(21, holdingYears) - 5;
      const yearsPhase2 = Math.max(0, holdingYears - 21);
      socialDiscount = (yearsPhase1 * 0.0165) + (yearsPhase2 * 0.016);
    }
  }
  const socialBase = grossGain * (1 - socialDiscount);

  const capitalGainsTax = taxBase * 0.19;
  const socialContributions = socialBase * 0.172;
  const totalTaxDue = capitalGainsTax + socialContributions;
  const netGain = grossGain - totalTaxDue;

  return {
    grossGain: Math.round(grossGain * 100) / 100,
    taxBase: Math.round(taxBase * 100) / 100,
    socialBase: Math.round(socialBase * 100) / 100,
    capitalGainsTax: Math.round(capitalGainsTax * 100) / 100,
    socialContributions: Math.round(socialContributions * 100) / 100,
    totalTaxDue: Math.round(totalTaxDue * 100) / 100,
    netGain: Math.round(netGain * 100) / 100,
  };
}

/**
 * Income Tax Estimator (France - simplified single share / 1 part)
 */
export interface IncomeTaxInput {
  taxableIncome: number;
  householdParts: number;
}

export interface IncomeTaxOutput {
  incomeTax: number;
  effectiveTaxRate: number;
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxOutput {
  const { taxableIncome, householdParts = 1 } = input;

  if (taxableIncome <= 0 || householdParts <= 0) {
    return { incomeTax: 0, effectiveTaxRate: 0 };
  }

  // 2026 French Tax Brackets (applied to income divided by parts)
  const q = taxableIncome / householdParts;
  let taxPerPart = 0;

  const brackets = [
    { limit: 11600, rate: 0.00 },
    { limit: 29579, rate: 0.11 },
    { limit: 84577, rate: 0.30 },
    { limit: 181917, rate: 0.41 },
    { limit: Infinity, rate: 0.45 }
  ];

  let previousLimit = 0;
  for (let i = 0; i < brackets.length; i++) {
    const { limit, rate } = brackets[i];
    if (q > previousLimit) {
      const taxableAmountInBracket = Math.min(q, limit) - previousLimit;
      taxPerPart += taxableAmountInBracket * rate;
      previousLimit = limit;
    } else {
      break;
    }
  }

  const incomeTax = taxPerPart * householdParts;
  const effectiveTaxRate = (incomeTax / taxableIncome) * 100;

  return {
    incomeTax: Math.round(incomeTax * 100) / 100,
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
  };
}

/**
 * VAT / TVA Calculator
 */
export interface VatInput {
  amount: number;
  vatRate: number; // e.g., 20 for 20%
  calculationType: 'exclude' | 'include'; // exclude = add VAT, include = extract VAT
}

export interface VatOutput {
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
}

export function calculateVat(input: VatInput): VatOutput {
  const { amount, vatRate, calculationType } = input;
  const rate = vatRate / 100;

  if (amount <= 0 || vatRate < 0) {
    return { netAmount: 0, vatAmount: 0, grossAmount: 0 };
  }

  let netAmount = 0;
  let vatAmount = 0;
  let grossAmount = 0;

  if (calculationType === 'exclude') {
    netAmount = amount;
    vatAmount = amount * rate;
    grossAmount = amount + vatAmount;
  } else {
    grossAmount = amount;
    netAmount = amount / (1 + rate);
    vatAmount = grossAmount - netAmount;
  }

  return {
    netAmount: Math.round(netAmount * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    grossAmount: Math.round(grossAmount * 100) / 100,
  };
}

/**
 * Retirement Savings Projection
 */
export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnRate: number; // %
  inflationRate: number; // %
}

export interface RetirementOutput {
  futureValueNominal: number;
  futureValueReal: number; // Inflation adjusted
  totalInvested: number;
  totalInterest: number;
}

export function calculateRetirement(input: RetirementInput): RetirementOutput {
  const { currentAge, retirementAge, currentSavings, monthlyContribution, annualReturnRate, inflationRate } = input;
  const years = retirementAge - currentAge;

  if (years <= 0) {
    return { futureValueNominal: currentSavings, futureValueReal: currentSavings, totalInvested: 0, totalInterest: 0 };
  }

  const months = years * 12;
  const nominalRate = annualReturnRate / 100 / 12;
  const realRate = (annualReturnRate - inflationRate) / 100 / 12;

  let futureValueNominal = currentSavings;
  let futureValueReal = currentSavings;
  let totalInvested = 0;

  for (let i = 0; i < months; i++) {
    futureValueNominal = futureValueNominal * (1 + nominalRate) + monthlyContribution;
    futureValueReal = futureValueReal * (1 + realRate) + monthlyContribution;
    totalInvested += monthlyContribution;
  }

  const totalInterest = futureValueNominal - (currentSavings + totalInvested);

  return {
    futureValueNominal: Math.round(futureValueNominal * 100) / 100,
    futureValueReal: Math.round(futureValueReal * 100) / 100,
    totalInvested: Math.round(totalInvested * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}

export function runFormula(formulaId: string, inputs: Record<string, any>): Record<string, any> {
  switch (formulaId) {
    case 'mortgage-amortization':
      return calculateMortgage({
        loanAmount: Number(inputs.loanAmount || 0),
        interestRate: Number(inputs.interestRate || 0),
        termYears: Number(inputs.termYears || 0),
      });
    case 'gross-to-net':
      return calculateGrossToNet({
        grossSalary: Number(inputs.grossSalary || 0),
        isCadre: Boolean(inputs.isCadre),
        period: inputs.period || 'annual',
      });
    case 'notary-fees':
      return calculateNotaryFees({
        propertyValue: Number(inputs.propertyValue || 0),
        propertyType: inputs.propertyType || 'old',
      });
    case 'rent-vs-buy':
      return calculateRentVsBuy({
        propertyPrice: Number(inputs.propertyPrice || 0),
        monthlyRent: Number(inputs.monthlyRent || 0),
        rentEscalation: Number(inputs.rentEscalation || 0),
        investmentReturn: Number(inputs.investmentReturn || 0),
        holdPeriodYears: Number(inputs.holdPeriodYears || 0),
      });
    case 'loan-repayment':
      return calculateLoan({
        loanAmount: Number(inputs.loanAmount || 0),
        interestRate: Number(inputs.interestRate || 0),
        termMonths: Number(inputs.termMonths || 0),
      });
    case 'savings-interest':
      return calculateSavings({
        initialDeposit: Number(inputs.initialDeposit || 0),
        monthlyContribution: Number(inputs.monthlyContribution || 0),
        annualInterestRate: Number(inputs.annualInterestRate || 0),
        years: Number(inputs.years || 0),
      });
    case 'capital-gains':
      return calculateCapitalGains({
        purchasePrice: Number(inputs.purchasePrice || 0),
        salePrice: Number(inputs.salePrice || 0),
        holdingYears: Number(inputs.holdingYears || 0),
      });
    case 'income-tax':
      return calculateIncomeTax({
        taxableIncome: Number(inputs.taxableIncome || 0),
        householdParts: Number(inputs.householdParts || 1),
      });
    case 'vat-calculator':
      return calculateVat({
        amount: Number(inputs.amount || 0),
        vatRate: Number(inputs.vatRate || 0),
        calculationType: inputs.calculationType || 'exclude',
      });
    case 'retirement-projection':
      return calculateRetirement({
        currentAge: Number(inputs.currentAge || 0),
        retirementAge: Number(inputs.retirementAge || 0),
        currentSavings: Number(inputs.currentSavings || 0),
        monthlyContribution: Number(inputs.monthlyContribution || 0),
        annualReturnRate: Number(inputs.annualReturnRate || 0),
        inflationRate: Number(inputs.inflationRate || 0),
      });
    default:
      throw new Error(`Unknown formula: ${formulaId}`);
  }
}
