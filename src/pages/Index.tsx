import { useState, useEffect } from 'react';
import { ScoreCard } from '@/components/ScoreCard';
import { TeamManagement } from '@/components/TeamManagement';
import { LiveOverView } from '@/components/LiveOverView';
import { TossFeature } from '@/components/TossFeature';
import { Button } from "@/components/ui/button";
import { Trophy, Users, Play, ArrowRight } from 'lucide-react';
import { Team, Player, BallEvent, Over, MatchState, TossResult } from '@/types/cricket';
import { toast } from "sonner";

const defaultTeams: [Team, Team] = [
  {
    id: '1',
    name: 'Team 1',
    players: []
  },
  {
    id: '2',
    name: 'Team 2',
    players: []
  }
];

const createEmptyOver = (number: number): Over => ({
  number,
  balls: [],
  complete: false
});

const Index = () => {
  const [matchState, setMatchState] = useState<MatchState>({
    teams: defaultTeams,
    currentInningsTeamIndex: 0,
    overs: [createEmptyOver(1)],
    currentOver: 1,
    currentBall: 0,
    battingTeamScore: 0,
    battingTeamWickets: 0,
    currentBatsmen: [null, null],
    currentBowler: null,
    toss: null,
    gameStarted: false
  });

  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [showTossScreen, setShowTossScreen] = useState(false);

  const handleTeamsUpdate = (teams: [Team, Team]) => {
    setMatchState(prev => ({
      ...prev,
      teams
    }));
  };

  const handleTossComplete = (tossResult: TossResult) => {
    setMatchState(prev => {
      // Determine the batting team based on toss results
      let battingTeamIndex: 0 | 1;
      
      if (tossResult.choice === 'bat') {
        battingTeamIndex = tossResult.winner as 0 | 1;
      } else {
        battingTeamIndex = (tossResult.winner === 0 ? 1 : 0) as 0 | 1;
      }
      
      return {
        ...prev,
        toss: tossResult,
        currentInningsTeamIndex: battingTeamIndex,
        gameStarted: true
      };
    });
    
    setShowTossScreen(false);
    toast.success("Match started! Good luck to both teams.");
  };

  const handleBallEvent = (event: BallEvent) => {
    setMatchState(prev => {
      // Create a copy of the current state
      const newState = { ...prev };
      
      // Find the current over
      const currentOverIndex = newState.overs.findIndex(over => over.number === newState.currentOver);
      if (currentOverIndex === -1) return prev;
      
      // Add the ball event to the current over
      newState.overs[currentOverIndex].balls.push(event);
      
      // Update score and wickets
      newState.battingTeamScore += event.runs + (event.extraRuns || 0);
      if (event.isWicket) {
        newState.battingTeamWickets += 1;
      }
      
      // Check if over is complete (6 legal deliveries)
      const legalDeliveries = newState.overs[currentOverIndex].balls.filter(
        ball => !ball.isExtra || (ball.extraType !== 'Wide' && ball.extraType !== 'No Ball')
      ).length;
      
      if (legalDeliveries >= 6) {
        // Mark current over as complete
        newState.overs[currentOverIndex].complete = true;
        
        // Create a new over
        newState.overs.push(createEmptyOver(newState.currentOver + 1));
        newState.currentOver += 1;
        newState.currentBall = 0;
      } else {
        newState.currentBall = legalDeliveries;
      }
      
      return newState;
    });
  };

  const getCurrentOver = (): Over => {
    const over = matchState.overs.find(over => over.number === matchState.currentOver);
    return over || createEmptyOver(matchState.currentOver);
  };

  const getRunRate = () => {
    const totalOvers = matchState.currentOver - 1 + (matchState.currentBall / 6);
    if (totalOvers === 0) return 0;
    return (matchState.battingTeamScore / totalOvers).toFixed(2);
  };

  const toggleInningsTeam = () => {
    setMatchState(prev => ({
      ...prev,
      currentInningsTeamIndex: prev.currentInningsTeamIndex === 0 ? 1 : 0,
      battingTeamScore: 0,
      battingTeamWickets: 0,
      overs: [createEmptyOver(1)],
      currentOver: 1,
      currentBall: 0,
      currentBatsmen: [null, null],
      currentBowler: null
    }));
  };

  const startGame = () => {
    // Validate teams have enough players
    if (matchState.teams[0].players.length < 2 || matchState.teams[1].players.length < 2) {
      toast.error("Both teams need at least 2 players!");
      return;
    }
    
    setShowTossScreen(true);
    setShowTeamManagement(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Cricket Score Tracker</h1>
          <p className="text-muted-foreground">Track live cricket scores with ease</p>
          
          <div className="flex justify-center gap-4">
            {!showTossScreen && !matchState.gameStarted && (
              <Button 
                onClick={() => setShowTeamManagement(!showTeamManagement)}
                variant={showTeamManagement ? "default" : "outline"}
              >
                <Users className="mr-2 h-4 w-4" />
                {showTeamManagement ? 'Hide Team Management' : 'Team Management'}
              </Button>
            )}
            
            {!showTossScreen && !matchState.gameStarted && (
              <Button 
                onClick={startGame}
                variant="default"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Match
              </Button>
            )}
            
            {matchState.gameStarted && (
              <Button onClick={toggleInningsTeam} variant="outline">
                <Trophy className="mr-2 h-4 w-4" />
                Switch Innings
              </Button>
            )}
          </div>
        </div>

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
          <div className="grid gap-8 md:grid-cols-2">
            <ScoreCard
              teamName={matchState.teams[matchState.currentInningsTeamIndex].name}
              score={matchState.battingTeamScore}
              wickets={matchState.battingTeamWickets}
              overs={parseFloat((matchState.currentOver - 1 + (matchState.currentBall / 6)).toFixed(1))}
              onScoreChange={(runs) => {
                setMatchState(prev => ({
                  ...prev,
                  battingTeamScore: Math.max(0, prev.battingTeamScore + runs)
                }));
              }}
              onWicketChange={(wickets) => {
                setMatchState(prev => ({
                  ...prev,
                  battingTeamWickets: Math.min(Math.max(0, prev.battingTeamWickets + wickets), 10)
                }));
              }}
            />
            <LiveOverView
              teams={matchState.teams}
              currentInningsTeamIndex={matchState.currentInningsTeamIndex}
              currentOver={getCurrentOver()}
              onBallEvent={handleBallEvent}
            />
          </div>
        )}

        {matchState.gameStarted && (
          <div className="glass-card rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Match Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Current over: {matchState.currentOver}.{matchState.currentBall}
                </p>
              </div>
              
              {matchState.toss && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{matchState.teams[matchState.toss.winner].name}</span> won the toss and chose to {matchState.toss.choice} first
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Run Rate</p>
                <p className="text-xl font-semibold">{getRunRate()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {matchState.teams[matchState.currentInningsTeamIndex].name} Batting
                </p>
                <p className="text-xl font-semibold">
                  {matchState.battingTeamWickets} / 10 wickets
                </p>
              </div>
            </div>

            {(matchState.battingTeamScore > 0) && (
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">
                  {matchState.teams[matchState.currentInningsTeamIndex].name} batting
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
