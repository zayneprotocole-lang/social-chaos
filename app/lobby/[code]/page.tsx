'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import GameSettingsPanel from '@/components/lobby/GameSettings'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import { useLobbyLogicV2 } from '@/hooks/useLobbyLogicV2' // V2 Hook

// New UI Components
import LobbyHeader from '@/components/lobby/LobbyHeader'
import DurationCard from '@/components/lobby/DurationCard'
import LobbyPlayerList from '@/components/lobby/LobbyPlayerList' // V2 Component
import LobbySkeleton from '@/components/lobby/LobbySkeleton'

export default function LobbyPage() {
  const params = useParams()
  const code = params.code as string

  const {
    session,
    isLoading,
    lobbyPlayers,
    playerCount,
    needsProfileCreation,
    roundsTotal,
    isProgressiveMode,
    handleSettingsUpdate,
    updateRoundsAndMode,
    startGame,
    calculateTimeEstimation,
    canStartGame,
    startGameError,
  } = useLobbyLogicV2(code)

  const timeEst = calculateTimeEstimation()
  const router = useRouter()

  if (isLoading) {
    return <LobbySkeleton />
  }

  if (!session) {
    return (
      <div className="bg-background flex h-screen flex-col items-center justify-center gap-4 p-4 text-center text-white">
        <h1 className="text-destructive text-2xl font-bold">
          Session introuvable
        </h1>
        <p className="text-muted-foreground">
          Le code {code} ne correspond à aucune partie active.
        </p>
        <Button onClick={() => router.push('/')} variant="outline">
          Retour à l'accueil
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-background min-h-screen space-y-6 p-4 pb-24"
    >
      <LobbyHeader />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <DurationCard
            roundsTotal={roundsTotal}
            isProgressiveMode={isProgressiveMode}
            session={session}
            timeEst={timeEst}
            playerCount={playerCount}
            onUpdate={updateRoundsAndMode}
          />

          {/* New Profile-Aware Player List */}
          <LobbyPlayerList />
        </div>

        <GameSettingsPanel
          defaultSettings={
            session?.settings || {
              difficulty: 2,
              tags: ['Fun'],
              timerDuration: 180,
              alcoholMode: true,
            }
          }
          onUpdate={handleSettingsUpdate}
          isProgressiveMode={isProgressiveMode}
          onProgressiveModeChange={(enabled) =>
            updateRoundsAndMode(roundsTotal, enabled)
          }
        />
      </div>

      <div className="bg-background/80 border-border fixed bottom-0 left-0 w-full border-t p-4 backdrop-blur-lg">
        <Button
          onClick={startGame}
          disabled={!canStartGame}
          className="from-primary to-secondary w-full bg-gradient-to-r py-6 text-xl font-bold shadow-[0_0_20px_var(--primary)] hover:opacity-90 disabled:opacity-50 disabled:shadow-none"
        >
          <Play className="mr-2 h-6 w-6 fill-current" />
          {startGameError ? startGameError.toUpperCase() :
            (playerCount === 1 ? 'JOUER SEUL' : 'LANCER LA PARTIE')
          }
        </Button>
      </div>
    </motion.div>
  )
}
