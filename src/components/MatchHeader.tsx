
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
    <div className="text-center space-y-3 sm:space-y-4 relative">
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent -z-10 transform -translate-y-1/2"></div>
      
      <div className="flex justify-end absolute top-0 right-0">
        {user && (
          <Button 
            onClick={signOut}
            variant="outline" 
            size="sm"
            className="border-white/10 hover:bg-primary/20 hover:text-white text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4"
          >
            <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        )}
      </div>
      
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white relative inline-block">
        <span className="text-primary">Cricket</span> Score
        <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground">Track live cricket scores with precision</p>
      
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 pt-2">
        {!showTossScreen && !gameStarted && (
          <Button 
            onClick={onToggleTeamManagement}
            variant={showTeamManagement ? "default" : "outline"}
            size="sm"
            className={`text-xs sm:text-sm ${showTeamManagement ? "" : "border-white/10 hover:bg-primary/20 hover:text-white"}`}
          >
            <Users className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {showTeamManagement ? 'Hide Teams' : 'Teams'}
          </Button>
        )}
        
        {!showTossScreen && !gameStarted && (
          <Button 
            onClick={onStartGame}
            variant="default"
            size="sm"
            className="hover-glow text-xs sm:text-sm"
          >
            <Play className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Start Match
          </Button>
        )}
        
        {gameStarted && (
          <Button 
            onClick={onSwitchInnings} 
            variant="outline"
            size="sm" 
            className="border-white/10 hover:bg-primary/20 hover:text-white text-xs sm:text-sm"
          >
            <Trophy className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Switch Innings
          </Button>
        )}
      </div>
    </div>
  );
};
