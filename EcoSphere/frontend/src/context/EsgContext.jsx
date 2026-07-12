import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { envApi } from '../services/api';

const EsgContext = createContext();
export const useEsg = () => useContext(EsgContext);

// ─── Storage key ──────────────────────────────────────────────────────────────
const TX_KEY = 'eco_transactions';
const GOALS_KEY = 'eco_goals';
const EF_KEY = 'eco_emission_factors';

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
};
const save = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) {}
};

// ─── Scoring Engine ───────────────────────────────────────────────────────────
const BASE_ENV_SCORE = 90;
const INITIAL_DEPARTMENTS = [
  { name: 'Manufacturing', baseScore: 65, score: 65, color: '#f87171' },
  { name: 'Logistics', baseScore: 72, score: 72, color: '#fbbf24' },
  { name: 'IT', baseScore: 88, score: 88, color: '#34d399' },
  { name: 'HR', baseScore: 95, score: 95, color: '#60a5fa' },
];

function recalcDepartmentScores(transactions) {
  const totals = {};
  transactions.forEach(tx => {
    if (!totals[tx.department]) totals[tx.department] = 0;
    totals[tx.department] += parseFloat(tx.total_co2 || 0);
  });
  return INITIAL_DEPARTMENTS.map(d => {
    const emitted = totals[d.name] || 0;
    const penalty = Math.min(30, emitted * 2);
    return { ...d, score: Math.round(Math.max(20, d.baseScore - penalty)) };
  });
}

function recalcKpis(kpis, transactions, departments) {
  const totalEmitted = transactions.reduce((acc, tx) => acc + parseFloat(tx.total_co2 || 0), 0);
  const carbonSaved = Math.max(0, 1240 - totalEmitted).toFixed(0);
  const envScore = Math.max(40, Math.min(100, BASE_ENV_SCORE - totalEmitted * 0.8)).toFixed(1);
  const avgDeptScore = departments.reduce((a, d) => a + d.score, 0) / departments.length;
  const overallScore = Math.round(parseFloat(envScore) * 0.4 + avgDeptScore * 0.6);
  return kpis.map(kpi => {
    if (kpi.id === 'overall_score') return { ...kpi, value: String(overallScore), trend: overallScore >= 80 ? 'up' : 'down', change: overallScore >= 80 ? '+1.2' : '-0.8' };
    if (kpi.id === 'carbon_saved') return { ...kpi, value: carbonSaved, trend: parseFloat(carbonSaved) > 1200 ? 'up' : 'down', change: parseFloat(carbonSaved) > 1200 ? '+12%' : '-5%' };
    if (kpi.id === 'env_score') return { ...kpi, value: envScore, trend: parseFloat(envScore) >= 85 ? 'up' : 'down', change: parseFloat(envScore) >= 85 ? '+3.1' : '-2.4' };
    return kpi;
  });
}

// ─── Initial Data ─────────────────────────────────────────────────────────────
const INITIAL_KPIS = [
  { id: 'overall_score', title: 'Overall ESG Score', value: '85', change: '+2.5', trend: 'up' },
  { id: 'carbon_saved', title: 'Carbon Saved (tons)', value: '1240', change: '+12%', trend: 'up' },
  { id: 'social_score', title: 'Social Impact Score', value: '92', change: '+4.1', trend: 'up' },
  { id: 'governance_score', title: 'Governance Score', value: '78', change: '-1.2', trend: 'down' },
  { id: 'env_score', title: 'Environmental Score', value: '88', change: '+3.1', trend: 'up' },
];

const SEED_TRANSACTIONS = [
  { id: 'CTX-1001', department: 'Manufacturing', source: 'Electricity', activity_type: 'Grid Power Consumption', quantity: 5000, unit: 'kWh', emission_factor: 0.0004, total_co2: 2.0, date: '2024-01-15', location: 'Plant A, Chennai', description: 'Monthly electricity', status: 'Verified', blockchain_hash: '0x3f8a...9c12', verification_ts: '2024-01-16T10:00:00Z', verification_history: [{ state: 'Pending', ts: '2024-01-15T12:00:00Z' }, { state: 'Verified', ts: '2024-01-16T10:00:00Z' }] },
  { id: 'CTX-1002', department: 'Logistics', source: 'Fuel', activity_type: 'Fleet Operations', quantity: 1200, unit: 'Liters', emission_factor: 0.00268, total_co2: 3.22, date: '2024-01-16', location: 'Mumbai Hub', description: 'Diesel fuel', status: 'Pending', blockchain_hash: null, verification_ts: null, verification_history: [{ state: 'Pending', ts: '2024-01-16T08:00:00Z' }] },
  { id: 'CTX-1003', department: 'IT', source: 'Electricity', activity_type: 'Data Center Cooling', quantity: 2800, unit: 'kWh', emission_factor: 0.0004, total_co2: 1.12, date: '2024-01-18', location: 'HQ Data Center', description: 'Server farm', status: 'Verified', blockchain_hash: '0xab12...ff34', verification_ts: '2024-01-19T14:00:00Z', verification_history: [{ state: 'Pending', ts: '2024-01-18T10:00:00Z' }, { state: 'Verified', ts: '2024-01-19T14:00:00Z' }] },
  { id: 'CTX-1004', department: 'Manufacturing', source: 'Waste', activity_type: 'Solid Waste Disposal', quantity: 500, unit: 'kg', emission_factor: 0.00082, total_co2: 0.41, date: '2024-01-20', location: 'Plant B, Pune', description: 'Industrial waste', status: 'Failed', blockchain_hash: null, verification_ts: null, verification_history: [{ state: 'Pending', ts: '2024-01-20T08:00:00Z' }, { state: 'Failed', ts: '2024-01-20T15:00:00Z' }] },
];

const SEED_GOALS = [
  { id: 'GOAL-001', name: 'Net Zero Carbon by 2030', department: 'All', target: 100, current: 68, unit: '%', deadline: '2030-12-31', status: 'In Progress', description: 'Reduce total carbon emissions to net zero' },
  { id: 'GOAL-002', name: 'Renewable Energy 50%', department: 'Manufacturing', target: 50, current: 31, unit: '%', deadline: '2025-06-30', status: 'In Progress', description: 'Switch 50% of energy to renewables' },
  { id: 'GOAL-003', name: 'Waste Reduction 30%', department: 'All', target: 30, current: 30, unit: '%', deadline: '2024-12-31', status: 'Achieved', description: 'Reduce industrial waste by 30%' },
  { id: 'GOAL-004', name: 'Fleet Electrification 40%', department: 'Logistics', target: 40, current: 12, unit: '%', deadline: '2026-03-31', status: 'At Risk', description: 'Convert 40% of fleet to electric vehicles' },
];

const SEED_EMISSION_FACTORS = [
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
  const [transactions, setTransactions] = useState(() => load(TX_KEY, SEED_TRANSACTIONS));
  const [goals, setGoals] = useState(() => load(GOALS_KEY, SEED_GOALS));
  const [emissionFactors, setEmissionFactors] = useState(() => load(EF_KEY, SEED_EMISSION_FACTORS));
  const [aiInsights, setAiInsights] = useState(INITIAL_AI_INSIGHTS);
  const [monthlyTrend] = useState(MONTHLY_TREND);
  const [emissionDistribution] = useState(EMISSION_DISTRIBUTION);

  // ── Recalculate scores ────────────────────────────────────────────────────
  const recalculate = useCallback((newTransactions) => {
    const updatedDepts = recalcDepartmentScores(newTransactions);
    setDepartments(updatedDepts);
    setKpis(prev => recalcKpis(prev, newTransactions, updatedDepts));
  }, []);

  // ── Sync with backend on startup ──────────────────────────────────────────
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        // Transactions
        const txRes = await envApi.getTransactions({ per_page: 100 });
        const backendTx = txRes.items || txRes;
        if (Array.isArray(backendTx) && backendTx.length > 0) {
          setTransactions(backendTx);
          recalculate(backendTx);
        } else {
          recalculate(transactions);
        }

        // Goals
        const goalsList = await envApi.getGoals();
        if (Array.isArray(goalsList) && goalsList.length > 0) {
          setGoals(goalsList);
        }

        // Emission Factors
        const efList = await envApi.getEmissionFactors();
        if (Array.isArray(efList) && efList.length > 0) {
          setEmissionFactors(efList);
        }

        // AI Recommendations
        const recsList = await envApi.getRecommendations('environmental', 3);
        if (Array.isArray(recsList) && recsList.length > 0) {
          setAiInsights(recsList);
        }
      } catch (err) {
        console.warn("Backend API not reachable or unauthenticated. Using persisted local storage.", err);
        recalculate(transactions);
      }
    };
    fetchBackendData();
  }, []); // eslint-disable-line

  // ── Persist to localStorage on change ─────────────────────────────────────
  useEffect(() => { save(TX_KEY, transactions); }, [transactions]);
  useEffect(() => { save(GOALS_KEY, goals); }, [goals]);
  useEffect(() => { save(EF_KEY, emissionFactors); }, [emissionFactors]);

  // ─ Transactions ───────────────────────────────────────────────────────────
  const addTransaction = useCallback(async (data) => {
    try {
      const res = await envApi.calculateCarbon(data);
      const newTx = res.transaction || res;
      setTransactions(prev => {
        const updated = [newTx, ...prev];
        recalculate(updated);
        return updated;
      });
      return newTx;
    } catch (err) {
      console.warn("Failed to save to backend, saving locally:", err);
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
    }
  }, [recalculate]);

  const updateTransaction = useCallback(async (id, updates) => {
    try {
      await envApi.updateTransaction(id, updates);
    } catch (err) {
      console.warn("Failed to update on backend, updating locally:", err);
    }
    setTransactions(prev => {
      const updated = prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx);
      recalculate(updated);
      return updated;
    });
  }, [recalculate]);

  const deleteTransaction = useCallback(async (id) => {
    try {
      await envApi.deleteTransaction(id);
    } catch (err) {
      console.warn("Failed to delete from backend, deleting locally:", err);
    }
    setTransactions(prev => {
      const updated = prev.filter(tx => tx.id !== id);
      recalculate(updated);
      return updated;
    });
  }, [recalculate]);

  // ─ Goals ─────────────────────────────────────────────────────────────────
  const addGoal = useCallback(async (goal) => {
    try {
      const newGoal = await envApi.createGoal(goal);
      setGoals(prev => [newGoal, ...prev]);
    } catch (err) {
      console.warn("Failed to save goal to backend, saving locally:", err);
      setGoals(prev => [{ id: `GOAL-${Math.floor(Math.random() * 9000) + 100}`, ...goal }, ...prev]);
    }
  }, []);

  const updateGoal = useCallback(async (id, updates) => {
    try {
      await envApi.updateGoal(id, updates);
    } catch (err) {
      console.warn("Failed to update goal on backend, updating locally:", err);
    }
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);

  const deleteGoal = useCallback(async (id) => {
    try {
      await envApi.deleteGoal(id);
    } catch (err) {
      console.warn("Failed to delete goal from backend, deleting locally:", err);
    }
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  // ─ Emission Factors ───────────────────────────────────────────────────────
  const addEmissionFactor = useCallback(async (ef) => {
    try {
      const newEf = await envApi.createEmissionFactor(ef);
      setEmissionFactors(prev => [newEf, ...prev]);
    } catch (err) {
      console.warn("Failed to save emission factor to backend, saving locally:", err);
      setEmissionFactors(prev => [{ id: `EF-${Math.floor(Math.random() * 9000) + 100}`, ...ef, active: true }, ...prev]);
    }
  }, []);

  const updateEmissionFactor = useCallback(async (id, updates) => {
    try {
      await envApi.updateEmissionFactor(id, updates);
    } catch (err) {
      console.warn("Failed to update emission factor on backend, updating locally:", err);
    }
    setEmissionFactors(prev => prev.map(ef => ef.id === id ? { ...ef, ...updates } : ef));
  }, []);

  const deleteEmissionFactor = useCallback(async (id) => {
    try {
      await envApi.deleteEmissionFactor(id);
    } catch (err) {
      console.warn("Failed to delete emission factor from backend, deleting locally:", err);
    }
    setEmissionFactors(prev => prev.filter(ef => ef.id !== id));
  }, []);

  // ─ Blockchain Verification ────────────────────────────────────────────────
  const simulateVerification = useCallback(async (txId) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    try {
      await envApi.verifyTransaction(txId);
    } catch (err) {
      console.warn("Failed to initiate verification on backend:", err);
    }

    const currentHistory = tx.verification_history || [];
    updateTransaction(txId, {
      status: 'Verifying',
      verification_history: [...currentHistory, { state: 'Verifying', ts: new Date().toISOString() }],
    });

    setTimeout(() => {
      const success = Math.random() > 0.15;
      const hash = success
        ? `0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...${Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
        : null;
      setTransactions(prev => {
        const updated = prev.map(t => {
          if (t.id !== txId) return t;
          return {
            ...t,
            status: success ? 'Verified' : 'Failed',
            blockchain_hash: hash,
            verification_ts: success ? new Date().toISOString() : null,
            verification_history: [...(t.verification_history || []), {
              state: success ? 'Verified' : 'Failed',
              ts: new Date().toISOString(),
            }],
          };
        });
        recalculate(updated);
        return updated;
      });
    }, 2500);
  }, [transactions, updateTransaction, recalculate]);

  // ─ Reset to seeds (for demo) ──────────────────────────────────────────────
  const resetDemoData = useCallback(() => {
    setTransactions(SEED_TRANSACTIONS);
    setGoals(SEED_GOALS);
    setEmissionFactors(SEED_EMISSION_FACTORS);
    recalculate(SEED_TRANSACTIONS);
  }, [recalculate]);

  const value = {
    kpis, departments, transactions, goals, emissionFactors, aiInsights, monthlyTrend, emissionDistribution,
    addTransaction, updateTransaction, deleteTransaction,
    addGoal, updateGoal, deleteGoal,
    addEmissionFactor, updateEmissionFactor, deleteEmissionFactor,
    simulateVerification,
    resetDemoData,
  };

  return <EsgContext.Provider value={value}>{children}</EsgContext.Provider>;
};
