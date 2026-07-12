import React, { useState, useMemo } from 'react';
import { ShieldCheck, Plus, CheckCircle2, Clock, AlertTriangle, Search, FileText } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Progress from '../components/common/Progress';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { useEsg } from '../context/EsgContext';

const INITIAL_POLICIES = [
  { id: 'POL-001', title: 'Carbon Reduction Policy', category: 'Environmental', version: '2.1', published_date: '2023-11-12', acknowledged_count: 142, total_required_count: 150 },
  { id: 'POL-002', title: 'Fair Labor Standards Code', category: 'Social', version: '1.0', published_date: '2024-01-10', acknowledged_count: 89, total_required_count: 150 },
  { id: 'POL-003', title: 'Whistleblower & Anti-Bribery Rules', category: 'Governance', version: '3.0', published_date: '2023-09-05', acknowledged_count: 150, total_required_count: 150 },
];

const INITIAL_ISSUES = [
  { id: 'COMP-001', title: 'Safety Gear Compliance Gap', description: 'Auditors found incomplete usage of safety glasses in warehouse sector B.', severity: 'High', status: 'Open', owner: 'R. Davis', due_date: '2024-03-01' },
  { id: 'COMP-002', title: 'Carbon Emission Overshoot (Plant C)', description: 'Monthly emission check detected 12% overshoot against regional regulatory limits.', severity: 'Critical', status: 'In Investigation', owner: 'M. Patel', due_date: '2024-02-28' },
  { id: 'COMP-003', title: 'Supplier Fair Wage Check Deficit', description: 'Minor documentation gap in supplier review checklist.', severity: 'Medium', status: 'Resolved', owner: 'J. Smith', due_date: '2024-02-15' },
];

export const Governance = () => {
  const { recordPolicyAcknowledgement } = useEsg();
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [search, setSearch] = useState('');
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const [newPolicy, setNewPolicy] = useState({ title: '', category: 'Environmental', version: '1.0', published_date: '' });
  const [newIssue, setNewIssue] = useState({ title: '', description: '', severity: 'Medium', owner: '', due_date: '' });

  const stats = useMemo(() => {
    const totalPolicies = policies.length;
    const resolvedIssues = issues.filter(i => i.status === 'Resolved').length;
    const openIssues = issues.filter(i => i.status === 'Open' || i.status === 'In Investigation').length;
    return { totalPolicies, resolvedIssues, openIssues };
  }, [policies, issues]);

  const handleAcknowledge = (id) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === id && p.acknowledged_count < p.total_required_count) {
        return { ...p, acknowledged_count: p.acknowledged_count + 1 };
      }
      return p;
    }));
    const policy = policies.find(p => p.id === id);
    recordPolicyAcknowledgement({
      policy: policy?.title,
      department: policy?.category,
      description: `${policy?.title || 'Policy'} was acknowledged and synced to the enterprise ledger.`,
      toast: `${policy?.title || 'Policy'} acknowledgement recorded in real time.`
    });
  };

  const handleCreatePolicy = (e) => {
    e.preventDefault();
    const pol = {
      id: `POL-${Math.floor(Math.random() * 900) + 100}`,
      ...newPolicy,
      acknowledged_count: 0,
      total_required_count: 150
    };
    setPolicies(prev => [pol, ...prev]);
    setIsPolicyModalOpen(false);
    setNewPolicy({ title: '', category: 'Environmental', version: '1.0', published_date: '' });
  };

  const handleCreateIssue = (e) => {
    e.preventDefault();
    const issue = {
      id: `COMP-${Math.floor(Math.random() * 900) + 100}`,
      ...newIssue,
      status: 'Open'
    };
    setIssues(prev => [issue, ...prev]);
    setIsIssueModalOpen(false);
    setNewIssue({ title: '', description: '', severity: 'Medium', owner: '', due_date: '' });
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Governance & Compliance</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor compliance requirements, policy status acknowledgements, and environmental audits</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:-translate-y-1 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Corporate ESG Policies</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalPolicies} active</h3>
            </div>
            <div className="p-2 rounded-lg bg-green-50 text-green-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Open Compliance Issues</p>
              <h3 className="text-3xl font-bold text-red-600 mt-1">{stats.openIssues} alert</h3>
            </div>
            <div className="p-2 rounded-lg bg-red-50 text-red-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolved Items</p>
              <h3 className="text-3xl font-bold text-green-600 mt-1">{stats.resolvedIssues} closed</h3>
            </div>
            <div className="p-2 rounded-lg bg-green-50 text-green-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Governance Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policies */}
        <Card>
          <CardHeader title="ESG Policies & Compliance Status" action={<Button size="sm" icon={Plus} onClick={() => setIsPolicyModalOpen(true)}>Add Policy</Button>} />
          <CardContent>
            <div className="space-y-4">
              {policies.map(p => {
                const pct = Math.round((p.acknowledged_count / p.total_required_count) * 100);
                return (
                  <div key={p.id} className="border border-gray-150 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">{p.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Category: {p.category} · v{p.version}</p>
                      </div>
                      <Badge variant={pct === 100 ? 'success' : 'warning'}>{pct}% Acknowledged</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={p.acknowledged_count} max={p.total_required_count} color={pct === 100 ? 'bg-green-500' : 'bg-primary-500'} size="sm" className="flex-1" />
                      <Button size="sm" variant="outline" onClick={() => handleAcknowledge(p.id)} disabled={pct === 100}>Acknowledge</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Issues */}
        <Card>
          <CardHeader title="Audits & Compliance Issues" action={<Button size="sm" icon={Plus} onClick={() => setIsIssueModalOpen(true)}>Log Issue</Button>} />
          <CardContent>
            <div className="space-y-4">
              {issues.map(issue => (
                <div key={issue.id} className="border border-gray-150 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">{issue.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">Due: {issue.due_date} · Owner: {issue.owner}</p>
                    </div>
                    <Badge variant={issue.severity === 'Critical' || issue.severity === 'High' ? 'danger' : 'warning'}>
                      {issue.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{issue.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      issue.status === 'Resolved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>{issue.status}</span>
                    {issue.status !== 'Resolved' && (
                      <Button size="sm" variant="outline" onClick={() => {
                        setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, status: 'Resolved' } : i));
                      }}>Resolve</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Create Modal */}
      <Modal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} title="Add Governance Policy"
        footer={<>
          <Button variant="secondary" onClick={() => setIsPolicyModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreatePolicy}>Add Policy</Button>
        </>}
      >
        <div className="space-y-4">
          <Input label="Policy Name" placeholder="e.g. Supplier Code of Conduct"
            value={newPolicy.title} onChange={e => setNewPolicy({ ...newPolicy, title: e.target.value })} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none focus:ring-primary-500"
              value={newPolicy.category} onChange={e => setNewPolicy({ ...newPolicy, category: e.target.value })}>
              <option>Environmental</option>
              <option>Social</option>
              <option>Governance</option>
            </select>
          </div>

          <Input label="Published Date" type="date"
            value={newPolicy.published_date} onChange={e => setNewPolicy({ ...newPolicy, published_date: e.target.value })} />
        </div>
      </Modal>

      {/* Issue Create Modal */}
      <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Log Compliance Issue"
        footer={<>
          <Button variant="secondary" onClick={() => setIsIssueModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateIssue}>Log Issue</Button>
        </>}
      >
        <div className="space-y-4">
          <Input label="Issue Title" placeholder="e.g. Safety Exit Blockage"
            value={newIssue.title} onChange={e => setNewIssue({ ...newIssue, title: e.target.value })} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none focus:ring-primary-500"
              value={newIssue.severity} onChange={e => setNewIssue({ ...newIssue, severity: e.target.value })}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

          <Input label="Assigned Owner" placeholder="e.g. Alex Green"
            value={newIssue.owner} onChange={e => setNewIssue({ ...newIssue, owner: e.target.value })} />

          <Input label="Due Date" type="date"
            value={newIssue.due_date} onChange={e => setNewIssue({ ...newIssue, due_date: e.target.value })} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none focus:ring-primary-500"
              placeholder="Give details..." value={newIssue.description} onChange={e => setNewIssue({ ...newIssue, description: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Governance;
