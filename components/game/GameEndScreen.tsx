'use client'

import { useEffect, useRef, useState } from 'react'
import { Player, GameSession } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Trophy, Skull, Home, Users, Handshake, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { archiveGame } from '@/app/actions/game'
import { GAME_CONFIG } from '@/lib/constants/config'
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

  const [linkStatus, setLinkStatus] = useState<'none' | 'created' | 'renewed'>('none')

  // Store actions
  const links = useMentorEleveStore(s => s.links)
  const createLink = useMentorEleveStore(s => s.createLink)
  const getActiveLink = useMentorEleveStore(s => s.getActiveLink)
  const getConsumedLink = useMentorEleveStore(s => s.getConsumedLink)
  const consumeLink = useMentorEleveStore(s => s.consumeLink)
  const updateLink = useMentorEleveStore(s => s.updateLink)
  const deleteConsumedLinks = useMentorEleveStore(s => s.deleteConsumedLinks)

  // Separate disqualified adventurers
  const adventurers = players.filter(p => p.hasBeenPaused)
  const competitors = players.filter(p => !p.hasBeenPaused)
  const hasCompetitors = competitors.length > 0

  const sortedPlayers = [...(hasCompetitors ? competitors : adventurers)].sort((a, b) => b.score - a.score)

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

    console.log('🔗 Processing link lifecycle at game end...')

    // Step 1: Get all profile IDs in this game
    const playerProfileIds = players.map(p => p.profileId).filter((id): id is string => !!id)

    // Step 2: Consume ALL active links that were present in this game
    for (const link of links) {
      if (!link.isConsumed) {
        const mentorInGame = playerProfileIds.includes(link.mentorProfileId)
        const eleveInGame = playerProfileIds.includes(link.eleveProfileId)

        if (mentorInGame && eleveInGame) {
          console.log(`  → Consuming active link ${link.id} (${link.mentorProfileId} → ${link.eleveProfileId})`)
          consumeLink(link.id)
        }
      }
    }

    // Step 3: Handle new GOAT/Chèvre relationship
    if (canCreateLink && goat?.profileId && chevre?.profileId) {
      // Check if there's already a consumed link between these two profiles
      const existingConsumedLink = getConsumedLink(goat.profileId, chevre.profileId)

      if (existingConsumedLink) {
        // Same duo (in any order) → update with new roles
        console.log(`  → Updating existing link ${existingConsumedLink.id} with new roles`)
        updateLink(existingConsumedLink.id, goat.profileId, chevre.profileId)
        setLinkStatus('renewed')
      } else {
        // Check if there's an active link (shouldn't happen, but just in case)
        const existingActiveLink = getActiveLink(goat.profileId, chevre.profileId)

        if (!existingActiveLink) {
          // New duo → create new link
          console.log(`  → Creating new link: ${goat.profileId} → ${chevre.profileId}`)
          createLink(goat.profileId, chevre.profileId)
          setLinkStatus('created')
        }
      }
    }

    // Step 4: Delete all remaining consumed links (not renewed)
    // Small delay to ensure updateLink has processed
    setTimeout(() => {
      console.log('  → Cleaning up remaining consumed links')
      deleteConsumedLinks()
    }, 100)

  }, [players, links, canCreateLink, goat, chevre, consumeLink, getConsumedLink, getActiveLink, updateLink, createLink, deleteConsumedLinks])

  const handleReturnHome = () => {
    router.push('/')
  }

  return (
    <div
      className={`fixed inset-0 z-[100] bg-gradient-to-b ${GAME_CONFIG.COLORS.UI.BACKGROUND_OVERLAY} flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto`}
    >
      <div className="animate-in fade-in w-full max-w-2xl space-y-6 duration-1000 my-auto">
        {/* Title */}
        <div className="space-y-2 text-center">
          <h1 className="text-5xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            🏆 Fin de partie
          </h1>
        </div>

        {/* Scoreboard (compact) */}
        <div className="space-y-2 rounded-xl border-2 border-white/20 bg-black/60 p-4 shadow-[0_0_40px_rgba(138,43,226,0.3)] backdrop-blur-md">
          {sortedPlayers.map((player, index) => {
            const isGoat = !isSoloMode && player.id === goat.id && goat.score > (chevre?.score || 0)
            const isChevre = !isSoloMode && chevre && player.id === chevre.id && goat.score > chevre.score

            return (
              <div
                key={player.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 transition-all',
                  isGoat && 'border-yellow-500 bg-yellow-500/10',
                  isChevre && 'border-red-500 bg-red-500/10',
                  !isGoat && !isChevre && 'border-white/10 bg-white/5'
                )}
              >
                {!isSoloMode && (
                  <div className={cn(
                    'w-8 text-center text-xl font-black',
                    isGoat && 'text-yellow-400',
                    isChevre && 'text-red-400',
                    !isGoat && !isChevre && 'text-white/40'
                  )}>
                    #{index + 1}
                  </div>
                )}
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={player.avatar || undefined} />
                  <AvatarFallback>{player.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className={cn(
                    'font-bold',
                    isGoat && 'text-yellow-400',
                    isChevre && 'text-red-400',
                    !isGoat && !isChevre && 'text-white'
                  )}>
                    {player.name}
                  </p>
                </div>
                <div className={cn(
                  'text-2xl font-black',
                  isGoat && 'text-yellow-400',
                  isChevre && 'text-red-400',
                  !isGoat && !isChevre && 'text-white'
                )}>
                  {player.score}
                </div>
              </div>
            )
          })}
        </div>

        {/* Adventurers Section (Disqualified) */}
        {adventurers.length > 0 && hasCompetitors && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center justify-center gap-2 text-white/60">
              <Users className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase">Aventuriers</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {adventurers.map(player => (
                <div key={player.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 opacity-60">
                  <Avatar className="h-6 w-6 grayscale">
                    <AvatarImage src={player.avatar || undefined} />
                    <AvatarFallback className="text-xs">{player.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white/70 line-through">{player.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOAT & Chèvre Cards (Only Multi-player) */}
        {!isSoloMode && goat && chevre && goat.score > chevre.score && (
          <div className="space-y-4">
            {/* GOAT Card */}
            <div className="rounded-xl border-2 border-yellow-500 bg-gradient-to-br from-yellow-500/20 to-yellow-900/10 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-black text-yellow-400">👑 GOAT : {goat.name}</p>
                  <p className="text-sm text-yellow-300/80">Score : {goat.score} pts</p>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Pour le reste de la soirée, la Chèvre deviendra votre élève.
                Vous devrez l'encourager et lui donner des conseils avisés.
              </p>
            </div>

            {/* Chèvre Card */}
            <div className="rounded-xl border-2 border-red-500 bg-gradient-to-br from-red-500/20 to-red-900/10 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Skull className="h-8 w-8 text-red-400" />
                <div>
                  <p className="text-2xl font-black text-red-400">🐐 Chèvre : {chevre.name}</p>
                  <p className="text-sm text-red-300/80">Score : {chevre.score} pts</p>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Pour le reste de la soirée, le GOAT sera votre mentor.
                Vous lui devrez le respect et devrez mettre en pratique ses conseils.
              </p>
            </div>
          </div>
        )}

        {/* Link Section */}
        {!isSoloMode && goat && chevre && goat.score > chevre.score && (
          <>
            {/* Link Created/Renewed */}
            {(linkStatus === 'created' || linkStatus === 'renewed') && (
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 rounded-xl border-2 border-indigo-500 bg-gradient-to-br from-indigo-500/20 to-purple-900/10 p-5 text-center">
                <Handshake className="mx-auto h-10 w-10 text-indigo-400 mb-3" />
                <p className="text-xl font-bold text-indigo-400 mb-2">
                  🤝 {linkStatus === 'renewed' ? 'Lien renouvelé !' : 'Lien créé !'}
                </p>
                <p className="text-white/80 text-sm mb-1">
                  Pour la prochaine partie que vous ferez ensemble,
                </p>
                <p className="text-white/80 text-sm mb-1">
                  vous obtiendrez réciproquement l'action "<span className="font-bold text-indigo-400">Accompagnement</span>".
                </p>
                <p className="text-white/60 text-xs mt-2">
                  Lors de son utilisation, vous réaliserez le défi en cours en duo.
                </p>
              </div>
            )}

            {/* No profiles - Incentive message */}
            {!bothHaveProfiles && (
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 rounded-xl border-2 border-dashed border-white/30 bg-white/5 p-5 text-center">
                <UserPlus className="mx-auto h-8 w-8 text-white/40 mb-3" />
                <p className="text-white/60 text-sm">
                  Sauvegardez vos profils pour débloquer le système <span className="font-bold text-indigo-400">Mentor/Élève</span> !
                </p>
              </div>
            )}
          </>
        )}

        {/* Return Home Button */}
        <div className="flex justify-center pt-2">
          <Button
            onClick={handleReturnHome}
            className="bg-primary hover:bg-primary/80 px-8 py-6 text-lg font-bold text-white shadow-[0_0_30px_var(--primary)]"
          >
            <Home className="mr-2 h-5 w-5" />
            TERMINER
          </Button>
        </div>
      </div>
    </div>
  )
}
