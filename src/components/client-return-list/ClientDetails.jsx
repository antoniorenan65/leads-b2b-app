import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatTime, isReturnToday, handleWhatsAppClick } from '@/lib/dateUtils';

const ClientDetails = ({ client, upcomingReturns, onClientSelect, onClose }) => {
  if (client) {
    return (
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Detalhes do Cliente</CardTitle>
          <CardDescription className="text-white/70">Informações completas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><span className="text-white/70 text-sm">Nome:</span><p className="text-white font-medium">{client.nome}</p></div>
          <div><span className="text-white/70 text-sm">Endereço:</span><p className="text-white font-medium">{client.endereco}</p></div>
          <div><span className="text-white/70 text-sm">WhatsApp:</span><p className="text-white font-medium">{client.contato}</p></div>
          <div><span className="text-white/70 text-sm">Plano:</span><p className="text-white font-medium">{client.plano}</p></div>
          <div><span className="text-white/70 text-sm">Retorno:</span><p className="text-white font-medium">{formatDate(client.returnDate)} às {formatTime(client.returnTime)}</p></div>
          <div><span className="text-white/70 text-sm">Cadastrado em:</span><p className="text-white font-medium">{formatDate(client.createdAt)}</p></div>
          <div className="pt-4 space-y-2">
            <Button onClick={() => handleWhatsAppClick(client)} className="w-full btn-primary"><MessageCircle className="w-4 h-4 mr-2" />Contatar</Button>
            <Button onClick={onClose} variant="outline" className="w-full btn-secondary">Fechar Detalhes</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Próximos Retornos</CardTitle>
        <CardDescription className="text-white/70">Agendamentos ordenados por data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {upcomingReturns.length === 0 ? (
            <div className="text-center py-8"><Calendar className="w-12 h-12 mx-auto mb-3 text-white/30" /><p className="text-white/60 text-sm">Nenhum retorno agendado</p></div>
          ) : (
            upcomingReturns.map((ret, index) => (
              <motion.div
                key={`${ret.id}-${index}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border cursor-pointer ${isReturnToday(ret.returnDate) ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5 border-white/10'}`}
                onClick={() => onClientSelect(ret)}
              >
                <div className="font-medium text-white text-sm mb-1">{ret.nome}</div>
                <div className="text-xs text-white/70 space-y-1">
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(ret.returnDate)}</div>
                  <div className="flex items-center gap-1">⏰ {formatTime(ret.returnTime)}</div>
                  <div className="flex items-center gap-1">📞 {ret.contato}</div>
                </div>
                {isReturnToday(ret.returnDate) && (
                  <div className="mt-2">
                    <Button onClick={(e) => { e.stopPropagation(); handleWhatsAppClick(ret); }} size="sm" className="w-full btn-primary text-xs"><MessageCircle className="w-3 h-3 mr-1" />Contatar Agora</Button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientDetails;
