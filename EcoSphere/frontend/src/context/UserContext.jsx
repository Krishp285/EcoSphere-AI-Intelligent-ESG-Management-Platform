import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { user } = useAuth();

  // Derive from authenticated user — no hardcoded name
  const currentUser = user || { name: 'Guest', email: '', role: 'User', organization: 'EcoSphere' };
  const currentOrganization = currentUser.organization || 'EcoSphere';
  const organizations = [currentOrganization];

  return (
    <UserContext.Provider value={{
      user: currentUser,
      currentOrganization,
      organizations,
    }}>
      {children}
    </UserContext.Provider>
  );
};
