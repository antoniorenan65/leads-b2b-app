import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const SearchFilters = ({ onSearch, onGeolocationSearch, onCnpjSearch, isLoading }) => {
  const [searchType, setSearchType] = useState('manual');
  const [filters, setFilters] = useState({ estado: '', cidade: '', bairro: '', cep: '', cnae: '' });
  const [cnpjToSearch, setCnpjToSearch] = useState('');
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const data = await response.json();
        setEstados(data.sort((a, b) => a.nome.localeCompare(b.nome)));
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
      }
    };
    fetchEstados();
  }, []);

  const fetchCidades = async (estadoId) => {
    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`);
      const data = await response.json();
      setCidades(data.sort((a, b) => a.nome.localeCompare(b.nome)));
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  };

  const handleEstadoChange = (e) => {
    const estadoId = e.target.value;
    const estado = estados.find(est => est.id.toString() === estadoId);
    setFilters({ ...filters, estado: estado ? estado.sigla : '', cidade: '', bairro: '' });
    if (estadoId) {
      fetchCidades(estadoId);
    } else {
      setCidades([]);
    }
  };

  const handleCidadeChange = (e) => {
    setFilters({ ...filters, cidade: e.target.value, bairro: '' });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleCnpjSearch = (e) => {
    e.preventDefault();
    if (!cnpjToSearch.trim()) {
      toast({ title: 'CNPJ inválido', description: 'Por favor, digite um CNPJ para buscar.', variant: 'destructive' });
      return;
    }
    onCnpjSearch(cnpjToSearch.replace(/\D/g, ''));
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Filtros de Busca</CardTitle>
        <CardDescription className="text-white/70">Configure os parâmetros da busca</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label className="text-white">Tipo de Busca</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => setSearchType('manual')} variant={searchType === 'manual' ? 'default' : 'outline'} className={searchType === 'manual' ? 'btn-primary' : 'btn-secondary'} size="sm">Localização</Button>
            <Button onClick={() => setSearchType('cnpj')} variant={searchType === 'cnpj' ? 'default' : 'outline'} className={searchType === 'cnpj' ? 'btn-primary' : 'btn-secondary'} size="sm"><FileSearch className="w-4 h-4 mr-1" />Por CNPJ</Button>
          </div>
          <Button onClick={() => setSearchType('geolocation')} variant={searchType === 'geolocation' ? 'default' : 'outline'} className={`w-full ${searchType === 'geolocation' ? 'btn-primary' : 'btn-secondary'}`} size="sm"><MapPin className="w-4 h-4 mr-1" />Usar minha localização</Button>
        </div>

        {searchType === 'manual' && (
          <form onSubmit={(e) => { e.preventDefault(); onSearch(filters); }} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Estado *</Label>
              <Select onChange={handleEstadoChange} className="input-field">
                <option value="">Selecione o estado</option>
                {estados.map(estado => <option key={estado.id} value={estado.id}>{estado.nome}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Cidade *</Label>
              <Select name="cidade" onChange={handleCidadeChange} className="input-field" disabled={!filters.estado}>
                <option value="">Selecione a cidade</option>
                {cidades.map(cidade => <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>)}
              </Select>
            </div>
            <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
              {isLoading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Buscar por Local
            </Button>
          </form>
        )}
        
        {searchType === 'geolocation' && (
          <div className="text-center py-8">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <p className="text-white/70 mb-4">Clique no botão para encontrar leads próximos.</p>
            <Button onClick={onGeolocationSearch} className="btn-primary" disabled={isLoading}>
              {isLoading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
              Buscar na Minha Localização
            </Button>
          </div>
        )}

        {searchType === 'cnpj' && (
           <form onSubmit={handleCnpjSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj" className="text-white">CNPJ</Label>
              <Input id="cnpj" name="cnpj" placeholder="Digite o CNPJ" value={cnpjToSearch} onChange={(e) => setCnpjToSearch(e.target.value)} className="input-field" />
            </div>
            <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
              {isLoading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Buscar CNPJ
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
