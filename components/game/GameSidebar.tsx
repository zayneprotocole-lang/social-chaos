'use client'

import { GameSession } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import { cn, getTimestamp } from '@/lib/utils'
import { Trophy, Clock } from 'lucide-react'

interface GameSidebarProps {
    session: GameSession
    isSwapping?: boolean
    onPlayerClick?: (playerId: string) => void
    swapUsedByPlayerIds?: string[] // V9.4: Array of all players who have used swap
}

export default function GameSidebar({
    session,
    isSwapping = false,
    onPlayerClick,
    swapUsedByPlayerIds = [],
}: GameSidebarProps) {
    const { players, currentTurnPlayerId, roundsCompleted, roundsTotal } = session

    // Calculate current round (1-based)
    const currentRound = Math.min(roundsCompleted + 1, roundsTotal)

    // Sort players by createdAt (strict ordering)
    const sortedPlayers = [...players].sort((a, b) => {
        return getTimestamp(a.createdAt) - getTimestamp(b.createdAt)
    })

    return (
        <>
            {/* Desktop Sidebar - Fixed on right */}
            <div className="hidden md:block fixed right-4 top-20 z-40 w-64 max-h-[calc(100vh-120px)]">
                <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-black/50 backdrop-blur-xl shadow-2xl">
                    {/* Neon Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10 pointer-events-none" />

                    {/* Round Counter Header */}
                    <div className="relative p-4 border-b border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
                                    Manche
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                    {currentRound}
                                </span>
                                <span className="text-sm font-bold text-white/40">
                                    / {roundsTotal}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-violet-500"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${((currentRound - 1) / roundsTotal) * 100}%`,
                                }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>
                    </div>

                    {/* Players List */}
                    <div className="relative p-3 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-primary uppercase">
                                Ordre de Jeu
                            </span>
                        </div>

                        {sortedPlayers.map((player, index) => {
                            const isActive = player.id === currentTurnPlayerId
                            // V9.4: Block if player has used swap this turn
                            const isBlockedFromSwap = isSwapping && swapUsedByPlayerIds.includes(player.id)

                            return (
                                <motion.div
                                    key={player.id}
                                    onClick={() => !isBlockedFromSwap && onPlayerClick?.(player.id)}
                                    className={cn(
                                        'relative flex items-center gap-3 p-3 rounded-xl border transition-all overflow-hidden',
                                        isActive
                                            ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(var(--primary),0.4)] scale-105'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10',
                                        isSwapping && !isActive && !isBlockedFromSwap
                                            ? 'animate-pulse ring-2 ring-orange-500 hover:bg-orange-500/20 cursor-pointer'
                                            : 'cursor-pointer',
                                        isBlockedFromSwap
                                            ? 'opacity-30 cursor-not-allowed grayscale ring-2 ring-red-500/50'
                                            : '',
                                        player.isPaused ? 'opacity-50' : ''
                                    )}
                                    layoutId={`player-${player.id}`}
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                >
                                    {/* Animated Glow Background for Active Player */}
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 via-violet-500/20 to-primary/20 blur-xl"
                                            animate={{
                                                opacity: [0.5, 1, 0.5],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                        />
                                    )}

                                    {/* Player Order Number */}
                                    <span
                                        className={cn(
                                            'font-mono font-black text-sm w-6 text-center',
                                            isActive
                                                ? 'text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.8)]'
                                                : 'text-white/40'
                                        )}
                                    >
                                        {index + 1}
                                    </span>

                                    {/* Avatar with Glow */}
                                    <div className="relative">
                                        <Avatar
                                            className={cn(
                                                'h-10 w-10 border-2 transition-all',
                                                isActive
                                                    ? 'border-primary ring-2 ring-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.6)]'
                                                    : 'border-white/20'
                                            )}
                                        >
                                            <AvatarImage src={player.avatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-500/20 text-xs font-bold text-white">
                                                {player.name[0]}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Active Pulse Indicator */}
                                        {isActive && (
                                            <motion.div
                                                className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-black"
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    boxShadow: [
                                                        '0 0 10px rgba(var(--primary), 0.6)',
                                                        '0 0 20px rgba(var(--primary), 1)',
                                                        '0 0 10px rgba(var(--primary), 0.6)',
                                                    ],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut',
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Player Info */}
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={cn(
                                                'font-bold truncate text-sm',
                                                isActive
                                                    ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                                                    : 'text-white/70'
                                            )}
                                        >
                                            {player.name}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px]">
                                            <span
                                                className={cn(
                                                    'font-mono',
                                                    isActive ? 'text-primary' : 'text-white/50'
                                                )}
                                            >
                                                Score: {player.score}
                                            </span>
                                            {player.isPaused && (
                                                <span className="text-red-500 font-bold uppercase">
                                                    Pause
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <motion.div
                                            className="h-2 w-2 rounded-full bg-primary"
                                            animate={{
                                                opacity: [0.5, 1, 0.5],
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                        />
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Swap Mode Indicator */}
                    {isSwapping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-orange-500/20 border-t border-orange-500 text-center"
                        >
                            <p className="text-orange-200 text-xs font-bold uppercase animate-pulse">
                                🔄 Sélectionnez un joueur
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Mobile Drawer/Overlay - Shows as overlay on smaller screens */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 max-h-[40vh]">
                <div className="relative overflow-hidden rounded-t-2xl border-t border-primary/30 bg-black/60 backdrop-blur-xl shadow-2xl">
                    {/* Neon Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

                    {/* Round Counter - Compact for Mobile */}
                    <div className="relative p-3 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-bold tracking-wider text-white/60 uppercase">
                                Manche
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                {currentRound}
                            </span>
                            <span className="text-xs font-bold text-white/40">
                                / {roundsTotal}
                            </span>
                        </div>
                    </div>

                    {/* Players List - Horizontal Scroll on Mobile */}
                    <div className="relative p-3 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
                        {sortedPlayers.map((player, index) => {
                            const isActive = player.id === currentTurnPlayerId
                            // V9.4: Block if player has used swap this turn
                            const isBlockedFromSwap = isSwapping && swapUsedByPlayerIds.includes(player.id)

                            return (
                                <div
                                    key={player.id}
                                    onClick={() => !isBlockedFromSwap && onPlayerClick?.(player.id)}
                                    className={cn(
                                        'relative flex flex-col items-center gap-1 min-w-[70px] p-2 rounded-lg border transition-all',
                                        isActive
                                            ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(var(--primary),0.4)]'
                                            : 'bg-white/5 border-white/10',
                                        isSwapping && !isActive && !isBlockedFromSwap
                                            ? 'animate-pulse ring-1 ring-orange-500 cursor-pointer'
                                            : '',
                                        isBlockedFromSwap
                                            ? 'opacity-30 cursor-not-allowed grayscale ring-1 ring-red-500/50'
                                            : ''
                                    )}
                                >
                                    {/* Glow for Active Player */}
                                    {isActive && (
                                        <div className="absolute inset-0 -z-10 bg-primary/20 blur-lg rounded-lg" />
                                    )}

                                    <span
                                        className={cn(
                                            'font-mono text-[10px] font-bold',
                                            isActive ? 'text-primary' : 'text-white/40'
                                        )}
                                    >
                                        #{index + 1}
                                    </span>

                                    <Avatar
                                        className={cn(
                                            'h-8 w-8 border-2',
                                            isActive
                                                ? 'border-primary ring-2 ring-primary/50'
                                                : 'border-white/20'
                                        )}
                                    >
                                        <AvatarImage src={player.avatar} />
                                        <AvatarFallback className="bg-primary/20 text-[10px] font-bold text-white">
                                            {player.name[0]}
                                        </AvatarFallback>
                                    </Avatar>

                                    <p
                                        className={cn(
                                            'text-[10px] font-bold truncate max-w-[60px] text-center',
                                            isActive ? 'text-white' : 'text-white/60'
                                        )}
                                    >
                                        {player.name}
                                    </p>

                                    {isActive && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
