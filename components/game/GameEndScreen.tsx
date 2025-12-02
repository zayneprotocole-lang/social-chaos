'use client'

import { useEffect, useRef } from 'react'
import { Player, GameSession } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Trophy, Skull, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/lib/store/useGameStore'
import { archiveGame } from '@/app/actions/game'
import { GAME_CONFIG } from '@/lib/constants/config'

interface GameEndScreenProps {
  players: Player[]
  session: GameSession
}

export default function GameEndScreen({
  players,
  session,
}: GameEndScreenProps) {
  const router = useRouter()
  const { resetGame } = useGameStore()
  const hasArchived = useRef(false)

  // Sort players by score (highest to lowest)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  const winner = sortedPlayers[0]
  const loser = sortedPlayers[sortedPlayers.length - 1]

  useEffect(() => {
    if (session && !hasArchived.current) {
      hasArchived.current = true
      // Archive the game
      archiveGame(session.roomCode, session)
    }
  }, [session])

  const handleReturnHome = () => {
    resetGame()
    router.push('/')
  }

  return (
    <div
      className={`fixed inset-0 z-[100] bg-gradient-to-b ${GAME_CONFIG.COLORS.UI.BACKGROUND_OVERLAY} flex items-center justify-center p-4 backdrop-blur-sm`}
    >
      <div className="animate-in fade-in w-full max-w-2xl space-y-8 duration-1000">
        {/* Title */}
        <div className="space-y-4 text-center">
          <h1 className="animate-pulse text-6xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            FIN DE PARTIE
          </h1>
          <p className="text-2xl font-bold text-white/80">Tableau des Scores</p>
        </div>

        {/* Scoreboard */}
        <div className="space-y-3 rounded-xl border-2 border-white/20 bg-black/60 p-6 shadow-[0_0_40px_rgba(138,43,226,0.3)] backdrop-blur-md">
          {sortedPlayers.map((player, index) => {
            const isWinner =
              player.id === winner.id && winner.score > loser.score
            const isLoser =
              player.id === loser.id &&
              winner.score > loser.score &&
              sortedPlayers.length > 1

            return (
              <div
                key={player.id}
                className={cn(
                  'flex items-center gap-4 rounded-lg border-2 p-4 transition-all',
                  isWinner &&
                    'scale-105 border-yellow-500 bg-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.4)]',
                  isLoser &&
                    'border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.4)]',
                  !isWinner && !isLoser && 'border-white/10 bg-white/5'
                )}
              >
                {/* Rank */}
                <div
                  className={cn(
                    'w-12 text-center text-3xl font-black',
                    isWinner && 'text-yellow-400',
                    isLoser && 'text-red-400',
                    !isWinner && !isLoser && 'text-white/60'
                  )}
                >
                  #{index + 1}
                </div>

                {/* Avatar */}
                <Avatar
                  className={cn(
                    'h-16 w-16 border-2',
                    isWinner && 'ring-4 ring-yellow-500',
                    isLoser && 'ring-4 ring-red-500'
                  )}
                >
                  <AvatarImage src={player.avatar} />
                  <AvatarFallback>{player.name[0]}</AvatarFallback>
                </Avatar>

                {/* Player Info */}
                <div className="flex-1">
                  <p
                    className={cn(
                      'text-xl font-black',
                      isWinner && 'text-yellow-400',
                      isLoser && 'text-red-400',
                      !isWinner && !isLoser && 'text-white'
                    )}
                  >
                    {player.name}
                  </p>
                  {isWinner && (
                    <p className="flex items-center gap-1 text-sm font-bold text-yellow-300">
                      <Trophy className="h-4 w-4" /> GRAND GAGNANT
                    </p>
                  )}
                  {isLoser && (
                    <p className="flex items-center gap-1 text-sm font-bold text-red-300">
                      <Skull className="h-4 w-4" /> GRAND PERDANT
                    </p>
                  )}
                </div>

                {/* Score */}
                <div
                  className={cn(
                    'text-4xl font-black',
                    isWinner && 'text-yellow-400',
                    isLoser && 'text-red-400',
                    !isWinner && !isLoser && 'text-white'
                  )}
                >
                  {player.score}
                </div>
              </div>
            )
          })}
        </div>

        {/* Winner/Loser Messages */}
        {winner.score > loser.score && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Winner Card */}
            <div className="space-y-3 rounded-xl border-2 border-yellow-500 bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 p-6 text-center">
              <Trophy className="mx-auto h-12 w-12 animate-bounce text-yellow-400" />
              <p className="text-lg font-bold text-yellow-400">Récompense</p>
              <p className="text-white/80 italic">"À définir"</p>
            </div>

            {/* Loser Card */}
            <div className="space-y-3 rounded-xl border-2 border-red-500 bg-gradient-to-br from-red-500/20 to-red-900/20 p-6 text-center">
              <Skull className="mx-auto h-12 w-12 animate-pulse text-red-400" />
              <p className="text-lg font-bold text-red-400">Sentence</p>
              <p className="text-white/80 italic">"À définir"</p>
            </div>
          </div>
        )}

        {/* Return Home Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleReturnHome}
            className="bg-primary hover:bg-primary/80 px-8 py-6 text-lg font-bold text-white shadow-[0_0_30px_var(--primary)]"
          >
            <Home className="mr-2 h-5 w-5" />
            RETOUR À L'ACCUEIL
          </Button>
        </div>
      </div>
    </div>
  )
}
