import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LeadInfoCard = ({ lead }) => {
  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Informações da Empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/70">Razão Social:</span>
            <p className="text-white font-medium">{lead.razaoSocial}</p>
          </div>
          <div>
            <span className="text-white/70">CNPJ:</span>
            <p className="text-white font-medium">{lead.cnpj}</p>
          </div>
          <div>
            <span className="text-white/70">Telefone:</span>
            <p className="text-white font-medium">{lead.telefone}</p>
          </div>
          <div>
            <span className="text-white/70">Email:</span>
            <p className="text-white font-medium">{lead.email}</p>
          </div>
          <div className="col-span-2">
            <span className="text-white/70">Endereço:</span>
            <p className="text-white font-medium">
              {lead.endereco}, {lead.cidade}/{lead.estado} - {lead.cep}
            </p>
          </div>
          <div className="col-span-2">
            <span className="text-white/70">Atividade:</span>
            <p className="text-white font-medium">{lead.atividade}</p>
          </div>
          <div className="col-span-2">
            <span className="text-white/70">CNAE:</span>
            <p className="text-white font-medium">{lead.cnae}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadInfoCard;
