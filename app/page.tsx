'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import {
  Zap,
  Users,
  Skull,
  BookHeart,
  Clock,
  Loader2,
  UserCircle,
} from 'lucide-react'
import { dataAccess } from '@/lib/services/dataAccess'
import { GAME_CONFIG } from '@/lib/constants/config'
import { ensureAuthenticated } from '@/lib/firebase/auth'
import { useGameStore } from '@/lib/store/useGameStore'
import { useSavedGameStore } from '@/lib/store/useSavedGameStore'
import { SavedGameCard } from '@/components/home/SavedGameCard'
import { AnimatePresence } from 'framer-motion'
import { PremiumModal, PremiumButton } from '@/components/premium/PremiumModal'
import { HelpModal, HelpButton } from '@/components/help/HelpModal'
import {
  SettingsModal,
  SettingsButton,
} from '@/components/settings/SettingsModal'

export default function Home() {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [roomCode, setRoomCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isPremiumOpen, setIsPremiumOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const setActiveSession = useGameStore((state) => state.setActiveSession)

  const savedGame = useSavedGameStore((s) => s.savedGame)
  const deleteGame = useSavedGameStore((s) => s.deleteGame)
  const [isValidatingSavedGame, setIsValidatingSavedGame] = useState(true)

  // Clean up saved games that are finished or invalid
  useEffect(() => {
    const validateSavedGame = async () => {
      if (!savedGame?.id) {
        setIsValidatingSavedGame(false)
        return
      }

      try {
        // Check if the session exists and its status
        const session = await dataAccess.getSession(savedGame.id)

        if (!session || session.status === 'FINISHED') {
          deleteGame()
        }
      } catch {
        // If we can't fetch, delete to be safe
        deleteGame()
      } finally {
        setIsValidatingSavedGame(false)
      }
    }

    validateSavedGame()
  }, [savedGame?.id, deleteGame])

  // Only show saved game card after validation completes
  const hasSavedGame = !isValidatingSavedGame && !!savedGame

  const handleResumeSavedGame = () => {
    if (!savedGame) return
    // Set active session from saved game data
    setActiveSession(savedGame.id, savedGame.id.substring(0, 4).toUpperCase())
    // Navigate to game page - the session ID is used as room code fallback
    router.push(`/game/${savedGame.id}`)
  }

  const handleDeleteSavedGame = () => {
    deleteGame()
    // Also clear active session to prevent orphan "Reprendre la partie" button
    setActiveSession(null, null)
  }

  const createRoom = async () => {
    setIsCreating(true)
    try {
      // Ensure user is authenticated before creating session
      await ensureAuthenticated()

      // Generate a random 4-letter code
      const code = Math.random().toString(36).substring(2, 6).toUpperCase()

      await dataAccess.createSession({
        roomCode: code,
        settings: {
          difficulty: 2,
          tags: ['Fun'],
          timerDuration: GAME_CONFIG.TIMERS.DEFAULT,
          alcoholMode: true,
        },
        roundsTotal: GAME_CONFIG.ROUNDS.DEFAULT,
        isProgressiveMode: false,
      })

      router.push(`/lobby/${code}?host=true`)
    } catch (error) {
      console.error('Error creating room:', error)
      alert('Erreur lors de la création de la partie. Vérifiez la console.')
      setIsCreating(false)
    }
  }

  return (
    <main className="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      {/* Library Button - Top Left */}
      <Button
        onClick={() => router.push('/library')}
        variant="outline"
        className="border-primary/30 hover:border-primary bg-background/80 fixed top-4 left-4 z-50 backdrop-blur-sm"
      >
        <BookHeart className="mr-2 h-4 w-4" />
        Bibliothèque
      </Button>

      {/* Premium Button - Top Left (Right of Library) */}
      <PremiumButton
        onClick={() => setIsPremiumOpen(true)}
        className="fixed top-4 left-36 z-50"
      />

      {/* Help Button - Top Left (Right of Premium) */}
      <HelpButton
        onClick={() => setIsHelpOpen(true)}
        className="fixed top-4 left-64 z-50"
      />

      {/* Profile Button - Top Right (Left of History) */}
      {/* Profile Button - Top Right (Left of History) */}
      <Button
        variant="outline"
        onClick={() => router.push('/profiles')}
        className="border-primary/30 hover:border-primary bg-background/80 fixed top-4 right-48 z-50 backdrop-blur-sm"
      >
        <UserCircle className="mr-2 h-4 w-4" />
        Profils
      </Button>

      {/* Settings Button - Top Right (Left of History) */}
      <SettingsButton
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-4 right-28 z-50"
      />

      {/* History Button - Top Right */}
      <Button
        onClick={() => router.push('/history')}
        variant="outline"
        className="border-primary/30 hover:border-primary bg-background/80 fixed top-4 right-4 z-50 backdrop-blur-sm"
      >
        <Clock className="mr-2 h-4 w-4" />
        Historique
      </Button>

      {/* Background decoration */}
      <div className="pointer-events-none absolute top-0 left-0 -z-10 h-full w-full overflow-hidden opacity-20">
        <div className="bg-primary absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-[100px]" />
        <div className="bg-secondary absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-[100px]" />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-10 mb-12 space-y-6 text-center duration-700">
        <h1 className="from-primary to-secondary bg-gradient-to-r via-white bg-clip-text text-6xl font-black tracking-tighter text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] md:text-8xl">
          SOCIAL
          <br />
          CHAOS
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md text-xl font-medium md:text-2xl">
          Le jeu de soirée qui va détruire votre dignité (et vos amitiés).
        </p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-10 w-full max-w-md space-y-6 delay-200 duration-1000">
        {/* Saved Game Card */}
        <AnimatePresence>
          {hasSavedGame && (
            <SavedGameCard
              onResume={handleResumeSavedGame}
              onDelete={handleDeleteSavedGame}
            />
          )}
        </AnimatePresence>

        <Card className="border-primary/20 bg-card/50 shadow-[0_0_50px_-12px_var(--primary)] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Prêt à jouer ?
            </CardTitle>
            <CardDescription className="text-center">
              Lance une partie locale et détruis des amitiés.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={createRoom}
              disabled={isCreating}
              className="from-primary hover:from-primary/90 w-full bg-gradient-to-r to-purple-600 py-8 text-xl font-bold shadow-[0_0_20px_var(--primary)] transition-all hover:scale-105 hover:to-purple-600/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <Zap className="mr-2 h-6 w-6" />
              )}
              {isCreating ? 'CRÉATION...' : 'JOUER'}
            </Button>
          </CardContent>
        </Card>

        <div className="text-muted-foreground grid grid-cols-3 gap-4 text-center text-xs">
          <div className="flex flex-col items-center gap-2">
            <Users className="text-primary h-6 w-6" />
            <span>Multi-joueurs</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skull className="text-destructive h-6 w-6" />
            <span>Gages Hardcore</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap className="text-secondary h-6 w-6" />
            <span>Rythme Rapide</span>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
      />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </main>
  )
}
