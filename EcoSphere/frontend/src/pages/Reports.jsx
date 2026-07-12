import React, { useState, useMemo } from 'react';
import { FileText, Download, TrendingUp, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useEsg } from '../context/EsgContext';

export const Reports = () => {
  const { kpis, transactions, goals, departments } = useEsg();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const totalCO2 = transactions.reduce((acc, curr) => acc + curr.total_co2, 0).toFixed(2);
  const avgDeptScore = useMemo(() => {
    return Math.round(departments.reduce((acc, curr) => acc + curr.score, 0) / departments.length);
  }, [departments]);

  const reportLogs = [
    { id: 'REP-01', title: 'Environmental Carbon Report', category: 'Environmental', date: '2024-02-15', format: 'PDF', size: '2.4 MB' },
    { id: 'REP-02', title: 'Q1 ESG Executive Summary', category: 'Executive', date: '2024-02-22', format: 'PDF', size: '4.1 MB' },
    { id: 'REP-03', title: 'Volunteering & Social CSR Report', category: 'Social', date: '2024-02-10', format: 'CSV', size: '345 KB' },
    { id: 'REP-04', title: 'Corporate Policies Compliance Audit', category: 'Governance', date: '2024-02-18', format: 'Excel', size: '1.2 MB' },
  ];

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return reportLogs;
    return reportLogs.filter(r => r.category === selectedCategory);
  }, [selectedCategory]);

  const exportAllCSV = () => {
    const rows = [
      ['EcoSphere AI — ESG Consolidated Report'],
      ['Reporting Date:', new Date().toLocaleDateString()],
      [],
      ['KPI Metrics Summary'],
      ['Metric', 'Value', 'Change'],
      ...kpis.map(k => [k.title, k.value, k.change]),
      [],
      ['Department Performance'],
      ['Department', 'ESG Score'],
      ...departments.map(d => [d.name, d.score]),
      [],
      ['Recent Transactions Log'],
      ['ID', 'Department', 'Resource', 'Emissions (t)', 'Date', 'Status'],
      ...transactions.map(t => [t.id, t.department, t.source, t.total_co2, t.date, t.status])
    ];
    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecosphere_esg_master_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ESG Consolidated Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate corporate Environmental, Social, and Governance compliance reports</p>
        </div>
        <Button icon={Download} onClick={exportAllCSV}>Export Master ESG Data (CSV)</Button>
      </div>

      {/* Overview Block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall ESG Rating', val: 'A+', note: 'Acme Corp (Global)' },
          { label: 'Avg Department Score', val: `${avgDeptScore}/100`, note: 'Corporate Average' },
          { label: 'Active Goals Tracked', val: goals.length, note: 'Sustainability Goals' },
          { label: 'Total Q1 Emissions', val: `${totalCO2} t`, note: 'Metric Tons CO₂e' },
        ].map(item => (
          <Card key={item.label}>
            <p className="text-sm text-gray-500 font-medium">{item.label}</p>
            <p className="text-3xl font-extrabold text-primary-700 mt-1">{item.val}</p>
            <p className="text-xs text-gray-400 mt-1">{item.note}</p>
          </Card>
        ))}
      </div>

      {/* Document Center Table */}
      <Card>
        <CardHeader title="Report Repository" subtitle="Download compliance documents and auditing summaries" />
        <CardContent>
          {/* Category Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {['All', 'Environmental', 'Social', 'Governance', 'Executive'].map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === cat ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  {['Report Title', 'Category', 'Generated Date', 'Format', 'Size', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(rep => (
                  <tr key={rep.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary-600" />
                        {rep.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <Badge variant="primary">{rep.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{rep.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-bold">{rep.format}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{rep.size}</td>
                    <td className="px-4 py-3 text-sm">
                      <Button size="sm" variant="outline" icon={Download} onClick={() => window.print()}>Download</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
