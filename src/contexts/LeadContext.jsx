import React, { createContext, useContext, useState, useEffect } from 'react';

const LeadContext = createContext();

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads deve ser usado dentro de um LeadProvider');
  }
  return context;
};

export const LeadProvider = ({ children }) => {
  const [interestedLeads, setInterestedLeads] = useState([]);
  const [clientReturns, setClientReturns] = useState([]);

  useEffect(() => {
    const savedInterestedLeads = localStorage.getItem('interestedLeads');
    if (savedInterestedLeads) {
      setInterestedLeads(JSON.parse(savedInterestedLeads));
    }

    const savedClientReturns = localStorage.getItem('clientReturns');
    if (savedClientReturns) {
      setClientReturns(JSON.parse(savedClientReturns));
    }
  }, []);

  const updateLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addInterestedLead = (leadData) => {
    setInterestedLeads(prevLeads => {
      const newLeads = [...prevLeads];
      const existingIndex = newLeads.findIndex(l => l.cnpj === leadData.cnpj);
      if (existingIndex >= 0) {
        newLeads[existingIndex] = leadData;
      } else {
        newLeads.push(leadData);
      }
      updateLocalStorage('interestedLeads', newLeads);
      return newLeads;
    });
  };
  
  const updateInterestedLead = (cnpj, updatedData) => {
    setInterestedLeads(prevLeads => {
      const newLeads = prevLeads.map(lead => 
        lead.cnpj === cnpj ? { ...lead, ...updatedData } : lead
      );
      updateLocalStorage('interestedLeads', newLeads);
      return newLeads;
    });
  };

  const addClientReturn = (clientData) => {
    setClientReturns(prevClients => {
      const newClients = [...prevClients, clientData];
      updateLocalStorage('clientReturns', newClients);
      return newClients;
    });
  };

  const removeClientReturn = (clientId) => {
    setClientReturns(prevClients => {
      const newClients = prevClients.filter(client => client.id !== clientId);
      updateLocalStorage('clientReturns', newClients);
      return newClients;
    });
  };

  const value = {
    interestedLeads,
    addInterestedLead,
    updateInterestedLead,
    clientReturns,
    addClientReturn,
    removeClientReturn,
    setClientReturns,
  };

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
};
