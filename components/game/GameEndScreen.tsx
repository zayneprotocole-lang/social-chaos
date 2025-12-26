'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Player, GameSession } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Home, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { archiveGame } from '@/app/actions/game'
import { useMentorEleveStore } from '@/lib/store/useMentorEleveStore'

interface GameEndScreenProps {
  players: Player[]
  session: GameSession
}

export default function GameEndScreen({
  players,
  session,
}: GameEndScreenProps) {
  const router = useRouter()
  const hasArchived = useRef(false)
  const hasProcessedLinks = useRef(false)

  const [linkStatus, setLinkStatus] = useState<'none' | 'created' | 'renewed'>(
    'none'
  )

  // Store actions
  const links = useMentorEleveStore((s) => s.links)
  const createLink = useMentorEleveStore((s) => s.createLink)
  const getActiveLink = useMentorEleveStore((s) => s.getActiveLink)
  const getConsumedLink = useMentorEleveStore((s) => s.getConsumedLink)
  const consumeLink = useMentorEleveStore((s) => s.consumeLink)
  const updateLink = useMentorEleveStore((s) => s.updateLink)
  const deleteConsumedLinks = useMentorEleveStore((s) => s.deleteConsumedLinks)

  // Separate adventurers (paused players)
  const adventurers = players.filter((p) => p.hasBeenPaused)
  const competitors = players.filter((p) => !p.hasBeenPaused)
  const hasCompetitors = competitors.length > 0

  // Sort by score descending
  const sortedPlayers = [...(hasCompetitors ? competitors : adventurers)].sort(
    (a, b) => b.score - a.score
  )

  // Solo Mode Check
  const isSoloMode = sortedPlayers.length === 1

  // GOAT = winner, Chèvre = loser
  const goat = sortedPlayers[0]
  const chevre = isSoloMode ? null : sortedPlayers[sortedPlayers.length - 1]

  // Check if both have saved profiles
  const bothHaveProfiles = !isSoloMode && goat?.profileId && chevre?.profileId
  const canCreateLink = bothHaveProfiles && goat.score > (chevre?.score || 0)

  // Archive game
  useEffect(() => {
    if (session && !hasArchived.current) {
      hasArchived.current = true
      archiveGame(session.roomCode, session)
    }
  }, [session])

  // COMPLETE LINK LIFECYCLE MANAGEMENT
  useEffect(() => {
    if (hasProcessedLinks.current) return
    hasProcessedLinks.current = true

    // Step 1: Get all profile IDs in this game
    const playerProfileIds = players
      .map((p) => p.profileId)
      .filter((id): id is string => !!id)

    // Step 2: Consume ALL active links that were present in this game
    for (const link of links) {
      if (!link.isConsumed) {
        const mentorInGame = playerProfileIds.includes(link.mentorProfileId)
        const eleveInGame = playerProfileIds.includes(link.eleveProfileId)

        if (mentorInGame && eleveInGame) {
          consumeLink(link.id)
        }
      }
    }

    // Step 3: Handle new GOAT/Chèvre relationship
    if (canCreateLink && goat?.profileId && chevre?.profileId) {
      const existingConsumedLink = getConsumedLink(
        goat.profileId,
        chevre.profileId
      )

      if (existingConsumedLink) {
        updateLink(existingConsumedLink.id, goat.profileId, chevre.profileId)
        setLinkStatus('renewed')
      } else {
        const existingActiveLink = getActiveLink(
          goat.profileId,
          chevre.profileId
        )

        if (!existingActiveLink) {
          createLink(goat.profileId, chevre.profileId)
          setLinkStatus('created')
        }
      }
    }

    // Step 4: Delete all remaining consumed links
    setTimeout(() => {
      deleteConsumedLinks()
    }, 100)
  }, [
    players,
    links,
    canCreateLink,
    goat,
    chevre,
    consumeLink,
    getConsumedLink,
    getActiveLink,
    updateLink,
    createLink,
    deleteConsumedLinks,
  ])

  const handleReturnHome = () => {
    router.push('/')
  }

  const handleReplay = () => {
    router.push('/')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <motion.div
        className="glass-strong scrollbar-thin max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl p-5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="mb-4 text-center">
          <span className="text-4xl">🏆</span>
          <h1 className="mt-2 text-2xl font-black text-white">FIN DE PARTIE</h1>
        </div>

        {/* Classement */}
        <div className="mb-4 space-y-2">
          {sortedPlayers.map((player, index) => {
            const isGoat =
              !isSoloMode &&
              player.id === goat?.id &&
              goat.score > (chevre?.score || 0)
            const isChevre =
              !isSoloMode &&
              chevre &&
              player.id === chevre.id &&
              goat.score > chevre.score
            const isAdventurer = adventurers.some((a) => a.id === player.id)

            return (
              <div
                key={player.id}
                className={cn(
                  'flex items-center gap-3 rounded-xl p-2.5 transition-all',
                  isGoat && 'border border-amber-500/50 bg-amber-500/20',
                  isChevre && 'border border-purple-500/50 bg-purple-500/20',
                  isAdventurer && 'border border-cyan-500/30 bg-cyan-500/10',
                  !isGoat && !isChevre && !isAdventurer && 'glass'
                )}
              >
                {/* Rang */}
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                    isGoat && 'bg-amber-500 text-black',
                    isChevre && 'bg-purple-500 text-white',
                    isAdventurer && 'bg-cyan-500/50 text-white',
                    !isGoat &&
                      !isChevre &&
                      !isAdventurer &&
                      'bg-white/10 text-white'
                  )}
                >
                  {isAdventurer ? '🧭' : `#${index + 1}`}
                </span>

                {/* Avatar + Nom */}
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Avatar className="h-7 w-7 border border-white/20">
                    <AvatarImage src={player.avatar || undefined} />
                    <AvatarFallback className="text-xs font-bold">
                      {player.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      'truncate text-sm font-semibold',
                      isGoat && 'text-amber-400',
                      isChevre && 'text-purple-400',
                      !isGoat && !isChevre && 'text-white'
                    )}
                  >
                    {player.name}
                  </span>
                </div>

                {/* Score */}
                <span
                  className={cn(
                    'text-base font-bold',
                    isGoat && 'text-amber-400',
                    isChevre && 'text-purple-400',
                    !isGoat && !isChevre && 'text-white'
                  )}
                >
                  {player.score}
                </span>
              </div>
            )
          })}
        </div>

        {/* Cartes GOAT / Chèvre */}
        {!isSoloMode && goat && chevre && goat.score > chevre.score && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            {/* GOAT */}
            <div className="rounded-xl border border-amber-500/50 bg-gradient-to-br from-amber-500/30 to-amber-600/10 p-2.5">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="text-lg">👑</span>
                <span className="text-xs font-bold text-amber-400">GOAT</span>
              </div>
              <p className="truncate text-sm font-semibold text-white">
                {goat.name}
              </p>
              <p className="mt-0.5 text-[10px] text-white/60">Mentor ce soir</p>
            </div>

            {/* Chèvre */}
            <div className="rounded-xl border border-purple-500/50 bg-gradient-to-br from-purple-500/30 to-purple-600/10 p-2.5">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="text-lg">🐐</span>
                <span className="text-xs font-bold text-purple-400">
                  Chèvre
                </span>
              </div>
              <p className="truncate text-sm font-semibold text-white">
                {chevre.name}
              </p>
              <p className="mt-0.5 text-[10px] text-white/60">Élève ce soir</p>
            </div>
          </div>
        )}

        {/* Aventuriers (si présents) */}
        {adventurers.length > 0 && hasCompetitors && (
          <div className="glass mb-4 rounded-xl p-2.5">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="text-lg">🧭</span>
              <span className="text-xs font-bold text-cyan-400">
                Aventuriers
              </span>
            </div>
            <p className="truncate text-xs text-white/80">
              {adventurers.map((a) => a.name).join(', ')}
            </p>
            <p className="mt-0.5 text-[10px] text-white/50">
              Hors classement (pause)
            </p>
          </div>
        )}

        {/* Lien créé */}
        {(linkStatus === 'created' || linkStatus === 'renewed') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border border-white/10 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 p-2.5"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">🤝</span>
              <span className="text-xs text-white/80">
                {linkStatus === 'renewed'
                  ? 'Lien renouvelé !'
                  : 'Lien Mentor/Élève créé !'}
              </span>
            </div>
            <p className="mt-1 text-center text-[10px] text-white/50">
              Rejouez ensemble pour l&apos;action Accompagnement
            </p>
          </motion.div>
        )}

        {/* Incitation à créer des profils */}
        {!isSoloMode &&
          goat &&
          chevre &&
          goat.score > chevre.score &&
          !bothHaveProfiles && (
            <div className="mb-4 rounded-xl border border-dashed border-white/30 bg-white/5 p-2.5 text-center">
              <p className="text-[10px] text-white/60">
                Sauvegardez vos profils pour le système{' '}
                <span className="font-bold text-purple-400">Mentor/Élève</span>
              </p>
            </div>
          )}

        {/* Boutons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="glass-interactive flex-1 border-white/20 py-5"
            onClick={handleReplay}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Rejouer
          </Button>
          <Button
            className="flex-1 bg-purple-600 py-5 font-bold text-white hover:bg-purple-500"
            onClick={handleReturnHome}
          >
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
