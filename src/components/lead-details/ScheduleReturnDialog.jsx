import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

const ScheduleReturnDialog = ({ open, onOpenChange, onSchedule }) => {
  const [wantsReturn, setWantsReturn] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');

  const handleSave = () => {
    if (wantsReturn && (!returnDate || !returnTime)) {
      toast({ title: "❌ Campos obrigatórios", description: "Preencha data e horário para o retorno", variant: "destructive" });
      return;
    }
    onSchedule({ wantsReturn, returnDate, returnTime });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Agendar Retorno</DialogTitle>
          <DialogDescription className="text-white/70">O cliente deseja que você retorne o contato?</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => setWantsReturn(true)} variant={wantsReturn ? 'default' : 'outline'} className={wantsReturn ? 'btn-primary' : 'btn-secondary'}>
              <Calendar className="w-4 h-4 mr-2" />
              Sim
            </Button>
            <Button onClick={() => setWantsReturn(false)} variant={!wantsReturn ? 'default' : 'outline'} className={!wantsReturn ? 'btn-primary' : 'btn-secondary'}>
              <X className="w-4 h-4 mr-2" />
              Não
            </Button>
          </div>
          {wantsReturn && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Data</Label>
                <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="input-field" min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Horário</Label>
                <Input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="input-field" />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline" className="btn-secondary">Cancelar</Button>
          <Button onClick={handleSave} className="btn-primary">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleReturnDialog;
