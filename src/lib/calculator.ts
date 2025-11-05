/**
 * Core retirement calculation engine
 * All calculations happen client-side - no data sent to servers
 */

export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  annualContribution: number;
  rateOfReturn: number; // percentage (e.g., 7 for 7%)
  annualSpending: number;
  inflationRate: number; // percentage (e.g., 3 for 3%)
  lifeExpectancy: number;
  // Optional advanced inputs
  socialSecurityIncome?: number;
  pensionIncome?: number;
  oneTimeCashflow?: { age: number; amount: number }[];
}

export interface YearlyProjection {
  age: number;
  balance: number;
  contribution: number;
  withdrawal: number;
  interest: number;
  inflationAdjustedBalance: number;
}

export interface RetirementResults {
  projections: YearlyProjection[];
  summary: {
    retirementGoalReached: boolean;
    ageMoneyRunsOut: number | null;
    finalBalance: number;
    totalContributions: number;
    totalWithdrawals: number;
    safeWithdrawalRate: number;
    successProbability: number; // Simple heuristic for now
  };
}

/**
 * Calculate retirement projections year by year
 */
export function calculateRetirement(inputs: RetirementInputs): RetirementResults {
  const projections: YearlyProjection[] = [];
  let balance = inputs.currentSavings;
  let totalContributions = inputs.currentSavings;
  let totalWithdrawals = 0;
  let ageMoneyRunsOut: number | null = null;

  // Calculate inflation-adjusted spending each year
  const getInflationAdjustedSpending = (yearsFromNow: number): number => {
    return inputs.annualSpending * Math.pow(1 + inputs.inflationRate / 100, yearsFromNow);
  };

  for (let age = inputs.currentAge; age <= inputs.lifeExpectancy; age++) {
    const isWorking = age < inputs.retirementAge;
    const yearsFromStart = age - inputs.currentAge;
    
    // Calculate this year's values
    let contribution = 0;
    let withdrawal = 0;
    
    if (isWorking) {
      contribution = inputs.annualContribution;
      balance += contribution;
      totalContributions += contribution;
    } else {
      // In retirement - withdraw for expenses
      const inflationAdjustedSpending = getInflationAdjustedSpending(yearsFromStart);
      const socialSecurity = inputs.socialSecurityIncome || 0;
      const pension = inputs.pensionIncome || 0;
      
      withdrawal = Math.max(0, inflationAdjustedSpending - socialSecurity - pension);
      balance -= withdrawal;
      totalWithdrawals += withdrawal;
    }

    // Check for one-time cashflows
    const oneTimeCashflow = inputs.oneTimeCashflow?.find(cf => cf.age === age);
    if (oneTimeCashflow) {
      balance += oneTimeCashflow.amount;
      if (oneTimeCashflow.amount > 0) {
        totalContributions += oneTimeCashflow.amount;
      } else {
        totalWithdrawals += Math.abs(oneTimeCashflow.amount);
      }
    }

    // Apply investment returns
    const interest = balance * (inputs.rateOfReturn / 100);
    balance += interest;

    // Track when money runs out
    if (balance <= 0 && ageMoneyRunsOut === null) {
      ageMoneyRunsOut = age;
    }

    // Calculate inflation-adjusted balance for display
    const inflationAdjustedBalance = balance / Math.pow(1 + inputs.inflationRate / 100, yearsFromStart);

    projections.push({
      age,
      balance: Math.max(0, balance),
      contribution,
      withdrawal,
      interest,
      inflationAdjustedBalance: Math.max(0, inflationAdjustedBalance),
    });

    // Stop if balance is depleted
    if (balance <= 0) {
      balance = 0;
    }
  }

  // Calculate safe withdrawal rate (4% rule variation)
  // Get balance at the START of retirement (before first withdrawal)
  const retirementIndex = projections.findIndex(p => p.age === inputs.retirementAge);
  const balanceAtRetirement = retirementIndex > 0 
    ? projections[retirementIndex - 1].balance * (1 + inputs.rateOfReturn / 100)
    : projections[0]?.balance || 0;
  const safeWithdrawalRate = balanceAtRetirement > 0 
    ? (inputs.annualSpending / balanceAtRetirement) * 100 
    : 0;

  // Simple success probability heuristic
  const yearsInRetirement = inputs.lifeExpectancy - inputs.retirementAge;
  const yearsWithMoney = ageMoneyRunsOut 
    ? ageMoneyRunsOut - inputs.retirementAge 
    : yearsInRetirement;
  const successProbability = Math.min(100, (yearsWithMoney / yearsInRetirement) * 100);

  return {
    projections,
    summary: {
      retirementGoalReached: ageMoneyRunsOut === null || ageMoneyRunsOut >= inputs.lifeExpectancy,
      ageMoneyRunsOut,
      finalBalance: projections[projections.length - 1]?.balance || 0,
      totalContributions,
      totalWithdrawals,
      safeWithdrawalRate,
      successProbability,
    },
  };
}

/**
 * Apply conservative assumptions to inputs (Reality Check feature)
 */
export function applyConservativeMode(inputs: RetirementInputs): RetirementInputs {
  return {
    ...inputs,
    rateOfReturn: 5, // Lower return assumption
    inflationRate: 3.5, // Higher inflation assumption
    annualSpending: inputs.annualSpending * 1.1, // Add 10% "life happens" buffer
    lifeExpectancy: Math.max(inputs.lifeExpectancy, 95), // Plan for longevity
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Coast FIRE calculation result
 */
export interface CoastFIREResult {
  fireNumber: number;
  coastNumber: number;
  currentSavings: number;
  gap: number;
  isCoasting: boolean;
  percentToCoast: number;
}

/**
 * Calculate Coast FIRE status
 * Shows if current savings can "coast" to retirement goal without further contributions
 */
export function calculateCoastFIRE(inputs: RetirementInputs): CoastFIREResult {
  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  const fireNumber = inputs.annualSpending / 0.04; // 4% rule
  const coastNumber = fireNumber / Math.pow(1 + inputs.rateOfReturn / 100, yearsToRetirement);
  
  const gap = coastNumber - inputs.currentSavings;
  const isCoasting = inputs.currentSavings >= coastNumber;
  const percentToCoast = (inputs.currentSavings / coastNumber) * 100;

  return {
    fireNumber,
    coastNumber,
    currentSavings: inputs.currentSavings,
    gap,
    isCoasting,
    percentToCoast,
  };
}

/**
 * Calculate the earliest age user can stop saving and still reach retirement goal
 */
export function calculateStopSavingAge(inputs: RetirementInputs): number | null {
  // Helper to project balance to a specific age
  const projectBalanceToAge = (targetAge: number): number => {
    let balance = inputs.currentSavings;
    for (let age = inputs.currentAge; age < targetAge; age++) {
      balance += inputs.annualContribution;
      balance *= (1 + inputs.rateOfReturn / 100);
    }
    return balance;
  };

  // Test each potential stop age
  for (let stopAge = inputs.currentAge; stopAge <= inputs.retirementAge; stopAge++) {
    const balanceAtStopAge = projectBalanceToAge(stopAge);
    
    // Create test scenario: stop contributing at this age
    const testInputs: RetirementInputs = {
      ...inputs,
      currentAge: stopAge,
      currentSavings: balanceAtStopAge,
      annualContribution: 0, // Stop contributions
    };
    
    const results = calculateRetirement(testInputs);
    
    if (results.summary.retirementGoalReached) {
      return stopAge;
    }
  }
  
  return null; // Can't stop saving yet
}

/**
 * Stress test scenario results
 */
export interface StressTestScenarios {
  worstCase: RetirementResults;
  baseCase: RetirementResults;
  bestCase: RetirementResults;
}

/**
 * Generate stress test scenarios (worst/base/best case)
 */
export function generateStressTestScenarios(inputs: RetirementInputs): StressTestScenarios {
  return {
    worstCase: calculateRetirement({
      ...inputs,
      rateOfReturn: 4,
      inflationRate: 5,
      lifeExpectancy: 95,
      annualSpending: inputs.annualSpending * 1.1, // 10% higher spending
    }),
    baseCase: calculateRetirement(inputs),
    bestCase: calculateRetirement({
      ...inputs,
      rateOfReturn: 10,
      inflationRate: 2,
    }),
  };
}
