
import { useState } from 'react';
import { Team, Player, BallEvent, Over, MatchState, TossResult } from '@/types/cricket';
import { toast } from "sonner";

const createEmptyOver = (number: number): Over => ({
  number,
  balls: [],
  complete: false
});

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

export const useMatchState = () => {
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
      return false;
    }
    return true;
  };

  return {
    matchState,
    handleTeamsUpdate,
    handleTossComplete,
    handleBallEvent,
    getCurrentOver,
    getRunRate,
    toggleInningsTeam,
    startGame
  };
};
