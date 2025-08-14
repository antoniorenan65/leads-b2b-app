import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const today = now.toDateString();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      notifications.forEach(notification => {
        if (notification.date === today && !notification.shown) {
          const notificationTime = parseInt(notification.time.split(':')[0]) * 60 + parseInt(notification.time.split(':')[1]);
          
          if (Math.abs(currentTime - notificationTime) <= 1) {
            toast({
              title: "🔔 Lembrete de Retorno",
              description: `Cliente: ${notification.clientName} - ${notification.type}`,
              duration: 10000,
            });
            
            setNotifications(prev => 
              prev.map(n => 
                n.id === notification.id ? { ...n, shown: true } : n
              )
            );
          }
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // Verificar a cada minuto
    return () => clearInterval(interval);
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      shown: false
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getPendingNotifications = () => {
    const today = new Date().toDateString();
    return notifications.filter(n => n.date >= today && !n.shown);
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    getPendingNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
