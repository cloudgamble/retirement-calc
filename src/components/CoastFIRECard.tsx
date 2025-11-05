import { formatCurrency, formatPercent, type CoastFIREResult } from '../lib/calculator';

interface CoastFIRECardProps {
  coastFire: CoastFIREResult;
}

export function CoastFIRECard({ coastFire }: CoastFIRECardProps) {
  const getStatusColor = () => {
    if (coastFire.isCoasting) return 'bg-green-50 border-green-200';
    if (coastFire.percentToCoast >= 75) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getIconColor = () => {
    if (coastFire.isCoasting) return 'text-green-600';
    if (coastFire.percentToCoast >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIcon = () => {
    if (coastFire.isCoasting) {
      return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    );
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 border-2 ${getStatusColor()}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={getIconColor()}>{getIcon()}</div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Coast FIRE Status</h3>
          <p className="text-sm text-gray-600 mt-1">
            Can you stop saving and still retire on time?
          </p>
        </div>
      </div>

      {coastFire.isCoasting ? (
        <div className="space-y-3">
          <div className="bg-green-100 rounded-lg p-4">
            <p className="text-green-900 font-semibold">
              ✅ You're coasting! Your current savings will grow to your FIRE number even if you stop contributing.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">FIRE Number</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(coastFire.fireNumber)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Current Savings</div>
              <div className="text-xl font-bold text-green-600">{formatCurrency(coastFire.currentSavings)}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-green-200">
            <div className="text-sm text-gray-600">Progress to Coast FIRE</div>
            <div className="text-2xl font-bold text-green-600">{formatPercent(coastFire.percentToCoast)}</div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className={`${coastFire.percentToCoast >= 75 ? 'bg-yellow-100' : 'bg-red-100'} rounded-lg p-4`}>
            <p className={`${coastFire.percentToCoast >= 75 ? 'text-yellow-900' : 'text-red-900'} font-semibold`}>
              {coastFire.percentToCoast >= 75 
                ? `⚠️ Almost there! You're ${formatPercent(coastFire.percentToCoast)} of the way to Coast FIRE.`
                : `📊 Keep saving! You need ${formatCurrency(coastFire.gap)} more to reach Coast FIRE.`
              }
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Coast Number Needed</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(coastFire.coastNumber)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Current Savings</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(coastFire.currentSavings)}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Progress to Coast FIRE</div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${coastFire.percentToCoast >= 75 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(coastFire.percentToCoast, 100)}%` }}
              />
            </div>
            <div className="text-right text-sm font-semibold text-gray-700 mt-1">
              {formatPercent(coastFire.percentToCoast)}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="text-sm text-gray-600">Gap to Close</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(coastFire.gap)}</div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>Coast FIRE:</strong> The amount you need today so your savings can grow (without new contributions) to your FIRE number by retirement age.
        </p>
      </div>
    </div>
  );
}
