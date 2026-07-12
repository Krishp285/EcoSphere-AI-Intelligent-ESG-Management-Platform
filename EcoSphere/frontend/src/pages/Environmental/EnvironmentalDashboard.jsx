import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Leaf, AlertTriangle,
  Target, Calculator, ArrowLeftRight, Bot, CheckCircle2, Clock
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Progress from '../../components/common/Progress';
import Button from '../../components/common/Button';
import { useEsg } from '../../context/EsgContext';

const COLORS = ['#34d399', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa'];

const VerificationBadge = ({ status }) => {
  const map = {
    Verified: { variant: 'success', icon: CheckCircle2 },
    Pending: { variant: 'warning', icon: Clock },
    Verifying: { variant: 'primary', icon: Clock },
    Failed: { variant: 'danger', icon: AlertTriangle },
  };
  const cfg = map[status] || map.Pending;
  const Icon = cfg.icon;
  return (
    <Badge variant={cfg.variant} className="flex items-center gap-1">
      <Icon className="w-3 h-3" /> {status}
    </Badge>
  );
};

const EnvironmentalDashboard = () => {
  const { kpis, departments, transactions, goals, aiInsights, monthlyTrend, emissionDistribution } = useEsg();

  const envKpis = kpis.filter(k => ['carbon_saved', 'env_score', 'overall_score'].includes(k.id));
  const totalCO2 = transactions.reduce((a, t) => a + t.total_co2, 0).toFixed(2);
  const goalProgress = goals.map(g => ({ ...g, completion: Math.round((g.current / g.target) * 100) }));

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total CO2 card */}
        <Card className="hover:-translate-y-1 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total CO₂ Emitted</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalCO2}</h3>
              <p className="text-xs text-gray-400">metric tons</p>
            </div>
            <div className="p-2 rounded-lg bg-red-50 text-red-500">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {envKpis.map(kpi => (
          <Card key={kpi.id} className="hover:-translate-y-1 transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</h3>
              </div>
              <div className="p-2 rounded-lg bg-green-50 text-green-500">
                <Leaf className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {kpi.trend === 'up'
                ? <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                : <TrendingDown className="w-4 h-4 text-red-500 mr-1" />}
              <span className={kpi.trend === 'up' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{kpi.change}</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Monthly Carbon Trend" subtitle="Actual vs Target (tCO₂)" />
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="envActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A86B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00A86B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="actual" stroke="#00A86B" fill="url(#envActual)" name="Actual" />
                  <Area type="monotone" dataKey="target" stroke="#9ca3af" strokeDasharray="5 5" fill="none" name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Emission Distribution" subtitle="By source category" />
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={emissionDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {emissionDistribution.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color || COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {emissionDistribution.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color || COLORS[idx % COLORS.length] }} />
                  {item.name} ({item.value}%)
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Department Carbon Comparison" subtitle="ESG scores by department" />
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departments} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="score" name="ESG Score" radius={[4, 4, 0, 0]}>
                    {departments.map((dept, idx) => (
                      <Cell key={dept.name} fill={dept.color || COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Goal Progress */}
        <Card>
          <CardHeader title="Goal Progress" subtitle="Sustainability targets" />
          <CardContent>
            <div className="space-y-4">
              {goalProgress.slice(0, 4).map(goal => (
                <div key={goal.id}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium truncate mr-2">{goal.name}</span>
                    <span className="font-bold flex-shrink-0">{goal.completion}%</span>
                  </div>
                  <Progress value={goal.current} max={goal.target}
                    color={goal.status === 'Achieved' ? 'bg-green-500' : goal.status === 'At Risk' ? 'bg-red-500' : 'bg-primary-500'}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-primary-100 bg-primary-50/30">
          <CardHeader
            title={<span className="flex items-center gap-2"><Bot className="w-5 h-5 text-primary-600" />AI Recommendation Engine</span>}
            action={<Badge variant="primary">Real-time</Badge>}
          />
          <CardContent>
            <div className="space-y-3">
              {aiInsights.map(insight => (
                <div key={insight.id} className="p-4 bg-white rounded-lg border border-primary-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-gray-900">{insight.category}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={insight.priority === 'Critical' ? 'danger' : insight.priority === 'High' ? 'warning' : 'gray'}>
                        {insight.priority}
                      </Badge>
                      <span className="text-xs text-gray-400">Risk: {insight.risk_level}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2"><strong>Root Cause:</strong> {insight.root_cause}</p>
                  <p className="text-sm text-gray-700 mb-3">{insight.recommendation}</p>
                  <div className="flex flex-wrap gap-3 text-xs mb-3">
                    <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full">↓ {insight.expected_carbon_reduction} CO₂</span>
                    <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">💰 {insight.estimated_cost_savings}</span>
                    <span className="text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">+{insight.esg_score_improvement} ESG</span>
                    <span className="text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">{insight.confidence}% confidence</span>
                  </div>
                  <Button size="sm" variant="outline" icon={Target}>Apply Recommendation (placeholder)</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Recent Transactions" action={
            <Link to="/environmental/transactions" className="text-xs text-primary-600 hover:underline">View all</Link>
          } />
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="border-b border-gray-50 pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tx.source}</p>
                      <p className="text-xs text-gray-500">{tx.department} · {tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{tx.total_co2} tCO₂</p>
                      <VerificationBadge status={tx.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader title="Quick Actions" />
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/environmental/calculator">
              <Button variant="outline" icon={Calculator} fullWidth>Calculate Carbon</Button>
            </Link>
            <Link to="/environmental/transactions">
              <Button variant="outline" icon={ArrowLeftRight} fullWidth>View Transactions</Button>
            </Link>
            <Link to="/environmental/goals">
              <Button variant="outline" icon={Target} fullWidth>Manage Goals</Button>
            </Link>
            <Link to="/environmental/reports">
              <Button variant="outline" icon={Bot} fullWidth>Generate Report</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalDashboard;
