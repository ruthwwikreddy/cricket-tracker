
import { useState } from 'react';
import { TeamManagement } from '@/components/TeamManagement';
import { TossFeature } from '@/components/TossFeature';
import { MatchHeader } from '@/components/MatchHeader';
import { MatchScoreView } from '@/components/MatchScoreView';
import { MatchProgress } from '@/components/MatchProgress';
import { useMatchState } from '@/hooks/useMatchState';

const Index = () => {
  const {
    matchState,
    handleTeamsUpdate,
    handleTossComplete,
    handleBallEvent,
    updateWickets,
    getCurrentOver,
    getRunRate,
    toggleInningsTeam,
    startGame,
    getPlayerScores
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
    handleBallEvent({
      runs: runs > 0 ? runs : 0,
      isWicket: false,
      extraRuns: runs < 0 ? Math.abs(runs) : 0,
      isExtra: false,
      batsmanId: matchState.currentBatsmen[0],
      bowlerId: matchState.currentBowler
    });
  };

  const handleWicketChange = (wickets: number) => {
    if (wickets > 0) {
      handleBallEvent({
        runs: 0,
        isWicket: true,
        wicketType: 'Other',
        batsmanId: matchState.currentBatsmen[0],
        bowlerId: matchState.currentBowler
      });
    } else {
      updateWickets(wickets);
    }
  };

  return (
    <div className="min-h-screen bg-cricket-black py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-[url('/cricket-texture.jpg')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cricket-red/5 to-cricket-black"></div>
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
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
            overs={matchState.overs}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
