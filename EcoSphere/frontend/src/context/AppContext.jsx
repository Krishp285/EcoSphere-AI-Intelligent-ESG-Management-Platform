import React from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { SidebarProvider } from './SidebarContext';
import { NotificationProvider } from './NotificationContext';
import { UserProvider } from './UserContext';

export const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <NotificationProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </NotificationProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
