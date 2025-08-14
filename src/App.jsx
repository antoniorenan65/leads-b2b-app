import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AdminPanel from '@/pages/AdminPanel';
import B2BLeads from '@/pages/B2BLeads';
import LeadDetails from '@/pages/LeadDetails';
import PotentialClients from '@/pages/PotentialClients';
import InterestedClients from '@/pages/InterestedClients';
import ClientReturn from '@/pages/ClientReturn';
import ClientReturnList from '@/pages/ClientReturnList';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LeadProvider } from '@/contexts/LeadContext';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <LeadProvider>
          <Router>
            <Helmet>
              <title>Leads B2B - Sistema de Gestão de Leads</title>
              <meta name="description" content="Sistema completo para gestão de leads B2B com busca por geolocalização e CNPJ" />
              <meta property="og:title" content="Leads B2B - Sistema de Gestão de Leads" />
              <meta property="og:description" content="Sistema completo para gestão de leads B2B com busca por geolocalização e CNPJ" />
            </Helmet>
            
            <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/b2b-leads" element={<B2BLeads />} />
                <Route path="/lead-details/:cnpj" element={<LeadDetails />} />
                <Route path="/potential-clients" element={<PotentialClients />} />
                <Route path="/interested-clients" element={<InterestedClients />} />
                <Route path="/client-return" element={<ClientReturn />} />
                <Route path="/client-return-list" element={<ClientReturnList />} />
              </Routes>
            </div>
            
            <Toaster />
          </Router>
        </LeadProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
