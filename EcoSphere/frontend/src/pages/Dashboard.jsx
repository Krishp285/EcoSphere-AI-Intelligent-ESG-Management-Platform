import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Leaf,
  Users,
  Scale,
  Award,
  FileText,
  Zap,
  Target,
  Bot
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Progress from '../components/common/Progress';
import Button from '../components/common/Button';
import { useUser } from '../context/UserContext';
import { useEsg } from '../context/EsgContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const KPI_ICONS = {
  overall_score: Award,
  carbon_saved: Leaf,
  social_score: Users,
  governance_score: Scale,
  env_score: Leaf,
};

const KPI_COLORS = {
  overall_score: 'text-primary-600',
  carbon_saved: 'text-green-600',
  social_score: 'text-blue-600',
  governance_score: 'text-indigo-600',
  env_score: 'text-emerald-600',
};

export const Dashboard = () => {
  const { user, currentOrganization } = useUser();
  const { kpis, departments, transactions, aiInsights, monthlyTrend } = useEsg();

  // Show only the 4 headline KPIs on the executive dashboard
  const execKpis = kpis.filter(k => ['overall_score', 'carbon_saved', 'social_score', 'governance_score'].includes(k.id));

  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Good morning, {user?.name || 'Alex'}! 👋</h1>
          <p className="text-primary-100 max-w-xl">
            Here's what's happening with {currentOrganization || 'your organisation'}'s ESG initiatives today. Your overall health score is trending upwards.
          </p>
          <div className="mt-6 flex space-x-4">
            <Button variant="secondary" icon={FileText}>Generate Report</Button>
            <Button variant="outline" className="text-white border-white hover:bg-primary-700" icon={Zap}>Quick Actions</Button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
          <Leaf className="w-64 h-64" />
        </div>
      </div>

      {/* KPI Grid — driven by EsgContext */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {execKpis.map((kpi) => {
          const Icon = KPI_ICONS[kpi.id] || Award;
          const color = KPI_COLORS[kpi.id] || 'text-primary-600';
          return (
            <Card key={kpi.id} className="hover:-translate-y-1 transition-transform duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-gray-50 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={kpi.trend === 'up' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {kpi.change}
                </span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Analytics & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader title="Carbon Emissions Trend" subtitle="Actual vs Target (metric tons CO₂)" />
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A86B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00A86B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="actual" stroke="#00A86B" fillOpacity={1} fill="url(#colorCarbon)" name="Actual" />
                  <Area type="monotone" dataKey="target" stroke="#9ca3af" strokeDasharray="5 5" fill="none" name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Department Leaderboard" subtitle="ESG Score by Department" />
          <CardContent>
            <div className="space-y-4">
              {[...departments].sort((a, b) => b.score - a.score).map((dept, idx) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                      #{idx + 1}
                    </div>
                    <span className="font-medium text-gray-700 text-sm">{dept.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 w-1/2">
                    <Progress value={dept.score} className="flex-1" color="bg-primary-500" />
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{dept.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insight & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 border border-primary-100 bg-primary-50/30">
          <CardHeader
            title={
              <div className="flex items-center text-primary-800">
                <Bot className="w-5 h-5 mr-2" />
                AI Copilot Insights
              </div>
            }
            action={<Badge variant="primary">Live</Badge>}
          />
          <CardContent>
            <div className="space-y-3">
              {aiInsights.slice(0, 2).map(insight => (
                <div key={insight.id} className="p-4 bg-white rounded-lg border border-primary-100 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 flex items-center text-sm">
                      <Target className="w-4 h-4 mr-2 text-primary-600" />
                      {insight.recommendation}
                    </h4>
                    <Badge variant={insight.priority === 'Critical' ? 'danger' : 'warning'}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{insight.root_cause}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="text-green-600 font-medium">↓ {insight.expected_carbon_reduction} CO₂</span>
                    <span className="text-blue-600 font-medium">+{insight.esg_score_improvement} ESG</span>
                    <span className="font-medium">{insight.confidence}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Recent Activities" />
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${tx.status === 'Verified' ? 'bg-green-500' : tx.status === 'Failed' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.source} — {tx.department}</p>
                    <p className="text-xs text-gray-500">{tx.total_co2} tCO₂ · {tx.date}</p>
                    <Badge variant={tx.status === 'Verified' ? 'success' : tx.status === 'Failed' ? 'danger' : 'warning'} className="mt-1">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
