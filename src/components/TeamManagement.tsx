
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
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-primary">Team Management</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={activeTeamIndex === 0 ? "default" : "outline"} 
            onClick={() => setActiveTeamIndex(0)}
          >
            {teams[0].name}
          </Button>
          <Button 
            variant={activeTeamIndex === 1 ? "default" : "outline"} 
            onClick={() => setActiveTeamIndex(1)}
          >
            {teams[1].name}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          {editingTeamName ? (
            <div className="flex items-center gap-2">
              <Input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Team name"
                className="w-48"
              />
              <Button size="sm" onClick={handleTeamNameChange}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditingTeamName(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{activeTeam.name}</h3>
              <Button size="sm" variant="outline" onClick={() => {
                setNewTeamName(activeTeam.name);
                setEditingTeamName(true);
              }}>Edit</Button>
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            {activeTeam.players.length} players
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Add new player"
            className="flex-1"
          />
          <Select defaultValue={newPlayerRole} onValueChange={(value) => setNewPlayerRole(value as Player['role'])}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Batsman">Batsman</SelectItem>
              <SelectItem value="Bowler">Bowler</SelectItem>
              <SelectItem value="All-rounder">All-rounder</SelectItem>
              <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddPlayer}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-2 mt-4">
          <Label>Players</Label>
          <div className="rounded-md border">
            {activeTeam.players.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                No players added yet
              </div>
            ) : (
              <div className="divide-y">
                {activeTeam.players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{player.name}</span>
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                        {player.role}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemovePlayer(player.id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <X className="h-4 w-4" />
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
