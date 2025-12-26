'use client'

import { useState, useEffect } from 'react'
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
import {
  Settings,
  Volume2,
  LogOut,
  Save,
  Users,
  Crown,
  Sparkles,
} from 'lucide-react'

import { Player } from '@/lib/types'
import PausePlayerManager from './PausePlayerManager'
import { useSavedGameStore } from '@/lib/store/useSavedGameStore'
import { useGameStore } from '@/lib/store/useGameStore'
import { GameSession } from '@/types/index'
import { getUserData } from '@/lib/services/userDataService'
import { useAuth } from '@/hooks/useAuth'
import { Check } from 'lucide-react'

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
  const [isPremium, setIsPremium] = useState(false)
  const { isAuthenticated } = useAuth()
  const saveGame = useSavedGameStore((s) => s.saveGame)
  const deleteGame = useSavedGameStore((s) => s.deleteGame)
  const setActiveSession = useGameStore((s) => s.setActiveSession)

  // Check Premium status on mount
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!isAuthenticated) return
      try {
        const userData = await getUserData()
        if (userData?.isPremium) {
          setIsPremium(true)
        }
      } catch {
        // User not authenticated or error fetching data
      }
    }
    checkPremiumStatus()
  }, [isAuthenticated])

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
        className="flex w-[280px] flex-col border-l-2 border-purple-500/30 bg-gradient-to-b from-slate-900/98 via-gray-900/98 to-slate-900/98 text-white shadow-[-10px_0_40px_rgba(147,51,234,0.15)] backdrop-blur-xl sm:w-[340px]"
      >
        {/* Header avec gradient */}
        <SheetHeader className="relative -mx-6 -mt-6 flex-shrink-0 border-b border-white/10 bg-gradient-to-r from-purple-600/20 via-pink-500/10 to-cyan-500/20 px-5 py-4">
          <SheetTitle className="flex items-center gap-2.5 font-black tracking-widest text-white uppercase">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/50 bg-purple-500/30 shadow-lg shadow-purple-500/20">
              <Settings className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-base">Options</span>
          </SheetTitle>
        </SheetHeader>

        {/* Contenu principal - scrollable */}
        <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
          {/* Volume Control */}
          <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-3 shadow-lg shadow-cyan-500/5">
            <Label className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/20">
                <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <span>Volume</span>
              <span className="ml-auto rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-normal text-cyan-400">
                {volume[0]}%
              </span>
            </Label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-full [&_.absolute]:bg-gradient-to-r [&_.absolute]:from-cyan-500 [&_.absolute]:to-cyan-400 [&_.relative]:bg-white/10 [&_[role=slider]]:border-cyan-300 [&_[role=slider]]:bg-cyan-400"
            />
          </div>

          {/* Player Management (Pause) */}
          {players && onTogglePause && (
            <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-3 shadow-lg shadow-purple-500/5">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-purple-400/30 bg-purple-500/20">
                  <Users className="h-3.5 w-3.5 text-purple-400" />
                </div>
                <span>Gestion des Joueurs</span>
              </div>
              <PausePlayerManager
                players={players}
                currentTurnPlayerId={currentTurnPlayerId}
                onTogglePause={onTogglePause}
              />
            </div>
          )}

          {/* Section Premium */}
          {isPremium ? (
            // Badge Premium pour utilisateurs premium
            <div className="rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-3 shadow-lg shadow-green-500/5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-green-400/30 bg-green-500/20">
                  <Check className="h-3.5 w-3.5 text-green-400" />
                </div>
                <span className="text-sm font-bold text-white">Premium</span>
                <span className="ml-auto rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                  Actif ✓
                </span>
              </div>
              <p className="mt-2 text-[10px] text-white/60">
                Merci pour votre soutien ! Profitez de toutes les
                fonctionnalités.
              </p>
            </div>
          ) : (
            // Promo Premium pour utilisateurs non-premium
            <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-3 shadow-lg shadow-amber-500/5">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-500/20">
                  <Crown className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <span className="text-sm font-bold text-white">Premium</span>
                <Sparkles className="ml-auto h-3 w-3 animate-pulse text-amber-400" />
              </div>
              <p className="mb-2 text-[10px] text-white/60">
                Débloquez tous les packs de défis et fonctionnalités exclusives
                !
              </p>
              <Button
                onClick={() => router.push('/premium')}
                size="sm"
                className="h-8 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-black hover:from-amber-400 hover:to-orange-400"
              >
                <Crown className="mr-1.5 h-3 w-3" />
                Voir les offres
              </Button>
            </div>
          )}
        </div>

        {/* Boutons d'action - fixés en bas */}
        <div className="mt-3 flex-shrink-0 space-y-2 border-t border-white/10 pt-3 pb-4">
          {/* Save and Quit Button */}
          {session && (
            <Button
              onClick={handleSaveAndQuit}
              variant="secondary"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:via-blue-500 hover:to-indigo-500"
            >
              <Save className="h-4 w-4" />
              <span>Sauvegarder et quitter</span>
            </Button>
          )}

          {/* End Game Button */}
          <Button
            onClick={handleEndGame}
            variant="destructive"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:from-red-500 hover:via-red-400 hover:to-red-500"
          >
            <LogOut className="h-4 w-4" />
            <span>Terminer la Partie</span>
          </Button>
        </div>

        {/* Footer */}
        <p className="flex-shrink-0 pb-2 text-center text-[10px] text-white/20">
          Social Chaos v1.0
        </p>
      </SheetContent>
    </Sheet>
  )
}
