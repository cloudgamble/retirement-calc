import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatPercent, type RetirementInputs, type RetirementResults } from '../lib/calculator';

interface ExportButtonsProps {
  inputs: RetirementInputs;
  results: RetirementResults;
}

export function ExportButtons({ inputs, results }: ExportButtonsProps) {
  const exportToCSV = () => {
    const headers = ['Age', 'Balance', 'Contribution', 'Withdrawal', 'Interest'];
    const rows = results.projections.map(p => [
      p.age,
      p.balance.toFixed(2),
      p.contribution.toFixed(2),
      p.withdrawal.toFixed(2),
      p.interest.toFixed(2),
    ]);

    const csvContent = [
      '# Retirement Calculator Results',
      `# Generated: ${new Date().toLocaleString()}`,
      '',
      '# Inputs',
      `Current Age,${inputs.currentAge}`,
      `Retirement Age,${inputs.retirementAge}`,
      `Current Savings,${inputs.currentSavings}`,
      `Annual Contribution,${inputs.annualContribution}`,
      `Rate of Return,${inputs.rateOfReturn}%`,
      `Annual Spending,${inputs.annualSpending}`,
      `Inflation Rate,${inputs.inflationRate}%`,
      `Life Expectancy,${inputs.lifeExpectancy}`,
      '',
      '# Summary',
      `Goal Reached,${results.summary.retirementGoalReached ? 'Yes' : 'No'}`,
      `Age Money Runs Out,${results.summary.ageMoneyRunsOut || 'N/A'}`,
      `Final Balance,${results.summary.finalBalance.toFixed(2)}`,
      `Safe Withdrawal Rate,${results.summary.safeWithdrawalRate.toFixed(2)}%`,
      `Success Probability,${results.summary.successProbability.toFixed(1)}%`,
      '',
      '# Yearly Projections',
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `retirement-plan-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Retirement Calculator Results', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });
    
    // Summary Box
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 14, 40);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const summaryY = 48;
    const lineHeight = 6;
    
    const summaryText = [
      `Status: ${results.summary.retirementGoalReached ? '✓ On Track' : '✗ Needs Adjustment'}`,
      `Safe Withdrawal Rate: ${formatPercent(results.summary.safeWithdrawalRate)}`,
      `Success Probability: ${formatPercent(results.summary.successProbability)}`,
      `Final Balance: ${formatCurrency(results.summary.finalBalance)}`,
      `Total Contributions: ${formatCurrency(results.summary.totalContributions)}`,
      results.summary.ageMoneyRunsOut 
        ? `Money Runs Out: Age ${results.summary.ageMoneyRunsOut}` 
        : 'Money Lasts: Through life expectancy',
    ];
    
    summaryText.forEach((text, i) => {
      doc.text(text, 14, summaryY + (i * lineHeight));
    });
    
    // Inputs Table
    autoTable(doc, {
      startY: summaryY + (summaryText.length * lineHeight) + 10,
      head: [['Input', 'Value']],
      body: [
        ['Current Age', `${inputs.currentAge}`],
        ['Retirement Age', `${inputs.retirementAge}`],
        ['Current Savings', formatCurrency(inputs.currentSavings)],
        ['Annual Contribution', formatCurrency(inputs.annualContribution)],
        ['Rate of Return', formatPercent(inputs.rateOfReturn)],
        ['Annual Spending', formatCurrency(inputs.annualSpending)],
        ['Inflation Rate', formatPercent(inputs.inflationRate)],
        ['Life Expectancy', `${inputs.lifeExpectancy}`],
        ...(inputs.socialSecurityIncome ? [['Social Security', formatCurrency(inputs.socialSecurityIncome)]] : []),
        ...(inputs.pensionIncome ? [['Pension', formatCurrency(inputs.pensionIncome)]] : []),
      ],
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233] },
    });
    
    // Projections Table (sample every 5 years)
    const sampledProjections = results.projections.filter((_, i) => i % 5 === 0 || i === results.projections.length - 1);
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Age', 'Balance', 'Contribution', 'Withdrawal']],
      body: sampledProjections.map(p => [
        `${p.age}`,
        formatCurrency(p.balance),
        formatCurrency(p.contribution),
        formatCurrency(p.withdrawal),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [14, 165, 233] },
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Generated by retirement-calc | Not financial advice', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    
    doc.save(`retirement-plan-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Your Plan</h3>
      <div className="flex gap-3">
        <button
          onClick={exportToCSV}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download CSV
        </button>
        
        <button
          onClick={exportToPDF}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Download PDF
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        Your data stays private - exports are generated locally in your browser
      </p>
    </div>
  );
}
