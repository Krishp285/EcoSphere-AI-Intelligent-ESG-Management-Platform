import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, setTokens, clearTokens, getToken } from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AUTH_KEY = 'eco_user_data';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session from storage ────────────────────────────────────────
  useEffect(() => {
    const restore = async () => {
      const token = getToken();
      const storedUser = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);

      if (token && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setIsAuthenticated(true);
          // Silently re-validate token in background
          authApi.me().then(freshUser => {
            setUser(freshUser);
            localStorage.setItem(AUTH_KEY, JSON.stringify(freshUser));
          }).catch(() => {
            // Token expired — clear session
            _clearSession();
          });
        } catch (_) {
          _clearSession();
        }
      }
      setIsLoading(false);
    };
    restore();
  }, []); // eslint-disable-line

  const _clearSession = () => {
    setIsAuthenticated(false);
    setUser(null);
    clearTokens();
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    // Legacy key cleanup
    localStorage.removeItem('eco_auth');
    sessionStorage.removeItem('eco_auth');
  };

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password, rememberMe = true) => {
    try {
      const data = await authApi.login(email, password);
      const { user: userData, access_token, refresh_token } = data;
      setTokens(access_token, refresh_token, rememberMe);
      const store = rememberMe ? localStorage : sessionStorage;
      store.setItem(AUTH_KEY, JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      // Fall back to mock auth if backend is unreachable (network error)
      if (err.message?.includes('fetch') || err.message?.includes('Failed to fetch') || err.message?.toLowerCase().includes('network')) {
        return _mockLogin(email, password, rememberMe);
      }
      throw err;
    }
  }, []);

  // ── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password, organization = 'EcoSphere Demo Org') => {
    try {
      const data = await authApi.register(name, email, password, organization);
      const { user: userData, access_token, refresh_token } = data;
      setTokens(access_token, refresh_token, true);
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      if (err.message?.includes('fetch') || err.message?.toLowerCase().includes('network')) {
        return _mockRegister(name, email);
      }
      throw err;
    }
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    _clearSession();
  }, []);

  // ── Mock fallbacks (used only when backend unreachable) ──────────────────
  const _mockLogin = (email, password, rememberMe) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const mockUser = {
            id: 'mock-1',
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            email,
            role: 'Admin',
            organization: 'EcoSphere Demo Org',
          };
          const store = rememberMe ? localStorage : sessionStorage;
          store.setItem(AUTH_KEY, JSON.stringify(mockUser));
          localStorage.setItem('eco_access_token', 'mock-token');
          setUser(mockUser);
          setIsAuthenticated(true);
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 600);
    });
  };

  const _mockRegister = (name, email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { id: `mock-${Date.now()}`, name, email, role: 'Admin', organization: 'EcoSphere Demo Org' };
        localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
        localStorage.setItem('eco_access_token', 'mock-token');
        setUser(mockUser);
        setIsAuthenticated(true);
        resolve(mockUser);
      }, 600);
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
