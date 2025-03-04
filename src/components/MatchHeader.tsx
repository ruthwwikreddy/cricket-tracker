
import { Button } from "@/components/ui/button";
import { Trophy, Users, Play, LogOut } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";

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
  const { user, signOut } = useAuth();

  return (
    <div className="text-center space-y-4 relative">
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent -z-10 transform -translate-y-1/2"></div>
      <div className="flex justify-end absolute top-0 right-0">
        {user && (
          <Button 
            onClick={signOut}
            variant="outline" 
            size="sm"
            className="border-white/10 hover:bg-primary/20 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
      </div>
      <h1 className="text-5xl font-bold text-white relative inline-block">
        <span className="text-primary">Cricket</span> Score Tracker
        <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      </h1>
      <p className="text-muted-foreground">Track live cricket scores with precision</p>
      
      <div className="flex justify-center gap-4 pt-2">
        {!showTossScreen && !gameStarted && (
          <Button 
            onClick={onToggleTeamManagement}
            variant={showTeamManagement ? "default" : "outline"}
            className={showTeamManagement ? "" : "border-white/10 hover:bg-primary/20 hover:text-white"}
          >
            <Users className="mr-2 h-4 w-4" />
            {showTeamManagement ? 'Hide Team Management' : 'Team Management'}
          </Button>
        )}
        
        {!showTossScreen && !gameStarted && (
          <Button 
            onClick={onStartGame}
            variant="default"
            className="hover-glow"
          >
            <Play className="mr-2 h-4 w-4" />
            Start Match
          </Button>
        )}
        
        {gameStarted && (
          <Button 
            onClick={onSwitchInnings} 
            variant="outline" 
            className="border-white/10 hover:bg-primary/20 hover:text-white"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Switch Innings
          </Button>
        )}
      </div>
    </div>
  );
};
