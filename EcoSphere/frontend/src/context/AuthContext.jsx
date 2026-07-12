import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent session
    const storedAuth = localStorage.getItem('eco_auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        if (parsed.isAuthenticated && parsed.user) {
          setIsAuthenticated(true);
          setUser(parsed.user);
        }
      } catch (e) {
        console.error('Failed to parse auth token', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, rememberMe) => {
    // Mock login delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const mockUser = { id: 1, name: 'Alex Johnson', email, role: 'Admin' };
          setIsAuthenticated(true);
          setUser(mockUser);
          
          if (rememberMe) {
            localStorage.setItem('eco_auth', JSON.stringify({ isAuthenticated: true, user: mockUser }));
          } else {
            // Use sessionStorage for non-remembered
            sessionStorage.setItem('eco_auth', JSON.stringify({ isAuthenticated: true, user: mockUser }));
          }
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };
  
  const register = async (name, email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { id: 2, name, email, role: 'User' };
        setIsAuthenticated(true);
        setUser(mockUser);
        localStorage.setItem('eco_auth', JSON.stringify({ isAuthenticated: true, user: mockUser }));
        resolve(mockUser);
      }, 800);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('eco_auth');
    sessionStorage.removeItem('eco_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
