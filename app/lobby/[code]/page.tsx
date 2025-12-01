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
        calculateTimeEstimation
    } = useLobbyLogic(code)

    const timeEst = calculateTimeEstimation()

    return (
        <div className="min-h-screen p-4 pb-24 space-y-6 bg-background">
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
                    defaultSettings={session?.settings || { difficulty: 2, tags: ['Fun'], timerDuration: 180, alcoholMode: true }}
                    onUpdate={handleSettingsUpdate}
                    isProgressiveMode={isProgressiveMode}
                    onProgressiveModeChange={(enabled) => updateSessionExtraSettings(roundsTotal, enabled)}
                />
            </div>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-lg border-t border-border">
                <Button
                    onClick={startGame}
                    disabled={!session || session.players.length < 2}
                    className="w-full py-6 text-xl font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-[0_0_20px_var(--primary)] disabled:opacity-50 disabled:shadow-none"
                >
                    <Play className="mr-2 h-6 w-6 fill-current" />
                    {session && session.players.length < 2 ? "2 JOUEURS MINIMUM" : "LANCER LA PARTIE"}
                </Button>
            </div>
        </div>
    )
}
