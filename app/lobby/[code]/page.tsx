'use client'

import { useParams } from 'next/navigation'
import GameSettingsPanel from '@/components/lobby/GameSettings'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import { useLobbyLogic } from '@/hooks/useLobbyLogic'

// New UI Components
import LobbyHeader from '@/components/lobby/LobbyHeader'
import DurationCard from '@/components/lobby/DurationCard'
import PlayerList from '@/components/lobby/PlayerList'

export default function LobbyPage() {
  const params = useParams()
  const code = params.code as string

  const {
    session,
    isLoading,
    showAddPlayer,
    setShowAddPlayer,
    newPlayerName,
    setNewPlayerName,
    roundsTotal,
    isProgressiveMode,
    handleAddPlayer,
    handleSettingsUpdate,
    updateSessionExtraSettings,
    handleDeletePlayer,
    startGame,
    calculateTimeEstimation,
  } = useLobbyLogic(code)

  const timeEst = calculateTimeEstimation()

  if (isLoading || !session) {
    return (
      <div className="bg-background flex h-screen items-center justify-center text-white">
        Chargement du lobby...
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen space-y-6 p-4 pb-24">
      <LobbyHeader />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <DurationCard
            roundsTotal={roundsTotal}
            isProgressiveMode={isProgressiveMode}
            session={session}
            timeEst={timeEst}
            onUpdate={updateSessionExtraSettings}
          />

          <PlayerList
            session={session}
            showAddPlayer={showAddPlayer}
            setShowAddPlayer={setShowAddPlayer}
            newPlayerName={newPlayerName}
            setNewPlayerName={setNewPlayerName}
            onAddPlayer={handleAddPlayer}
            onDeletePlayer={handleDeletePlayer}
          />
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
            updateSessionExtraSettings(roundsTotal, enabled)
          }
        />
      </div>

      <div className="bg-background/80 border-border fixed bottom-0 left-0 w-full border-t p-4 backdrop-blur-lg">
        <Button
          onClick={startGame}
          disabled={!session || session.players.length < 2}
          className="from-primary to-secondary w-full bg-gradient-to-r py-6 text-xl font-bold shadow-[0_0_20px_var(--primary)] hover:opacity-90 disabled:opacity-50 disabled:shadow-none"
        >
          <Play className="mr-2 h-6 w-6 fill-current" />
          {session && session.players.length < 2
            ? '2 JOUEURS MINIMUM'
            : 'LANCER LA PARTIE'}
        </Button>
      </div>
    </div>
  )
}
