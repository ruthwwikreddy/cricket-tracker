
import { Trophy, Download, User } from 'lucide-react';
import { Team, TossResult, Over, PlayerScore } from '@/types/cricket';
import { ExportPdf } from './ExportPdf';
import { useState } from 'react';

interface MatchProgressProps {
  teams: [Team, Team];
  currentInningsTeamIndex: 0 | 1;
  currentOver: number;
  currentBall: number;
  battingTeamScore: number;
  battingTeamWickets: number;
  toss: TossResult | null;
  runRate: string;
  overs: Over[];
}

export const MatchProgress = ({
  teams,
  currentInningsTeamIndex,
  currentOver,
  currentBall,
  battingTeamScore,
  battingTeamWickets,
  toss,
  runRate,
  overs
}: MatchProgressProps) => {
  const [showBattingStats, setShowBattingStats] = useState(true);
  
  // Get current team players and scores from the latest scoring data in overs
  const getBattingStats = () => {
    const battingTeam = teams[currentInningsTeamIndex];
    const playerStats = new Map<string, { runs: number, balls: number }>();
    
    // Initialize all players with 0 runs and 0 balls
    battingTeam.players.forEach(player => {
      playerStats.set(player.id, { runs: 0, balls: 0 });
    });
    
    // Calculate stats from all overs
    overs.forEach(over => {
      over.balls.forEach(ball => {
        if (ball.batsmanId) {
          const stats = playerStats.get(ball.batsmanId);
          if (stats) {
            const newStats = {
              runs: stats.runs + ball.runs,
              balls: stats.balls + ((!ball.isExtra || (ball.extraType !== 'Wide' && ball.extraType !== 'No Ball')) ? 1 : 0)
            };
            playerStats.set(ball.batsmanId, newStats);
          }
        }
      });
    });
    
    // Convert map to array for rendering
    return battingTeam.players.map(player => {
      const stats = playerStats.get(player.id) || { runs: 0, balls: 0 };
      return {
        playerId: player.id,
        playerName: player.name,
        runs: stats.runs,
        balls: stats.balls
      };
    });
  };
  
  const getBowlingStats = () => {
    const bowlingTeam = teams[currentInningsTeamIndex === 0 ? 1 : 0];
    const playerStats = new Map<string, { wickets: number, balls: number, runs: number }>();
    
    // Initialize all players with 0 wickets, balls, and runs
    bowlingTeam.players.forEach(player => {
      playerStats.set(player.id, { wickets: 0, balls: 0, runs: 0 });
    });
    
    // Calculate stats from all overs
    overs.forEach(over => {
      over.balls.forEach(ball => {
        if (ball.bowlerId) {
          const stats = playerStats.get(ball.bowlerId);
          if (stats) {
            const newStats = {
              wickets: stats.wickets + (ball.isWicket && ball.wicketType !== 'Run Out' ? 1 : 0),
              balls: stats.balls + ((!ball.isExtra || (ball.extraType !== 'Wide' && ball.extraType !== 'No Ball')) ? 1 : 0),
              runs: stats.runs + ball.runs + (ball.extraRuns || 0)
            };
            playerStats.set(ball.bowlerId, newStats);
          }
        }
      });
    });
    
    // Convert map to array for rendering
    return bowlingTeam.players.map(player => {
      const stats = playerStats.get(player.id) || { wickets: 0, balls: 0, runs: 0 };
      const overs = Math.floor(stats.balls / 6) + (stats.balls % 6) / 10;
      return {
        playerId: player.id,
        playerName: player.name,
        wickets: stats.wickets,
        overs: overs.toFixed(1),
        runs: stats.runs
      };
    });
  };
  
  const battingStats = getBattingStats();
  const bowlingStats = getBowlingStats();
  
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
              {battingTeamScore} / {battingTeamWickets}
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
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-semibold text-primary flex items-center gap-2">
              <User className="h-4 w-4" />
              Player Stats
            </h4>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowBattingStats(true)}
                className={`text-xs px-3 py-1 rounded ${showBattingStats ? 'bg-primary text-white' : 'bg-black/20 hover:bg-black/30'}`}
              >
                Batting
              </button>
              <button 
                onClick={() => setShowBattingStats(false)}
                className={`text-xs px-3 py-1 rounded ${!showBattingStats ? 'bg-primary text-white' : 'bg-black/20 hover:bg-black/30'}`}
              >
                Bowling
              </button>
            </div>
          </div>
          
          {showBattingStats ? (
            <div className="bg-black/10 rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 text-xs text-muted-foreground p-2 bg-black/20">
                <div className="col-span-6">Batsman</div>
                <div className="col-span-2 text-center">Runs</div>
                <div className="col-span-2 text-center">Balls</div>
                <div className="col-span-2 text-center">SR</div>
              </div>
              <div className="max-h-36 overflow-y-auto">
                {battingStats.map((stat) => (
                  <div key={stat.playerId} className="grid grid-cols-12 text-sm p-2 border-t border-white/5">
                    <div className="col-span-6 truncate">{stat.playerName}</div>
                    <div className="col-span-2 text-center">{stat.runs}</div>
                    <div className="col-span-2 text-center">{stat.balls}</div>
                    <div className="col-span-2 text-center">
                      {stat.balls > 0 ? ((stat.runs / stat.balls) * 100).toFixed(1) : '0.0'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-black/10 rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 text-xs text-muted-foreground p-2 bg-black/20">
                <div className="col-span-5">Bowler</div>
                <div className="col-span-2 text-center">O</div>
                <div className="col-span-2 text-center">R</div>
                <div className="col-span-1 text-center">W</div>
                <div className="col-span-2 text-center">Econ</div>
              </div>
              <div className="max-h-36 overflow-y-auto">
                {bowlingStats.map((stat) => (
                  <div key={stat.playerId} className="grid grid-cols-12 text-sm p-2 border-t border-white/5">
                    <div className="col-span-5 truncate">{stat.playerName}</div>
                    <div className="col-span-2 text-center">{stat.overs}</div>
                    <div className="col-span-2 text-center">{stat.runs}</div>
                    <div className="col-span-1 text-center">{stat.wickets}</div>
                    <div className="col-span-2 text-center">
                      {parseFloat(stat.overs) > 0 
                        ? (stat.runs / parseFloat(stat.overs)).toFixed(1) 
                        : '0.0'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-end">
          <ExportPdf 
            teams={teams}
            currentInningsTeamIndex={currentInningsTeamIndex}
            battingTeamScore={battingTeamScore}
            battingTeamWickets={battingTeamWickets}
            currentOver={currentOver}
            currentBall={currentBall}
            overs={overs}
            toss={toss}
            runRate={runRate}
            battingStats={battingStats}
            bowlingStats={bowlingStats}
          />
        </div>
      </div>
    </div>
  );
};
