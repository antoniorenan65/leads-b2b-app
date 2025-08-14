import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const now = new Date().getTime();
      
      if (userData.expiresAt && now < userData.expiresAt) {
        setUser(userData);
      } else {
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminUser = { email: 'admin', password: 'user5317', isAdmin: true };
    
    // Verificar admin
    if (email === adminUser.email && password === adminUser.password) {
      const userData = {
        email: adminUser.email,
        isAdmin: true,
        expiresAt: null // Admin não expira
      };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return { success: true, isAdmin: true };
    }
    
    // Verificar usuários criados
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const now = new Date().getTime();
      if (foundUser.expiresAt && now > foundUser.expiresAt) {
        return { success: false, message: 'Acesso expirado' };
      }
      
      const userData = {
        email: foundUser.email,
        isAdmin: false,
        expiresAt: foundUser.expiresAt
      };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return { success: true, isAdmin: false };
    }
    
    return { success: false, message: 'Credenciais inválidas' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
