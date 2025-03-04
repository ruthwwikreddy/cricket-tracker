
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from 'lucide-react';

interface ScoreCardProps {
  teamName: string;
  score: number;
  wickets: number;
  overs: number;
  onScoreChange: (runs: number) => void;
  onWicketChange: (wickets: number) => void;
}

export const ScoreCard = ({
  teamName,
  score,
  wickets,
  overs,
  onScoreChange,
  onWicketChange,
}: ScoreCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleScoreChange = (runs: number) => {
    setIsUpdating(true);
    onScoreChange(runs);
    setTimeout(() => setIsUpdating(false), 500);
  };

  return (
    <Card className="score-container border-cricket-red/20 relative overflow-hidden">
      <div className="absolute inset-0 cricket-gradient opacity-30"></div>
      <div className="relative z-10 space-y-4">
        <h2 className="text-2xl font-semibold text-primary">{teamName}</h2>
        <div className="flex items-center justify-between">
          <div className={`score-digit ${isUpdating ? 'animate-score-update' : ''}`}>
            {score}/{wickets}
          </div>
          <div className="text-xl text-muted-foreground">
            {overs.toFixed(1)} overs
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Runs</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleScoreChange(-1)}
                className="border-white/10 hover:bg-primary/20 hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleScoreChange(1)}
                className="border-white/10 hover:bg-primary/20 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Wickets</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onWicketChange(-1)}
                className="border-white/10 hover:bg-primary/20 hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onWicketChange(1)}
                className="border-white/10 hover:bg-primary/20 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
