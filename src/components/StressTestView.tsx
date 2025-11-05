import { formatCurrency, formatPercent, type StressTestScenarios } from '../lib/calculator';

interface StressTestViewProps {
  scenarios: StressTestScenarios;
}

export function StressTestView({ scenarios }: StressTestViewProps) {
  const getScenarioColor = (reached: boolean) => {
    return reached ? 'text-green-600' : 'text-red-600';
  };

  const getScenarioIcon = (reached: boolean) => {
    if (reached) {
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Stress Test: How Robust Is Your Plan?</h3>
      <p className="text-sm text-gray-600 mb-6">
        See how your retirement plan holds up under different market conditions
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Worst Case */}
        <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
          <div className="flex items-center gap-2 mb-3">
            {getScenarioIcon(scenarios.worstCase.summary.retirementGoalReached)}
            <h4 className="font-bold text-gray-900">Worst Case</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-600">Returns</div>
              <div className="font-semibold">4%</div>
            </div>
            <div>
              <div className="text-gray-600">Inflation</div>
              <div className="font-semibold">5%</div>
            </div>
            <div>
              <div className="text-gray-600">Life Exp.</div>
              <div className="font-semibold">95 years</div>
            </div>
            <div className="pt-2 border-t border-red-200">
              <div className="text-gray-600">Final Balance</div>
              <div className={`font-bold ${getScenarioColor(scenarios.worstCase.summary.retirementGoalReached)}`}>
                {formatCurrency(scenarios.worstCase.summary.finalBalance)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Success Rate</div>
              <div className={`font-bold ${getScenarioColor(scenarios.worstCase.summary.retirementGoalReached)}`}>
                {formatPercent(scenarios.worstCase.summary.successProbability)}
              </div>
            </div>
          </div>
        </div>

        {/* Base Case */}
        <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
          <div className="flex items-center gap-2 mb-3">
            {getScenarioIcon(scenarios.baseCase.summary.retirementGoalReached)}
            <h4 className="font-bold text-gray-900">Base Case</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-600">Returns</div>
              <div className="font-semibold">Your inputs</div>
            </div>
            <div>
              <div className="text-gray-600">Inflation</div>
              <div className="font-semibold">Your inputs</div>
            </div>
            <div>
              <div className="text-gray-600">Life Exp.</div>
              <div className="font-semibold">Your inputs</div>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <div className="text-gray-600">Final Balance</div>
              <div className={`font-bold ${getScenarioColor(scenarios.baseCase.summary.retirementGoalReached)}`}>
                {formatCurrency(scenarios.baseCase.summary.finalBalance)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Success Rate</div>
              <div className={`font-bold ${getScenarioColor(scenarios.baseCase.summary.retirementGoalReached)}`}>
                {formatPercent(scenarios.baseCase.summary.successProbability)}
              </div>
            </div>
          </div>
        </div>

        {/* Best Case */}
        <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
          <div className="flex items-center gap-2 mb-3">
            {getScenarioIcon(scenarios.bestCase.summary.retirementGoalReached)}
            <h4 className="font-bold text-gray-900">Best Case</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-600">Returns</div>
              <div className="font-semibold">10%</div>
            </div>
            <div>
              <div className="text-gray-600">Inflation</div>
              <div className="font-semibold">2%</div>
            </div>
            <div>
              <div className="text-gray-600">Life Exp.</div>
              <div className="font-semibold">Your inputs</div>
            </div>
            <div className="pt-2 border-t border-green-200">
              <div className="text-gray-600">Final Balance</div>
              <div className={`font-bold ${getScenarioColor(scenarios.bestCase.summary.retirementGoalReached)}`}>
                {formatCurrency(scenarios.bestCase.summary.finalBalance)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Success Rate</div>
              <div className={`font-bold ${getScenarioColor(scenarios.bestCase.summary.retirementGoalReached)}`}>
                {formatPercent(scenarios.bestCase.summary.successProbability)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>💡 Recommendation:</strong> {
            scenarios.worstCase.summary.retirementGoalReached
              ? "Your plan succeeds even in the worst case scenario! You have a very robust retirement plan."
              : scenarios.baseCase.summary.retirementGoalReached
              ? "Your plan works in normal conditions but may struggle in a downturn. Consider increasing savings or reducing spending for more safety."
              : "Your plan needs adjustment. Even the base case shows challenges. Consider saving more, working longer, or reducing retirement spending."
          }
        </p>
      </div>
    </div>
  );
}
