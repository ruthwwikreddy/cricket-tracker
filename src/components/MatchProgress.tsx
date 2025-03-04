
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
    <div className="glass-card rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Match Progress</h3>
          <p className="text-sm text-muted-foreground">
            Current over: {currentOver}.{currentBall}
          </p>
        </div>
        
        {toss && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{teams[toss.winner].name}</span> won the toss and chose to {toss.choice} first
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Run Rate</p>
          <p className="text-xl font-semibold">{runRate}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {teams[currentInningsTeamIndex].name} Batting
          </p>
          <p className="text-xl font-semibold">
            {battingTeamWickets} / 10 wickets
          </p>
        </div>
      </div>

      {(battingTeamScore > 0) && (
        <div className="flex items-center gap-2 text-primary">
          <Trophy className="h-5 w-5" />
          <span className="font-semibold">
            {teams[currentInningsTeamIndex].name} batting
          </span>
        </div>
      )}
    </div>
  );
};
