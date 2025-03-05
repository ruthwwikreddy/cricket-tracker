
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Team, Over, TossResult } from "@/types/cricket";

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
    
    // Add team lineups
    doc.setFontSize(16);
    doc.text(`Team Lineups`, 20, 105);
    
    // Team 1 players
    doc.setFontSize(14);
    doc.text(`${teams[0].name}:`, 20, 115);
    autoTable(doc, {
      startY: 120,
      head: [['Name', 'Role']],
      body: teams[0].players.map(player => [player.name, player.role]),
      theme: 'grid',
      styles: { fontSize: 12 },
      headStyles: { fillColor: [220, 38, 38] },
    });
    
    // Team 2 players
    const team1TableHeight = teams[0].players.length * 10 + 10; // Estimate table height
    doc.text(`${teams[1].name}:`, 20, 125 + team1TableHeight);
    autoTable(doc, {
      startY: 130 + team1TableHeight,
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
