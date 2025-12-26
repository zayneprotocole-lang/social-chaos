'use client'

import { GameSession } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import { cn, getTimestamp } from '@/lib/utils'
import { Trophy, Clock, Pause } from 'lucide-react'

interface GameSidebarProps {
  session: GameSession
  layout?: 'horizontal' | 'vertical'
  isSwapping?: boolean
  onPlayerClick?: (playerId: string) => void
  swapUsedByPlayerIds?: string[] // V9.4: Array of all players who have used swap
}

export default function GameSidebar({
  session,
  layout = 'vertical',
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

  // Responsive sizing based on player count AND screen size
  const playerCount = players.length
  // Base sizes by player count, with responsive breakpoints
  const getAvatarSize = () => {
    if (playerCount <= 4)
      return 'w-8 h-8 min-[390px]:w-10 min-[390px]:h-10 min-[430px]:w-12 min-[430px]:h-12'
    if (playerCount <= 6)
      return 'w-7 h-7 min-[390px]:w-8 min-[390px]:h-8 min-[430px]:w-10 min-[430px]:h-10'
    return 'w-6 h-6 min-[390px]:w-7 min-[390px]:h-7 min-[430px]:w-8 min-[430px]:h-8'
  }
  const avatarSize = getAvatarSize()
  const containerGap =
    playerCount <= 4
      ? 'gap-1.5 min-[390px]:gap-2 min-[430px]:gap-3'
      : playerCount <= 6
        ? 'gap-1 min-[390px]:gap-1.5 min-[430px]:gap-2'
        : 'gap-0.5 min-[390px]:gap-1 min-[430px]:gap-1.5'
  const textSize =
    playerCount <= 4
      ? 'text-[9px] min-[390px]:text-[10px]'
      : 'text-[8px] min-[390px]:text-[9px]'

  // Horizontal layout - for mobile game screen
  if (layout === 'horizontal') {
    return (
      <div className="w-full">
        {/* Une seule ligne : Joueurs à gauche, Manche à droite */}
        <div className="flex items-center justify-between">
          {/* Groupe joueurs - gauche */}
          <div className={cn('flex items-center', containerGap)}>
            {sortedPlayers.map((player) => {
              const isActive = player.id === currentTurnPlayerId
              const isBlockedFromSwap =
                isSwapping && swapUsedByPlayerIds.includes(player.id)
              const canSwap = isSwapping && !isActive && !isBlockedFromSwap

              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: canSwap ? [1, 1.02, 1] : 1,
                  }}
                  whileHover={
                    canSwap
                      ? {
                          scale: 1.1,
                          boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)',
                        }
                      : undefined
                  }
                  whileTap={canSwap ? { scale: 0.95 } : undefined}
                  transition={
                    canSwap
                      ? {
                          scale: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          },
                        }
                      : undefined
                  }
                  className={cn(
                    'flex flex-col items-center rounded-lg p-1 transition-all min-[390px]:rounded-xl min-[390px]:p-1.5',
                    isActive
                      ? 'glass-strong shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-2 ring-purple-500'
                      : 'glass',
                    canSwap &&
                      'cursor-pointer ring-2 ring-cyan-400/50 hover:ring-cyan-400',
                    isBlockedFromSwap &&
                      'cursor-not-allowed opacity-30 grayscale',
                    isSwapping && isActive && 'cursor-not-allowed opacity-50',
                    player.isPaused && 'opacity-50'
                  )}
                  onClick={() => canSwap && onPlayerClick?.(player.id)}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar
                      className={cn(
                        avatarSize,
                        'border-2',
                        isActive ? 'border-purple-500' : 'border-white/20',
                        canSwap && 'border-cyan-400'
                      )}
                    >
                      <AvatarImage src={player.avatar || undefined} />
                      <AvatarFallback className="bg-purple-500/30 text-xs font-bold text-white">
                        {player.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* Indicateur joueur actif */}
                    {isActive && !isSwapping && (
                      <motion.div
                        className="absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-purple-500"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}

                    {/* Badge swap cliquable */}
                    {canSwap && (
                      <motion.div
                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <span className="text-[8px] font-bold text-white">
                          ↔
                        </span>
                      </motion.div>
                    )}

                    {/* Badge pause */}
                    {player.isPaused && !isSwapping && (
                      <div className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500">
                        <Pause className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Score sous l'avatar */}
                  <span
                    className={cn(
                      textSize,
                      'mt-0.5 font-bold',
                      canSwap ? 'text-cyan-400' : 'text-purple-400'
                    )}
                  >
                    {player.score || 0}
                  </span>
                </motion.div>
              )
            })}

            {/* Indicateur swap intégré */}
            {isSwapping && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-2 rounded-lg border border-cyan-500/50 bg-cyan-500/20 px-2 py-0.5"
              >
                <span className="text-[10px] font-bold whitespace-nowrap text-cyan-300 min-[390px]:text-xs">
                  🔄 Choisir
                </span>
              </motion.div>
            )}
          </div>

          {/* Compteur de manche - droite (compact si 7+ joueurs) */}
          <div
            className={cn(
              'glass flex items-center rounded-lg',
              playerCount >= 7
                ? 'gap-0.5 px-1.5 py-0.5'
                : 'gap-1.5 px-2 py-1 min-[390px]:px-3 min-[390px]:py-1.5'
            )}
          >
            {playerCount < 7 && (
              <>
                <Trophy className="h-3 w-3 text-purple-400 min-[390px]:h-4 min-[390px]:w-4" />
                <span className="text-[10px] text-white/60 uppercase min-[390px]:text-xs">
                  Manche
                </span>
              </>
            )}
            <span
              className={cn(
                'font-bold text-white',
                playerCount >= 7 ? 'text-xs' : 'text-sm min-[390px]:text-base'
              )}
            >
              {currentRound}
            </span>
            <span className="text-xs text-white/40">/</span>
            <span className="text-xs text-white/60">{roundsTotal}</span>
            {/* Mini progress bar - hidden for 7+ players */}
            {playerCount < 7 && (
              <div className="h-1 w-8 overflow-hidden rounded-full bg-white/10 min-[390px]:w-12">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentRound / roundsTotal) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Vertical layout (default) - Desktop sidebar + Mobile drawer
  return (
    <>
      {/* Desktop Sidebar - Fixed on right */}
      <div className="fixed top-20 right-4 z-40 hidden max-h-[calc(100vh-120px)] w-64 md:block">
        <div className="border-primary/30 relative overflow-hidden rounded-2xl border bg-black/50 shadow-2xl backdrop-blur-xl">
          {/* Neon Glow Effect */}
          <div className="from-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-violet-500/10" />

          {/* Round Counter Header */}
          <div className="relative border-b border-white/10 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="text-primary h-4 w-4" />
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
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="from-primary h-full bg-gradient-to-r to-violet-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentRound - 1) / roundsTotal) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Players List */}
          <div className="scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent relative max-h-[calc(100vh-280px)] space-y-2 overflow-y-auto p-3">
            <div className="mb-2 flex items-center gap-2 border-b border-white/10 pb-2">
              <Clock className="text-primary h-4 w-4" />
              <span className="text-primary text-xs font-bold uppercase">
                Ordre de Jeu
              </span>
            </div>

            {sortedPlayers.map((player, index) => {
              const isActive = player.id === currentTurnPlayerId
              const isBlockedFromSwap =
                isSwapping && swapUsedByPlayerIds.includes(player.id)

              return (
                <motion.div
                  key={player.id}
                  onClick={() =>
                    !isBlockedFromSwap && onPlayerClick?.(player.id)
                  }
                  className={cn(
                    'relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 transition-all',
                    isActive
                      ? 'bg-primary/20 border-primary scale-105 shadow-[0_0_20px_rgba(var(--primary),0.4)]'
                      : 'border-white/10 bg-white/5 hover:bg-white/10',
                    isSwapping && !isActive && !isBlockedFromSwap
                      ? 'animate-pulse cursor-pointer ring-2 ring-orange-500 hover:bg-orange-500/20'
                      : 'cursor-pointer',
                    isBlockedFromSwap
                      ? 'cursor-not-allowed opacity-30 ring-2 ring-red-500/50 grayscale'
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
                      className="from-primary/20 to-primary/20 absolute inset-0 -z-10 bg-gradient-to-r via-violet-500/20 blur-xl"
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
                      'w-6 text-center font-mono text-sm font-black',
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
                          ? 'border-primary ring-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.6)] ring-2'
                          : 'border-white/20'
                      )}
                    >
                      <AvatarImage src={player.avatar || undefined} />
                      <AvatarFallback className="from-primary/20 bg-gradient-to-br to-violet-500/20 text-xs font-bold text-white">
                        {player.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* Active Pulse Indicator */}
                    {isActive && (
                      <motion.div
                        className="bg-primary absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-black"
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

                    {/* Pause indicator */}
                    {player.isPaused && (
                      <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500">
                        <Pause className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'truncate text-sm font-bold',
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
                        <span className="font-bold text-red-500 uppercase">
                          Pause
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className="bg-primary h-2 w-2 rounded-full"
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
              className="border-t border-orange-500 bg-orange-500/20 p-3 text-center"
            >
              <p className="animate-pulse text-xs font-bold text-orange-200 uppercase">
                🔄 Sélectionnez un joueur
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Drawer/Overlay - Shows as overlay on smaller screens */}
      <div className="fixed right-0 bottom-0 left-0 z-40 max-h-[40vh] md:hidden">
        <div className="border-primary/30 relative overflow-hidden rounded-t-2xl border-t bg-black/60 shadow-2xl backdrop-blur-xl">
          {/* Neon Glow Effect */}
          <div className="from-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent to-transparent" />

          {/* Round Counter - Compact for Mobile */}
          <div className="relative flex items-center justify-between border-b border-white/10 p-3">
            <div className="flex items-center gap-2">
              <Trophy className="text-primary h-3 w-3" />
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
          <div className="scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent relative flex gap-2 overflow-x-auto p-3">
            {sortedPlayers.map((player, index) => {
              const isActive = player.id === currentTurnPlayerId
              const isBlockedFromSwap =
                isSwapping && swapUsedByPlayerIds.includes(player.id)

              return (
                <div
                  key={player.id}
                  onClick={() =>
                    !isBlockedFromSwap && onPlayerClick?.(player.id)
                  }
                  className={cn(
                    'relative flex min-w-[70px] flex-col items-center gap-1 rounded-lg border p-2 transition-all',
                    isActive
                      ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(var(--primary),0.4)]'
                      : 'border-white/10 bg-white/5',
                    isSwapping && !isActive && !isBlockedFromSwap
                      ? 'animate-pulse cursor-pointer ring-1 ring-orange-500'
                      : '',
                    isBlockedFromSwap
                      ? 'cursor-not-allowed opacity-30 ring-1 ring-red-500/50 grayscale'
                      : ''
                  )}
                >
                  {/* Glow for Active Player */}
                  {isActive && (
                    <div className="bg-primary/20 absolute inset-0 -z-10 rounded-lg blur-lg" />
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
                        ? 'border-primary ring-primary/50 ring-2'
                        : 'border-white/20'
                    )}
                  >
                    <AvatarImage src={player.avatar || undefined} />
                    <AvatarFallback className="bg-primary/20 text-[10px] font-bold text-white">
                      {player.name[0]}
                    </AvatarFallback>
                  </Avatar>

                  <p
                    className={cn(
                      'max-w-[60px] truncate text-center text-[10px] font-bold',
                      isActive ? 'text-white' : 'text-white/60'
                    )}
                  >
                    {player.name}
                  </p>

                  {isActive && (
                    <div className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
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
