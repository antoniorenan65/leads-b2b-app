import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Users, UserPlus, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { getPendingNotifications } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.isAdmin) {
      navigate('/login');
      return;
    }

    // Solicitar geolocalização ao fazer login
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem('userLocation', JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.log('Geolocalização não permitida:', error);
        }
      );
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pendingNotifications = getPendingNotifications();

  const menuItems = [
    {
      title: 'B2B Leads',
      description: 'Buscar leads por geolocalização ou filtros',
      icon: Search,
      path: '/b2b-leads',
      color: 'from-blue-500 to-cyan-500',
      enabled: true
    },
    {
      title: 'Clientes Potenciais',
      description: 'Visualizar clientes com interesse',
      icon: Users,
      path: '/potential-clients',
      color: 'from-green-500 to-emerald-500',
      enabled: true
    },
    {
      title: 'Clientes Interessados',
      description: 'Gestão de clientes interessados',
      icon: UserPlus,
      path: '/interested-clients',
      color: 'from-purple-500 to-pink-500',
      enabled: true
    }
  ];

  if (!user || user.isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Leads B2B</title>
        <meta name="description" content="Dashboard principal do sistema de gestão de leads B2B" />
        <meta property="og:title" content="Dashboard - Leads B2B" />
        <meta property="og:description" content="Dashboard principal do sistema de gestão de leads B2B" />
      </Helmet>

      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Bem-vindo ao Leads B2B
              </h1>
              <p className="text-white/70 text-lg">
                Olá, {user.email}! Escolha uma opção para começar.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {pendingNotifications.length > 0 && (
                <div className="relative">
                  <Bell className="w-6 h-6 text-white" />
                  <span className="notification-badge">
                    {pendingNotifications.length}
                  </span>
                </div>
              )}
              
              <Button onClick={handleLogout} variant="outline" className="btn-secondary">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </motion.div>

          {/* Menu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`glass-effect border-white/20 cursor-pointer card-hover ${
                    !item.enabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => item.enabled && navigate(item.path)}
                >
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mb-4`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      className={`w-full ${item.enabled ? 'btn-primary' : 'btn-secondary cursor-not-allowed'}`}
                      disabled={!item.enabled}
                    >
                      {item.enabled ? 'Acessar' : 'Em Desenvolvimento'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Notificações Pendentes */}
          {pendingNotifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Card className="glass-effect border-yellow-500/30 bg-yellow-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <Bell className="w-5 h-5" />
                    Notificações Pendentes ({pendingNotifications.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pendingNotifications.slice(0, 3).map((notification, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-white font-medium">{notification.clientName}</div>
                        <div className="text-white/70 text-sm">
                          {notification.date} às {notification.time} - {notification.type}
                        </div>
                      </div>
                    ))}
                    {pendingNotifications.length > 3 && (
                      <div className="text-center text-white/60 text-sm">
                        +{pendingNotifications.length - 3} mais notificações...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
