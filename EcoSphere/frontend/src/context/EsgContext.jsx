import React, { createContext, useContext, useState, useCallback } from 'react';

const EsgContext = createContext();
export const useEsg = () => useContext(EsgContext);

// ─── Scoring Engine ───────────────────────────────────────────────────────────
const EMISSION_FACTOR_BASE = 0.4; // kg CO2 per unit used in scoring
const BASE_ENV_SCORE = 90;

function recalcDepartmentScores(transactions, depts) {
  const totals = {};
  transactions.forEach(tx => {
    if (!totals[tx.department]) totals[tx.department] = 0;
    totals[tx.department] += tx.total_co2;
  });
  return depts.map(d => {
    const emitted = totals[d.name] || 0;
    const penalty = Math.min(30, emitted * 2);
    const newScore = Math.max(20, d.baseScore - penalty);
    return { ...d, score: Math.round(newScore) };
  });
}

function recalcKpis(kpis, transactions, departments) {
  const totalEmitted = transactions.reduce((acc, tx) => acc + tx.total_co2, 0);
  const carbonSaved = Math.max(0, 1240 - totalEmitted);
  const envScore = Math.max(40, Math.min(100, BASE_ENV_SCORE - totalEmitted * 0.8));
  const avgDeptScore = departments.reduce((a, d) => a + d.score, 0) / departments.length;
  const overallScore = Math.round((envScore * 0.4 + avgDeptScore * 0.6));

  return kpis.map(kpi => {
    if (kpi.id === 'overall_score') return { ...kpi, value: overallScore.toFixed(1), change: overallScore > 80 ? '+1.2' : '-0.8', trend: overallScore > 80 ? 'up' : 'down' };
    if (kpi.id === 'carbon_saved') return { ...kpi, value: carbonSaved.toFixed(0), change: carbonSaved > 1200 ? '+12%' : '-5%', trend: carbonSaved > 1200 ? 'up' : 'down' };
    if (kpi.id === 'env_score') return { ...kpi, value: envScore.toFixed(1), change: envScore > 85 ? '+3.1' : '-2.4', trend: envScore > 85 ? 'up' : 'down' };
    return kpi;
  });
}

// ─── Initial Data ─────────────────────────────────────────────────────────────
const INITIAL_DEPARTMENTS = [
  { name: 'Manufacturing', baseScore: 65, score: 65, color: '#f87171' },
  { name: 'Logistics', baseScore: 72, score: 72, color: '#fbbf24' },
  { name: 'IT', baseScore: 88, score: 88, color: '#34d399' },
  { name: 'HR', baseScore: 95, score: 95, color: '#60a5fa' },
];

const INITIAL_KPIS = [
  { id: 'overall_score', title: 'Overall ESG Score', value: '85', change: '+2.5', trend: 'up' },
  { id: 'carbon_saved', title: 'Carbon Saved (tons)', value: '1240', change: '+12%', trend: 'up' },
  { id: 'social_score', title: 'Social Impact Score', value: '92', change: '+4.1', trend: 'up' },
  { id: 'governance_score', title: 'Governance Score', value: '78', change: '-1.2', trend: 'down' },
  { id: 'env_score', title: 'Environmental Score', value: '88', change: '+3.1', trend: 'up' },
];

const INITIAL_TRANSACTIONS = [
  { id: 'CTX-1001', department: 'Manufacturing', source: 'Electricity', activity_type: 'Grid Power Consumption', quantity: 5000, unit: 'kWh', emission_factor: 0.0004, total_co2: 2.0, date: '2024-01-15', location: 'Plant A, Chennai', description: 'Monthly electricity bill', status: 'Verified', blockchain_hash: '0x3f8a...9c12', verification_ts: '2024-01-16T10:00:00Z', verification_history: [{ state: 'Pending', ts: '2024-01-15T12:00:00Z' }, { state: 'Verifying', ts: '2024-01-16T09:00:00Z' }, { state: 'Verified', ts: '2024-01-16T10:00:00Z' }] },
  { id: 'CTX-1002', department: 'Logistics', source: 'Fuel', activity_type: 'Fleet Operations', quantity: 1200, unit: 'Liters', emission_factor: 0.00268, total_co2: 3.22, date: '2024-01-16', location: 'Mumbai Hub', description: 'Diesel fuel for delivery fleet', status: 'Pending', blockchain_hash: null, verification_ts: null, verification_history: [{ state: 'Pending', ts: '2024-01-16T08:00:00Z' }] },
  { id: 'CTX-1003', department: 'IT', source: 'Electricity', activity_type: 'Data Center Cooling', quantity: 2800, unit: 'kWh', emission_factor: 0.0004, total_co2: 1.12, date: '2024-01-18', location: 'HQ Data Center', description: 'Server farm power consumption', status: 'Verified', blockchain_hash: '0xab12...ff34', verification_ts: '2024-01-19T14:00:00Z', verification_history: [{ state: 'Pending', ts: '2024-01-18T10:00:00Z' }, { state: 'Verified', ts: '2024-01-19T14:00:00Z' }] },
  { id: 'CTX-1004', department: 'Manufacturing', source: 'Waste', activity_type: 'Solid Waste Disposal', quantity: 500, unit: 'kg', emission_factor: 0.00082, total_co2: 0.41, date: '2024-01-20', location: 'Plant B, Pune', description: 'Industrial waste landfill', status: 'Failed', blockchain_hash: null, verification_ts: null, verification_history: [{ state: 'Pending', ts: '2024-01-20T08:00:00Z' }, { state: 'Verifying', ts: '2024-01-20T12:00:00Z' }, { state: 'Failed', ts: '2024-01-20T15:00:00Z' }] },
];

const INITIAL_GOALS = [
  { id: 'GOAL-001', name: 'Net Zero Carbon by 2030', department: 'All', target: 100, current: 68, unit: '%', deadline: '2030-12-31', status: 'In Progress', description: 'Reduce total carbon emissions to net zero' },
  { id: 'GOAL-002', name: 'Renewable Energy 50%', department: 'Manufacturing', target: 50, current: 31, unit: '%', deadline: '2025-06-30', status: 'In Progress', description: 'Switch 50% of energy to renewables' },
  { id: 'GOAL-003', name: 'Waste Reduction 30%', department: 'All', target: 30, current: 30, unit: '%', deadline: '2024-12-31', status: 'Achieved', description: 'Reduce industrial waste by 30%' },
  { id: 'GOAL-004', name: 'Fleet Electrification 40%', department: 'Logistics', target: 40, current: 12, unit: '%', deadline: '2026-03-31', status: 'At Risk', description: 'Convert 40% of fleet to electric vehicles' },
];

const INITIAL_EMISSION_FACTORS = [
  { id: 'EF-001', name: 'Grid Electricity (India)', category: 'Electricity', value: 0.0004, unit: 'tCO2/kWh', source: 'CEA 2023', active: true },
  { id: 'EF-002', name: 'Diesel Fuel', category: 'Fuel', value: 0.00268, unit: 'tCO2/liter', source: 'IPCC 2021', active: true },
  { id: 'EF-003', name: 'Natural Gas', category: 'Fuel', value: 0.00202, unit: 'tCO2/liter', source: 'IPCC 2021', active: true },
  { id: 'EF-004', name: 'Solid Waste (Landfill)', category: 'Waste', value: 0.00082, unit: 'tCO2/kg', source: 'EPA 2022', active: true },
  { id: 'EF-005', name: 'Air Transport (Economy)', category: 'Transport', value: 0.000255, unit: 'tCO2/km', source: 'DEFRA 2023', active: true },
  { id: 'EF-006', name: 'Steel Manufacturing', category: 'Manufacturing', value: 0.00185, unit: 'tCO2/kg', source: 'IPCC 2021', active: true },
];

const INITIAL_AI_INSIGHTS = [
  { id: 'AI-001', root_cause: 'Manufacturing department electricity usage up 14% YoY due to legacy equipment', recommendation: 'Replace 3 legacy compressors with energy-efficient models (ISO 50001 certified)', expected_carbon_reduction: '18%', estimated_cost_savings: '₹24,00,000/year', esg_score_improvement: '+6.2 pts', confidence: 94, priority: 'Critical', risk_level: 'High', category: 'Energy Efficiency' },
  { id: 'AI-002', root_cause: 'Logistics fleet running 78% diesel vehicles on high-emission routes', recommendation: 'Transition top 5 high-emission routes to CNG vehicles; partner with GreenFleet supplier', expected_carbon_reduction: '22%', estimated_cost_savings: '₹18,50,000/year', esg_score_improvement: '+4.8 pts', confidence: 87, priority: 'High', risk_level: 'Medium', category: 'Fleet Optimization' },
  { id: 'AI-003', root_cause: 'IT data center cooling inefficiency — PUE ratio at 1.8 vs industry benchmark of 1.2', recommendation: 'Implement hot-aisle containment and upgrade to liquid cooling for server rows A & B', expected_carbon_reduction: '31%', estimated_cost_savings: '₹12,00,000/year', esg_score_improvement: '+3.5 pts', confidence: 91, priority: 'Medium', risk_level: 'Low', category: 'Data Center Efficiency' },
];

const MONTHLY_TREND = [
  { name: 'Jan', actual: 4.2, target: 4.0 },
  { name: 'Feb', actual: 3.8, target: 3.8 },
  { name: 'Mar', actual: 3.5, target: 3.6 },
  { name: 'Apr', actual: 3.9, target: 3.4 },
  { name: 'May', actual: 3.2, target: 3.2 },
  { name: 'Jun', actual: 2.9, target: 3.0 },
];

const EMISSION_DISTRIBUTION = [
  { name: 'Electricity', value: 45, color: '#34d399' },
  { name: 'Fuel', value: 28, color: '#fbbf24' },
  { name: 'Waste', value: 15, color: '#f87171' },
  { name: 'Transport', value: 8, color: '#60a5fa' },
  { name: 'Manufacturing', value: 4, color: '#a78bfa' },
];

// ─── Provider ─────────────────────────────────────────────────────────────────
export const EsgProvider = ({ children }) => {
  const [kpis, setKpis] = useState(INITIAL_KPIS);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [emissionFactors, setEmissionFactors] = useState(INITIAL_EMISSION_FACTORS);
  const [aiInsights] = useState(INITIAL_AI_INSIGHTS);
  const [monthlyTrend, setMonthlyTrend] = useState(MONTHLY_TREND);
  const [emissionDistribution] = useState(EMISSION_DISTRIBUTION);

  // Recalculate scores after any transaction change
  const recalculate = useCallback((newTransactions) => {
    const updatedDepts = recalcDepartmentScores(newTransactions, INITIAL_DEPARTMENTS);
    setDepartments(updatedDepts);
    setKpis(prev => recalcKpis(prev, newTransactions, updatedDepts));
    // Update monthly trend's latest month
    const totalNew = newTransactions.filter(tx => tx.date >= '2024-06-01').reduce((a, t) => a + t.total_co2, 0);
    setMonthlyTrend(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = { ...updated[updated.length - 1], actual: parseFloat((updated[updated.length - 1].actual + totalNew * 0.1).toFixed(2)) };
      return updated;
    });
  }, []);

  const addTransaction = useCallback((data) => {
    const newTx = {
      id: `CTX-${Math.floor(Math.random() * 9000) + 1100}`,
      ...data,
      status: 'Pending',
      blockchain_hash: null,
      verification_ts: null,
      verification_history: [{ state: 'Pending', ts: new Date().toISOString() }],
    };
    setTransactions(prev => {
      const updated = [newTx, ...prev];
      recalculate(updated);
      return updated;
    });
    return newTx;
  }, [recalculate]);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => {
      const updated = prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx);
      recalculate(updated);
      return updated;
    });
  }, [recalculate]);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => {
      const updated = prev.filter(tx => tx.id !== id);
      recalculate(updated);
      return updated;
    });
  }, [recalculate]);

  const addGoal = useCallback((goal) => {
    setGoals(prev => [{ id: `GOAL-${Math.floor(Math.random() * 900) + 100}`, ...goal }, ...prev]);
  }, []);

  const updateGoal = useCallback((id, updates) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);

  const deleteGoal = useCallback((id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  const addEmissionFactor = useCallback((ef) => {
    setEmissionFactors(prev => [{ id: `EF-${Math.floor(Math.random() * 900) + 100}`, ...ef, active: true }, ...prev]);
  }, []);

  const updateEmissionFactor = useCallback((id, updates) => {
    setEmissionFactors(prev => prev.map(ef => ef.id === id ? { ...ef, ...updates } : ef));
  }, []);

  const deleteEmissionFactor = useCallback((id) => {
    setEmissionFactors(prev => prev.filter(ef => ef.id !== id));
  }, []);

  // Blockchain verification simulation
  const simulateVerification = useCallback((txId) => {
    updateTransaction(txId, { status: 'Verifying', verification_history: transactions.find(t => t.id === txId)?.verification_history.concat({ state: 'Verifying', ts: new Date().toISOString() }) });
    setTimeout(() => {
      const success = Math.random() > 0.15;
      const hash = success ? `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}` : null;
      updateTransaction(txId, {
        status: success ? 'Verified' : 'Failed',
        blockchain_hash: hash,
        verification_ts: success ? new Date().toISOString() : null,
      });
    }, 2000);
  }, [transactions, updateTransaction]);

  const value = {
    // State
    kpis, departments, transactions, goals, emissionFactors, aiInsights, monthlyTrend, emissionDistribution,
    // Transaction actions
    addTransaction, updateTransaction, deleteTransaction,
    // Goal actions
    addGoal, updateGoal, deleteGoal,
    // Emission factor actions
    addEmissionFactor, updateEmissionFactor, deleteEmissionFactor,
    // Blockchain
    simulateVerification,
  };

  return <EsgContext.Provider value={value}>{children}</EsgContext.Provider>;
};
