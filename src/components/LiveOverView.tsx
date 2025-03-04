
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Minus, AlertCircle } from 'lucide-react';
import { BallEvent, Over, Team, Player } from '@/types/cricket';

interface LiveOverViewProps {
  teams: [Team, Team];
  currentInningsTeamIndex: 0 | 1;
  currentOver: Over;
  onBallEvent: (event: BallEvent) => void;
}

export const LiveOverView = ({ 
  teams, 
  currentInningsTeamIndex, 
  currentOver, 
  onBallEvent 
}: LiveOverViewProps) => {
  const [selectedRuns, setSelectedRuns] = useState<number | null>(null);
  const [isWicketMenuOpen, setIsWicketMenuOpen] = useState(false);
  const [isExtraMenuOpen, setIsExtraMenuOpen] = useState(false);
  const [selectedWicketType, setSelectedWicketType] = useState<BallEvent['wicketType'] | null>(null);
  const [selectedExtraType, setSelectedExtraType] = useState<BallEvent['extraType'] | null>(null);

  const battingTeam = teams[currentInningsTeamIndex];
  const bowlingTeam = teams[currentInningsTeamIndex === 0 ? 1 : 0];

  const handleRunsClick = (runs: number) => {
    setSelectedRuns(runs);
  };

  const handleBallSubmit = () => {
    if (selectedRuns === null && !selectedWicketType && !selectedExtraType) return;

    const ballEvent: BallEvent = {
      runs: selectedRuns ?? 0,
      isWicket: !!selectedWicketType,
      wicketType: selectedWicketType ?? undefined,
      isExtra: !!selectedExtraType,
      extraType: selectedExtraType ?? undefined,
      extraRuns: selectedExtraType ? 1 : 0, // Default extra runs
    };

    onBallEvent(ballEvent);
    resetSelections();
  };

  const resetSelections = () => {
    setSelectedRuns(null);
    setIsWicketMenuOpen(false);
    setIsExtraMenuOpen(false);
    setSelectedWicketType(null);
    setSelectedExtraType(null);
  };

  const getEventDescription = (event: BallEvent): string => {
    let description = '';
    
    if (event.isWicket) {
      description = `W (${event.wicketType})`;
    } else if (event.isExtra) {
      description = `${event.extraRuns} ${event.extraType}`;
    } else {
      description = event.runs.toString();
    }
    
    return description;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">Live Over</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Batting</p>
            <p className="font-medium">{battingTeam.name}</p>
          </div>
          <div className="text-center mx-2">
            <p className="text-sm text-muted-foreground">Over</p>
            <p className="font-medium">{currentOver.number}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Bowling</p>
            <p className="font-medium">{bowlingTeam.name}</p>
          </div>
        </div>

        <div className="flex justify-center gap-2 py-2">
          {currentOver.balls.map((ball, idx) => (
            <div 
              key={idx} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                ball.isWicket ? 'bg-destructive text-white' : 
                ball.isExtra ? 'bg-yellow-200 text-yellow-800' : 
                'bg-secondary text-secondary-foreground'
              }`}
            >
              {getEventDescription(ball)}
            </div>
          ))}
          {Array.from({ length: 6 - currentOver.balls.length }).map((_, idx) => (
            <div 
              key={`empty-${idx}`} 
              className="w-8 h-8 rounded-full flex items-center justify-center border border-dashed border-muted-foreground/40"
            />
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Runs</p>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 6].map((run) => (
                <Button
                  key={run}
                  variant={selectedRuns === run ? "default" : "outline"}
                  className="w-10 h-10 p-0"
                  onClick={() => handleRunsClick(run)}
                >
                  {run}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={isWicketMenuOpen ? "default" : "outline"}
              onClick={() => {
                setIsWicketMenuOpen(!isWicketMenuOpen);
                setIsExtraMenuOpen(false);
              }}
              className="flex-1"
            >
              Wicket
            </Button>
            <Button
              variant={isExtraMenuOpen ? "default" : "outline"}
              onClick={() => {
                setIsExtraMenuOpen(!isExtraMenuOpen);
                setIsWicketMenuOpen(false);
              }}
              className="flex-1"
            >
              Extra
            </Button>
          </div>

          {isWicketMenuOpen && (
            <div className="space-y-2 animate-fade-in">
              <p className="text-sm font-medium">Wicket Type</p>
              <div className="flex flex-wrap gap-2">
                {['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Other'].map((type) => (
                  <Button
                    key={type}
                    variant={selectedWicketType === type ? "default" : "outline"}
                    onClick={() => setSelectedWicketType(type as BallEvent['wicketType'])}
                    size="sm"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {isExtraMenuOpen && (
            <div className="space-y-2 animate-fade-in">
              <p className="text-sm font-medium">Extra Type</p>
              <div className="flex flex-wrap gap-2">
                {['Wide', 'No Ball', 'Bye', 'Leg Bye'].map((type) => (
                  <Button
                    key={type}
                    variant={selectedExtraType === type ? "default" : "outline"}
                    onClick={() => setSelectedExtraType(type as BallEvent['extraType'])}
                    size="sm"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={handleBallSubmit}
            disabled={selectedRuns === null && !selectedWicketType && !selectedExtraType}
          >
            Record Ball
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
