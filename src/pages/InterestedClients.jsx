import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft, UserPlus, Users, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const InterestedClients = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.isAdmin) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const menuItems = [
    {
      title: 'Clientes Retorno (Cadastro)',
      description: 'Cadastrar novos clientes interessados',
      icon: UserPlus,
      path: '/client-return',
      color: 'from-green-500 to-emerald-500',
      enabled: true
    },
    {
      title: 'Clientes Retorno',
      description: 'Ver todos os clientes cadastrados',
      icon: Users,
      path: '/client-return-list',
      color: 'from-blue-500 to-cyan-500',
      enabled: true
    },
    {
      title: 'Clientes ADS',
      description: 'Em desenvolvimento - Em teste',
      icon: Settings,
      path: '#',
      color: 'from-gray-500 to-gray-600',
      enabled: false
    }
  ];

  const handleMenuClick = (item) => {
    if (item.enabled) {
      navigate(item.path);
    } else {
      toast({
        title: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
        description: "Esta seção estará disponível em breve",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Clientes Interessados - Leads B2B</title>
        <meta name="description" content="Gestão completa de clientes interessados e retornos" />
        <meta property="og:title" content="Clientes Interessados - Leads B2B" />
        <meta property="og:description" content="Gestão completa de clientes interessados e retornos" />
      </Helmet>

      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="btn-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold gradient-text">Clientes Interessados</h1>
              <p className="text-white/70">Gestão completa de clientes interessados</p>
            </div>
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
              <Settings className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Em Criação</span>
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
                whileHover={item.enabled ? { scale: 1.02 } : {}}
                whileTap={item.enabled ? { scale: 0.98 } : {}}
              >
                <Card 
                  className={`glass-effect border-white/20 cursor-pointer card-hover ${
                    !item.enabled ? 'opacity-60' : ''
                  }`}
                  onClick={() => handleMenuClick(item)}
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
                      {item.enabled ? 'Acessar' : 'Em Teste'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Informações Adicionais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5" />
                  Funcionalidades Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-green-400">✅ Implementado</h3>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li>• Cadastro de clientes interessados</li>
                      <li>• Agendamento de retornos</li>
                      <li>• Notificações automáticas</li>
                      <li>• Lista de clientes cadastrados</li>
                      <li>• Informações de contato (WhatsApp)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-yellow-400">🚧 Em Desenvolvimento</h3>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li>• Clientes ADS (Em teste)</li>
                      <li>• Integração com campanhas</li>
                      <li>• Relatórios avançados</li>
                      <li>• Automação de follow-up</li>
                      <li>• Dashboard de conversões</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default InterestedClients;
