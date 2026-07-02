/**
 * Health Formulas
 */

export interface BmiInput {
  weight: number; // in kg
  height: number; // in cm
}

export interface BmiOutput {
  bmi: number;
  category: string; // e.g., 'underweight', 'normal', 'overweight', 'obese'
}

export function calculateBmi(input: BmiInput): BmiOutput {
  const { weight, height } = input;
  if (weight <= 0 || height <= 0) {
    return { bmi: 0, category: 'unknown' };
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  const roundedBmi = Math.round(bmi * 10) / 10;

  let category = 'normal';
  if (roundedBmi < 18.5) {
    category = 'underweight';
  } else if (roundedBmi < 25) {
    category = 'normal';
  } else if (roundedBmi < 30) {
    category = 'overweight';
  } else {
    category = 'obese';
  }

  return {
    bmi: roundedBmi,
    category
  };
}

export interface BmrInput {
  weight: number; // in kg
  height: number; // in cm
  age: number; // in years
  gender: string; // 'male' | 'female'
}

export interface BmrOutput {
  bmr: number;
}

export function calculateBmr(input: BmrInput): BmrOutput {
  const { weight, height, age, gender } = input;
  if (weight <= 0 || height <= 0 || age <= 0) {
    return { bmr: 0 };
  }

  let bmr = 0;
  if (gender === 'female') {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.33 * age);
  } else {
    // Default to male
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  }

  return {
    bmr: Math.round(bmr)
  };
}

export interface CalorieInput {
  weight: number; // in kg
  height: number; // in cm
  age: number; // in years
  gender: string; // 'male' | 'female'
  activityLevel: string; // 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'
}

export interface CalorieOutput {
  maintenance: number;
  weightLoss: number;
  weightGain: number;
}

export function calculateCalories(input: CalorieInput): CalorieOutput {
  const { weight, height, age, gender, activityLevel } = input;
  const bmrResult = calculateBmr({ weight, height, age, gender });
  const bmr = bmrResult.bmr;

  if (bmr <= 0) {
    return { maintenance: 0, weightLoss: 0, weightGain: 0 };
  }

  let multiplier = 1.2;
  switch (activityLevel) {
    case 'sedentary':
      multiplier = 1.2;
      break;
    case 'light':
      multiplier = 1.375;
      break;
    case 'moderate':
      multiplier = 1.55;
      break;
    case 'active':
      multiplier = 1.725;
      break;
    case 'veryActive':
      multiplier = 1.9;
      break;
    default:
      multiplier = 1.2;
  }

  const maintenance = Math.round(bmr * multiplier);
  const weightLoss = Math.max(1200, Math.round(maintenance - 500)); // Standard 500 kcal deficit (cap at min healthy 1200)
  const weightGain = Math.round(maintenance + 500); // Standard 500 kcal surplus

  return {
    maintenance,
    weightLoss,
    weightGain
  };
}
