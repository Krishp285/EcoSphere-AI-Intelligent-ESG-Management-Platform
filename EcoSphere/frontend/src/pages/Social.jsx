import React, { useState, useMemo } from 'react';
import { Heart, Plus, Users, ShieldAlert, Award, FileText, Check, X, Search } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Progress from '../components/common/Progress';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const INITIAL_ACTIVITIES = [
  { id: 'CSR-001', title: 'Community Tree Planting', description: 'Volunteering drive to plant 200 saplings in the local park.', department: 'Manufacturing', volunteer_hours: 45.0, points_awarded: 150, status: 'Approved', participant_count: 15, date: '2024-02-10' },
  { id: 'CSR-002', title: 'E-Waste Recycling Drive', description: 'Collecting and properly recycling obsolete corporate electronics.', department: 'IT', volunteer_hours: 28.0, points_awarded: 100, status: 'Approved', participant_count: 8, date: '2024-02-15' },
  { id: 'CSR-003', title: 'Food Bank Support Day', description: 'Volunteering at the regional food shelter distribution center.', department: 'HR', volunteer_hours: 16.0, points_awarded: 50, status: 'Pending', participant_count: 4, date: '2024-02-22' },
  { id: 'CSR-004', title: 'Logistics Safety Training Seminars', description: 'Seminars covering eco-driving and safe routing procedures.', department: 'Logistics', volunteer_hours: 32.0, points_awarded: 80, status: 'Approved', participant_count: 12, date: '2024-02-18' },
];

const DEPARTMENTS = ['All', 'Manufacturing', 'Logistics', 'IT', 'HR'];

export const Social = () => {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: '', description: '', department: 'Manufacturing', volunteer_hours: '', points_awarded: '', date: '' });

  const filtered = useMemo(() => {
    return activities.filter(act => {
      const matchSearch = act.title.toLowerCase().includes(search.toLowerCase()) || act.description.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'All' || act.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [activities, search, deptFilter]);

  const stats = useMemo(() => {
    const totalHours = activities.filter(a => a.status === 'Approved').reduce((acc, curr) => acc + curr.volunteer_hours, 0);
    const totalPoints = activities.filter(a => a.status === 'Approved').reduce((acc, curr) => acc + curr.points_awarded, 0);
    const chartData = DEPARTMENTS.filter(d => d !== 'All').map(d => {
      const hours = activities.filter(a => a.department === d && a.status === 'Approved').reduce((acc, curr) => acc + curr.volunteer_hours, 0);
      return { name: d, Hours: hours };
    });
    return { totalHours, totalPoints, chartData };
  }, [activities]);

  const handleApprove = (id) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
  };

  const handleReject = (id) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const act = {
      id: `CSR-${Math.floor(Math.random() * 900) + 100}`,
      ...newActivity,
      volunteer_hours: parseFloat(newActivity.volunteer_hours) || 0,
      points_awarded: parseInt(newActivity.points_awarded) || 0,
      status: 'Pending',
      participant_count: 0
    };
    setActivities(prev => [act, ...prev]);
    setIsModalOpen(false);
    setNewActivity({ title: '', description: '', department: 'Manufacturing', volunteer_hours: '', points_awarded: '', date: '' });
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Responsibility & CSR</h1>
        <p className="text-sm text-gray-500 mt-1">Manage CSR activities, employee volunteering participation, and department contribution scores</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:-translate-y-1 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Volunteer Hours</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalHours} hrs</h3>
            </div>
            <div className="p-2 rounded-lg bg-pink-50 text-pink-500">
              <Heart className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">CSR Activity Points</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalPoints} pts</h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Participating Employees</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {activities.reduce((acc, curr) => acc + curr.participant_count, 0)} users
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Volunteer Hours by Department" subtitle="Active contributions in Q1" />
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="Hours" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Pending Approvals" subtitle="Validate CSR volunteering activities" />
          <CardContent>
            <div className="space-y-4">
              {activities.filter(a => a.status === 'Pending').length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">No pending activity approvals</p>
              ) : (
                activities.filter(a => a.status === 'Pending').map(act => (
                  <div key={act.id} className="border border-gray-150 rounded-lg p-3 bg-gray-50/50">
                    <h4 className="font-semibold text-sm text-gray-900">{act.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{act.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded">{act.department}</span>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleApprove(act.id)} className="p-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleReject(act.id)} className="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main List Table */}
      <Card>
        <CardHeader
          title="CSR Activity Logs"
          action={<Button icon={Plus} onClick={() => setIsModalOpen(true)}>Log CSR Activity</Button>}
        />
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search activities..." icon={Search} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  {['Title', 'Department', 'Volunteering Hours', 'Points', 'Date', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(act => (
                  <tr key={act.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm">
                      <div className="font-semibold text-gray-900">{act.title}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{act.description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{act.department}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{act.volunteer_hours} hrs</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-bold">{act.points_awarded}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{act.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant={act.status === 'Approved' ? 'success' : act.status === 'Pending' ? 'warning' : 'danger'}>
                        {act.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Log Activity Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New CSR Activity"
        footer={<>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Save Activity</Button>
        </>}
      >
        <div className="space-y-4">
          <Input label="Activity Title" placeholder="e.g. Clean Energy Seminar"
            value={newActivity.title} onChange={e => setNewActivity({ ...newActivity, title: e.target.value })} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none focus:ring-primary-500"
              value={newActivity.department} onChange={e => setNewActivity({ ...newActivity, department: e.target.value })}>
              {DEPARTMENTS.filter(d => d !== 'All').map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Volunteer Hours" type="number" placeholder="25"
              value={newActivity.volunteer_hours} onChange={e => setNewActivity({ ...newActivity, volunteer_hours: e.target.value })} />
            <Input label="Points Awarded" type="number" placeholder="100"
              value={newActivity.points_awarded} onChange={e => setNewActivity({ ...newActivity, points_awarded: e.target.value })} />
          </div>

          <Input label="Date" type="date"
            value={newActivity.date} onChange={e => setNewActivity({ ...newActivity, date: e.target.value })} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none focus:ring-primary-500"
              placeholder="Volunteering details..." value={newActivity.description} onChange={e => setNewActivity({ ...newActivity, description: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Social;
