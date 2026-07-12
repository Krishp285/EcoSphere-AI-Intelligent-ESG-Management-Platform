import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'Badge Unlocked: Carbon Reducer', read: false },
    { id: 2, type: 'info', message: 'Carbon Report Ready', read: false },
    { id: 3, type: 'warning', message: 'Policy Reminder: Diversity Training', read: true },
  ]);

  const addNotification = (notification) => {
    setNotifications([notification, ...notifications]);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
