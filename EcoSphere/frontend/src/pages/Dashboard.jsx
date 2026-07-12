import React, { useState } from 'react';
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
  Bot,
  Activity,
  Sparkles,
  Cpu,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Coins,
  ArrowRight
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Progress from '../components/common/Progress';
import Button from '../components/common/Button';
import { useUser } from '../context/UserContext';
import { useEsg } from '../context/EsgContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Legend
} from 'recharts';

const KPI_ICONS = {
  overall_score: Award,
  carbon_saved: Leaf,
  social_score: Users,
  governance_score: Scale,
  env_score: Leaf,
};

const KPI_COLORS = {
  overall_score: 'text-primary-600 bg-primary-50 border-primary-100',
  carbon_saved: 'text-green-600 bg-green-50 border-green-100',
  social_score: 'text-blue-600 bg-blue-50 border-blue-100',
  governance_score: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  env_score: 'text-emerald-600 bg-emerald-50 border-emerald-100',
};

const ACTIVITY_ICONS = {
  blockchain: ShieldCheck,
  ai: Bot,
  governance: Scale,
  challenge: Sparkles,
  report: FileText,
  default: Activity,
};

export const Dashboard = () => {
  const { user, currentOrganization } = useUser();
  const { kpis, departments, transactions, aiInsights, monthlyTrend, liveActivities, executiveBrief } = useEsg();
  const [activeTab, setActiveTab] = useState('executive');

  // Digital Twin state
  const [simRenewable, setSimRenewable] = useState(30);
  const [simEv, setSimEv] = useState(10);
  const [simTrees, setSimTrees] = useState(500);
  const [simWaste, setSimWaste] = useState(15);
  const [simCsr, setSimCsr] = useState(10); // in Lakhs
  const [simGreen, setSimGreen] = useState(20);

  // Derive metrics
  const execKpis = kpis.filter(k => ['overall_score', 'carbon_saved', 'social_score', 'governance_score'].includes(k.id));
  const overallKpi = kpis.find(k => k.id === 'overall_score');
  const scoreVal = overallKpi ? parseInt(overallKpi.value) : 85;

  const totalCO2 = transactions.reduce((acc, curr) => acc + parseFloat(curr.total_co2 || 0), 0);

  let grade = 'A';
  if (scoreVal >= 95) grade = 'A++';
  else if (scoreVal >= 90) grade = 'A+';
  else if (scoreVal >= 85) grade = 'A';
  else if (scoreVal >= 80) grade = 'B+';
  else if (scoreVal >= 75) grade = 'B';
  else if (scoreVal >= 70) grade = 'B-';
  else if (scoreVal >= 60) grade = 'C';
  else grade = 'D';

  // Digital Twin calculations
  const simScore = Math.min(100, Math.round(scoreVal + (simRenewable - 30) * 0.15 + (simEv - 10) * 0.1 + (simTrees - 500) * 0.0012 + (simWaste - 15) * 0.16 + (simCsr - 10) * 0.35 + (simGreen - 20) * 0.22));
  const carbonReduced = Math.max(0, Math.round(1240 - totalCO2 + (simRenewable * 7.5) + (simEv * 4.2) + (simTrees * 0.015) + (simWaste * 2.8) + (simGreen * 8.4)));
  const costSaving = Math.max(0, Math.round((simRenewable * 14000) + (simWaste * 7500) + (simGreen * 16500)));
  const compliancePct = Math.min(100, Math.round(80 + (simWaste * 0.4) + (simGreen * 0.5)));

  // Predictive Forecast Data
  const forecastData = [
    { name: 'Jun', actual: totalCO2.toFixed(1), predicted: totalCO2.toFixed(1), confidence: 100 },
    { name: 'Jul', actual: null, predicted: (totalCO2 * 0.96).toFixed(1), confidence: 95 },
    { name: 'Aug', actual: null, predicted: (totalCO2 * 0.93).toFixed(1), confidence: 90 },
    { name: 'Sep', actual: null, predicted: (totalCO2 * 0.88).toFixed(1), confidence: 85 },
    { name: 'Oct', actual: null, predicted: (totalCO2 * 0.84).toFixed(1), confidence: 80 },
    { name: 'Nov', actual: null, predicted: (totalCO2 * 0.79).toFixed(1), confidence: 75 },
  ];

  const forecastScoreData = [
    { name: 'Jun', actual: scoreVal, predicted: scoreVal },
    { name: 'Jul', actual: null, predicted: Math.min(100, scoreVal + 1) },
    { name: 'Aug', actual: null, predicted: Math.min(100, scoreVal + 2) },
    { name: 'Sep', actual: null, predicted: Math.min(100, scoreVal + 3) },
    { name: 'Oct', actual: null, predicted: Math.min(100, scoreVal + 4) },
    { name: 'Nov', actual: null, predicted: Math.min(100, scoreVal + 6) },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Control */}
      <div className="flex border-b border-gray-200 gap-6">
        {[
          { id: 'executive', name: 'Executive Command', icon: Sparkles },
          { id: 'predictive', name: 'Predictive Forecasts', icon: Cpu },
          { id: 'twin', name: 'Digital Twin Sim', icon: Layers }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === t.id
                ? 'border-primary-600 text-primary-600 font-extrabold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.name}
          </button>
        ))}
      </div>

      {/* Tab 1: Executive Command */}
      {activeTab === 'executive' && (
        <div className="space-y-6">
          {/* Executive Command Center Hero */}
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/40 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 p-6 text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.65)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,168,107,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.14),transparent_30%)]" />
            <div className="absolute -top-10 right-0 text-white/5">
              <Leaf className="w-96 h-96" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.55fr_0.95fr] gap-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-primary-500/20 text-primary-200 border border-primary-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.28em] uppercase flex items-center gap-1.5 animate-pulse">
                    <Activity className="w-3.5 h-3.5" /> {executiveBrief.healthStatus} ESG Health Status
                  </span>
                  <span className="bg-emerald-500/15 text-emerald-200 border border-emerald-500/25 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.28em] uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> {executiveBrief.complianceStatus}
                  </span>
                  <span className="bg-slate-800/80 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.28em] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Organization ESG Grade {executiveBrief.grade}
                  </span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight">Executive Command Center</h1>
                  <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                    {currentOrganization || 'Acme Corp (Global)'} · Presented for {user?.name || 'Administrator'}.
                  </p>
                </div>

                <div className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary-200 tracking-[0.22em] uppercase">
                    <Bot className="w-4.5 h-4.5 animate-bounce text-primary-300" /> AI Executive Assessment
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">{executiveBrief.summary}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Priority', value: executiveBrief.priority, color: 'text-primary-200' },
                    { label: 'Confidence', value: executiveBrief.confidence, color: 'text-emerald-200' },
                    { label: 'Estimated Savings', value: executiveBrief.estimatedSavings, color: 'text-sky-200' },
                    { label: 'ESG Improvement', value: `${executiveBrief.estimatedImprovement} pts`, color: 'text-indigo-200' },
                  ].map(stat => (
                    <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-400 font-bold">{stat.label}</span>
                      <span className={`block mt-1 text-sm font-extrabold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Carbon Trend Indicator', value: executiveBrief.carbonTrend, color: 'text-green-300' },
                    { label: 'Compliance Status', value: executiveBrief.complianceStatus, color: 'text-emerald-300' },
                    { label: 'Sustainability Progress', value: executiveBrief.sustainabilityProgress, color: 'text-amber-200' },
                    { label: 'Risk Level', value: executiveBrief.riskLevel, color: 'text-rose-200' },
                  ].map(stat => (
                    <div key={stat.label} className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                      <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-400 font-bold">{stat.label}</span>
                      <span className={`block mt-1 text-sm font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-center shadow-2xl">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400 font-bold">Organization ESG Grade</div>
                  <div className="mt-3 text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-primary-300 to-sky-300">{grade}</div>
                  <p className="mt-2 text-xs text-slate-400">Live executive-grade performance snapshot</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold">Live ESG Risk Meter</span>
                    <span className="font-bold text-emerald-300">{executiveBrief.liveRiskMeter}/100</span>
                  </div>
                  <Progress value={100 - executiveBrief.liveRiskMeter} color="bg-gradient-to-r from-emerald-400 to-amber-400" className="mt-3 h-2.5" />
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                    Next recommended action: {executiveBrief.nextRecommendedAction}.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Estimated ESG Improvement', value: `${executiveBrief.estimatedImprovement} pts` },
                    { label: 'Compliance Risk', value: executiveBrief.riskLevel },
                  ].map(stat => (
                    <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-400 font-bold">{stat.label}</span>
                      <span className="block mt-1 text-sm font-bold text-white">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Headline KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {execKpis.map((kpi) => {
              const Icon = KPI_ICONS[kpi.id] || Award;
              const colorClasses = KPI_COLORS[kpi.id] || 'text-primary-600 bg-primary-50';
              return (
                <Card key={kpi.id} className="hover:-translate-y-1 transition-all duration-200 border border-gray-150 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{kpi.title}</p>
                      <h3 className="text-3xl font-black text-gray-900 mt-1">{kpi.value}</h3>
                    </div>
                    <div className={`p-2 rounded-xl border ${colorClasses}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={kpi.trend === 'up' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {kpi.change}
                      </span>
                      <span className="text-gray-500 ml-2">vs last month</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 font-bold px-1.5 py-0.5 rounded text-gray-600">Verified</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Primary Trend Charts & Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2 border border-gray-200">
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
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }} />
                      <Area type="monotone" dataKey="actual" stroke="#00A86B" strokeWidth={2} fillOpacity={1} fill="url(#colorCarbon)" name="Actual" />
                      <Area type="monotone" dataKey="target" stroke="#9ca3af" strokeDasharray="5 5" fill="none" name="Target" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader title="Department Leaderboard" subtitle="ESG Score Performance Mapping" />
              <CardContent>
                <div className="space-y-4">
                  {[...departments].sort((a, b) => b.score - a.score).map((dept, idx) => (
                    <div key={dept.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                          #{idx + 1}
                        </div>
                        <span className="font-semibold text-gray-700 text-xs">{dept.name}</span>
                      </div>
                      <div className="flex items-center space-x-3 w-1/2">
                        <Progress value={dept.score} className="flex-1 h-2" color="bg-primary-500" />
                        <span className="text-xs font-bold text-gray-900 w-8 text-right">{dept.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights & Live Activities Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2 border border-primary-100 bg-primary-50/20">
              <CardHeader
                title={
                  <div className="flex items-center text-primary-850 font-bold">
                    <Bot className="w-5 h-5 mr-2 text-primary-600 animate-bounce" />
                    AI Action Advisory
                  </div>
                }
                action={<Badge variant="primary">Smart Engine</Badge>}
              />
              <CardContent>
                <div className="space-y-3">
                  {aiInsights.slice(0, 2).map(insight => (
                    <div key={insight.id} className="p-4 bg-white rounded-xl border border-primary-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-gray-900 flex items-center text-xs">
                          <Target className="w-4 h-4 mr-2 text-primary-600" />
                          {insight.recommendation}
                        </h4>
                        <Badge variant={insight.priority === 'Critical' ? 'danger' : 'warning'}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-2xs text-gray-500 leading-normal">{insight.root_cause}</p>
                      <div className="flex items-center gap-4 text-2xs text-gray-600 mt-2 pt-2 border-t border-gray-100">
                        <span className="text-green-600 font-bold">↓ {insight.expected_carbon_reduction} Carbon</span>
                        <span className="text-blue-600 font-bold">+{insight.esg_score_improvement} ESG points</span>
                        <span className="font-bold">{insight.confidence}% confidence</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader title="Live Activity Feed" subtitle="Real-time blockchain validations" />
              <CardContent>
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {liveActivities.map((act) => (
                    <div key={act.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                      <div className="mt-1 flex-shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                          {(() => {
                            const Icon = ACTIVITY_ICONS[act.type] || ACTIVITY_ICONS.default;
                            return <Icon className="w-4 h-4 text-primary-600" />;
                          })()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold text-gray-900 truncate">{act.title}</p>
                            <p className="text-2xs text-gray-500 leading-snug mt-0.5">{act.desc}</p>
                          </div>
                          <Badge variant="primary" className={`${act.badgeColor} uppercase text-[9px] font-bold py-0.5 px-1.5 border`}>
                            {act.type}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-1">{act.ts}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Predictive Forecasts */}
      {activeTab === 'predictive' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Carbon Emission Forecast */}
          <Card className="lg:col-span-2">
            <CardHeader title="Carbon Emission Forecast (tCO₂e)" subtitle="AI projected emissions modeling based on historical data" />
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData}>
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#00A86B" strokeWidth={3} name="Actual Emissions" />
                    <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={3} strokeDasharray="5 5" name="AI Projected Path" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Predictive Summary KPI Cards */}
          <div className="space-y-4">
            <Card>
              <CardHeader title="ESG Rating Projection" subtitle="Predicted score trend" />
              <CardContent className="space-y-4">
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastScoreData}>
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={3.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="pt-2 border-t flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">Current Rating:</span>
                  <span className="text-gray-900 font-bold">{grade} ({scoreVal})</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">AI Target Rating:</span>
                  <span className="text-primary-600 font-bold">A++ ({scoreVal + 6})</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-white">
              <CardHeader title="AI Forecast Advisory" subtitle="Confidence Index: 92%" />
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Sparkles className="w-4.5 h-4.5" />
                  <span>PREDICTION SUCCESS SIMULATION</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Completing the IT Green Cooling compressor replacement this month will accelerate the 2030 Net Zero deadline targets by approximately 14 months.
                </p>
                <div className="flex items-center gap-1.5 text-2xs text-green-400 font-bold">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Expected compliance risk is stable.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: ESG Digital Twin Simulator */}
      {activeTab === 'twin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Controls Sliders */}
          <Card className="lg:col-span-2">
            <CardHeader title="ESG Digital Twin Simulator" subtitle="Interact with operational parameters to preview ESG updates" />
            <CardContent className="space-y-5">
              
              {/* Renewable Sliders */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-emerald-500" /> Renewable Energy Share</span>
                  <span className="text-emerald-600 font-bold">{simRenewable}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={simRenewable} onChange={e => setSimRenewable(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* EVs Sliders */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Fleet Electrification</span>
                  <span className="text-amber-600 font-bold">{simEv}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={simEv} onChange={e => setSimEv(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Trees sliders */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1.5"><Leaf className="w-4 h-4 text-green-500" /> Tree Plantation (Trees)</span>
                  <span className="text-green-600 font-bold">{simTrees} trees</span>
                </div>
                <input 
                  type="range" min="0" max="5000" step="50" value={simTrees} onChange={e => setSimTrees(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>

              {/* Waste sliders */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-orange-500" /> Waste Recycled Ratio</span>
                  <span className="text-orange-600 font-bold">{simWaste}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={simWaste} onChange={e => setSimWaste(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* CSR investment sliders */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1.5"><Coins className="w-4 h-4 text-blue-500" /> CSR Investment allocation</span>
                  <span className="text-blue-600 font-bold">₹{simCsr} Lakhs</span>
                </div>
                <input 
                  type="range" min="0" max="50" step="1" value={simCsr} onChange={e => setSimCsr(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Green Manufacturing sliders */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-indigo-500" /> Green Factory Efficiency</span>
                  <span className="text-indigo-600 font-bold">{simGreen}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={simGreen} onChange={e => setSimGreen(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

            </CardContent>
          </Card>

          {/* Simulator Outcomes */}
          <div className="space-y-4">
            <Card className="border border-primary-50 bg-primary-50/10">
              <CardHeader title="Simulated Outcomes" subtitle="Live projection values" />
              <CardContent className="space-y-4">
                
                {/* Score */}
                <div className="p-3 bg-white rounded-xl border border-gray-150 flex items-center justify-between">
                  <div>
                    <span className="text-4xs text-gray-400 font-bold uppercase tracking-wider block">Estimated ESG Score</span>
                    <span className="text-2xl font-black text-primary-600 mt-1 block">{simScore}/100</span>
                  </div>
                  <Badge variant={simScore >= scoreVal ? 'success' : 'danger'}>
                    {simScore - scoreVal >= 0 ? `+${simScore - scoreVal}` : simScore - scoreVal} pts
                  </Badge>
                </div>

                {/* Carbon reduced */}
                <div className="p-3 bg-white rounded-xl border border-gray-150 flex items-center justify-between">
                  <div>
                    <span className="text-4xs text-gray-400 font-bold uppercase tracking-wider block">Carbon Offset Projected</span>
                    <span className="text-xl font-bold text-green-600 mt-1 block">{carbonReduced} tCO₂e</span>
                  </div>
                </div>

                {/* Cost savings */}
                <div className="p-3 bg-white rounded-xl border border-gray-150 flex items-center justify-between">
                  <div>
                    <span className="text-4xs text-gray-400 font-bold uppercase tracking-wider block">Projected Cost Savings</span>
                    <span className="text-xl font-bold text-blue-600 mt-1 block">₹{costSaving.toLocaleString()} / yr</span>
                  </div>
                </div>

                {/* Compliance progress */}
                <div className="p-3 bg-white rounded-xl border border-gray-150 space-y-1.5">
                  <div className="flex justify-between text-2xs font-bold text-gray-700">
                    <span>COMPLIANCE INDEX</span>
                    <span>{compliancePct}%</span>
                  </div>
                  <Progress value={compliancePct} color="bg-primary-500" />
                </div>

              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-white flex flex-col justify-center text-center p-6 border border-slate-800">
              <Bot className="w-12 h-12 mx-auto text-primary-400 animate-bounce mb-3" />
              <h4 className="font-bold text-xs">AI Advisory Sync</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Adjusting ESG Digital Twin parameters calculates direct projections against historical operations matrices. Apply this config to overwrite settings.
              </p>
            </Card>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
