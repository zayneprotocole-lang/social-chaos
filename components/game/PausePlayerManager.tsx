'use client'

import { Player } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { UserMinus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PausePlayerManagerProps {
    players: Player[]
    currentTurnPlayerId?: string
    onTogglePause: (playerId: string, isPaused: boolean) => void
}

export default function PausePlayerManager({
    players,
    currentTurnPlayerId,
    onTogglePause,
}: PausePlayerManagerProps) {
    // Count active players to prevent pausing everyone
    const activePlayersCount = players.filter((p) => !p.isPaused).length

    const handleToggle = (player: Player) => {
        const willBePaused = !player.isPaused

        // Prevent pausing the last active player
        if (willBePaused && activePlayersCount <= 1) {
            return
        }

        onTogglePause(player.id, willBePaused)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold">
                <UserMinus className="w-5 h-5" />
                Gestion des Joueurs
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {players.map((player) => {
                    const isActive = !player.isPaused
                    const isCurrentTurn = player.id === currentTurnPlayerId

                    return (
                        <div
                            key={player.id}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg border transition-all",
                                isActive
                                    ? "bg-white/5 border-white/10"
                                    : "bg-black/40 border-white/5 opacity-70",
                                isCurrentTurn && "border-primary/50 bg-primary/10"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className={cn(
                                    "h-10 w-10 border transition-colors",
                                    isActive ? "border-primary" : "border-white/20 grayscale"
                                )}>
                                    <AvatarImage src={player.avatar || undefined} />
                                    <AvatarFallback>{player.name[0]}</AvatarFallback>
                                </Avatar>

                                <div>
                                    <p className={cn(
                                        "font-bold text-sm",
                                        isActive ? "text-white" : "text-muted-foreground decoration-white/30"
                                    )}>
                                        {player.name}
                                    </p>
                                    {isCurrentTurn && (
                                        <p className="text-[10px] text-primary animate-pulse">
                                            Tour en cours
                                        </p>
                                    )}
                                    {!isActive && (
                                        <p className="text-[10px] text-yellow-500 font-medium">
                                            En Pause
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Label htmlFor={`pause-${player.id}`} className="sr-only">
                                    Pause {player.name}
                                </Label>
                                <Switch
                                    id={`pause-${player.id}`}
                                    checked={isActive}
                                    onCheckedChange={() => handleToggle(player)}
                                    disabled={isActive && activePlayersCount <= 1}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
