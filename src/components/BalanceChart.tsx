import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { formatCurrency } from '../lib/calculator';
import type { YearlyProjection } from '../lib/calculator';

interface BalanceChartProps {
  projections: YearlyProjection[];
  retirementAge: number;
}

export function BalanceChart({ projections, retirementAge }: BalanceChartProps) {
  // Sample data for better performance (show every Nth year if dataset is large)
  const displayData = projections.length > 50 
    ? projections.filter((_, i) => i % 2 === 0 || i === projections.length - 1)
    : projections;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={displayData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="age" 
          label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
          stroke="#666"
        />
        <YAxis 
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          stroke="#666"
        />
        <Tooltip 
          formatter={(value: number) => formatCurrency(value)}
          labelFormatter={(age) => `Age ${age}`}
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '8px' }}
        />
        <Legend />
        <ReferenceLine 
          x={retirementAge} 
          stroke="#f59e0b" 
          strokeDasharray="5 5" 
          label={{ value: 'Retirement', position: 'top', fill: '#f59e0b', fontSize: 12 }}
        />
        <Line 
          type="monotone" 
          dataKey="balance" 
          stroke="#0ea5e9" 
          strokeWidth={3}
          dot={false}
          name="Portfolio Balance"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
