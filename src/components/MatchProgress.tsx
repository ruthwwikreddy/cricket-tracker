
import { Trophy } from 'lucide-react';
import { Team, TossResult } from '@/types/cricket';

interface MatchProgressProps {
  teams: [Team, Team];
  currentInningsTeamIndex: 0 | 1;
  currentOver: number;
  currentBall: number;
  battingTeamScore: number;
  battingTeamWickets: number;
  toss: TossResult | null;
  runRate: string;
}

export const MatchProgress = ({
  teams,
  currentInningsTeamIndex,
  currentOver,
  currentBall,
  battingTeamScore,
  battingTeamWickets,
  toss,
  runRate
}: MatchProgressProps) => {
  return (
    <div className="glass-card rounded-lg p-6 space-y-4 border-cricket-red/20 relative overflow-hidden">
      <div className="absolute inset-0 cricket-gradient opacity-30"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-primary">Match Progress</h3>
            <p className="text-sm text-muted-foreground">
              Current over: {currentOver}.{currentBall}
            </p>
          </div>
          
          {toss && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">{teams[toss.winner].name}</span> won the toss and chose to {toss.choice} first
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-black/20 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Run Rate</p>
            <p className="text-2xl font-semibold text-white">{runRate}</p>
          </div>
          <div className="bg-black/20 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {teams[currentInningsTeamIndex].name}
            </p>
            <p className="text-2xl font-semibold text-white">
              {battingTeamWickets} / 10 wickets
            </p>
          </div>
        </div>

        {(battingTeamScore > 0) && (
          <div className="flex items-center gap-2 text-primary mt-4 bg-primary/10 p-3 rounded-lg animate-pulse-glow">
            <Trophy className="h-5 w-5" />
            <span className="font-semibold">
              {teams[currentInningsTeamIndex].name} batting
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
