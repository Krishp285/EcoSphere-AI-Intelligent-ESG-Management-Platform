import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, Search, ShieldAlert, Award, FileText, CheckCircle2, 
  ChevronRight, Copy, Download, Printer, RefreshCw, Layers, Database, Cpu 
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { useEsg } from '../context/EsgContext';
import { useNotifications } from '../context/NotificationContext';

export const TrustCenter = () => {
  const { transactions } = useEsg();
  const { showToast } = useNotifications();
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  
  // Re-verification loading state
  const [reverifying, setReverifying] = useState(false);
  const [timelineStep, setTimelineStep] = useState(0);

  const trustScore = useMemo(() => {
    const verified = transactions.filter(t => t.status === 'Verified').length;
    const total = transactions.length;
    if (total === 0) return 100;
    return Math.round((verified / total) * 100);
  }, [transactions]);

  const qrPattern = useMemo(() => {
    const seed = selectedTx?.blockchain_hash || selectedTx?.id || 'ecosphere';
    return Array.from({ length: 64 }, (_, i) => {
      const code = seed.charCodeAt(i % seed.length);
      return ((code + i * 17) % 7) < 3;
    });
  }, [selectedTx]);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const query = search.toLowerCase();
      return (
        t.id.toLowerCase().includes(query) ||
        t.department.toLowerCase().includes(query) ||
        (t.blockchain_hash || '').toLowerCase().includes(query) ||
        t.source.toLowerCase().includes(query)
      );
    });
  }, [transactions, search]);

  // Handle re-verification simulation in modal
  const handleVerifyAgain = () => {
    setReverifying(true);
    setTimelineStep(0);
    showToast(`Initiating cryptographic audit for ${selectedTx?.id}...`, 'info');
  };

  // Timeline step simulator
  useEffect(() => {
    if (!reverifying) return;
    
    const interval = setInterval(() => {
      setTimelineStep(prev => {
        if (prev >= 5) {
          setReverifying(false);
          clearInterval(interval);
          showToast(`Cryptographic seal validated successfully on block #20857329 for ${selectedTx?.id}.`, 'success');
          return 5;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [reverifying, selectedTx, showToast]);

  const copyHash = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    showToast('Blockchain hash signature copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blockchain Trust Center</h1>
        <p className="text-sm text-gray-500 mt-1">Audit public verification history, certificate signatures, and transaction timelines</p>
      </div>

      {/* Overview Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg">
          <div className="flex justify-between items-center h-full min-h-[140px] p-2">
            <div>
              <h2 className="text-xl font-bold mb-2">Cryptographic Verification Ledger</h2>
              <p className="text-xs text-primary-100 max-w-md leading-relaxed">
                All carbon offsets and emissions transactions are anchored on-chain. Audit certificates confirm data integrity and regulatory compliance.
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-extrabold">{trustScore}%</p>
              <p className="text-xs text-primary-100 mt-1">Ledger Trust Index</p>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-center items-center text-center p-6 border border-gray-200">
          <ShieldCheck className="w-12 h-12 text-primary-600 mb-3" />
          <p className="text-sm font-semibold text-gray-900">Immutable Auditing</p>
          <p className="text-xs text-gray-500 mt-1">Verify hashes instantly using any Ethereum block explorer</p>
        </Card>
      </div>

      {/* Search Filter & Table */}
      <Card className="border border-gray-200">
        <CardHeader title="Blockchain Ledger Log" subtitle="Cryptographically sealed ESG transaction ledger" />
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Search transaction ID, department, or hash..." icon={Search} value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  {['Tx ID', 'Department', 'Resource', 'Quantity', 'Status', 'Blockchain Hash', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-primary-700 font-bold">{tx.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{tx.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{tx.source}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{tx.quantity} {tx.unit}</td>
                    <td className="px-4 py-3">
                      <Badge variant={tx.status === 'Verified' ? 'success' : tx.status === 'Failed' ? 'danger' : 'warning'}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500 truncate max-w-[120px]">
                      {tx.blockchain_hash || 'Pending on-chain seal'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button size="sm" variant="outline" icon={ChevronRight} onClick={() => { setSelectedTx(tx); setTimelineStep(5); }}>Audit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Certificate Modal */}
      <Modal 
        isOpen={!!selectedTx} 
        onClose={() => { setSelectedTx(null); setReverifying(false); }} 
        title={`Audit Report Certificate — ${selectedTx?.id}`} 
        className="sm:max-w-3xl"
      >
        {selectedTx && (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
            
            {/* Certificate Border layout container */}
            <div className="border-4 border-double border-primary-600 rounded-2xl p-6 bg-gradient-to-br from-slate-50 via-white to-primary-50 shadow-inner relative overflow-hidden">
              {/* Seal watermark */}
              <div className="absolute -bottom-6 -right-6 text-primary-200/20 transform rotate-12">
                <ShieldCheck className="w-56 h-56" />
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4 relative z-10 border-b border-primary-100 pb-4">
                <div>
                  <span className="text-2xs font-extrabold text-primary-700 tracking-widest uppercase">Immutable Verification Ledger</span>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight mt-1">CERTIFICATE OF ENVIRONMENTAL OFFSET</h3>
                  <p className="text-4xs text-gray-500 mt-1">EcoSphere Blockchain network certification record & validity report</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <Badge variant={selectedTx.status === 'Verified' ? 'success' : selectedTx.status === 'Failed' ? 'danger' : 'warning'}>{selectedTx.status}</Badge>
                  <Badge variant="gray">Trust Score 100/100</Badge>
                  <Badge variant="primary">Network: Arbitrum One ESG L2</Badge>
                </div>
              </div>

              {/* Certificate metrics grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5 text-xs relative z-10">
                <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
                  {[
                    { label: 'Certificate ID', val: `CERT-${selectedTx.id}-${(selectedTx.blockchain_hash || 'PEND').slice(2, 6).toUpperCase()}` },
                    { label: 'Organization', val: 'Acme Corp (Global)' },
                    { label: 'Department', val: selectedTx.department },
                    { label: 'Transaction ID', val: selectedTx.id },
                    { label: 'Resource / Activity', val: `${selectedTx.source} (${selectedTx.activity_type})` },
                    { label: 'Emission Details', val: `${selectedTx.quantity} ${selectedTx.unit} · ${selectedTx.total_co2} Metric Tons CO₂e` }
                  ].map(item => (
                    <div key={item.label}>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">{item.label}</span>
                      <span className="text-xs font-semibold text-gray-900 block mt-0.5">{item.val}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-150 shadow-sm flex flex-col justify-between">
                  {[
                    { label: 'Timestamp', val: selectedTx.verification_ts ? new Date(selectedTx.verification_ts).toLocaleString() : 'Awaiting confirmation' },
                    { label: 'Blockchain Hash', val: selectedTx.blockchain_hash || 'Pending next block seal' },
                    { label: 'Digital Signature', val: 'SHA256: SECURE_SIGNED_HASH' },
                    { label: 'Verification Status', val: selectedTx.status === 'Verified' ? 'Verified' : 'Awaiting final confirmation' }
                  ].map(item => (
                    <div key={item.label}>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">{item.label}</span>
                      <span className="text-xs font-semibold text-gray-900 block mt-0.5">{item.val}</span>
                    </div>
                  ))}

                  <div className="pt-2 border-t flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase block">Digital Sign Key</span>
                      <span className="text-[9px] font-mono text-primary-600 block">SHA256: SECURE_SIGN</span>
                    </div>
                    <div className="w-16 h-16 border border-gray-300 p-1 rounded-lg bg-white flex flex-wrap gap-[1px] shadow-inner">
                      {qrPattern.map((cell, i) => (
                        <div key={i} className={`w-[6px] h-[6px] ${cell ? 'bg-slate-900' : 'bg-white'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Immutable Hash Signature block */}
              <div className="mt-5 pt-4 border-t border-primary-100 relative z-10">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-1">
                  <span>Cryptographic Hash Signature</span>
                  <button 
                    onClick={() => copyHash(selectedTx.blockchain_hash)}
                    className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                  >
                    <Copy className="w-3.5 h-3.5" /> <span>Copy</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-green-400 p-2.5 rounded-lg font-mono text-[10px] break-all border border-slate-900 shadow-inner">
                  {selectedTx.blockchain_hash || '0x0000000000000000000000000000000000000000 (Awaiting next block seal)'}
                </div>
              </div>
            </div>

            {/* Blockchain Visualization Step-by-Step Timeline */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
              <span className="block text-xs text-gray-700 font-bold uppercase tracking-wider">Blockchain Telemetry Lifecycle Timeline</span>
              
              <div className="relative flex justify-between items-center w-full pt-4">
                {/* Connecting Line */}
                <div className="absolute top-[28px] left-[5%] right-[5%] h-1 bg-gray-200 z-0">
                  <div 
                    className="bg-primary-600 h-1 transition-all duration-300 z-0" 
                    style={{ width: `${(timelineStep / 5) * 100}%` }}
                  />
                </div>

                {/* Steps */}
                {[
                  { name: 'Created', icon: FileText },
                  { name: 'Hashed', icon: Cpu },
                  { name: 'Verified', icon: ShieldCheck },
                  { name: 'Stored', icon: Database },
                  { name: 'Issued', icon: Layers },
                  { name: 'Immutable', icon: CheckCircle2 }
                ].map((step, idx) => {
                  const Icon = step.icon;
                  const active = idx <= timelineStep;
                  const current = idx === timelineStep;
                  return (
                    <div key={step.name} className="flex flex-col items-center z-10 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        active 
                          ? 'bg-primary-600 border-primary-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      } ${current ? 'ring-4 ring-primary-100 scale-110 animate-pulse' : ''}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-bold mt-2 ${active ? 'text-primary-700' : 'text-gray-400'}`}>
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Print and Download Actions */}
            <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" icon={Printer} onClick={() => window.print()}>Print Certificate</Button>
                <Button size="sm" variant="outline" icon={Download} onClick={() => showToast('Downloading certificate PDF...', 'info')}>Download Certificate</Button>
                <Button size="sm" variant="outline" icon={Copy} onClick={() => copyHash(selectedTx.blockchain_hash)}>Copy Hash</Button>
              </div>
              <Button 
                size="sm" 
                variant="primary" 
                icon={RefreshCw} 
                isLoading={reverifying} 
                onClick={handleVerifyAgain}
              >
                Verify Again
              </Button>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrustCenter;
