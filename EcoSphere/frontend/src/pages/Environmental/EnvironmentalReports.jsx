import React, { useRef } from 'react';
import { Download, FileText, TrendingUp, Leaf, CheckCircle2, Bot, Building2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Progress from '../../components/common/Progress';
import { useEsg } from '../../context/EsgContext';

const PIE_COLORS = ['#34d399', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa'];

const EnvironmentalReports = () => {
  const { kpis, departments, transactions, goals, aiInsights, monthlyTrend, emissionDistribution } = useEsg();
  const reportRef = useRef(null);

  const envScore = kpis.find(k => k.id === 'env_score');
  const carbonSaved = kpis.find(k => k.id === 'carbon_saved');
  const overallScore = kpis.find(k => k.id === 'overall_score');
  const totalCO2 = transactions.reduce((a, t) => a + t.total_co2, 0).toFixed(2);
  const verifiedCount = transactions.filter(t => t.status === 'Verified').length;
  const pendingCount = transactions.filter(t => t.status === 'Pending').length;

  const exportCSV = () => {
    const rows = [
      ['EcoSphere AI — Environmental Report'],
      ['Generated:', new Date().toLocaleString()],
      [],
      ['KPIs'],
      ['Metric', 'Value', 'Trend'],
      ...kpis.map(k => [k.title, k.value, k.change]),
      [],
      ['Carbon Transactions'],
      ['ID', 'Department', 'Source', 'CO2 (t)', 'Date', 'Status', 'Blockchain Hash'],
      ...transactions.map(t => [t.id, t.department, t.source, t.total_co2, t.date, t.status, t.blockchain_hash || 'N/A']),
      [],
      ['Sustainability Goals'],
      ['Name', 'Department', 'Target', 'Current', 'Completion %', 'Status', 'Deadline'],
      ...goals.map(g => [g.name, g.department, g.target, g.current, Math.round((g.current / g.target) * 100), g.status, g.deadline]),
      [],
      ['Department Scores'],
      ['Department', 'Score'],
      ...departments.map(d => [d.name, d.score]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `ecosphere_environmental_report_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const printPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Environmental Report</h2>
          <p className="text-sm text-gray-500">Generated: {new Date().toLocaleString()}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" icon={Download} onClick={exportCSV}>Export CSV</Button>
          <Button variant="outline" icon={Download} onClick={printPDF}>Export PDF</Button>
          <Button variant="secondary" icon={FileText}>Export Excel</Button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-6 print:text-black">

        {/* Executive Summary */}
        <Card>
          <CardHeader title="Executive Summary" subtitle={`Reporting Period: Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`} />
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: 'Environmental Score', value: envScore?.value || '--', icon: Leaf, color: 'text-green-600' },
                { label: 'Total CO₂ Emitted', value: `${totalCO2} t`, icon: TrendingUp, color: 'text-red-500' },
                { label: 'Carbon Saved', value: `${carbonSaved?.value || '--'} t`, icon: Leaf, color: 'text-primary-600' },
                { label: 'Overall ESG Score', value: overallScore?.value || '--', icon: TrendingUp, color: 'text-blue-600' },
              ].map(item => (
                <div key={item.label} className="text-center p-4 bg-gray-50 rounded-xl">
                  <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
              <p className="text-sm text-primary-900">
                <strong>Summary:</strong> EcoSphere AI has tracked <strong>{transactions.length}</strong> carbon transactions across <strong>{departments.length}</strong> departments.
                Overall ESG score stands at <strong>{overallScore?.value}</strong> with an environmental sub-score of <strong>{envScore?.value}</strong>.
                <strong>{verifiedCount}</strong> transactions are blockchain-verified; <strong>{pendingCount}</strong> are pending verification.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Monthly Carbon Trend" />
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend}>
                    <defs>
                      <linearGradient id="reportActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00A86B" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#00A86B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="actual" stroke="#00A86B" fill="url(#reportActual)" name="Actual" />
                    <Area type="monotone" dataKey="target" stroke="#9ca3af" strokeDasharray="5 5" fill="none" name="Target" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Emission Distribution" />
            <CardContent>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={emissionDistribution} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                      {emissionDistribution.map((e, i) => <Cell key={i} fill={e.color || PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {emissionDistribution.map((e, i) => (
                  <div key={e.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color || PIE_COLORS[i % PIE_COLORS.length] }} />
                    {e.name}: {e.value}%
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Report */}
        <Card>
          <CardHeader title="Department Summary" subtitle="ESG scores and carbon footprint by department" />
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    {['Department', 'ESG Score', 'Performance', 'CO₂ Emitted (t)', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...departments].sort((a, b) => b.score - a.score).map((dept, idx) => {
                    const co2 = transactions.filter(t => t.department === dept.name).reduce((a, t) => a + t.total_co2, 0).toFixed(2);
                    return (
                      <tr key={dept.name} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 flex items-center gap-2">
                          {idx === 0 && <span className="text-yellow-500">🏆</span>}{dept.name}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-primary-700">{dept.score}/100</td>
                        <td className="px-4 py-3 w-32"><Progress value={dept.score} color={dept.score >= 85 ? 'bg-green-500' : dept.score >= 70 ? 'bg-primary-500' : 'bg-yellow-500'} size="sm" /></td>
                        <td className="px-4 py-3 text-sm text-gray-700">{co2}</td>
                        <td className="px-4 py-3">
                          <Badge variant={dept.score >= 85 ? 'success' : dept.score >= 70 ? 'primary' : 'warning'}>
                            {dept.score >= 85 ? 'Leading' : dept.score >= 70 ? 'On Track' : 'Needs Attention'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Bot className="w-5 h-5 text-primary-600" />AI Recommendation Summary</span>} />
          <CardContent>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={insight.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h4 className="font-semibold text-sm text-gray-900">{i + 1}. {insight.category}</h4>
                    <div className="flex gap-2">
                      <Badge variant={insight.priority === 'Critical' ? 'danger' : insight.priority === 'High' ? 'warning' : 'gray'}>{insight.priority}</Badge>
                      <Badge variant="gray">Risk: {insight.risk_level}</Badge>
                      <Badge variant="success">{insight.confidence}% confidence</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-1"><strong>Root Cause:</strong> {insight.root_cause}</p>
                  <p className="text-sm text-gray-700 mb-2">{insight.recommendation}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded">↓ {insight.expected_carbon_reduction} CO₂</span>
                    <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded">💰 {insight.estimated_cost_savings}</span>
                    <span className="text-primary-700 bg-primary-50 px-2 py-0.5 rounded">+{insight.esg_score_improvement} ESG Score</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Verification Status */}
        <Card>
          <CardHeader title="Blockchain Verification Status" />
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: 'Verified', count: transactions.filter(t => t.status === 'Verified').length, variant: 'success' },
                { label: 'Pending', count: transactions.filter(t => t.status === 'Pending').length, variant: 'warning' },
                { label: 'Verifying', count: transactions.filter(t => t.status === 'Verifying').length, variant: 'primary' },
                { label: 'Failed', count: transactions.filter(t => t.status === 'Failed').length, variant: 'danger' },
              ].map(s => (
                <div key={s.label} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{s.count}</p>
                  <Badge variant={s.variant} className="mt-1">{s.label}</Badge>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    {['Transaction ID', 'Source', 'Status', 'Hash', 'Verified At'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-xs font-mono text-primary-700">{tx.id}</td>
                      <td className="px-4 py-2 text-xs text-gray-700">{tx.source}</td>
                      <td className="px-4 py-2">
                        <Badge variant={tx.status === 'Verified' ? 'success' : tx.status === 'Failed' ? 'danger' : 'warning'}>{tx.status}</Badge>
                      </td>
                      <td className="px-4 py-2 text-xs font-mono text-gray-500">{tx.blockchain_hash || 'N/A'}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">{tx.verification_ts ? new Date(tx.verification_ts).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Goals Summary */}
        <Card>
          <CardHeader title="Sustainability Goals Progress" />
          <CardContent>
            <div className="space-y-3">
              {goals.map(g => {
                const pct = Math.round((g.current / g.target) * 100);
                return (
                  <div key={g.id} className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-900 truncate">{g.name}</span>
                        <span className="text-gray-500 flex-shrink-0 ml-2">{g.current}/{g.target} {g.unit}</span>
                      </div>
                      <Progress value={g.current} max={g.target}
                        color={g.status === 'Achieved' ? 'bg-green-500' : g.status === 'At Risk' ? 'bg-red-500' : 'bg-primary-500'}
                        size="md"
                      />
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-bold text-gray-900">{pct}%</p>
                      <Badge variant={g.status === 'Achieved' ? 'success' : g.status === 'At Risk' ? 'danger' : 'primary'} className="text-xs">{g.status}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnvironmentalReports;
