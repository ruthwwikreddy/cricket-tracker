
import { Button } from "@/components/ui/button";
import { Trophy, Users, Play } from 'lucide-react';

interface MatchHeaderProps {
  gameStarted: boolean;
  showTeamManagement: boolean;
  showTossScreen: boolean;
  onToggleTeamManagement: () => void;
  onStartGame: () => void;
  onSwitchInnings: () => void;
}

export const MatchHeader = ({
  gameStarted,
  showTeamManagement,
  showTossScreen,
  onToggleTeamManagement,
  onStartGame,
  onSwitchInnings
}: MatchHeaderProps) => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold text-primary">Cricket Score Tracker</h1>
      <p className="text-muted-foreground">Track live cricket scores with ease</p>
      
      <div className="flex justify-center gap-4">
        {!showTossScreen && !gameStarted && (
          <Button 
            onClick={onToggleTeamManagement}
            variant={showTeamManagement ? "default" : "outline"}
          >
            <Users className="mr-2 h-4 w-4" />
            {showTeamManagement ? 'Hide Team Management' : 'Team Management'}
          </Button>
        )}
        
        {!showTossScreen && !gameStarted && (
          <Button 
            onClick={onStartGame}
            variant="default"
          >
            <Play className="mr-2 h-4 w-4" />
            Start Match
          </Button>
        )}
        
        {gameStarted && (
          <Button onClick={onSwitchInnings} variant="outline">
            <Trophy className="mr-2 h-4 w-4" />
            Switch Innings
          </Button>
        )}
      </div>
    </div>
  );
};
