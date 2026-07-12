import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'Badge Unlocked: Carbon Reducer', read: false, time: '10m ago' },
    { id: 2, type: 'info', message: 'Carbon Report Ready', read: false, time: '1h ago' },
    { id: 3, type: 'warning', message: 'Policy Reminder: Diversity Training', read: true, time: '1d ago' },
  ]);

  const [toasts, setToasts] = useState([]);

  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: Date.now() + Math.random(),
      read: false,
      time: 'Just now',
      ...notification
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, unreadCount, toasts, showToast }}>
      {children}
    </NotificationContext.Provider>
  );
};
