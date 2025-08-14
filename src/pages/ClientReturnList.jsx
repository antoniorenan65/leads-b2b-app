import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/contexts/LeadContext';
import ClientList from '@/components/client-return-list/ClientList';
import ClientDetails from '@/components/client-return-list/ClientDetails';
import DeleteClientDialog from '@/components/client-return-list/DeleteClientDialog';
import { Card, CardContent } from '@/components/ui/card';

const ClientReturnList = () => {
  const [userClients, setUserClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { user } = useAuth();
  const { clientReturns, removeClientReturn } = useLeads();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.isAdmin) {
      navigate('/login');
      return;
    }
    setUserClients(clientReturns.filter(client => client.createdBy === user.email));
  }, [user, navigate, clientReturns]);

  const handleDeleteRequest = (client) => {
    setClientToDelete(client);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      removeClientReturn(clientToDelete.id);
      setShowDeleteDialog(false);
      setClientToDelete(null);
      setSelectedClient(null);
    }
  };

  const upcomingReturns = userClients
    .filter(client => client.returnDate && new Date(client.returnDate) >= new Date())
    .sort((a, b) => new Date(a.returnDate) - new Date(b.returnDate));

  return (
    <>
      <Helmet>
        <title>Lista de Clientes - Leads B2B</title>
        <meta name="description" content="Visualize todos os clientes cadastrados e seus agendamentos" />
      </Helmet>

      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/interested-clients')} variant="outline" className="btn-secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Clientes Cadastrados</h1>
                <p className="text-white/70">{userClients.length} clientes • {upcomingReturns.length} retornos</p>
              </div>
            </div>
            <Button onClick={() => navigate('/client-return')} className="btn-primary">
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </motion.div>

          {userClients.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <Card className="glass-effect border-white/20 max-w-md mx-auto">
                <CardContent className="pt-8">
                  <Users className="w-16 h-16 mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl font-semibold text-white mb-2">Nenhum cliente cadastrado</h3>
                  <p className="text-white/70 mb-6">Comece cadastrando seu primeiro cliente interessado.</p>
                  <Button onClick={() => navigate('/client-return')} className="btn-primary">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Cadastrar Cliente
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
                <ClientList
                  clients={userClients}
                  onClientSelect={setSelectedClient}
                  onDeleteRequest={handleDeleteRequest}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                <ClientDetails
                  client={selectedClient}
                  upcomingReturns={upcomingReturns}
                  onClientSelect={setSelectedClient}
                  onClose={() => setSelectedClient(null)}
                />
              </motion.div>
            </div>
          )}

          <DeleteClientDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            client={clientToDelete}
            onConfirm={confirmDelete}
          />
        </div>
      </div>
    </>
  );
};

export default ClientReturnList;
