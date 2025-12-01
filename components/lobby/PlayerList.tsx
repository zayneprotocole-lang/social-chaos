import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Crown, Trash2, UserPlus } from 'lucide-react'
import { GameSession } from '@/lib/types'

interface PlayerListProps {
    session: GameSession | null
    showAddPlayer: boolean
    setShowAddPlayer: (show: boolean) => void
    newPlayerName: string
    setNewPlayerName: (name: string) => void
    onAddPlayer: () => void
    onDeletePlayer: (id: string) => void
}

export default function PlayerList({
    session,
    showAddPlayer,
    setShowAddPlayer,
    newPlayerName,
    setNewPlayerName,
    onAddPlayer,
    onDeletePlayer
}: PlayerListProps) {
    return (
        <Card className="bg-card/50 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" /> Joueurs ({session?.players.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {session?.players.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-all group">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary/30">
                                <span className="text-sm font-black text-primary">{player.name[0].toUpperCase()}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-base">{player.name}</span>
                                {player.isHost && (
                                    <span className="text-[10px] text-yellow-500 uppercase font-bold flex items-center gap-1">
                                        <Crown className="h-3 w-3" /> Hôte
                                    </span>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeletePlayer(player.id)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                {/* Add Button */}
                {!showAddPlayer && (
                    <button
                        onClick={() => setShowAddPlayer(true)}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                    >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-primary/50">
                            <UserPlus className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-primary/70 group-hover:text-primary uppercase tracking-wide">
                            Ajouter un joueur
                        </span>
                    </button>
                )}

                {/* Add Form */}
                {showAddPlayer && (
                    <div className="flex gap-2 p-2 rounded-lg border-2 border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/10 animate-in fade-in duration-200">
                        <Input
                            autoFocus
                            placeholder="Prénom du joueur..."
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') onAddPlayer()
                            }}
                            className="flex-1 h-9 bg-background/50 border-primary/30 focus:border-primary"
                        />
                        <Button
                            onClick={onAddPlayer}
                            disabled={!newPlayerName.trim()}
                            size="sm"
                            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-bold h-9 px-4"
                        >
                            ✓
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setShowAddPlayer(false)
                                setNewPlayerName('')
                            }}
                            className="h-9 px-3 text-muted-foreground hover:text-foreground"
                        >
                            ✕
                        </Button>
                    </div>
                )}

                {session?.players.length === 0 && !showAddPlayer && (
                    <div className="text-center py-8 text-muted-foreground italic text-sm">
                        Aucun joueur. Ajoutez des participants !
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
