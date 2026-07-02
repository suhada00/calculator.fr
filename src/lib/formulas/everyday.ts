/**
 * Everyday Formulas
 */

export interface AgeInput {
  birthDate: string; // YYYY-MM-DD
  targetDate?: string; // YYYY-MM-DD (defaults to now)
}

export interface AgeOutput {
  years: number;
  months: number;
  days: number;
  daysToNextBirthday: number;
}

export function calculateAge(input: AgeInput): AgeOutput {
  const { birthDate, targetDate } = input;
  if (!birthDate) {
    return { years: 0, months: 0, days: 0, daysToNextBirthday: 0 };
  }

  const birth = new Date(birthDate);
  const target = targetDate ? new Date(targetDate) : new Date();

  if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
    return { years: 0, months: 0, days: 0, daysToNextBirthday: 0 };
  }

  if (target < birth) {
    return { years: 0, months: 0, days: 0, daysToNextBirthday: 0 };
  }

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    // Get number of days in the previous month of target
    const prevMonthDate = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonthDate.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Calculate days to next birthday
  const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < target) {
    nextBirthday.setFullYear(target.getFullYear() + 1);
  }

  const diffTime = nextBirthday.getTime() - target.getTime();
  const daysToNextBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    daysToNextBirthday: daysToNextBirthday >= 365 ? 365 : daysToNextBirthday
  };
}

export interface TipInput {
  billAmount: number;
  tipPercentage: number;
  numberOfPeople: number;
}

export interface TipOutput {
  tipAmount: number;
  totalAmount: number;
  amountPerPerson: number;
  tipPerPerson: number;
}

export function calculateTip(input: TipInput): TipOutput {
  const { billAmount, tipPercentage, numberOfPeople = 1 } = input;
  const ppl = numberOfPeople <= 0 ? 1 : numberOfPeople;

  if (billAmount <= 0) {
    return { tipAmount: 0, totalAmount: 0, amountPerPerson: 0, tipPerPerson: 0 };
  }

  const tipAmount = billAmount * (tipPercentage / 100);
  const totalAmount = billAmount + tipAmount;
  const amountPerPerson = totalAmount / ppl;
  const tipPerPerson = tipAmount / ppl;

  return {
    tipAmount: Math.round(tipAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    amountPerPerson: Math.round(amountPerPerson * 100) / 100,
    tipPerPerson: Math.round(tipPerPerson * 100) / 100
  };
}

export interface DiscountInput {
  originalPrice: number;
  discountPercentage: number;
  taxPercentage?: number;
}

export interface DiscountOutput {
  savings: number;
  finalPrice: number;
}

export function calculateDiscount(input: DiscountInput): DiscountOutput {
  const { originalPrice, discountPercentage, taxPercentage = 0 } = input;

  if (originalPrice <= 0) {
    return { savings: 0, finalPrice: 0 };
  }

  const savings = originalPrice * (Math.min(100, Math.max(0, discountPercentage)) / 100);
  const discountedPrice = originalPrice - savings;
  const taxAmount = discountedPrice * (Math.max(0, taxPercentage) / 100);
  const finalPrice = discountedPrice + taxAmount;

  return {
    savings: Math.round(savings * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100
  };
}
