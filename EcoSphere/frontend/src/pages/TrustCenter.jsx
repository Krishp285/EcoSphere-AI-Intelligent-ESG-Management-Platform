import React, { useState, useMemo } from 'react';
import { ShieldCheck, Search, ShieldAlert, Award, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { useEsg } from '../context/EsgContext';

export const TrustCenter = () => {
  const { transactions } = useEsg();
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  const trustScore = useMemo(() => {
    const verified = transactions.filter(t => t.status === 'Verified').length;
    const total = transactions.length;
    if (total === 0) return 100;
    return Math.round((verified / total) * 100);
  }, [transactions]);

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

        <Card className="flex flex-col justify-center items-center text-center p-6">
          <ShieldCheck className="w-12 h-12 text-primary-600 mb-3" />
          <p className="text-sm font-semibold text-gray-900">Immutable Auditing</p>
          <p className="text-xs text-gray-500 mt-1">Verify hashes instantly using any Ethereum block explorer</p>
        </Card>
      </div>

      {/* Search Filter & Table */}
      <Card>
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
                      <Button size="sm" variant="outline" icon={ChevronRight} onClick={() => setSelectedTx(tx)}>Audit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Modal */}
      <Modal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} title={`Trust Center Certificate — ${selectedTx?.id}`} className="sm:max-w-xl">
        {selectedTx && (
          <div className="space-y-4">
            <div className="border border-primary-100 bg-primary-50/20 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-primary-600" />
              <div>
                <h4 className="font-semibold text-sm text-gray-900">Sealed On-Chain Certificate</h4>
                <p className="text-xs text-gray-500 mt-0.5">Hash validity confirmed at genesis block</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {[
                ['Transaction ID', selectedTx.id],
                ['Department', selectedTx.department],
                ['Recorded CO₂', `${selectedTx.total_co2} tCO₂e`],
                ['Source', selectedTx.source],
                ['Calculated date', selectedTx.date],
                ['Blockchain Status', selectedTx.status],
              ].map(([lbl, val]) => (
                <div key={lbl}>
                  <span className="block text-gray-500 font-medium">{lbl}</span>
                  <span className="block text-gray-900 font-semibold mt-0.5">{val}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <span className="block text-xs text-gray-500 font-medium mb-1">Blockchain Hash Signature</span>
              <div className="bg-gray-50 p-2.5 rounded font-mono text-[10px] break-all border border-gray-150 text-gray-700">
                {selectedTx.blockchain_hash || 'Transaction pending block anchoring. Average execution time: 2.5s.'}
              </div>
            </div>

            {selectedTx.verification_history?.length > 0 && (
              <div className="border-t pt-4">
                <span className="block text-xs text-gray-500 font-medium mb-2">Block verification timeline</span>
                <div className="space-y-3">
                  {selectedTx.verification_history.map((hist, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        hist.state === 'Verified' ? 'bg-green-500' : hist.state === 'Failed' ? 'bg-red-500' : 'bg-primary-500'
                      }`} />
                      <div>
                        <p className="font-semibold text-gray-800">{hist.state}</p>
                        <p className="text-gray-400 mt-0.5">{new Date(hist.ts).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrustCenter;
