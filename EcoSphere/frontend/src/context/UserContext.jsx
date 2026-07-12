import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState('Acme Corp (Global)');
  const organizations = ['Acme Corp (Global)', 'Acme Corp (EMEA)', 'Acme Corp (NA)'];

  return (
    <UserContext.Provider value={{ currentOrganization, setCurrentOrganization, organizations }}>
      {children}
    </UserContext.Provider>
  );
};
