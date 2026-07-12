import React from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { SidebarProvider } from './SidebarContext';
import { NotificationProvider } from './NotificationContext';
import { UserProvider } from './UserContext';
import { EsgProvider } from './EsgContext';

export const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <NotificationProvider>
            <SidebarProvider>
              <EsgProvider>
                {children}
              </EsgProvider>
            </SidebarProvider>
          </NotificationProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
