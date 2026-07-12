import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Eye, Pencil, Trash2, Download, Shield, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { useEsg } from '../../context/EsgContext';

const STATUS_CONFIG = {
  Verified: { variant: 'success', icon: CheckCircle2 },
  Pending: { variant: 'warning', icon: Clock },
  Verifying: { variant: 'primary', icon: Loader2 },
  Failed: { variant: 'danger', icon: XCircle },
};

const VerificationBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = cfg.icon;
  return (
    <Badge variant={cfg.variant} className="flex items-center gap-1">
      <Icon className={`w-3 h-3 ${status === 'Verifying' ? 'animate-spin' : ''}`} />
      {status}
    </Badge>
  );
};

const ROWS_PER_PAGE = 10;
const DEPARTMENTS = ['All', 'Manufacturing', 'Logistics', 'IT', 'HR', 'Finance', 'Operations'];
const STATUSES = ['All', 'Pending', 'Verifying', 'Verified', 'Failed'];

const CarbonTransactions = () => {
  const { transactions, deleteTransaction, simulateVerification } = useEsg();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [viewTx, setViewTx] = useState(null);
  const [deleteTxId, setDeleteTxId] = useState(null);

  const filtered = useMemo(() => {
    let data = [...transactions];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(tx =>
        tx.id.toLowerCase().includes(q) ||
        tx.source.toLowerCase().includes(q) ||
        tx.department.toLowerCase().includes(q) ||
        (tx.description || '').toLowerCase().includes(q)
      );
    }
    if (deptFilter !== 'All') data = data.filter(tx => tx.department === deptFilter);
    if (statusFilter !== 'All') data = data.filter(tx => tx.status === statusFilter);
    data.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return data;
  }, [transactions, search, deptFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => sortKey === col
    ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
    : <ChevronDown className="w-3 h-3 opacity-30" />;

  const exportCSV = () => {
    const headers = ['ID', 'Department', 'Source', 'Activity', 'Quantity', 'Unit', 'Emission Factor', 'Total CO2 (t)', 'Date', 'Status', 'Blockchain Hash'];
    const rows = filtered.map(tx => [tx.id, tx.department, tx.source, tx.activity_type, tx.quantity, tx.unit, tx.emission_factor, tx.total_co2, tx.date, tx.status, tx.blockchain_hash || 'N/A']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'carbon_transactions.csv'; a.click();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title={`Carbon Transactions (${filtered.length})`}
          action={
            <div className="flex gap-2">
              <Button size="sm" variant="outline" icon={Download} onClick={exportCSV}>Export CSV</Button>
              <Button size="sm" variant="secondary" icon={Download}>Export PDF</Button>
            </div>
          }
        />
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search transactions..." icon={Search} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <select className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }}>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  {[['id', 'ID'], ['department', 'Department'], ['source', 'Source'], ['total_co2', 'CO₂ (t)'], ['date', 'Date'], ['status', 'Status']].map(([key, label]) => (
                    <th key={key}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                      onClick={() => toggleSort(key)}>
                      <span className="flex items-center gap-1">{label}<SortIcon col={key} /></span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No transactions found</td></tr>
                ) : paginated.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-primary-700">{tx.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{tx.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{tx.source}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{tx.total_co2}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{tx.date}</td>
                    <td className="px-4 py-3"><VerificationBadge status={tx.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewTx(tx)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-primary-600" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        {(tx.status === 'Pending' || tx.status === 'Failed') && (
                          <button onClick={() => simulateVerification(tx.id)} className="p-1.5 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600" title="Verify on Blockchain">
                            <Shield className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => setDeleteTxId(tx.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">Showing {(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded text-sm font-medium ${page === i + 1 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {i + 1}
                  </button>
                ))}
                <Button size="sm" variant="secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Transaction Modal */}
      <Modal isOpen={!!viewTx} onClose={() => setViewTx(null)} title={`Transaction Details — ${viewTx?.id}`} className="sm:max-w-2xl">
        {viewTx && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[['Department', viewTx.department], ['Source', viewTx.source], ['Activity', viewTx.activity_type], ['Quantity', `${viewTx.quantity} ${viewTx.unit}`], ['Total CO₂', `${viewTx.total_co2} tCO₂`], ['Date', viewTx.date], ['Location', viewTx.location || 'N/A'], ['Emission Factor', viewTx.emission_factor]].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-sm text-gray-900 font-semibold">{val}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <p className="text-xs text-gray-500 font-medium mb-2">Blockchain Verification</p>
              <div className="flex items-center gap-3 flex-wrap">
                <VerificationBadge status={viewTx.status} />
                {viewTx.blockchain_hash && (
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{viewTx.blockchain_hash}</span>
                )}
                {viewTx.verification_ts && (
                  <span className="text-xs text-gray-500">Verified: {new Date(viewTx.verification_ts).toLocaleString()}</span>
                )}
              </div>
            </div>
            {viewTx.verification_history?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-medium mb-2">Verification Timeline</p>
                <div className="space-y-2">
                  {viewTx.verification_history.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className={`w-2 h-2 rounded-full ${h.state === 'Verified' ? 'bg-green-500' : h.state === 'Failed' ? 'bg-red-500' : h.state === 'Verifying' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                      <span className="font-medium w-20">{h.state}</span>
                      <span className="text-gray-400">{new Date(h.ts).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteTxId} onClose={() => setDeleteTxId(null)} title="Delete Transaction"
        footer={<>
          <Button variant="secondary" onClick={() => setDeleteTxId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => { deleteTransaction(deleteTxId); setDeleteTxId(null); }}>Delete</Button>
        </>}
      >
        <p className="text-sm text-gray-600">Are you sure you want to delete transaction <strong>{deleteTxId}</strong>? This will recalculate all ESG scores.</p>
      </Modal>
    </div>
  );
};

export default CarbonTransactions;
