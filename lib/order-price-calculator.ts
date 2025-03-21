import { differenceInDays } from 'date-fns';
import type { OrderFormValues } from '../validators/order-form-schema';

interface PricingCalculatorInputs {
  wordCount: number;
  subject: 'arts' | 'business' | 'cs' | 'em';
  typeCategory: 'coursework' | 'bookreport' | 'researchpaper' | 'thesis' | 'proposal';
  academicLevel: 'undergraduate' | 'masters' | 'phd';
  deadline: number; // Deadline in days
}

const baseRate = 0.025; // Base rate in dollars per word

interface DeadlineFactor {
  minDays: number;
  maxDays: number | null;
  factor: number;
}

const deadlineFactors: DeadlineFactor[] = [
  { minDays: 15, maxDays: null, factor: 1.0 },
  { minDays: 10, maxDays: 14, factor: 1.05 },
  { minDays: 6, maxDays: 9, factor: 1.1 },
  { minDays: 4, maxDays: 5, factor: 1.2 },
  { minDays: 2, maxDays: 3, factor: 1.25 },
  { minDays: 1, maxDays: 2, factor: 1.5 },
  { minDays: 0.25, maxDays: 1, factor: 1.75 },
];

// Academic level multipliers
const academicLevelFactors: Record<PricingCalculatorInputs['academicLevel'], number> = {
  undergraduate: 1.0,
  masters: 1.15,
  phd: 1.25,
};

// Subject multipliers
const subjectFactors: Record<PricingCalculatorInputs['subject'], number> = {
  arts: 0,
  business: 0.005,
  cs: 0.01,
  em: 0.015,
};

// Type multipliers
const typeAdjustments: Record<PricingCalculatorInputs['typeCategory'], number> = {
  coursework: 0,
  bookreport: 10,
  researchpaper: 20,
  thesis: 50,
  proposal: 10,
};

const getDeadlineFactor = (days: number): number => {
  const factorObj = deadlineFactors.find(
    (df) => days >= df.minDays && (df.maxDays === null || days <= df.maxDays),
  );
  return factorObj ? factorObj.factor : 1.0;
};

// Pricing calculator function
export const calculateOrderPrice = ({
  wordCount,
  subject,
  typeCategory,
  academicLevel,
  deadline,
}: PricingCalculatorInputs): number => {
  const subjectFactor = subjectFactors[subject];
  const typeAdjustment = typeAdjustments[typeCategory];
  const academicLevelFactor = academicLevelFactors[academicLevel];
  const deadlineFactor = getDeadlineFactor(deadline);

  const finalRate =
    ((baseRate + subjectFactor) * wordCount + typeAdjustment) *
    academicLevelFactor *
    deadlineFactor;

  return parseFloat(finalRate.toFixed(2));
};

// Helper function to calculate price from form values
export const calculatePriceFromFormValues = (values: Partial<OrderFormValues>): number => {
  if (!values.wordCount || !values.subject || !values.typeCategory || !values.academicLevel || !values.deadline) {
    return 0;
  }

  const today = new Date();
  const daysUntilDeadline = differenceInDays(values.deadline, today) || 0.25; // Minimum 0.25 days (6 hours)

  return calculateOrderPrice({
    wordCount: values.wordCount,
    subject: values.subject,
    typeCategory: values.typeCategory,
    academicLevel: values.academicLevel,
    deadline: daysUntilDeadline > 0 ? daysUntilDeadline : 0.25,
  });
}; 