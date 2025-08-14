import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatTime, isReturnToday, handleWhatsAppClick } from '@/lib/dateUtils';

const ClientList = ({ clients, onClientSelect, onDeleteRequest }) => {
  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><Users className="w-5 h-5" />Todos os Clientes ({clients.length})</CardTitle>
        <CardDescription className="text-white/70">Clique em um cliente para ver os detalhes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
              onClick={() => onClientSelect(client)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 cursor-pointer">
                  <h3 className="font-semibold text-white mb-1">{client.nome}</h3>
                  <div className="text-sm text-white/70 space-y-1">
                    <div>📞 {client.contato}</div>
                    <div>📍 {client.endereco}</div>
                    <div>💰 {client.plano}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={(e) => { e.stopPropagation(); handleWhatsAppClick(client); }} size="sm" className="btn-primary"><MessageCircle className="w-4 h-4 mr-1" />WhatsApp</Button>
                  <Button onClick={(e) => { e.stopPropagation(); onDeleteRequest(client); }} size="sm" variant="outline" className="text-red-400 border-red-400/30 hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></Button>
                  {isReturnToday(client.returnDate) && <div className="text-xs px-2 py-1 bg-red-500 text-white rounded-full text-center">Hoje!</div>}
                </div>
              </div>
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Calendar className="w-4 h-4" />
                  <span>Retorno: {formatDate(client.returnDate)} às {formatTime(client.returnTime)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientList;
