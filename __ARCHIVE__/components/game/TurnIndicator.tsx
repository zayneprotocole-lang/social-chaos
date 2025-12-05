'use client'

import { GameSession } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TurnIndicatorProps {
    session: GameSession
}

export default function TurnIndicator({ session }: TurnIndicatorProps) {
    const { players, currentTurnPlayerId, roundsCompleted, roundsTotal } = session

    // Calculate current round (1-based)
    // If roundsCompleted is 0, we are in round 1.
    const currentRound = Math.min(roundsCompleted + 1, roundsTotal)

    return (
        <div className="w-full max-w-md mx-auto z-10">
            {/* Glassmorphism Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl shadow-2xl">

                {/* Round Counter */}
                <div className="mb-4 text-center">
                    <h3 className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
                        Manche
                    </h3>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            {currentRound}
                        </span>
                        <span className="text-sm font-bold text-white/40">
                            / {roundsTotal}
                        </span>
                    </div>
                </div>

                {/* Players List */}
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide mask-linear-fade">
                    {players.map((player) => {
                        const isActive = player.id === currentTurnPlayerId

                        return (
                            <div
                                key={player.id}
                                className="relative flex flex-col items-center gap-1 min-w-[60px]"
                            >
                                {/* Active Glow Background (Animated) */}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-glow"
                                        className="absolute inset-0 -z-10 rounded-xl bg-primary/20 blur-md"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Avatar Container */}
                                <div className={cn(
                                    "relative p-1 rounded-full transition-all duration-300",
                                    isActive ? "scale-110" : "opacity-70 grayscale"
                                )}>
                                    <Avatar className={cn(
                                        "h-10 w-10 border-2 transition-colors",
                                        isActive ? "border-primary ring-2 ring-primary/30" : "border-white/20"
                                    )}>
                                        <AvatarImage src={player.avatar} />
                                        <AvatarFallback className="bg-white/10 text-xs font-bold text-white">
                                            {player.name[0]}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Active Indicator Dot */}
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary border-2 border-black shadow-[0_0_10px_var(--primary)]"
                                        />
                                    )}
                                </div>

                                {/* Player Name */}
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wide truncate max-w-[60px] text-center transition-colors",
                                    isActive ? "text-primary drop-shadow-[0_0_5px_rgba(var(--primary),0.5)]" : "text-white/40"
                                )}>
                                    {player.name}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
