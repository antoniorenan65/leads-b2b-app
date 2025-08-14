import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ClientReturnForm from '@/components/client-return/ClientReturnForm';
import ClientReturnPreview from '@/components/client-return/ClientReturnPreview';

const ClientReturn = () => {
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    contato: '',
    plano: '',
    returnDate: '',
    returnTime: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <>
      <Helmet>
        <title>Cadastro de Cliente - Leads B2B</title>
        <meta name="description" content="Cadastre novos clientes interessados e agende retornos" />
      </Helmet>

      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
            <Button onClick={() => navigate('/interested-clients')} variant="outline" className="btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Cadastro de Cliente</h1>
              <p className="text-white/70">Cadastre um novo cliente interessado</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <ClientReturnForm formData={formData} setFormData={setFormData} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <ClientReturnPreview formData={formData} />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientReturn;
