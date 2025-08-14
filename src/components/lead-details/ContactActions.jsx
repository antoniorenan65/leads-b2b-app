import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ContactActions = ({ lead, hasWhatsApp }) => {
  const handleWhatsAppClick = () => {
    if (hasWhatsApp && lead) {
      const phoneNumber = lead.telefone.replace(/\D/g, '');
      const message = encodeURIComponent(`Olá! Encontrei sua empresa através de nossa busca de leads B2B. Gostaria de conversar sobre nossos serviços.`);
      window.open(`https://wa.me/55${phoneNumber}?text=${message}`, '_blank');
    }
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Ações de Contato</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => window.open(`tel:${lead.telefone}`)} className="btn-secondary">
            <Phone className="w-4 h-4 mr-2" />
            Ligar
          </Button>
          <Button onClick={handleWhatsAppClick} disabled={!hasWhatsApp} className={hasWhatsApp ? "btn-primary" : "btn-secondary opacity-50"}>
            <MessageCircle className="w-4 h-4 mr-2" />
            {hasWhatsApp ? 'WhatsApp' : 'Sem WhatsApp'}
          </Button>
        </div>
        {!hasWhatsApp && (
          <p className="text-sm text-white/60 text-center">
            Este número não possui WhatsApp ativo
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactActions;
