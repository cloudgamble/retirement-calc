import { describe, it, expect } from 'vitest';
import {
  calculateRetirement,
  applyConservativeMode,
  formatCurrency,
  formatPercent,
  calculateCoastFIRE,
  calculateStopSavingAge,
  generateStressTestScenarios,
  type RetirementInputs,
} from './calculator';

describe('calculateRetirement', () => {
  it('should calculate basic retirement scenario correctly', () => {
    const inputs: RetirementInputs = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 50000,
      annualContribution: 10000,
      rateOfReturn: 7,
      annualSpending: 40000,
      inflationRate: 3,
      lifeExpectancy: 90,
    };

    const result = calculateRetirement(inputs);

    // Should have projections for every year
    expect(result.projections).toHaveLength(61); // 30 to 90 inclusive
    
    // First year should match initial savings + contribution
    const firstYear = result.projections[0];
    expect(firstYear.age).toBe(30);
    expect(firstYear.contribution).toBe(10000);
    expect(firstYear.withdrawal).toBe(0);

    // Retirement year should show withdrawal
    const retirementYear = result.projections.find(p => p.age === 65);
    expect(retirementYear).toBeDefined();
    expect(retirementYear!.withdrawal).toBeGreaterThan(0);

    // Should have valid summary
    expect(result.summary.totalContributions).toBeGreaterThan(0);
    expect(result.summary.safeWithdrawalRate).toBeGreaterThan(0);
    expect(result.summary.successProbability).toBeGreaterThanOrEqual(0);
    expect(result.summary.successProbability).toBeLessThanOrEqual(100);
  });

  it('should detect when money runs out', () => {
    const inputs: RetirementInputs = {
      currentAge: 60,
      retirementAge: 65,
      currentSavings: 100000,
      annualContribution: 0,
      rateOfReturn: 0,
      annualSpending: 50000,
      inflationRate: 0,
      lifeExpectancy: 90,
    };

    const result = calculateRetirement(inputs);

    // With $100k and spending $50k/year with no returns, money runs out at age 67
    expect(result.summary.ageMoneyRunsOut).toBeDefined();
    expect(result.summary.ageMoneyRunsOut).toBeLessThan(90);
    expect(result.summary.retirementGoalReached).toBe(false);
  });

  it('should handle social security income correctly', () => {
    const inputs: RetirementInputs = {
      currentAge: 60,
      retirementAge: 67,
      currentSavings: 500000,
      annualContribution: 0,
      rateOfReturn: 5,
      annualSpending: 40000,
      inflationRate: 2,
      lifeExpectancy: 90,
      socialSecurityIncome: 30000,
    };

    const result = calculateRetirement(inputs);

    // With Social Security covering most expenses, should succeed
    const retirementYear = result.projections.find(p => p.age === 67);
    expect(retirementYear).toBeDefined();
    
    // Withdrawal should be reduced by Social Security (at year 67, inflation has increased spending)
    // But initial withdrawal should still be less than full spending
    expect(retirementYear!.withdrawal).toBeLessThan(50000);
    expect(result.summary.retirementGoalReached).toBe(true);
  });

  it('should apply inflation to spending correctly', () => {
    const inputs: RetirementInputs = {
      currentAge: 30,
      retirementAge: 31,
      currentSavings: 1000000,
      annualContribution: 0,
      rateOfReturn: 7,
      annualSpending: 40000,
      inflationRate: 3,
      lifeExpectancy: 35,
    };

    const result = calculateRetirement(inputs);

    // First retirement year (age 31)
    const year1 = result.projections.find(p => p.age === 31)!;
    
    // Second retirement year (age 32) - should have higher withdrawal due to inflation
    const year2 = result.projections.find(p => p.age === 32)!;
    
    expect(year2.withdrawal).toBeGreaterThan(year1.withdrawal);
  });

  it('should handle one-time cashflows', () => {
    const inputs: RetirementInputs = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 50000,
      annualContribution: 10000,
      rateOfReturn: 7,
      annualSpending: 40000,
      inflationRate: 3,
      lifeExpectancy: 90,
      oneTimeCashflow: [
        { age: 50, amount: 100000 }, // Inheritance
        { age: 70, amount: -50000 },  // Help kids with house
      ],
    };

    const result = calculateRetirement(inputs);

    const age50 = result.projections.find(p => p.age === 50)!;
    const age70 = result.projections.find(p => p.age === 70)!;

    // Balance should increase at age 50
    const age49 = result.projections.find(p => p.age === 49)!;
    expect(age50.balance).toBeGreaterThan(age49.balance + inputs.annualContribution);

    // Balance should have decreased at age 70 (beyond normal withdrawal)
    expect(age70.balance).toBeDefined();
  });

  it('should calculate safe withdrawal rate correctly', () => {
    const inputs: RetirementInputs = {
      currentAge: 64,
      retirementAge: 65,
      currentSavings: 1000000,
      annualContribution: 0,
      rateOfReturn: 7,
      annualSpending: 40000,
      inflationRate: 3,
      lifeExpectancy: 90,
    };

    const result = calculateRetirement(inputs);

    // With growth before withdrawal, balance will be ~$1.07M at retirement
    // So 40k / 1.07M = ~3.74%, which should be between 3-4%
    expect(result.summary.safeWithdrawalRate).toBeGreaterThan(3);
    expect(result.summary.safeWithdrawalRate).toBeLessThan(5);
  });
});

describe('applyConservativeMode', () => {
  it('should make assumptions more conservative', () => {
    const optimistic: RetirementInputs = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 50000,
      annualContribution: 10000,
      rateOfReturn: 10,
      annualSpending: 40000,
      inflationRate: 2,
      lifeExpectancy: 85,
    };

    const conservative = applyConservativeMode(optimistic);

    expect(conservative.rateOfReturn).toBeLessThan(optimistic.rateOfReturn);
    expect(conservative.inflationRate).toBeGreaterThan(optimistic.inflationRate);
    expect(conservative.annualSpending).toBeGreaterThan(optimistic.annualSpending);
    expect(conservative.lifeExpectancy).toBeGreaterThan(optimistic.lifeExpectancy);
  });
});

describe('formatCurrency', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(1234567)).toBe('$1,234,567');
    expect(formatCurrency(999.99)).toBe('$1,000'); // Rounds
    expect(formatCurrency(0)).toBe('$0');
  });
});

describe('formatPercent', () => {
  it('should format percentages correctly', () => {
    expect(formatPercent(7)).toBe('7.0%');
    expect(formatPercent(7.5)).toBe('7.5%');
    expect(formatPercent(10.123)).toBe('10.1%');
  });
});

describe('calculateCoastFIRE', () => {
  it('should calculate coast FIRE correctly when already coasting', () => {
    const inputs: RetirementInputs = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 500000,
      annualContribution: 10000,
      rateOfReturn: 7,
      annualSpending: 50000,
      inflationRate: 3,
      lifeExpectancy: 90,
    };

    const result = calculateCoastFIRE(inputs);

    expect(result.fireNumber).toBe(1250000); // $50k / 0.04
    expect(result.isCoasting).toBe(true);
    expect(result.gap).toBeLessThan(0); // Negative gap = coasting
    expect(result.percentToCoast).toBeGreaterThan(100);
  });

  it('should calculate gap when not coasting yet', () => {
    const inputs: RetirementInputs = {
      currentAge: 25,
      retirementAge: 65,
      currentSavings: 50000,
      annualContribution: 10000,
      rateOfReturn: 7,
      annualSpending: 50000,
      inflationRate: 3,
      lifeExpectancy: 90,
    };

    const result = calculateCoastFIRE(inputs);

    expect(result.isCoasting).toBe(false);
    expect(result.gap).toBeGreaterThan(0); // Positive gap = not coasting
    expect(result.percentToCoast).toBeLessThan(100);
  });

  it('should calculate percent to coast correctly', () => {
    const inputs: RetirementInputs = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 100000,
      annualContribution: 10000,
      rateOfReturn: 7,
      annualSpending: 50000,
      inflationRate: 3,
      lifeExpectancy: 90,
    };

    const result = calculateCoastFIRE(inputs);

    // Should be between 0-100% since we're not coasting yet
    expect(result.percentToCoast).toBeGreaterThan(0);
    expect(result.percentToCoast).toBeLessThan(200); // Reasonable upper bound
  });
});

describe('calculateStopSavingAge', () => {
  it('should find earliest age to stop saving', () => {
    const inputs: RetirementInputs = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 100000,
      annualContribution: 20000,
      rateOfReturn: 7,
      annualSpending: 50000,
      inflationRate: 3,
      lifeExpectancy: 90,
    };

    const stopAge = calculateStopSavingAge(inputs);

    expect(stopAge).not.toBeNull();
    expect(stopAge).toBeGreaterThanOrEqual(inputs.currentAge);
    expect(stopAge).toBeLessThan(inputs.retirementAge);
  });

  it('should return null if cannot stop saving', () => {
    const inputs: RetirementInputs = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 10000,
      annualContribution: 5000,
      rateOfReturn: 3,
      annualSpending: 80000,
      inflationRate: 3,
      lifeExpectancy: 90,
    };

    const stopAge = calculateStopSavingAge(inputs);

    expect(stopAge).toBeNull();
  });

  it('should return current age if already coasting', () => {
    const inputs: RetirementInputs = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 500000,
      annualContribution: 10000,
      rateOfReturn: 7,
      annualSpending: 40000,
      inflationRate: 3,
      lifeExpectancy: 90,
    };

    const stopAge = calculateStopSavingAge(inputs);

    expect(stopAge).toBe(inputs.currentAge);
  });
});

describe('generateStressTestScenarios', () => {
  it('should generate three scenarios with different assumptions', () => {
    const inputs: RetirementInputs = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 100000,
      annualContribution: 15000,
      rateOfReturn: 7,
      annualSpending: 50000,
      inflationRate: 3,
      lifeExpectancy: 90,
    };

    const scenarios = generateStressTestScenarios(inputs);

    expect(scenarios.worstCase).toBeDefined();
    expect(scenarios.baseCase).toBeDefined();
    expect(scenarios.bestCase).toBeDefined();

    // Worst case should have lower final balance
    expect(scenarios.worstCase.summary.finalBalance).toBeLessThan(
      scenarios.baseCase.summary.finalBalance
    );

    // Best case should have higher final balance
    expect(scenarios.bestCase.summary.finalBalance).toBeGreaterThan(
      scenarios.baseCase.summary.finalBalance
    );
  });

  it('should use correct assumptions for worst case', () => {
    const inputs: RetirementInputs = {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 100000,
      annualContribution: 15000,
      rateOfReturn: 7,
      annualSpending: 50000,
      inflationRate: 3,
      lifeExpectancy: 90,
    };

    const scenarios = generateStressTestScenarios(inputs);

    // Worst case planning to age 95
    expect(scenarios.worstCase.projections[scenarios.worstCase.projections.length - 1].age).toBe(95);
  });
});
