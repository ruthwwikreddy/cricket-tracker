
import { ScoreCard } from '@/components/ScoreCard';
import { LiveOverView } from '@/components/LiveOverView';
import { Team, BallEvent, Over } from '@/types/cricket';

interface MatchScoreViewProps {
  teams: [Team, Team];
  currentInningsTeamIndex: 0 | 1;
  battingTeamScore: number;
  battingTeamWickets: number;
  currentOver: number;
  currentBall: number;
  over: Over;
  onScoreChange: (runs: number) => void;
  onWicketChange: (wickets: number) => void;
  onBallEvent: (event: BallEvent) => void;
}

export const MatchScoreView = ({
  teams,
  currentInningsTeamIndex,
  battingTeamScore,
  battingTeamWickets,
  currentOver,
  currentBall,
  over,
  onScoreChange,
  onWicketChange,
  onBallEvent
}: MatchScoreViewProps) => {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <ScoreCard
        teamName={teams[currentInningsTeamIndex].name}
        score={battingTeamScore}
        wickets={battingTeamWickets}
        overs={parseFloat((currentOver - 1 + (currentBall / 6)).toFixed(1))}
        onScoreChange={onScoreChange}
        onWicketChange={onWicketChange}
      />
      <LiveOverView
        teams={teams}
        currentInningsTeamIndex={currentInningsTeamIndex}
        currentOver={over}
        onBallEvent={onBallEvent}
      />
    </div>
  );
};
