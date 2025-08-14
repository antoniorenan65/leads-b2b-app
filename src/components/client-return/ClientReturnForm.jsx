import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/contexts/LeadContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from '@/components/ui/use-toast';

const ClientReturnForm = ({ formData, setFormData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { addClientReturn } = useLeads();
  const { addNotification } = useNotifications();

  const planos = [
    '100 Mbps - R$ 79,90', '200 Mbps - R$ 99,90', '300 Mbps - R$ 119,90',
    '500 Mbps - R$ 149,90', '1 Gbps - R$ 199,90', 'Empresarial 500 Mbps - R$ 299,90',
    'Empresarial 1 Gbps - R$ 399,90'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatWhatsApp = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const handleWhatsAppChange = (value) => {
    handleInputChange('contato', formatWhatsApp(value));
  };

  const validateForm = () => {
    const requiredFields = ['nome', 'endereco', 'contato', 'plano', 'returnDate', 'returnTime'];
    for (const field of requiredFields) {
      if (!formData[field] || !formData[field].trim()) {
        toast({ title: "❌ Campo obrigatório", description: `Preencha o campo ${field}`, variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const clientReturnData = {
      id: Date.now().toString(),
      ...formData,
      createdBy: user.email,
      createdAt: new Date().toISOString()
    };
    
    addClientReturn(clientReturnData);
    addNotification({
      clientName: formData.nome,
      date: formData.returnDate,
      time: formData.returnTime,
      type: 'Retorno de Cliente'
    });
    
    toast({ title: "✅ Cliente cadastrado!", description: `${formData.nome} foi cadastrado com sucesso.` });
    setFormData({ nome: '', endereco: '', contato: '', plano: '', returnDate: '', returnTime: '' });
    setIsLoading(false);
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><UserPlus className="w-5 h-5" />Informações do Cliente</CardTitle>
        <CardDescription className="text-white/70">Preencha todos os campos obrigatórios</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-white">Nome Completo *</Label>
            <Input id="nome" type="text" placeholder="Digite o nome completo do cliente" value={formData.nome} onChange={(e) => handleInputChange('nome', e.target.value)} className="input-field" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endereco" className="text-white">Endereço Completo *</Label>
            <Input id="endereco" type="text" placeholder="Rua, número, bairro, cidade, CEP" value={formData.endereco} onChange={(e) => handleInputChange('endereco', e.target.value)} className="input-field" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contato" className="text-white">Contato (WhatsApp) *</Label>
            <Input id="contato" type="tel" placeholder="(11) 99999-9999" value={formData.contato} onChange={(e) => handleWhatsAppChange(e.target.value)} className="input-field" maxLength={15} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plano" className="text-white">Plano de Interesse *</Label>
            <Select value={formData.plano} onChange={(e) => handleInputChange('plano', e.target.value)} className="input-field" required>
              <option value="">Selecione o plano</option>
              {planos.map(plano => <option key={plano} value={plano}>{plano}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="returnDate" className="text-white">Data do Retorno *</Label>
              <Input id="returnDate" type="date" value={formData.returnDate} onChange={(e) => handleInputChange('returnDate', e.target.value)} className="input-field" min={new Date().toISOString().split('T')[0]} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="returnTime" className="text-white">Horário do Retorno *</Label>
              <Input id="returnTime" type="time" value={formData.returnTime} onChange={(e) => handleInputChange('returnTime', e.target.value)} className="input-field" required />
            </div>
          </div>
          <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
            {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Cadastrar Cliente
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientReturnForm;
