
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Coin, Check, X } from 'lucide-react';
import { Team, TossResult } from '@/types/cricket';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { toast } from "sonner";

interface TossFeatureProps {
  teams: [Team, Team];
  onTossComplete: (tossResult: TossResult) => void;
}

export const TossFeature = ({ teams, onTossComplete }: TossFeatureProps) => {
  const [tossWinner, setTossWinner] = useState<number | null>(null);
  const [choice, setChoice] = useState<'bat' | 'bowl'>('bat');
  const [tossingInProgress, setTossingInProgress] = useState(false);
  const [remainingTosses, setRemainingTosses] = useState(3);

  const conductToss = () => {
    if (remainingTosses <= 0) {
      toast.error("No more tosses remaining! Please make a selection manually.");
      return;
    }

    setTossingInProgress(true);
    
    // Random animation to simulate coin toss
    let flipCount = 0;
    const maxFlips = 10 + Math.floor(Math.random() * 10); // Between 10-20 flips
    const flipInterval = setInterval(() => {
      setTossWinner(Math.round(Math.random()));
      flipCount++;
      
      if (flipCount >= maxFlips) {
        clearInterval(flipInterval);
        setTossingInProgress(false);
        setRemainingTosses(prev => prev - 1);
        toast.success(`${teams[tossWinner !== null ? tossWinner : 0].name} won the toss!`);
      }
    }, 100);
  };

  const confirmToss = () => {
    if (tossWinner === null) {
      toast.error("Please conduct the toss or select a winner first!");
      return;
    }

    onTossComplete({
      winner: tossWinner,
      choice: choice,
      completed: true
    });
    
    toast.success(`${teams[tossWinner].name} has chosen to ${choice} first!`);
  };

  const manuallySelectWinner = (index: number) => {
    setTossWinner(index);
    toast(`${teams[index].name} selected as toss winner`);
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
          <Coin className="h-5 w-5" /> Toss
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Toss Winner</h3>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => manuallySelectWinner(0)}
                variant={tossWinner === 0 ? "default" : "outline"}
                className="flex-1"
                disabled={tossingInProgress}
              >
                {teams[0].name}
                {tossWinner === 0 && <Check className="ml-2 h-4 w-4" />}
              </Button>
              
              <Button 
                onClick={() => manuallySelectWinner(1)}
                variant={tossWinner === 1 ? "default" : "outline"}
                className="flex-1"
                disabled={tossingInProgress}
              >
                {teams[1].name}
                {tossWinner === 1 && <Check className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                onClick={conductToss} 
                variant="secondary" 
                className="w-full"
                disabled={tossingInProgress || remainingTosses <= 0}
              >
                <Coin className="mr-2 h-4 w-4" />
                {tossingInProgress ? "Tossing..." : `Toss Coin (${remainingTosses} left)`}
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Winner's Choice</h3>
            
            <Select 
              value={choice} 
              onValueChange={(value) => setChoice(value as 'bat' | 'bowl')}
              disabled={tossWinner === null || tossingInProgress}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bat">Bat First</SelectItem>
                <SelectItem value="bowl">Bowl First</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={confirmToss} 
              variant="default" 
              className="w-full"
              disabled={tossWinner === null || tossingInProgress}
            >
              <Check className="mr-2 h-4 w-4" />
              Confirm & Start Match
            </Button>
          </div>
        </div>

        {tossWinner !== null && (
          <div className="mt-4 p-3 bg-primary/10 rounded-md text-center">
            <p className="font-medium">
              {teams[tossWinner].name} {tossingInProgress ? "winning" : "won"} the toss 
              {!tossingInProgress && choice && ` and chose to ${choice} first`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
