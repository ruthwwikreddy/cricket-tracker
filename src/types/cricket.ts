
export interface Player {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  battingOrder?: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface BallEvent {
  runs: number;
  isWicket: boolean;
  wicketType?: 'Bowled' | 'Caught' | 'LBW' | 'Run Out' | 'Stumped' | 'Other';
  isExtra?: boolean;
  extraType?: 'Wide' | 'No Ball' | 'Bye' | 'Leg Bye';
  extraRuns?: number;
  batsmanId?: string;
  bowlerId?: string;
}

export interface Over {
  number: number;
  balls: BallEvent[];
  complete: boolean;
}

export interface MatchState {
  teams: [Team, Team];
  currentInningsTeamIndex: 0 | 1;
  overs: Over[];
  currentOver: number;
  currentBall: number;
  battingTeamScore: number;
  battingTeamWickets: number;
  currentBatsmen: [string | null, string | null]; // striker and non-striker
  currentBowler: string | null;
}
