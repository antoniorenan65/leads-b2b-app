import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/contexts/LeadContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from '@/components/ui/use-toast';
import LeadInfoCard from '@/components/lead-details/LeadInfoCard';
import ContactActions from '@/components/lead-details/ContactActions';
import InterestManager from '@/components/lead-details/InterestManager';
import InternetProviderManager from '@/components/lead-details/InternetProviderManager';
import ScheduleReturnDialog from '@/components/lead-details/ScheduleReturnDialog';

const LeadDetails = () => {
  const { cnpj } = useParams();
  const { user } = useAuth();
  const { addInterestedLead, updateInterestedLead } = useLeads();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasWhatsApp, setHasWhatsApp] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  useEffect(() => {
    if (!user || user.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchLeadDetails = async () => {
      setIsLoading(true);
      // Simular carregamento dos dados do lead
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockLead = {
        cnpj: cnpj,
        razaoSocial: 'Tech Solutions Ltda',
        telefone: '(11) 98765-4321',
        endereco: 'Av. Paulista, 1000',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100',
        cnae: '6201-5/00',
        atividade: 'Desenvolvimento de programas de computador sob encomenda',
        email: 'contato@techsolutions.com.br',
        site: 'www.techsolutions.com.br'
      };
      setLead(mockLead);
      setHasWhatsApp(Math.random() > 0.3);
      setIsLoading(false);
    };

    fetchLeadDetails();
  }, [cnpj, user, navigate]);

  const handleInterestChange = (interested) => {
    if (interested) {
      setShowScheduleDialog(true);
    } else {
      // Lógica para desmarcar interesse se necessário
    }
  };

  const handleScheduleReturn = (scheduleData) => {
    const leadData = {
      ...lead,
      isInterested: true,
      ...scheduleData,
      addedAt: new Date().toISOString()
    };
    
    addInterestedLead(leadData);

    if (scheduleData.wantsReturn) {
      addNotification({
        clientName: lead.razaoSocial,
        date: scheduleData.returnDate,
        time: scheduleData.returnTime,
        type: 'Retorno de Lead B2B'
      });
    }

    toast({
      title: "✅ Lead salvo!",
      description: scheduleData.wantsReturn 
        ? `Retorno agendado para ${scheduleData.returnDate} às ${scheduleData.returnTime}`
        : "Lead marcado como interessado",
    });

    setShowScheduleDialog(false);
  };

  const handleSaveInternetInfo = (internetProvider) => {
    updateInterestedLead(cnpj, { currentInternet: internetProvider });
    toast({
      title: "✅ Informação salva!",
      description: `Provedor atual registrado: ${internetProvider}`,
    });
  };

  if (isLoading || !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Carregando dados do lead...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{lead.razaoSocial} - Detalhes do Lead</title>
        <meta name="description" content={`Detalhes completos do lead ${lead.razaoSocial}`} />
      </Helmet>

      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
            <Button onClick={() => navigate('/b2b-leads')} variant="outline" className="btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">{lead.razaoSocial}</h1>
              <p className="text-white/70">CNPJ: {lead.cnpj}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <LeadInfoCard lead={lead} />
              <ContactActions lead={lead} hasWhatsApp={hasWhatsApp} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <InterestManager onInterestChange={handleInterestChange} />
              <InternetProviderManager onSave={handleSaveInternetInfo} />
            </motion.div>
          </div>

          <ScheduleReturnDialog
            open={showScheduleDialog}
            onOpenChange={setShowScheduleDialog}
            onSchedule={handleScheduleReturn}
          />
        </div>
      </div>
    </>
  );
};

export default LeadDetails;
