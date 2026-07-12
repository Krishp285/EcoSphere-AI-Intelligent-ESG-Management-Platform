import React, { useMemo } from 'react';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Progress from '../../components/common/Progress';
import { useEsg } from '../../context/EsgContext';

const MONTHLY_HISTORY = {
  Manufacturing: [58, 61, 60, 63, 62, 65],
  Logistics: [68, 70, 69, 71, 70, 72],
  IT: [82, 84, 85, 86, 87, 88],
  HR: [90, 92, 93, 93, 94, 95],
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const DEPT_COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#a78bfa'];

const DepartmentTracking = () => {
  const { departments, transactions } = useEsg();

  const ranked = useMemo(() => [...departments].sort((a, b) => b.score - a.score), [departments]);

  const carbonByDept = useMemo(() => {
    const map = {};
    transactions.forEach(tx => {
      if (!map[tx.department]) map[tx.department] = 0;
      map[tx.department] += tx.total_co2;
    });
    return departments.map(d => ({ name: d.name, co2: parseFloat((map[d.name] || 0).toFixed(2)), score: d.score }));
  }, [transactions, departments]);

  const trendData = useMemo(() =>
    MONTHS.map((m, i) => ({
      month: m,
      ...Object.fromEntries(Object.entries(MONTHLY_HISTORY).map(([dept, vals]) => [dept, vals[i]])),
    }))
  , []);

  return (
    <div className="space-y-6">
      {/* Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="ESG Score Leaderboard" subtitle="Ranked by overall department ESG score" />
          <CardContent>
            <div className="space-y-3">
              {ranked.map((dept, idx) => (
                <div key={dept.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                    idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-600' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {idx === 0 ? <Trophy className="w-5 h-5" /> : `#${idx + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-900">{dept.name}</span>
                      <span className="font-bold text-gray-900 text-lg">{dept.score}</span>
                    </div>
                    <Progress value={dept.score} max={100} color={dept.score >= 85 ? 'bg-green-500' : dept.score >= 70 ? 'bg-primary-500' : 'bg-yellow-500'} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Carbon Emissions by Department" subtitle="Total tCO₂ emitted" />
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carbonByDept} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} width={90} />
                  <Tooltip formatter={(v) => `${v} tCO₂`} />
                  <Bar dataKey="co2" name="CO₂ Emitted" fill="#f87171" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Score Trend */}
      <Card>
        <CardHeader title="Historical ESG Score Trend" subtitle="Monthly department score progression" />
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[50, 100]} stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                {Object.keys(MONTHLY_HISTORY).map((dept, i) => (
                  <Line key={dept} type="monotone" dataKey={dept} stroke={DEPT_COLORS[i]} strokeWidth={2} dot={{ r: 3 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Department Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {carbonByDept.map((dept, idx) => {
          const history = MONTHLY_HISTORY[dept.name] || [];
          const trend = history.length >= 2 ? history[history.length - 1] - history[history.length - 2] : 0;
          return (
            <Card key={dept.name}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Carbon: <strong>{dept.co2} tCO₂</strong></p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-700">{dept.score}</p>
                  <div className="flex items-center gap-1 justify-end text-xs">
                    {trend >= 0
                      ? <TrendingUp className="w-3 h-3 text-green-500" />
                      : <TrendingDown className="w-3 h-3 text-red-500" />}
                    <span className={trend >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {trend >= 0 ? '+' : ''}{trend} pts
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Progress value={dept.score} max={100}
                  color={dept.score >= 85 ? 'bg-green-500' : dept.score >= 70 ? 'bg-primary-500' : 'bg-yellow-500'}
                  size="md"
                />
              </div>
              <div className="mt-2 flex justify-end">
                <Badge variant={dept.score >= 85 ? 'success' : dept.score >= 70 ? 'primary' : 'warning'}>
                  {dept.score >= 85 ? 'Leading' : dept.score >= 70 ? 'On Track' : 'Needs Attention'}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentTracking;
