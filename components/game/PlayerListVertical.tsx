import { GameSession, Player } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlayerListVerticalProps {
    session: GameSession
    currentPlayer: Player
    isSwapping: boolean
    onPlayerClick: (playerId: string) => void
}

export default function PlayerListVertical({ session, currentPlayer, isSwapping, onPlayerClick }: PlayerListVerticalProps) {
    return (
        <div className="fixed right-4 top-20 z-40 w-48 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="bg-black/60 backdrop-blur-md border border-primary/20 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase">Joueurs</span>
                </div>
                {session.players.map((p, index) => (
                    <div
                        key={p.id}
                        onClick={() => onPlayerClick(p.id)}
                        className={cn(
                            "flex items-center gap-2 p-2 rounded-lg border transition-all text-xs relative overflow-hidden",
                            p.id === currentPlayer?.id
                                ? "bg-primary/20 border-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                                : "bg-white/5 border-white/10 opacity-70",
                            isSwapping && p.id !== currentPlayer?.id ? "cursor-pointer hover:bg-orange-500/20 hover:border-orange-500 animate-pulse ring-1 ring-orange-500" : ""
                        )}
                    >
                        <span className="font-mono font-bold text-white/50 w-4">{index + 1}</span>
                        <Avatar className={cn("h-8 w-8", p.id === currentPlayer?.id && "ring-2 ring-primary")}>
                            <AvatarImage src={p.avatar} />
                            <AvatarFallback>{p.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className={cn("font-bold truncate text-xs", p.id === currentPlayer?.id ? "text-white" : "text-muted-foreground")}>
                                {p.name}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                <span>Score: {p.score}</span>
                                {p.isPaused && <span className="text-red-500 font-bold">PAUSE</span>}
                            </div>
                        </div>
                        {p.id === currentPlayer?.id && (
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        )}
                    </div>
                ))}
            </div>
            {isSwapping && (
                <div className="mt-2 p-2 bg-orange-500/20 border border-orange-500 rounded text-orange-200 text-xs text-center font-bold animate-pulse">
                    SÉLECTIONNEZ UN JOUEUR
                </div>
            )}
        </div>
    )
}
