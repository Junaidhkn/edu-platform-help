interface PricingCalculatorInputs {
	pages?: number;
	wordCount?: number;
	subject: 'arts' | 'business' | 'cs' | 'em';
	type: 'coursework' | 'bookreport' | 'researchpaper' | 'thesis' | 'proposal';
	academic_level: 'undergraduate' | 'masters' | 'phd';
	deadline: number; // Deadline in days
}

let baseRate = 0.025; // Base rate in dollars per word

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
const academicLevelFactors: Record<
	PricingCalculatorInputs['academic_level'],
	number
> = {
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
const typeAdjustments: Record<PricingCalculatorInputs['type'], number> = {
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
const pricingCalculator = ({
	pages,
	wordCount,
	subject,
	type,
	academic_level,
	deadline,
}: PricingCalculatorInputs): number => {
	const subjectFactor = subjectFactors[subject];
	const typeAdjustment = typeAdjustments[type];
	const academicLevelFactor = academicLevelFactors[academic_level];
	const deadlineFactor = getDeadlineFactor(deadline);
	if (pages) {
		wordCount = pages * 250;
	}

	if (!wordCount) {
		throw new Error('Either pages or wordCount must be provided.');
	}
	const finalRate =
		((baseRate + subjectFactor) * wordCount + typeAdjustment) *
		academicLevelFactor *
		deadlineFactor;

	return parseFloat(finalRate.toFixed(2));
};

// Example Usage
console.log(
	pricingCalculator({
		pages: 12,
		subject: 'em',
		type: 'thesis',
		academic_level: 'phd',
		deadline: 3,
	}),
); // Output based on multipliers
