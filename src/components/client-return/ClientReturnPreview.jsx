import React from 'react';
import { UserPlus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ClientReturnPreview = ({ formData }) => {
  const handleWhatsAppClick = () => {
    if (formData.contato) {
      const phoneNumber = formData.contato.replace(/\D/g, '');
      const message = encodeURIComponent(`Olá ${formData.nome}! Estou entrando em contato sobre o plano de internet ${formData.plano}. Como posso ajudá-lo?`);
      window.open(`https://wa.me/55${phoneNumber}?text=${message}`, '_blank');
    }
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Preview do Cliente</CardTitle>
        <CardDescription className="text-white/70">Visualização dos dados preenchidos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.nome ? (
          <div className="space-y-3">
            <div>
              <span className="text-white/70 text-sm">Nome:</span>
              <p className="text-white font-medium">{formData.nome}</p>
            </div>
            {formData.endereco && (
              <div>
                <span className="text-white/70 text-sm">Endereço:</span>
                <p className="text-white font-medium">{formData.endereco}</p>
              </div>
            )}
            {formData.contato && (
              <div>
                <span className="text-white/70 text-sm">WhatsApp:</span>
                <p className="text-white font-medium">{formData.contato}</p>
              </div>
            )}
            {formData.plano && (
              <div>
                <span className="text-white/70 text-sm">Plano:</span>
                <p className="text-white font-medium">{formData.plano}</p>
              </div>
            )}
            {formData.returnDate && formData.returnTime && (
              <div>
                <span className="text-white/70 text-sm">Retorno:</span>
                <p className="text-white font-medium">
                  {new Date(formData.returnDate).toLocaleDateString('pt-BR')} às {formData.returnTime}
                </p>
              </div>
            )}
            {formData.contato && (
              <Button onClick={handleWhatsAppClick} className="w-full btn-primary" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Testar WhatsApp
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <UserPlus className="w-12 h-12 mx-auto mb-3 text-white/30" />
            <p className="text-white/60 text-sm">Preencha o formulário para ver o preview</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientReturnPreview;
