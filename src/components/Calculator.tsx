import { useState } from 'react';
import { 
  calculateRetirement, 
  applyConservativeMode, 
  calculateCoastFIRE,
  calculateStopSavingAge,
  generateStressTestScenarios,
  formatCurrency, 
  formatPercent, 
  type RetirementInputs 
} from '../lib/calculator';
import { BalanceChart } from './BalanceChart';
import { ExportButtons } from './ExportButtons';
import { CoastFIRECard } from './CoastFIRECard';
import { StopSavingAnalysis } from './StopSavingAnalysis';
import { StressTestView } from './StressTestView';

export function Calculator() {
  const [inputs, setInputs] = useState<RetirementInputs>({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    annualContribution: 15000,
    rateOfReturn: 7,
    annualSpending: 50000,
    inflationRate: 3,
    lifeExpectancy: 90,
  });

  const [conservativeMode, setConservativeMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const effectiveInputs = conservativeMode ? applyConservativeMode(inputs) : inputs;
  const results = calculateRetirement(effectiveInputs);
  
  // Calculate Phase 1 advanced features
  const coastFire = calculateCoastFIRE(effectiveInputs);
  const stopSavingAge = calculateStopSavingAge(effectiveInputs);
  const stressTest = generateStressTestScenarios(effectiveInputs);

  const handleInputChange = (field: keyof RetirementInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* Privacy Banner */}
      <div className="max-w-6xl mx-auto mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-sm text-green-800">
          <strong>100% Private:</strong> All calculations happen in your browser. No data is stored, tracked, or shared.{' '}
          <a href="https://github.com/cloudgamble/retirement-calc" target="_blank" rel="noopener noreferrer" className="underline">
            View source on GitHub →
          </a>
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Retirement Calculator</h1>
          <p className="text-lg text-gray-600">Free, private, and transparent retirement planning</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Information</h2>

            {/* Basic Inputs */}
            <div className="space-y-5">
              <InputField
                label="Current Age"
                value={inputs.currentAge}
                onChange={(v) => handleInputChange('currentAge', v)}
                min={18}
                max={100}
                step={1}
              />

              <InputField
                label="Retirement Age"
                value={inputs.retirementAge}
                onChange={(v) => handleInputChange('retirementAge', v)}
                min={inputs.currentAge + 1}
                max={100}
                step={1}
              />

              <InputField
                label="Current Savings"
                value={inputs.currentSavings}
                onChange={(v) => handleInputChange('currentSavings', v)}
                min={0}
                max={10000000}
                step={1000}
                prefix="$"
              />

              <InputField
                label="Annual Contribution"
                value={inputs.annualContribution}
                onChange={(v) => handleInputChange('annualContribution', v)}
                min={0}
                max={100000}
                step={1000}
                prefix="$"
                helpText="How much you'll save per year"
              />

              <InputField
                label="Expected Return Rate"
                value={inputs.rateOfReturn}
                onChange={(v) => handleInputChange('rateOfReturn', v)}
                min={0}
                max={20}
                step={0.5}
                suffix="%"
                helpText="Historical S&P 500 average: ~10%"
              />

              <InputField
                label="Annual Retirement Spending"
                value={inputs.annualSpending}
                onChange={(v) => handleInputChange('annualSpending', v)}
                min={0}
                max={500000}
                step={1000}
                prefix="$"
                helpText="How much you'll need per year"
              />

              <InputField
                label="Inflation Rate"
                value={inputs.inflationRate}
                onChange={(v) => handleInputChange('inflationRate', v)}
                min={0}
                max={10}
                step={0.1}
                suffix="%"
                helpText="Historical average: ~3%"
              />

              <InputField
                label="Life Expectancy"
                value={inputs.lifeExpectancy}
                onChange={(v) => handleInputChange('lifeExpectancy', v)}
                min={inputs.retirementAge + 1}
                max={120}
                step={1}
                helpText="Plan conservatively"
              />
            </div>

            {/* Advanced Options */}
            <div className="mt-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-2"
              >
                {showAdvanced ? '− Hide' : '+ Show'} Advanced Options
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-5 pl-4 border-l-2 border-gray-200">
                  <InputField
                    label="Social Security Income (Annual)"
                    value={inputs.socialSecurityIncome || 0}
                    onChange={(v) => handleInputChange('socialSecurityIncome', v)}
                    min={0}
                    max={100000}
                    step={1000}
                    prefix="$"
                    helpText="Optional: Expected annual SS benefit"
                  />

                  <InputField
                    label="Pension Income (Annual)"
                    value={inputs.pensionIncome || 0}
                    onChange={(v) => handleInputChange('pensionIncome', v)}
                    min={0}
                    max={200000}
                    step={1000}
                    prefix="$"
                    helpText="Optional: Annual pension benefit"
                  />
                </div>
              )}
            </div>

            {/* Conservative Mode Toggle */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={conservativeMode}
                  onChange={(e) => setConservativeMode(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Reality Check Mode</div>
                  <div className="text-sm text-gray-600">
                    Lower returns (5%), higher inflation (3.5%), +10% spending buffer, plan to age 95
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className={`rounded-xl shadow-lg p-6 ${
              results.summary.retirementGoalReached 
                ? 'bg-green-50 border-2 border-green-200' 
                : 'bg-red-50 border-2 border-red-200'
            }`}>
              <div className="flex items-start gap-3 mb-4">
                {results.summary.retirementGoalReached ? (
                  <svg className="w-8 h-8 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <div>
                  <h3 className={`text-2xl font-bold ${
                    results.summary.retirementGoalReached ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {results.summary.retirementGoalReached ? 'On Track!' : 'Needs Adjustment'}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    results.summary.retirementGoalReached ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {results.summary.retirementGoalReached 
                      ? `Your retirement plan succeeds through age ${effectiveInputs.lifeExpectancy}`
                      : `Money runs out at age ${results.summary.ageMoneyRunsOut}. Consider saving more or retiring later.`
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="text-sm font-medium text-gray-700">Withdrawal Rate</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {formatPercent(results.summary.safeWithdrawalRate)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {results.summary.safeWithdrawalRate <= 4 ? '✓ Safe (≤4%)' : '⚠️ High risk (>4%)'}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700">Success Rate</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {formatPercent(results.summary.successProbability)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {results.summary.successProbability >= 80 ? '✓ Strong' : '⚠️ Weak'}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700">Final Balance</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">
                    {formatCurrency(results.summary.finalBalance)}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700">Total Saved</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">
                    {formatCurrency(results.summary.totalContributions)}
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Balance Over Time</h3>
              <BalanceChart projections={results.projections} retirementAge={effectiveInputs.retirementAge} />
            </div>

            {/* Phase 1 Advanced Features */}
            <CoastFIRECard coastFire={coastFire} />
            
            <StopSavingAnalysis 
              stopSavingAge={stopSavingAge} 
              currentAge={effectiveInputs.currentAge}
              retirementAge={effectiveInputs.retirementAge}
            />
            
            <StressTestView scenarios={stressTest} />

            {/* Export Buttons */}
            <ExportButtons inputs={effectiveInputs} results={results} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-300 text-center text-gray-600 text-sm">
        <p>
          Made with ❤️ for the FIRE community | <a href="https://github.com/cloudgamble/retirement-calc" target="_blank" rel="noopener noreferrer" className="underline">Open Source</a> | Not financial advice
        </p>
      </footer>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  helpText?: string;
}

function InputField({ label, value, onChange, min, max, step, prefix, suffix, helpText }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-gray-600 font-medium">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {suffix && <span className="text-gray-600 font-medium">{suffix}</span>}
      </div>
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
  );
}
