
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
    <Card className="glass-card border-cricket-red/20 relative overflow-hidden">
      <div className="absolute inset-0 cricket-gradient opacity-30"></div>
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-semibold text-primary">Live Over</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Batting</p>
            <p className="font-medium">{battingTeam.name}</p>
          </div>
          <div className="text-center mx-4">
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
              className={`cricket-ball ${
                ball.isWicket ? 'bg-destructive' : 
                ball.isExtra ? 'bg-yellow-700' : 
                ''
              }`}
            >
              {getEventDescription(ball)}
            </div>
          ))}
          {Array.from({ length: 6 - currentOver.balls.length }).map((_, idx) => (
            <div 
              key={`empty-${idx}`} 
              className="cricket-ball-empty"
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
                  className={`w-10 h-10 p-0 border-white/10 ${selectedRuns === run ? 'bg-primary hover:bg-primary/90' : 'hover:bg-primary/20 hover:text-white'}`}
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
              className={`flex-1 ${isWicketMenuOpen ? 'bg-primary hover:bg-primary/90' : 'border-white/10 hover:bg-primary/20 hover:text-white'}`}
            >
              Wicket
            </Button>
            <Button
              variant={isExtraMenuOpen ? "default" : "outline"}
              onClick={() => {
                setIsExtraMenuOpen(!isExtraMenuOpen);
                setIsWicketMenuOpen(false);
              }}
              className={`flex-1 ${isExtraMenuOpen ? 'bg-primary hover:bg-primary/90' : 'border-white/10 hover:bg-primary/20 hover:text-white'}`}
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
                    className={`${selectedWicketType === type ? 'bg-primary hover:bg-primary/90' : 'border-white/10 hover:bg-primary/20 hover:text-white'}`}
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
                    className={`${selectedExtraType === type ? 'bg-primary hover:bg-primary/90' : 'border-white/10 hover:bg-primary/20 hover:text-white'}`}
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
