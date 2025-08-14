import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SearchResults = ({ results, isLoading }) => {
  const navigate = useNavigate();

  const handleLeadClick = (cnpj) => {
    navigate(`/lead-details/${cnpj}`);
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Resultados da Busca ({results.length})</CardTitle>
        <CardDescription className="text-white/70">Clique em um lead para ver mais detalhes</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-400" />
            <p className="text-white/70">Buscando leads...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/70">Nenhum lead encontrado. Configure os filtros e faça uma busca.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((lead, index) => (
              <motion.div
                key={lead.cnpj}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-300"
                onClick={() => handleLeadClick(lead.cnpj)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{lead.razaoSocial}</h3>
                    <div className="text-sm text-white/70 space-y-1">
                      <div>CNPJ: {lead.cnpj}</div>
                      <div>📞 {lead.telefone}</div>
                      <div>📍 {lead.endereco}, {lead.cidade}/{lead.estado}</div>
                      {lead.cnae && <div>🏢 CNAE: {lead.cnae}</div>}
                    </div>
                  </div>
                  <Button size="sm" className="btn-primary">Ver Detalhes</Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchResults;
