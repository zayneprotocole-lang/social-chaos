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

  // Check for perfect equality (all players have same score)
  const isPerfectEquality =
    !isSoloMode &&
    sortedPlayers.length >= 2 &&
    sortedPlayers.every((p) => p.score === sortedPlayers[0].score)

  // GOAT = winner (first sorted), Chèvre = loser (last sorted)
  // Always defined if 2+ players, regardless of score difference
  const goat = sortedPlayers[0]
  const chevre = isSoloMode ? null : sortedPlayers[sortedPlayers.length - 1]

  // Show GOAT/Chèvre cards if 2+ players (even with equality)
  const showGoatChevre = !isSoloMode && goat && chevre

  // Check if both have saved profiles - link only if GOAT actually won
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

    // Step 3: Handle new GOAT/Chèvre relationship (only if GOAT actually won)
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

        {/* Classement complet */}
        <div className="mb-4 space-y-1.5">
          {sortedPlayers.map((player, index) => {
            // GOAT = first player in sorted list (2+ players required)
            const isGoat = !isSoloMode && player.id === goat?.id
            // Chèvre = last player in sorted list (different from GOAT)
            const isChevre =
              !isSoloMode &&
              chevre &&
              player.id === chevre.id &&
              player.id !== goat?.id
            // Exclude adventurers from ranking (shown separately)
            const isAdventurer = adventurers.some((a) => a.id === player.id)

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={cn(
                  'flex items-center gap-2 rounded-xl p-2 transition-all min-[390px]:gap-3 min-[390px]:p-2.5',
                  isGoat && 'border border-amber-500/50 bg-amber-500/20',
                  isChevre && 'border border-purple-500/50 bg-purple-500/20',
                  isAdventurer && 'border border-cyan-500/30 bg-cyan-500/10',
                  !isGoat &&
                    !isChevre &&
                    !isAdventurer &&
                    'border border-white/10 bg-white/5'
                )}
              >
                {/* Rang */}
                <span
                  className={cn(
                    'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold min-[390px]:h-7 min-[390px]:w-7 min-[390px]:text-xs',
                    isGoat && 'bg-amber-500 text-black',
                    isChevre && 'bg-purple-500 text-white',
                    isAdventurer && 'bg-cyan-500/50 text-white',
                    !isGoat &&
                      !isChevre &&
                      !isAdventurer &&
                      'bg-white/10 text-white/70'
                  )}
                >
                  {isAdventurer ? '🧭' : `#${index + 1}`}
                </span>

                {/* Avatar */}
                <Avatar className="h-7 w-7 flex-shrink-0 border border-white/20 min-[390px]:h-8 min-[390px]:w-8">
                  <AvatarImage src={player.avatar || undefined} />
                  <AvatarFallback
                    className={cn(
                      'text-xs font-bold',
                      isGoat && 'bg-amber-500/30',
                      isChevre && 'bg-purple-500/30',
                      !isGoat && !isChevre && 'bg-white/10'
                    )}
                  >
                    {player.name[0]}
                  </AvatarFallback>
                </Avatar>

                {/* Nom */}
                <span
                  className={cn(
                    'min-w-0 flex-1 truncate text-xs font-semibold min-[390px]:text-sm',
                    isGoat && 'text-amber-400',
                    isChevre && 'text-purple-400',
                    !isGoat && !isChevre && 'text-white'
                  )}
                >
                  {player.name}
                </span>

                {/* Score */}
                <span
                  className={cn(
                    'flex-shrink-0 text-sm font-bold min-[390px]:text-base',
                    isGoat && 'text-amber-400',
                    isChevre && 'text-purple-400',
                    !isGoat && !isChevre && 'text-white'
                  )}
                >
                  {player.score}{' '}
                  <span className="text-[10px] font-normal opacity-60 min-[390px]:text-xs">
                    pts
                  </span>
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* Message d'égalité parfaite */}
        {isPerfectEquality && (
          <div className="mb-4 rounded-xl border border-white/20 bg-gradient-to-r from-amber-500/20 to-purple-500/20 p-3 text-center">
            <span className="text-2xl">🤝</span>
            <p className="mt-1 text-sm font-semibold text-white">
              Égalité parfaite !
            </p>
            <p className="text-[10px] text-white/60">
              Pas de GOAT ni de Chèvre ce soir
            </p>
          </div>
        )}

        {/* Cartes GOAT / Chèvre - TOUJOURS affichées si 2+ joueurs et pas d'égalité parfaite */}
        {showGoatChevre && !isPerfectEquality && (
          <div className="mb-4 grid grid-cols-2 gap-2 min-[390px]:gap-3">
            {/* Carte GOAT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="rounded-xl border border-amber-500/50 bg-gradient-to-br from-amber-500/30 via-amber-600/20 to-amber-700/10 p-3 text-center shadow-lg shadow-amber-500/20 min-[390px]:p-4"
            >
              {/* Icône */}
              <span className="text-3xl min-[390px]:text-4xl">👑</span>

              {/* Titre */}
              <p className="mt-1 text-xs font-black tracking-wider text-amber-400 uppercase min-[390px]:text-sm">
                GOAT
              </p>

              {/* Avatar */}
              <div className="mt-2 flex justify-center">
                <Avatar className="h-12 w-12 border-2 border-amber-500/50 shadow-lg shadow-amber-500/30 min-[390px]:h-14 min-[390px]:w-14">
                  <AvatarImage src={goat.avatar || undefined} />
                  <AvatarFallback className="bg-amber-500/30 text-lg font-bold text-amber-400 min-[390px]:text-xl">
                    {goat.name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Nom */}
              <p className="mt-2 truncate text-sm font-bold text-white min-[390px]:text-base">
                {goat.name}
              </p>

              {/* Rôle */}
              <p className="mt-1 text-[10px] text-amber-400/80 italic min-[390px]:text-xs">
                {canCreateLink ? '✨ Mentor ce soir' : '🏆 Champion du soir'}
              </p>
            </motion.div>

            {/* Carte Chèvre */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="rounded-xl border border-purple-500/50 bg-gradient-to-br from-purple-500/30 via-purple-600/20 to-purple-700/10 p-3 text-center shadow-lg shadow-purple-500/20 min-[390px]:p-4"
            >
              {/* Icône */}
              <span className="text-3xl min-[390px]:text-4xl">🐐</span>

              {/* Titre */}
              <p className="mt-1 text-xs font-black tracking-wider text-purple-400 uppercase min-[390px]:text-sm">
                Chèvre
              </p>

              {/* Avatar */}
              <div className="mt-2 flex justify-center">
                <Avatar className="h-12 w-12 border-2 border-purple-500/50 shadow-lg shadow-purple-500/30 min-[390px]:h-14 min-[390px]:w-14">
                  <AvatarImage src={chevre.avatar || undefined} />
                  <AvatarFallback className="bg-purple-500/30 text-lg font-bold text-purple-400 min-[390px]:text-xl">
                    {chevre.name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Nom */}
              <p className="mt-2 truncate text-sm font-bold text-white min-[390px]:text-base">
                {chevre.name}
              </p>

              {/* Rôle */}
              <p className="mt-1 text-[10px] text-purple-400/80 italic min-[390px]:text-xs">
                {canCreateLink ? '📚 Élève ce soir' : '😅 Prochaine victime !'}
              </p>
            </motion.div>
          </div>
        )}

        {/* Aventuriers - TOUJOURS affichés si présents */}
        {adventurers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mb-4 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/15 to-teal-500/10 p-3 min-[390px]:p-4"
          >
            {/* Titre */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl min-[390px]:text-2xl">🧭</span>
              <span className="text-xs font-black tracking-wider text-cyan-400 uppercase min-[390px]:text-sm">
                Aventuriers
              </span>
              <span className="text-[10px] font-normal text-cyan-400/60 min-[390px]:text-xs">
                ({adventurers.length})
              </span>
            </div>

            {/* Liste des joueurs avec avatars */}
            <div className="flex flex-wrap gap-2 min-[390px]:gap-3">
              {adventurers.map((adventurer) => (
                <div
                  key={adventurer.id}
                  className="flex items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 min-[390px]:gap-2 min-[390px]:px-2.5 min-[390px]:py-1.5"
                >
                  <Avatar className="h-6 w-6 border border-cyan-500/30 min-[390px]:h-7 min-[390px]:w-7">
                    <AvatarImage src={adventurer.avatar || undefined} />
                    <AvatarFallback className="bg-cyan-500/20 text-[10px] font-bold text-cyan-400 min-[390px]:text-xs">
                      {adventurer.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-white min-[390px]:text-sm">
                    {adventurer.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Note explicative */}
            <p className="mt-2 text-[10px] text-cyan-400/60 italic min-[390px]:text-xs">
              Hors classement — ont fait une pause
            </p>
          </motion.div>
        )}

        {/* Lien créé - avec noms des joueurs et explication */}
        {(linkStatus === 'created' || linkStatus === 'renewed') &&
          goat &&
          chevre && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mb-4 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/20 via-pink-500/15 to-cyan-500/20 p-3 min-[390px]:p-4"
            >
              {/* Titre */}
              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="text-2xl min-[390px]:text-3xl">🤝</span>
                <span className="text-sm font-black tracking-wider text-white uppercase min-[390px]:text-base">
                  {linkStatus === 'renewed'
                    ? 'Lien Renouvelé !'
                    : 'Lien Créé !'}
                </span>
              </div>

              {/* Explication principale */}
              <p className="text-center text-xs text-white/90 min-[390px]:text-sm">
                <span className="font-bold text-amber-400">{goat.name}</span>{' '}
                devient le{' '}
                <span className="font-bold text-purple-400">Mentor</span> de{' '}
                <span className="font-bold text-purple-400">{chevre.name}</span>
              </p>

              {/* Bonus */}
              <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-2">
                <p className="text-center text-[10px] text-white/70 min-[390px]:text-xs">
                  🎁{' '}
                  <span className="font-semibold text-cyan-400">
                    Bonus débloqué
                  </span>{' '}
                  : lors de votre prochaine partie ensemble, l&apos;action{' '}
                  <span className="font-bold text-purple-400">
                    Accompagnement
                  </span>{' '}
                  sera disponible !
                </p>
              </div>
            </motion.div>
          )}

        {/* Incitation à créer des profils - affiché si GOAT/Chèvre existent mais pas de profils */}
        {showGoatChevre &&
          !isPerfectEquality &&
          !bothHaveProfiles &&
          linkStatus === 'none' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="mb-4 rounded-xl border border-dashed border-purple-500/40 bg-purple-500/10 p-3 text-center min-[390px]:p-4"
            >
              <span className="text-xl min-[390px]:text-2xl">💡</span>
              <p className="mt-1 text-xs text-white/80 min-[390px]:text-sm">
                Créez des{' '}
                <span className="font-bold text-purple-400">profils</span> pour
                sauvegarder le lien{' '}
                <span className="font-bold text-amber-400">Mentor</span>/
                <span className="font-bold text-purple-400">Élève</span>
              </p>
              <p className="mt-1 text-[10px] text-white/50 min-[390px]:text-xs">
                et débloquer l&apos;action Accompagnement !
              </p>
            </motion.div>
          )}

        {/* Mode solo - message d'encouragement */}
        {isSoloMode && (
          <div className="mb-4 rounded-xl border border-white/20 bg-white/5 p-3 text-center">
            <span className="text-2xl">🎯</span>
            <p className="mt-1 text-sm font-semibold text-white">
              Bravo pour ce solo !
            </p>
            <p className="text-[10px] text-white/60">
              Invite des amis pour plus de chaos
            </p>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-3 min-[390px]:gap-4">
          <Button
            variant="outline"
            className="h-11 flex-1 rounded-xl border-white/20 bg-white/5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10 min-[390px]:h-12 min-[390px]:text-base"
            onClick={handleReplay}
          >
            <RotateCcw className="mr-2 h-4 w-4 min-[390px]:h-5 min-[390px]:w-5" />
            Rejouer
          </Button>
          <Button
            className="h-11 flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:from-purple-500 hover:to-violet-500 hover:shadow-purple-500/50 min-[390px]:h-12 min-[390px]:text-base"
            onClick={handleReturnHome}
          >
            <Home className="mr-2 h-4 w-4 min-[390px]:h-5 min-[390px]:w-5" />
            Accueil
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
