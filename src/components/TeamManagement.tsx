
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, User, UserPlus, X } from 'lucide-react';
import { Team, Player } from '@/types/cricket';

interface TeamManagementProps {
  teams: [Team, Team];
  onTeamsUpdate: (teams: [Team, Team]) => void;
}

export const TeamManagement = ({ teams, onTeamsUpdate }: TeamManagementProps) => {
  const [activeTeamIndex, setActiveTeamIndex] = useState<0 | 1>(0);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState<Player['role']>('Batsman');
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [newTeamName, setNewTeamName] = useState(teams[activeTeamIndex].name);

  const activeTeam = teams[activeTeamIndex];

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: newPlayerName.trim(),
      role: newPlayerRole,
    };

    const updatedTeams = [...teams] as [Team, Team];
    updatedTeams[activeTeamIndex].players.push(newPlayer);
    
    onTeamsUpdate(updatedTeams);
    setNewPlayerName('');
  };

  const handleRemovePlayer = (playerId: string) => {
    const updatedTeams = [...teams] as [Team, Team];
    updatedTeams[activeTeamIndex].players = updatedTeams[activeTeamIndex].players.filter(
      player => player.id !== playerId
    );
    
    onTeamsUpdate(updatedTeams);
  };

  const handleTeamNameChange = () => {
    if (!newTeamName.trim()) return;
    
    const updatedTeams = [...teams] as [Team, Team];
    updatedTeams[activeTeamIndex].name = newTeamName.trim();
    
    onTeamsUpdate(updatedTeams);
    setEditingTeamName(false);
  };

  return (
    <Card className="glass-card border-cricket-red/20 relative overflow-hidden animate-fade-in">
      <div className="absolute inset-0 cricket-gradient opacity-30"></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10 mobile-friendly-padding">
        <CardTitle className="text-lg sm:text-xl font-semibold text-primary">Teams</CardTitle>
        <div className="flex space-x-1 sm:space-x-2">
          <Button 
            variant={activeTeamIndex === 0 ? "default" : "outline"} 
            onClick={() => setActiveTeamIndex(0)}
            size="sm"
            className={`text-xs sm:text-sm ${activeTeamIndex === 0 ? "" : "border-white/10 hover:bg-primary/20 hover:text-white"}`}
          >
            {teams[0].name}
          </Button>
          <Button 
            variant={activeTeamIndex === 1 ? "default" : "outline"} 
            onClick={() => setActiveTeamIndex(1)}
            size="sm"
            className={`text-xs sm:text-sm ${activeTeamIndex === 1 ? "" : "border-white/10 hover:bg-primary/20 hover:text-white"}`}
          >
            {teams[1].name}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 relative z-10 px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="flex items-center justify-between">
          {editingTeamName ? (
            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Team name"
                className="w-full sm:w-48 bg-black/20 border-white/10 text-sm"
              />
              <div className="flex gap-1 w-full sm:w-auto mt-2 sm:mt-0">
                <Button size="sm" onClick={handleTeamNameChange} className="text-xs">Save</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingTeamName(false)} className="border-white/10 text-xs">Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-medium">{activeTeam.name}</h3>
              <Button size="sm" variant="outline" onClick={() => {
                setNewTeamName(activeTeam.name);
                setEditingTeamName(true);
              }} className="border-white/10 hover:bg-primary/20 hover:text-white text-xs py-0 px-2 h-6">Edit</Button>
            </div>
          )}
          <div className="text-xs sm:text-sm text-muted-foreground">
            {activeTeam.players.length} players
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Add new player"
            className="flex-1 bg-black/20 border-white/10 text-sm"
          />
          <div className="flex gap-2">
            <Select defaultValue={newPlayerRole} onValueChange={(value) => setNewPlayerRole(value as Player['role'])}>
              <SelectTrigger className="w-full sm:w-[140px] bg-black/20 border-white/10 text-xs sm:text-sm h-9">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Batsman">Batsman</SelectItem>
                <SelectItem value="Bowler">Bowler</SelectItem>
                <SelectItem value="All-rounder">All-rounder</SelectItem>
                <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddPlayer} className="hover-glow ml-auto sm:ml-0" size="sm">
              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-4">
          <Label className="text-xs sm:text-sm">Players</Label>
          <div className="rounded-md border border-white/10 bg-black/20 overflow-hidden">
            {activeTeam.players.length === 0 ? (
              <div className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-muted-foreground text-center">
                No players added yet
              </div>
            ) : (
              <div className="divide-y divide-white/10 max-h-60 overflow-y-auto small-scrollbar">
                {activeTeam.players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-2 sm:p-3 hover:bg-primary/5">
                    <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">{player.name}</span>
                      <span className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 bg-black/30 rounded-full text-muted-foreground whitespace-nowrap">
                        {player.role}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemovePlayer(player.id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
