import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import SearchFilters from '@/components/b2b-leads/SearchFilters';
import SearchResults from '@/components/b2b-leads/SearchResults';
import { toast } from '@/components/ui/use-toast';
import { fetchCnpjData } from '@/services/brasilAPI';

const B2BLeads = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCnpjSearch = async (cnpj) => {
    setIsLoading(true);
    setResults([]);

    try {
      const data = await fetchCnpjData(cnpj);
      if (data) {
        const result = {
          cnpj: data.cnpj,
          razaoSocial: data.razao_social,
          telefone: data.ddd_telefone_1,
          endereco: `${data.logradouro}, ${data.numero}`,
          cidade: data.municipio,
          estado: data.uf,
          cnae: data.cnae_fiscal
        };
        setResults([result]);
        toast({ title: "✅ CNPJ encontrado!" });
      }
    } catch (error) {
      toast({ title: "❌ Erro na busca", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    if (!filters.estado || !filters.cidade) {
      toast({ title: "❌ Campos obrigatórios", description: "Preencha pelo menos Estado e Cidade", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setResults([]);
    toast({ title: "🔍 Buscando leads...", description: "Esta é uma simulação. Para buscas reais, é necessária uma API com essa capacidade." });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResults = [
        { cnpj: '06990590000123', razaoSocial: 'NUBANK SA', telefone: '(11) 3333-3333', endereco: 'Rua Capote Valente, 39', cidade: filters.cidade, estado: filters.estado, cnae: '6422100' },
        { cnpj: '34028316000103', razaoSocial: 'Google Brasil Internet Ltda.', telefone: '(11) 2395-8400', endereco: 'Av. Brigadeiro Faria Lima, 3477', cidade: filters.cidade, estado: filters.estado, cnae: '6311900' },
        { cnpj: '03361252000104', razaoSocial: 'MercadoLivre.com Atividades de Internet Ltda.', telefone: '(11) 2543-4155', endereco: 'Avenida das Nações Unidas, 3003', cidade: filters.cidade, estado: filters.estado, cnae: '6319400' }
    ];
    setResults(mockResults);
    toast({ title: "✅ Busca simulada concluída!", description: `Encontrados ${mockResults.length} leads` });
    setIsLoading(false);
  };

  const handleGeolocationSearch = async () => {
    setIsLoading(true);
    setResults([]);
    if (!navigator.geolocation) {
      toast({ title: "❌ Geolocalização não suportada", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    toast({ title: "📍 Buscando por geolocalização...", description: "Esta é uma simulação." });
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResults([{ cnpj: '18727053000174', razaoSocial: 'UBER DO BRASIL TECNOLOGIA LTDA', telefone: '(11) 3333-4444', endereco: 'Av. Juscelino Kubitschek, 1909', cidade: 'São Paulo', estado: 'SP' }]);
        setIsLoading(false);
        toast({ title: "✅ Busca simulada por GPS concluída!" });
      },
      (error) => {
        toast({ title: "❌ Acesso à localização negado", variant: "destructive" });
        setIsLoading(false);
      }
    );
  };

  return (
    <>
      <Helmet>
        <title>B2B Leads - Busca de Leads</title>
        <meta name="description" content="Busque leads B2B por geolocalização ou filtros manuais" />
      </Helmet>
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">B2B Leads</h1>
              <p className="text-white/70">Busque leads por CNPJ, localização ou GPS</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <SearchFilters 
                onSearch={handleSearch} 
                onGeolocationSearch={handleGeolocationSearch}
                onCnpjSearch={handleCnpjSearch}
                isLoading={isLoading} 
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <SearchResults results={results} isLoading={isLoading} />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default B2BLeads;
