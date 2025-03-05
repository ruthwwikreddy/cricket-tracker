
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Team, Over, TossResult } from "@/types/cricket";

interface PlayerBattingStat {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
}

interface PlayerBowlingStat {
  playerId: string;
  playerName: string;
  wickets: number;
  overs: string;
  runs: number;
}

interface ExportPdfProps {
  teams: [Team, Team];
  currentInningsTeamIndex: 0 | 1;
  battingTeamScore: number;
  battingTeamWickets: number;
  currentOver: number;
  currentBall: number;
  overs: Over[];
  toss: TossResult | null;
  runRate: string;
  battingStats?: PlayerBattingStat[];
  bowlingStats?: PlayerBowlingStat[];
}

export const ExportPdf = ({
  teams,
  currentInningsTeamIndex,
  battingTeamScore,
  battingTeamWickets,
  currentOver,
  currentBall,
  overs,
  toss,
  runRate,
  battingStats,
  bowlingStats,
}: ExportPdfProps) => {
  const exportToPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38); // cricket-red color
    const title = `Cricket Match Report`;
    const titleWidth = doc.getTextDimensions(title).w;
    doc.text(title, (pageWidth - titleWidth) / 2, 20);
    
    // Add match info
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`${teams[0].name} vs ${teams[1].name}`, 20, 35);
    
    // Add toss info
    if (toss) {
      const tossInfo = `${teams[toss.winner].name} won the toss and chose to ${toss.choice} first`;
      doc.text(tossInfo, 20, 45);
    }
    
    // Add current score
    doc.setFontSize(16);
    doc.text(`Current Score`, 20, 60);
    doc.setFontSize(14);
    doc.text(`${teams[currentInningsTeamIndex].name}: ${battingTeamScore}/${battingTeamWickets}`, 20, 70);
    doc.text(`Overs: ${currentOver - 1}.${currentBall}`, 20, 80);
    doc.text(`Run Rate: ${runRate}`, 20, 90);
    
    // Add batting stats
    if (battingStats && battingStats.length > 0) {
      doc.setFontSize(16);
      doc.text(`Batting Statistics`, 20, 105);
      
      autoTable(doc, {
        startY: 110,
        head: [['Batsman', 'Runs', 'Balls', 'Strike Rate']],
        body: battingStats.map(player => [
          player.playerName, 
          player.runs.toString(), 
          player.balls.toString(), 
          player.balls > 0 ? ((player.runs / player.balls) * 100).toFixed(1) : '0'
        ]),
        theme: 'grid',
        styles: { fontSize: 12 },
        headStyles: { fillColor: [220, 38, 38] },
      });
    }
    
    // Add bowling stats
    if (bowlingStats && bowlingStats.length > 0) {
      const battingTableHeight = battingStats ? (battingStats.length * 10 + 10) : 0;
      doc.setFontSize(16);
      doc.text(`Bowling Statistics`, 20, 120 + battingTableHeight);
      
      autoTable(doc, {
        startY: 125 + battingTableHeight,
        head: [['Bowler', 'Overs', 'Runs', 'Wickets', 'Economy']],
        body: bowlingStats.map(player => [
          player.playerName, 
          player.overs, 
          player.runs.toString(), 
          player.wickets.toString(),
          parseFloat(player.overs) > 0 ? (player.runs / parseFloat(player.overs)).toFixed(1) : '0'
        ]),
        theme: 'grid',
        styles: { fontSize: 12 },
        headStyles: { fillColor: [220, 38, 38] },
      });
    }
    
    // Add team lineups
    const statsTableHeight = (battingStats ? (battingStats.length * 10 + 10) : 0) + 
                             (bowlingStats ? (bowlingStats.length * 10 + 20) : 0);
    
    doc.addPage();
    doc.setFontSize(16);
    doc.text(`Team Lineups`, 20, 20);
    
    // Team 1 players
    doc.setFontSize(14);
    doc.text(`${teams[0].name}:`, 20, 30);
    autoTable(doc, {
      startY: 35,
      head: [['Name', 'Role']],
      body: teams[0].players.map(player => [player.name, player.role]),
      theme: 'grid',
      styles: { fontSize: 12 },
      headStyles: { fillColor: [220, 38, 38] },
    });
    
    // Team 2 players
    const team1TableHeight = teams[0].players.length * 10 + 10;
    doc.text(`${teams[1].name}:`, 20, 45 + team1TableHeight);
    autoTable(doc, {
      startY: 50 + team1TableHeight,
      head: [['Name', 'Role']],
      body: teams[1].players.map(player => [player.name, player.role]),
      theme: 'grid',
      styles: { fontSize: 12 },
      headStyles: { fillColor: [220, 38, 38] },
    });
    
    // Add over summary
    if (overs.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text(`Over Summary`, 20, 20);
      
      const oversData = overs.map(over => {
        const runsInOver = over.balls.reduce((total, ball) => total + ball.runs + (ball.extraRuns || 0), 0);
        const wicketsInOver = over.balls.filter(ball => ball.isWicket).length;
        return [
          `Over ${over.number}`,
          `${runsInOver} runs`,
          `${wicketsInOver} wickets`,
          over.complete ? 'Complete' : 'In progress'
        ];
      });
      
      autoTable(doc, {
        startY: 30,
        head: [['Over', 'Runs', 'Wickets', 'Status']],
        body: oversData,
        theme: 'grid',
        styles: { fontSize: 12 },
        headStyles: { fillColor: [220, 38, 38] },
      });
    }
    
    // Current date as filename
    const now = new Date();
    const fileName = `cricket_match_${now.toISOString().split('T')[0]}.pdf`;
    
    // Save the PDF
    doc.save(fileName);
  };

  return (
    <Button 
      onClick={exportToPdf} 
      variant="outline" 
      className="hover:bg-primary/10 hover:text-primary border-primary/20"
    >
      <FileDown className="mr-2 h-4 w-4" />
      Export as PDF
    </Button>
  );
};
