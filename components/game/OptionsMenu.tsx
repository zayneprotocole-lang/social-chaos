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
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 border-white/20 backdrop-blur-sm"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="border-primary/20 w-[300px] border-l bg-black/90 text-white sm:w-[400px]"
      >
        <SheetHeader>
          <SheetTitle className="text-primary flex items-center gap-2 font-black tracking-widest uppercase">
            <Settings className="h-5 w-5" /> Options
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 h-full space-y-8 overflow-y-auto pb-10">
          {/* Volume Control */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-white">
              <Volume2 className="h-4 w-4" />
              Volume
            </Label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-muted-foreground text-xs">{volume[0]}%</p>
          </div>

          {/* Player Management (Pause) */}
          {players && onTogglePause && (
            <div className="border-t border-white/10 pt-4">
              <PausePlayerManager
                players={players}
                currentTurnPlayerId={currentTurnPlayerId}
                onTogglePause={onTogglePause}
              />
            </div>
          )}

          {/* Save and Quit Button */}
          {session && (
            <div className="border-t border-white/10 pt-4">
              <Button
                onClick={handleSaveAndQuit}
                variant="secondary"
                className="flex w-full items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Save className="h-4 w-4" />
                Sauvegarder et quitter
              </Button>
            </div>
          )}

          {/* End Game Button */}
          <div className="border-t border-white/10 pt-4">
            <Button
              onClick={handleEndGame}
              variant="destructive"
              className="flex w-full items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Terminer la Partie
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
