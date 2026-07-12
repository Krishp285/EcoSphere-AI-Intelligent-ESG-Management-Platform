/**
 * Centralized API client.
 * All requests go through here.
 * Swap BASE_URL to a real server when deploying.
 */

const BASE_URL = 'http://localhost:5000/api';

// ── Token management ──────────────────────────────────────────────────────────
const getToken = () =>
  localStorage.getItem('eco_access_token') || sessionStorage.getItem('eco_access_token');

const setTokens = (access, refresh, remember = true) => {
  const store = remember ? localStorage : sessionStorage;
  store.setItem('eco_access_token', access);
  store.setItem('eco_refresh_token', refresh);
};

const clearTokens = () => {
  ['eco_access_token', 'eco_refresh_token'].forEach(k => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
};

// ── Core fetcher ──────────────────────────────────────────────────────────────
const request = async (method, path, body = null, auth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.message || `HTTP ${res.status}`);
  }
  return json.data ?? json;
};

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
  register: (name, email, password, organization) =>
    request('POST', '/auth/register', { name, email, password, organization }, false),

  login: (email, password) =>
    request('POST', '/auth/login', { email, password }, false),

  me: () => request('GET', '/auth/me'),

  logout: () => request('POST', '/auth/logout'),
};

// ── Environment API ───────────────────────────────────────────────────────────
export const envApi = {
  dashboard: () => request('GET', '/environment/dashboard'),

  // Carbon Transactions
  getTransactions: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/environment/carbon${qs ? `?${qs}` : ''}`);
  },
  calculateCarbon: (data) => request('POST', '/environment/carbon/calculate', data),
  updateTransaction: (id, data) => request('PUT', `/environment/carbon/${id}`, data),
  deleteTransaction: (id) => request('DELETE', `/environment/carbon/${id}`),
  verifyTransaction: (id) => request('POST', `/environment/carbon/${id}/verify`),

  // Emission Factors
  getEmissionFactors: () => request('GET', '/environment/emission-factors'),
  createEmissionFactor: (data) => request('POST', '/environment/emission-factors', data),
  updateEmissionFactor: (id, data) => request('PUT', `/environment/emission-factors/${id}`, data),
  deleteEmissionFactor: (id) => request('DELETE', `/environment/emission-factors/${id}`),

  // Goals
  getGoals: () => request('GET', '/environment/goals'),
  createGoal: (data) => request('POST', '/environment/goals', data),
  updateGoal: (id, data) => request('PUT', `/environment/goals/${id}`, data),
  deleteGoal: (id) => request('DELETE', `/environment/goals/${id}`),

  // AI
  getRecommendations: (domain = 'environmental', count = 3) =>
    request('GET', `/environment/ai/recommendations?domain=${domain}&count=${count}`),
  applyRecommendation: (id, userId) =>
    request('POST', `/environment/ai/recommendations/${id}/apply`, { user_id: userId }),
};

export { setTokens, clearTokens, getToken };
