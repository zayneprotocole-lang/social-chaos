import { GameSession } from '@/lib/types'

interface GameProgressProps {
    session: GameSession
}

export default function GameProgress({ session }: GameProgressProps) {
    return (
        <div className="fixed top-4 left-4 z-40 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 text-xs font-mono space-y-1 shadow-lg">
            <div className="flex items-center gap-2 text-white/80">
                <span className="text-primary font-bold">ROUND</span>
                <span>{session.roundsCompleted + 1} / {session.roundsTotal}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
                <span className="text-secondary font-bold">JOUEURS</span>
                <span>{session.playersPlayedThisRound} / {session.players.filter(p => !p.isPaused).length}</span>
            </div>
        </div>
    )
}
