import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Users, MessageCircle, Calendar, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const PotentialClients = () => {
  const [interestedLeads, setInterestedLeads] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.isAdmin) {
      navigate('/login');
      return;
    }

    // Carregar leads interessados do localStorage
    const savedLeads = localStorage.getItem('interestedLeads');
    if (savedLeads) {
      setInterestedLeads(JSON.parse(savedLeads));
    }
  }, [user, navigate]);

  const handleWhatsAppClick = (lead) => {
    const phoneNumber = lead.telefone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${lead.razaoSocial}! Conforme combinado, estou retornando o contato. Como posso ajudá-los?`);
    window.open(`https://wa.me/55${phoneNumber}?text=${message}`, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const isReturnToday = (returnDate) => {
    const today = new Date().toDateString();
    const returnDateObj = new Date(returnDate).toDateString();
    return today === returnDateObj;
  };

  const getUpcomingReturns = () => {
    return interestedLeads.filter(lead => 
      lead.wantsReturn && 
      lead.returnDate && 
      new Date(lead.returnDate) >= new Date()
    ).sort((a, b) => new Date(a.returnDate) - new Date(b.returnDate));
  };

  const upcomingReturns = getUpcomingReturns();

  return (
    <>
      <Helmet>
        <title>Clientes Potenciais - Leads B2B</title>
        <meta name="description" content="Visualize todos os clientes potenciais e agendamentos" />
        <meta property="og:title" content="Clientes Potenciais - Leads B2B" />
        <meta property="og:description" content="Visualize todos os clientes potenciais e agendamentos" />
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
              <h1 className="text-3xl font-bold gradient-text">Clientes Potenciais</h1>
              <p className="text-white/70">
                {interestedLeads.length} clientes interessados • {upcomingReturns.length} retornos agendados
              </p>
            </div>
          </motion.div>

          {interestedLeads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Card className="glass-effect border-white/20 max-w-md mx-auto">
                <CardContent className="pt-8">
                  <Building className="w-16 h-16 mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Nenhum cliente potencial
                  </h3>
                  <p className="text-white/70 mb-6">
                    Quando você marcar leads como interessados, eles aparecerão aqui.
                  </p>
                  <Button
                    onClick={() => navigate('/b2b-leads')}
                    className="btn-primary"
                  >
                    Buscar Leads
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lista de Clientes Interessados */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                <Card className="glass-effect border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Users className="w-5 h-5" />
                      Clientes Interessados ({interestedLeads.length})
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Clique em um cliente para ver todas as informações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {interestedLeads.map((lead, index) => (
                        <motion.div
                          key={lead.cnpj}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white mb-1">
                                {lead.razaoSocial}
                              </h3>
                              <div className="text-sm text-white/70 space-y-1">
                                <div>CNPJ: {lead.cnpj}</div>
                                <div>📞 {lead.telefone}</div>
                                <div>📍 {lead.cidade}/{lead.estado}</div>
                                {lead.currentInternet && (
                                  <div>🌐 Internet: {lead.currentInternet}</div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <Button
                                onClick={() => handleWhatsAppClick(lead)}
                                size="sm"
                                className="btn-primary"
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                WhatsApp
                              </Button>
                              
                              {lead.wantsReturn && (
                                <div className={`text-xs px-2 py-1 rounded-full text-center ${
                                  isReturnToday(lead.returnDate) 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-blue-500/20 text-blue-300'
                                }`}>
                                  {isReturnToday(lead.returnDate) ? 'Hoje!' : 'Agendado'}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {lead.wantsReturn && (
                            <div className="pt-3 border-t border-white/10">
                              <div className="flex items-center gap-2 text-sm text-white/70">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Retorno: {formatDate(lead.returnDate)} às {formatTime(lead.returnTime)}
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Agendamentos Próximos */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <Card className="glass-effect border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Calendar className="w-5 h-5" />
                      Próximos Retornos
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Agendamentos ordenados por data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingReturns.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-white/30" />
                        <p className="text-white/60 text-sm">
                          Nenhum retorno agendado
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {upcomingReturns.map((lead, index) => (
                          <motion.div
                            key={`${lead.cnpj}-${index}`}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-3 rounded-lg border ${
                              isReturnToday(lead.returnDate)
                                ? 'bg-red-500/20 border-red-500/50'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <div className="font-medium text-white text-sm mb-1">
                              {lead.razaoSocial}
                            </div>
                            <div className="text-xs text-white/70 space-y-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(lead.returnDate)}
                              </div>
                              <div className="flex items-center gap-1">
                                ⏰ {formatTime(lead.returnTime)}
                              </div>
                              <div className="flex items-center gap-1">
                                📞 {lead.telefone}
                              </div>
                            </div>
                            
                            {isReturnToday(lead.returnDate) && (
                              <div className="mt-2">
                                <Button
                                  onClick={() => handleWhatsAppClick(lead)}
                                  size="sm"
                                  className="w-full btn-primary text-xs"
                                >
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  Contatar Agora
                                </Button>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PotentialClients;
