import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

const DeleteClientDialog = ({ open, onOpenChange, client, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm();
    toast({
      title: "✅ Cliente removido",
      description: `${client?.nome} foi removido da lista.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Confirmar Exclusão</DialogTitle>
          <DialogDescription className="text-white/70">
            Tem certeza que deseja remover {client?.nome} da lista? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline" className="btn-secondary">Cancelar</Button>
          <Button onClick={handleConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            <Trash2 className="w-4 h-4 mr-2" />
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteClientDialog;
