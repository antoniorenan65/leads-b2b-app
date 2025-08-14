import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const InternetProviderManager = ({ onSave }) => {
  const [currentInternet, setCurrentInternet] = useState('');
  const [availableProviders, setAvailableProviders] = useState([]);

  useEffect(() => {
    // Simular carregamento de provedores de internet
    setAvailableProviders(['Vivo Fibra', 'Claro Internet', 'Tim Live', 'NET Virtua', 'Oi Fibra', 'Algar Telecom']);
  }, []);

  const handleSave = () => {
    if (!currentInternet) {
      toast({ title: "❌ Selecione um provedor", variant: "destructive" });
      return;
    }
    onSave(currentInternet);
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Wifi className="w-5 h-5" />
          Internet Atual
        </CardTitle>
        <CardDescription className="text-white/70">Registre o provedor de internet atual do cliente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-white">Provedor Atual</Label>
          <Select value={currentInternet} onChange={(e) => setCurrentInternet(e.target.value)} className="input-field">
            <option value="">Selecione o provedor</option>
            {availableProviders.map(provider => <option key={provider} value={provider}>{provider}</option>)}
          </Select>
        </div>
        <Button onClick={handleSave} className="w-full btn-primary" disabled={!currentInternet}>
          Salvar Informação
        </Button>
      </CardContent>
    </Card>
  );
};

export default InternetProviderManager;
