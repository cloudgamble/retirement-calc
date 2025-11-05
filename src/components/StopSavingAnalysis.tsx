interface StopSavingAnalysisProps {
  stopSavingAge: number | null;
  currentAge: number;
  retirementAge: number;
}

export function StopSavingAnalysis({ stopSavingAge, currentAge, retirementAge }: StopSavingAnalysisProps) {
  if (stopSavingAge === null) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-lg p-6">
        <div className="flex items-start gap-3">
          <svg className="w-8 h-8 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Keep Saving Required</h3>
            <p className="text-gray-700">
              Based on your current plan, you'll need to continue saving all the way to retirement age to reach your goal.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              💡 Try increasing your annual contribution or adjusting your retirement spending to create more flexibility.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const yearsUntilCanStop = stopSavingAge - currentAge;
  const yearsOfCoasting = retirementAge - stopSavingAge;

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl shadow-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <svg className="w-8 h-8 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">When Can I Stop Saving?</h3>
          <p className="text-sm text-gray-600 mt-1">
            Your earliest "freedom date" to stop contributing
          </p>
        </div>
      </div>

      <div className="bg-blue-100 rounded-lg p-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-blue-700 mb-1">You can stop saving at age</div>
          <div className="text-4xl font-bold text-blue-900">{stopSavingAge}</div>
          {stopSavingAge === currentAge ? (
            <div className="text-sm text-blue-700 mt-2 font-semibold">
              🎉 You can stop contributing right now!
            </div>
          ) : (
            <div className="text-sm text-blue-700 mt-2">
              {yearsUntilCanStop} {yearsUntilCanStop === 1 ? 'year' : 'years'} from now
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-3">
          <div className="text-xs text-gray-600">Save Until</div>
          <div className="text-2xl font-bold text-gray-900">Age {stopSavingAge}</div>
        </div>
        <div className="bg-white rounded-lg p-3">
          <div className="text-xs text-gray-600">Then Coast For</div>
          <div className="text-2xl font-bold text-green-600">{yearsOfCoasting} years</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-xs text-gray-600">
          After age {stopSavingAge}, your portfolio will grow from investment returns alone—no additional contributions needed!
        </p>
      </div>
    </div>
  );
}
