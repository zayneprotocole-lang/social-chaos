'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Settings, Volume2, LogOut, Save } from 'lucide-react'

import { Player } from '@/lib/types'
import PausePlayerManager from './PausePlayerManager'
import { useSavedGameStore } from '@/lib/store/useSavedGameStore'
import { useGameStore } from '@/lib/store/useGameStore'
import { GameSession } from '@/types/index'

interface OptionsMenuProps {
  onEndGame?: () => void
  players?: Player[]
  currentTurnPlayerId?: string
  onTogglePause?: (playerId: string, isPaused: boolean) => void
  session?: GameSession | null // For saving
}

export default function OptionsMenu({
  onEndGame,
  players,
  currentTurnPlayerId,
  onTogglePause,
  session,
}: OptionsMenuProps) {
  const router = useRouter()
  const [volume, setVolume] = useState([50])
  const saveGame = useSavedGameStore((s) => s.saveGame)
  const deleteGame = useSavedGameStore((s) => s.deleteGame)
  const setActiveSession = useGameStore((s) => s.setActiveSession)

  const handleEndGame = () => {
    // Delete any saved game to prevent phantom "resume" button
    deleteGame()
    setActiveSession(null, null)

    if (onEndGame) {
      onEndGame()
    } else {
      // Default behavior: go to home
      router.push('/')
    }
  }

  const handleSaveAndQuit = () => {
    if (session) {
      saveGame(session)
    }
    router.push('/')
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white/60 transition-all hover:border-white/40 hover:bg-white/10 hover:text-white min-[390px]:h-10 min-[390px]:w-10">
          <Settings className="h-4 w-4 min-[390px]:h-5 min-[390px]:w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] border-l border-white/10 bg-black/80 text-white backdrop-blur-xl sm:w-[400px]"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-black tracking-widest text-purple-400 uppercase">
            <Settings className="h-5 w-5" /> Options
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 h-full space-y-6 overflow-y-auto pb-10">
          {/* Volume Control */}
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <Label className="flex items-center gap-2 font-medium text-white">
              <Volume2 className="h-4 w-4 text-purple-400" />
              Volume
            </Label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-white/50">{volume[0]}%</p>
          </div>

          {/* Player Management (Pause) */}
          {players && onTogglePause && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <PausePlayerManager
                players={players}
                currentTurnPlayerId={currentTurnPlayerId}
                onTogglePause={onTogglePause}
              />
            </div>
          )}

          {/* Save and Quit Button */}
          {session && (
            <Button
              onClick={handleSaveAndQuit}
              variant="secondary"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-blue-500"
            >
              <Save className="h-5 w-5" />
              Sauvegarder et quitter
            </Button>
          )}

          {/* End Game Button */}
          <Button
            onClick={handleEndGame}
            variant="destructive"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 font-semibold text-white shadow-lg shadow-red-500/20 hover:from-red-500 hover:to-red-400"
          >
            <LogOut className="h-5 w-5" />
            Terminer la Partie
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
