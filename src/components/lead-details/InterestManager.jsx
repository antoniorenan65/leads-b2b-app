import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const InterestManager = ({ onInterestChange }) => {
  const [isInterested, setIsInterested] = useState(null);

  const handleInterestClick = (interested) => {
    setIsInterested(interested);
    onInterestChange(interested);
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Cliente tem Interesse?</CardTitle>
        <CardDescription className="text-white/70">Marque se o cliente demonstrou interesse</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => handleInterestClick(true)} variant={isInterested === true ? 'default' : 'outline'} className={isInterested === true ? 'btn-primary' : 'btn-secondary'}>
            <Check className="w-4 h-4 mr-2" />
            Sim
          </Button>
          <Button onClick={() => handleInterestClick(false)} variant={isInterested === false ? 'default' : 'outline'} className={isInterested === false ? 'btn-primary' : 'btn-secondary'}>
            <X className="w-4 h-4 mr-2" />
            Não
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestManager;
