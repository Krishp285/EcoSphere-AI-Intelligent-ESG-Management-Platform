import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, Download, TrendingUp, Sparkles, Building2, CheckCircle2, 
  RefreshCw, Clipboard, Database, ShieldCheck, Printer, FileDown 
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Progress from '../components/common/Progress';
import { useEsg } from '../context/EsgContext';
import { useNotifications } from '../context/NotificationContext';

export const Reports = () => {
  const { kpis, transactions, goals, departments, recordReportGeneration } = useEsg();
  const { showToast } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Smart Report simulation states
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [isReportReady, setIsReportReady] = useState(false);

  const totalCO2 = transactions.reduce((acc, curr) => acc + parseFloat(curr.total_co2 || 0), 0).toFixed(2);
  const avgDeptScore = useMemo(() => {
    if (departments.length === 0) return 0;
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
    showToast('Exported consolidated ESG datasets successfully.', 'success');
  };

  // Report Builder Steps Simulation
  const handleStartReport = () => {
    setIsBuilding(true);
    setBuildStep(0);
    setIsReportReady(false);
  };

  const stepsList = [
    'Collecting carbon calculations and department logs...',
    'Analyzing ESG scores compliance checklist variables...',
    'Generating emissions trajectory projection charts...',
    'Running AI recommendations and forecast models...',
    'Signing reports cryptographically with blockchain seals...',
    'Finalizing Executive Performance Summary document...'
  ];

  useEffect(() => {
    if (!isBuilding) return;

    const interval = setInterval(() => {
      setBuildStep(prev => {
        if (prev >= stepsList.length - 1) {
          clearInterval(interval);
          setIsBuilding(false);
          setIsReportReady(true);
            recordReportGeneration({
              description: 'Smart ESG report compiled with charts, AI insights, recommendations, and blockchain verification.',
              toast: 'Smart ESG Report compiled and ready for audit.'
            });
          showToast('Smart ESG Report compiled and ready for audit.', 'success');
          return stepsList.length - 1;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isBuilding]); // eslint-disable-line

  return (
    <div id="walkthrough-reports-content" className="space-y-6">
      {/* Module Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ESG Consolidated Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate corporate Environmental, Social, and Governance compliance reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button icon={Sparkles} onClick={handleStartReport}>Generate AI ESG Report</Button>
          <Button icon={Download} variant="outline" onClick={exportAllCSV}>Export CSV</Button>
        </div>
      </div>

      {/* Overview Block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall ESG Rating', val: 'A+', note: 'Acme Corp (Global)' },
          { label: 'Avg Department Score', val: `${avgDeptScore}/100`, note: 'Corporate Average' },
          { label: 'Active Goals Tracked', val: goals.length, note: 'Sustainability Goals' },
          { label: 'Total Q1 Emissions', val: `${totalCO2} t`, note: 'Metric Tons CO₂e' },
        ].map(item => (
          <Card key={item.label} className="border border-gray-200">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.label}</p>
            <p className="text-3xl font-extrabold text-primary-700 mt-1">{item.val}</p>
            <p className="text-2xs text-gray-400 mt-1">{item.note}</p>
          </Card>
        ))}
      </div>

      {/* Document Center Table */}
      <Card className="border border-gray-200">
        <CardHeader title="Report Repository" subtitle="Download compliance documents and auditing summaries" />
        <CardContent>
          {/* Category Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {['All', 'Environmental', 'Social', 'Governance', 'Executive'].map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
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

      {/* Smart Builder Modal */}
      <Modal isOpen={isBuilding} onClose={() => setIsBuilding(false)} title="Smart ESG Report Generator" className="sm:max-w-md">
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2 text-primary-600 font-bold text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>BUILDING SYSTEM LOG DATAFRAMES</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-2xs text-gray-500 font-semibold">
              <span>Report compiler progress</span>
              <span>{Math.round(((buildStep + 1) / stepsList.length) * 100)}%</span>
            </div>
            <Progress value={Math.round(((buildStep + 1) / stepsList.length) * 100)} color="bg-primary-600 animate-pulse" />
          </div>

          {/* Current Step Checklist */}
          <div className="bg-slate-50 border p-3 rounded-lg space-y-2 text-xs">
            {stepsList.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={idx < buildStep} 
                  readOnly 
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-3.5 w-3.5"
                />
                <span className={`leading-normal ${idx === buildStep ? 'text-primary-700 font-bold' : idx < buildStep ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Report Ready Presentation Modal */}
      <Modal isOpen={isReportReady} onClose={() => setIsReportReady(false)} title="Consolidated Q1 ESG Executive Report" className="sm:max-w-2xl">
        <div className="space-y-5 max-h-[85vh] overflow-y-auto pr-1">
          <div className="border-t-4 border-primary-600 pt-4 text-center space-y-1">
            <span className="text-4xs text-gray-500 uppercase tracking-widest font-black">Environmental Social Governance Compliance Registry</span>
            <h2 className="text-lg font-black text-gray-900">ACME CORP CONSOLIDATED PERFORMANCE AUDIT</h2>
            <p className="text-[10px] text-gray-400">Published Date: {new Date().toLocaleDateString()} · Cryptographic block anchor</p>
          </div>

          {/* Executive Summary */}
          <div className="bg-slate-50 border p-4 rounded-xl space-y-2 text-xs">
            <span className="text-2xs font-extrabold text-primary-800 tracking-wider uppercase block">Executive Performance Summary</span>
            <p className="leading-relaxed text-gray-700 font-medium">
              Acme Corp (Global) has recorded stable ESG compliance indexes this quarter, averaging an <span className="text-primary-700 font-bold">overall rating of A+ (Score 85/100)</span>. 
              Carbon emission logs offset totals at {totalCO2} metric tons, with IT departments taking lead via advanced cooling upgrades. 
              Social volunteer metrics logged 24+ additional hours, strengthening brand trust coefficients.
            </p>
          </div>

          {/* Table Metrics summary */}
          <div className="border rounded-xl overflow-hidden bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50 font-bold text-gray-500">
                <tr>
                  <th className="px-4 py-2 text-left">ESG Pillar Metric</th>
                  <th className="px-4 py-2 text-center">Score Index</th>
                  <th className="px-4 py-2 text-right">Trend Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {kpis.map(k => (
                  <tr key={k.id}>
                    <td className="px-4 py-2 font-bold text-gray-900">{k.title}</td>
                    <td className="px-4 py-2 text-center text-primary-600 font-bold">{k.value}</td>
                    <td className="px-4 py-2 text-right text-green-600 font-bold">{k.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI insights & recommendations */}
          <div className="space-y-2 text-xs">
            <span className="text-2xs font-extrabold text-indigo-700 tracking-wider uppercase block">AI Advisory Recommendations</span>
            <div className="border border-indigo-100 bg-indigo-50/10 p-3 rounded-lg space-y-1 text-slate-700">
              <span className="font-bold text-indigo-900">Replace 3 legacy Manufacturing compressors:</span>
              <p className="leading-snug mt-0.5">Estimated carbon reduction of 18% with annualized cost savings of ₹24,00,000.</p>
            </div>
          </div>

          {/* Blockchain & Digital Signatures */}
          <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Blockchain Stamp Seal</span>
              <span className="font-mono text-green-600 text-[10px] block mt-1 break-all bg-slate-900 p-2 rounded">
                0x7d9f2e4c8b0a9f2e4c8b0a9f2e4c8b0a9f2e4c8b0a
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Cryptographic Authority Signature</span>
              <div className="mt-2 text-2xs italic border border-gray-250 p-2 rounded bg-gray-50 flex items-center justify-between">
                <span>Certified by ESG Auditor node</span>
                <span className="text-green-600 font-bold">✓ Signed</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button size="sm" variant="outline" icon={Printer} onClick={() => window.print()}>Print</Button>
            <Button size="sm" variant="primary" icon={FileDown} onClick={() => showToast('Consolidated PDF exported successfully.', 'success')}>Download PDF Report</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Reports;
