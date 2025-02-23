
import { useState } from 'react';
import { ScoreCard } from '@/components/ScoreCard';
import { Button } from "@/components/ui/button";
import { Trophy } from 'lucide-react';

const Index = () => {
  const [team1Score, setTeam1Score] = useState(0);
  const [team1Wickets, setTeam1Wickets] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team2Wickets, setTeam2Wickets] = useState(0);
  const [overs, setOvers] = useState(0);

  const handleOverIncrement = () => {
    setOvers((prev) => Math.min(prev + 0.1, 50));
  };

  const getRunRate = (score: number) => {
    if (overs === 0) return 0;
    return (score / overs).toFixed(2);
  };

  const getWinningTeam = () => {
    if (team1Score > team2Score) return 'Team 1';
    if (team2Score > team1Score) return 'Team 2';
    return 'Tie';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Cricket Score Tracker</h1>
          <p className="text-muted-foreground">Track live cricket scores with ease</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <ScoreCard
            teamName="Team 1"
            score={team1Score}
            wickets={team1Wickets}
            overs={overs}
            onScoreChange={(runs) => setTeam1Score((prev) => Math.max(0, prev + runs))}
            onWicketChange={(wickets) => setTeam1Wickets((prev) => Math.min(Math.max(0, prev + wickets), 10))}
          />
          <ScoreCard
            teamName="Team 2"
            score={team2Score}
            wickets={team2Wickets}
            overs={overs}
            onScoreChange={(runs) => setTeam2Score((prev) => Math.max(0, prev + runs))}
            onWicketChange={(wickets) => setTeam2Wickets((prev) => Math.min(Math.max(0, prev + wickets), 10))}
          />
        </div>

        <div className="glass-card rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Match Progress</h3>
              <p className="text-sm text-muted-foreground">Current over: {overs.toFixed(1)}</p>
            </div>
            <Button onClick={handleOverIncrement}>Next Ball</Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Team 1 Run Rate</p>
              <p className="text-xl font-semibold">{getRunRate(team1Score)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team 2 Run Rate</p>
              <p className="text-xl font-semibold">{getRunRate(team2Score)}</p>
            </div>
          </div>

          {(team1Score > 0 || team2Score > 0) && (
            <div className="flex items-center gap-2 text-primary">
              <Trophy className="h-5 w-5" />
              <span className="font-semibold">
                {getWinningTeam()} {team1Score === team2Score ? '' : 'leading'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
