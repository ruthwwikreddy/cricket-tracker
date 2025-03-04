
import { useState } from 'react';
import { TeamManagement } from '@/components/TeamManagement';
import { TossFeature } from '@/components/TossFeature';
import { MatchHeader } from '@/components/MatchHeader';
import { MatchScoreView } from '@/components/MatchScoreView';
import { MatchProgress } from '@/components/MatchProgress';
import { useMatchState } from '@/hooks/useMatchState';
import { toast } from "sonner";

const Index = () => {
  const {
    matchState,
    handleTeamsUpdate,
    handleTossComplete,
    handleBallEvent,
    getCurrentOver,
    getRunRate,
    toggleInningsTeam,
    startGame
  } = useMatchState();

  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [showTossScreen, setShowTossScreen] = useState(false);

  const handleStartGame = () => {
    if (startGame()) {
      setShowTossScreen(true);
      setShowTeamManagement(false);
    }
  };

  const handleToggleTeamManagement = () => {
    setShowTeamManagement(!showTeamManagement);
  };

  const handleScoreChange = (runs: number) => {
    const newScore = Math.max(0, matchState.battingTeamScore + runs);
    
    // This is now handled through state updates rather than direct mutation
    handleBallEvent({
      runs: runs > 0 ? runs : 0,
      isWicket: false,
      extraRuns: runs < 0 ? Math.abs(runs) : 0,
      isExtra: false
    });
  };

  const handleWicketChange = (wickets: number) => {
    const newWickets = Math.min(Math.max(0, matchState.battingTeamWickets + wickets), 10);
    
    if (wickets > 0) {
      handleBallEvent({
        runs: 0,
        isWicket: true,
        wicketType: 'Other'
      });
    } else {
      // Handle wicket removal (just for UI purposes)
      const newState = { ...matchState };
      newState.battingTeamWickets = newWickets;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <MatchHeader 
          gameStarted={matchState.gameStarted}
          showTeamManagement={showTeamManagement}
          showTossScreen={showTossScreen}
          onToggleTeamManagement={handleToggleTeamManagement}
          onStartGame={handleStartGame}
          onSwitchInnings={toggleInningsTeam}
        />

        {showTeamManagement && !matchState.gameStarted && (
          <TeamManagement 
            teams={matchState.teams} 
            onTeamsUpdate={handleTeamsUpdate} 
          />
        )}
        
        {showTossScreen && !matchState.gameStarted && (
          <TossFeature 
            teams={matchState.teams}
            onTossComplete={handleTossComplete}
          />
        )}

        {matchState.gameStarted && (
          <MatchScoreView
            teams={matchState.teams}
            currentInningsTeamIndex={matchState.currentInningsTeamIndex}
            battingTeamScore={matchState.battingTeamScore}
            battingTeamWickets={matchState.battingTeamWickets}
            currentOver={matchState.currentOver}
            currentBall={matchState.currentBall}
            over={getCurrentOver()}
            onScoreChange={handleScoreChange}
            onWicketChange={handleWicketChange}
            onBallEvent={handleBallEvent}
          />
        )}

        {matchState.gameStarted && (
          <MatchProgress
            teams={matchState.teams}
            currentInningsTeamIndex={matchState.currentInningsTeamIndex}
            currentOver={matchState.currentOver}
            currentBall={matchState.currentBall}
            battingTeamScore={matchState.battingTeamScore}
            battingTeamWickets={matchState.battingTeamWickets}
            toss={matchState.toss}
            runRate={getRunRate()}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
