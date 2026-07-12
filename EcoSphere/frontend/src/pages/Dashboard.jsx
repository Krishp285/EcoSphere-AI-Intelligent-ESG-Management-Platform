import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Leaf, 
  Users, 
  Scale, 
  Award, 
  AlertCircle,
  FileText,
  Zap,
  Target,
  Bot
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Progress from '../components/common/Progress';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import { useUser } from '../context/UserContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock Data
const kpiData = [
  { title: 'Overall ESG Score', value: '85', change: '+2.5', icon: Award, color: 'text-primary-600', trend: 'up' },
  { title: 'Carbon Saved (tons)', value: '1,240', change: '+12%', icon: Leaf, color: 'text-green-600', trend: 'up' },
  { title: 'Social Impact Score', value: '92', change: '+4.1', icon: Users, color: 'text-blue-600', trend: 'up' },
  { title: 'Governance Score', value: '78', change: '-1.2', icon: Scale, color: 'text-indigo-600', trend: 'down' },
];

const chartData = [
  { name: 'Jan', carbon: 400, target: 240 },
  { name: 'Feb', carbon: 300, target: 220 },
  { name: 'Mar', carbon: 200, target: 200 },
  { name: 'Apr', carbon: 278, target: 180 },
  { name: 'May', carbon: 189, target: 160 },
  { name: 'Jun', carbon: 239, target: 140 },
];

const deptData = [
  { name: 'Manufacturing', score: 65, color: '#f87171' },
  { name: 'Logistics', score: 72, color: '#fbbf24' },
  { name: 'IT', score: 88, color: '#34d399' },
  { name: 'HR', score: 95, color: '#60a5fa' },
];

const timelineData = [
  { id: 1, type: 'audit', title: 'Q3 Environmental Audit Completed', time: '2 hours ago', status: 'success' },
  { id: 2, type: 'policy', title: 'New Diversity Policy Approved', time: '5 hours ago', status: 'success' },
  { id: 3, type: 'alert', title: 'Water usage spike in Facility B', time: '1 day ago', status: 'warning' },
];

export const Dashboard = () => {
  const { user, currentOrganization } = useUser();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Good morning, {user?.name || 'Alex'}! 👋</h1>
          <p className="text-primary-100 max-w-xl">
            Here's what's happening with {currentOrganization}'s ESG initiatives today. Your overall health score is trending upwards.
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

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <Card key={idx} className="hover:-translate-y-1 transition-transform duration-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</h3>
              </div>
              <div className={`p-2 rounded-lg bg-gray-50 ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
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
        ))}
      </div>

      {/* Analytics & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader title="Carbon Emissions Trend" subtitle="Actual vs Target (metric tons)" />
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A86B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00A86B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="carbon" stroke="#00A86B" fillOpacity={1} fill="url(#colorCarbon)" />
                  <Area type="monotone" dataKey="target" stroke="#9ca3af" strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Department Leaderboard" subtitle="Overall ESG Score by Dept" />
          <CardContent>
            <div className="space-y-4">
              {deptData.sort((a, b) => b.score - a.score).map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                      #{idx + 1}
                    </div>
                    <span className="font-medium text-gray-700">{dept.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 w-1/3">
                    <Progress value={dept.score} color={`bg-[${dept.color}]`} className="flex-1" />
                    <span className="text-sm font-bold text-gray-900">{dept.score}</span>
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
            action={<Badge variant="primary">98% Confidence</Badge>}
          />
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-primary-100 shadow-sm">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-primary-600" />
                  Recommendation: Optimize Logistics Routes
                </h4>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Based on recent carbon output data, optimizing delivery routes in the NA region could reduce emissions by approximately <strong>12%</strong> this quarter.
                </p>
                <div className="mt-4 flex space-x-3">
                  <Button size="sm">Apply Optimization</Button>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Recent Activities" />
          <CardContent>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {timelineData.map((item, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-lg border border-slate-200 bg-white shadow-sm ml-4 md:ml-0">
                    <div className="flex items-center justify-between mb-1 space-x-2">
                      <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                      <time className="font-medium text-xs text-primary-500">{item.time}</time>
                    </div>
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
