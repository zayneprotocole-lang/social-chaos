'use client'

/**
 * Composant de liste des joueurs pour le lobby (refactorisé avec profils)
 *
 * Features:
 * - Affiche les joueurs du lobby (profils + invités)
 * - Avatar avec initiales si pas de photo
 * - Badge "Hôte" sur le profil principal
 * - Bouton supprimer sur chaque joueur (y compris hôte)
 * - Ajout via profils existants ou invité
 */

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Crown,
  Trash2,
  UserPlus,
  Users,
  User,
  X,
  Check,
  UserCircle,
  Clock,
  Save,
  Handshake,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import {
  useLobbyStore,
  useLobbyPlayers,
  useIsSoloMode,
} from '@/lib/store/useLobbyStore'
import { useProfiles } from '@/lib/store/useProfileStore'
import { useGuestStore } from '@/lib/store/useGuestStore'
import { useMentorEleveStore } from '@/lib/store/useMentorEleveStore'
import { LobbyPlayer } from '@/types/lobby'
import { LocalPlayerProfile } from '@/types/profile'
import { SaveGuestDialog } from './SaveGuestDialog'
import { PlayerPreferencesDialog } from './PlayerPreferencesDialog'

// ========================================
// TYPES
// ========================================

export interface LobbyPlayerListProps {
  /** Callback pour ouvrir la gestion des profils */
  onManageProfiles?: () => void
  /** Classes CSS additionnelles */
  className?: string
}

// ========================================
// ANIMATION VARIANTS
// ========================================

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
}

// ========================================
// SUB-COMPONENT: PLAYER ITEM
// ========================================

interface PlayerItemProps {
  player: LobbyPlayer
  onRemove: () => void
  onConvertToProfile: (profile: LocalPlayerProfile) => void
  canRemove: boolean
  relationInfo?: { isMentor: boolean; partnerName: string } | null
}

function PlayerItem({
  player,
  onRemove,
  onConvertToProfile,
  canRemove,
  relationInfo,
}: PlayerItemProps) {
  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const isGuest = !player.profileId

  return (
    <motion.div
      variants={listItemVariants}
      layout
      className={`group flex items-center justify-between rounded-xl border p-3 transition-all ${
        player.isHost
          ? 'bg-primary/5 border-primary/30'
          : 'bg-background/50 border-border hover:border-primary/30'
      } `}
    >
      {/* Avatar + Info */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar
          className={`size-10 ${player.isHost ? 'ring-primary ring-offset-background ring-2 ring-offset-2' : ''}`}
        >
          {player.avatarUri ? (
            <AvatarImage src={player.avatarUri} alt={player.name} />
          ) : (
            <AvatarFallback className="from-primary/20 to-secondary/20 text-primary bg-gradient-to-br font-bold">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="text-foreground truncate font-bold">
              {player.name}
            </span>
            {isGuest && (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-dashed px-1.5 py-0 text-[10px] opacity-70"
                >
                  Invité
                </Badge>
                <SaveGuestDialog
                  guest={player}
                  onSaved={onConvertToProfile}
                  trigger={
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 border border-indigo-500/30 bg-indigo-500/10 px-3 text-xs font-semibold text-indigo-400 shadow-sm transition-all group-hover:shadow-indigo-500/10 hover:scale-105 hover:border-indigo-500/50 hover:bg-indigo-500/20"
                    >
                      <Save className="mr-1.5 h-3.5 w-3.5" />
                      Garder ce profil
                    </Button>
                  }
                />
              </div>
            )}
            {!isGuest && player.profileId && (
              <PlayerPreferencesDialog profileId={player.profileId} />
            )}
          </div>

          {player.isHost && (
            <span className="text-primary flex items-center gap-1 text-[10px] font-bold uppercase">
              <Crown className="size-3" />
              Hôte
            </span>
          )}

          {/* Mentor/Élève Relation Badge */}
          {relationInfo && (
            <span
              className={`flex items-center gap-1 text-[10px] font-bold uppercase ${
                relationInfo.isMentor ? 'text-yellow-500' : 'text-indigo-400'
              }`}
            >
              <Handshake className="size-3" />
              {relationInfo.isMentor ? 'Mentor de' : 'Élève de'}{' '}
              {relationInfo.partnerName}
            </span>
          )}
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        disabled={!canRemove}
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 transition-all group-hover:opacity-100 disabled:opacity-30"
        title="Retirer de la partie"
      >
        <Trash2 className="size-4" />
      </Button>
    </motion.div>
  )
}

// ========================================
// SUB-COMPONENT: ADD PLAYER PANEL
// ========================================

interface AddPlayerPanelProps {
  onClose: () => void
  onAddGuest: (name: string) => void
  onAddProfile: (profile: LocalPlayerProfile) => void
  existingProfileIds: string[]
}

function AddPlayerPanel({
  onClose,
  onAddGuest,
  onAddProfile,
  existingProfileIds,
}: AddPlayerPanelProps) {
  const [mode, setMode] = useState<'choose' | 'guest'>('choose')
  const [guestName, setGuestName] = useState('')

  const profiles = useProfiles()
  const guests = useGuestStore((s) => s.guests)

  const availableProfiles = profiles.filter(
    (p) => !existingProfileIds.includes(p.id)
  )

  // Invités récents (< 30 min, triés par date)
  const recentGuests = [...guests]
    .sort((a, b) => b.lastUsedAt - a.lastUsedAt)
    .slice(0, 5)

  const handleAddGuest = (name: string) => {
    if (name.trim()) {
      onAddGuest(name.trim())
      setGuestName('')
      onClose()
    }
  }

  const handleAddProfile = (profile: LocalPlayerProfile) => {
    onAddProfile(profile)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="border-primary/30 from-primary/5 to-secondary/5 rounded-xl border-2 bg-gradient-to-br p-3">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-foreground text-sm font-medium">
            {mode === 'choose' ? 'Ajouter un joueur' : 'Ajouter un invité'}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-muted-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>

        {mode === 'choose' ? (
          <div className="space-y-3">
            {/* Profils disponibles */}
            {availableProfiles.length > 0 && (
              <div className="space-y-1">
                <p className="text-muted-foreground mb-2 text-xs">
                  Profils enregistrés :
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableProfiles.map((profile) => {
                    const initials = profile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                    return (
                      <button
                        key={profile.id}
                        onClick={() => handleAddProfile(profile)}
                        className="border-border bg-background/50 hover:border-primary hover:bg-primary/10 flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all"
                      >
                        <Avatar className="size-6">
                          {profile.avatarUri ? (
                            <AvatarImage
                              src={profile.avatarUri}
                              alt={profile.name}
                            />
                          ) : (
                            <AvatarFallback className="bg-muted text-[10px]">
                              {initials}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-sm font-medium">
                          {profile.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Invités récents */}
            {recentGuests.length > 0 && (
              <div className="border-border/50 space-y-1 border-t border-dashed pt-2">
                <p className="text-muted-foreground mb-2 flex items-center gap-1 text-xs">
                  <Clock className="size-3" /> Récents :
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentGuests.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => handleAddGuest(guest.name)}
                      className="border-muted-foreground/30 bg-background/30 hover:bg-primary/5 hover:border-primary/50 flex items-center gap-2 rounded-full border border-dashed px-3 py-1.5 transition-all"
                    >
                      <span className="text-foreground/80 text-sm">
                        {guest.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ou ajouter un invité */}
            <div className="border-border border-t pt-2">
              <button
                onClick={() => setMode('guest')}
                className="border-muted-foreground/30 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-foreground flex w-full items-center justify-center gap-2 rounded-lg border border-dashed p-2 text-sm transition-all"
              >
                <UserCircle className="size-4" />
                Ajouter un invité (manuel)
              </button>
            </div>
          </div>
        ) : (
          /* Mode invité */
          <div className="flex gap-2">
            <Input
              autoFocus
              placeholder="Prénom du joueur..."
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGuest(guestName)}
              className="bg-background/50 h-9 flex-1"
            />
            <Button
              onClick={() => handleAddGuest(guestName)}
              disabled={!guestName.trim()}
              size="sm"
              className="h-9 px-3"
            >
              <Check className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMode('choose')
                setGuestName('')
              }}
              className="h-9 px-3"
            >
              <X className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ========================================
// MAIN COMPONENT
// ========================================

export function LobbyPlayerList({
  onManageProfiles,
  className = '',
}: LobbyPlayerListProps) {
  // Store
  const players = useLobbyPlayers()
  const isSoloMode = useIsSoloMode()
  const removePlayer = useLobbyStore((s) => s.removePlayer)
  const addPlayerFromProfile = useLobbyStore((s) => s.addPlayerFromProfile)
  const addGuestPlayer = useLobbyStore((s) => s.addGuestPlayer)

  // Mentor/Élève relations
  const links = useMentorEleveStore((s) => s.links)

  // State
  const [showAddPanel, setShowAddPanel] = useState(false)

  // Guest Store Actions
  const addGuestStore = useGuestStore((s) => s.addGuest)
  const removeGuestByName = useGuestStore((s) => s.removeGuestByName)
  const cleanupExpiredGuests = useGuestStore((s) => s.cleanupExpiredGuests)

  // Cleanup expired guests on mount
  useEffect(() => {
    cleanupExpiredGuests()
  }, [cleanupExpiredGuests])

  /**
   * Retire un joueur
   */
  const handleRemovePlayer = useCallback(
    (playerId: string) => {
      removePlayer(playerId)
    },
    [removePlayer]
  )

  /**
   * Ajoute depuis un profil
   */
  const handleAddFromProfile = useCallback(
    (profile: LocalPlayerProfile) => {
      addPlayerFromProfile(profile)
    },
    [addPlayerFromProfile]
  )

  /**
   * Ajoute un invité
   */
  const handleAddGuest = useCallback(
    (name: string) => {
      addGuestPlayer(name)
      addGuestStore(name)
    },
    [addGuestPlayer, addGuestStore]
  )

  /**
   * Conversion Invité -> Profil
   */
  const handleGuestToProfile = useCallback(
    (guestId: string, newProfile: LocalPlayerProfile, guestName: string) => {
      handleRemovePlayer(guestId)
      addPlayerFromProfile(newProfile)
      removeGuestByName(guestName)
    },
    [handleRemovePlayer, addPlayerFromProfile, removeGuestByName]
  )

  // IDs des profils déjà dans le lobby
  const existingProfileIds = players
    .filter((p) => p.profileId)
    .map((p) => p.profileId!)

  // Compute active duos in this lobby
  const getPlayerRelation = useCallback(
    (profileId: string | undefined) => {
      if (!profileId) return null

      for (const link of links) {
        // Skip consumed links
        if (link.isConsumed) continue

        const partnerProfileId =
          link.mentorProfileId === profileId
            ? link.eleveProfileId
            : link.eleveProfileId === profileId
              ? link.mentorProfileId
              : null

        if (partnerProfileId && existingProfileIds.includes(partnerProfileId)) {
          const isMentor = link.mentorProfileId === profileId
          const partner = players.find((p) => p.profileId === partnerProfileId)
          return { isMentor, partnerName: partner?.name || 'Inconnu' }
        }
      }
      return null
    },
    [links, existingProfileIds, players]
  )

  return (
    <Card className={`bg-card/50 border-primary/20 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-primary size-5" />
            <span>Joueurs</span>
            <Badge variant="secondary" className="ml-1">
              {players.length}
            </Badge>
          </div>

          {/* Info mode solo */}
          {isSoloMode && players.length > 0 && (
            <Badge className="bg-secondary/20 text-secondary border-secondary/30">
              Mode Solo
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Liste des joueurs */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {players.map((player) => (
              <PlayerItem
                key={player.id}
                player={player}
                onRemove={() => handleRemovePlayer(player.id)}
                onConvertToProfile={(p) =>
                  handleGuestToProfile(player.id, p, player.name)
                }
                canRemove={true}
                relationInfo={getPlayerRelation(player.profileId)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* État vide */}
        {players.length === 0 && !showAddPanel && (
          <div className="py-8 text-center">
            <User className="text-muted-foreground/50 mx-auto mb-2 size-10" />
            <p className="text-muted-foreground text-sm italic">
              Aucun joueur. Ajoutez des participants !
            </p>
          </div>
        )}

        {/* Panel d'ajout */}
        <AnimatePresence>
          {showAddPanel && (
            <AddPlayerPanel
              onClose={() => setShowAddPanel(false)}
              onAddGuest={handleAddGuest}
              onAddProfile={handleAddFromProfile}
              existingProfileIds={existingProfileIds}
            />
          )}
        </AnimatePresence>

        {/* Bouton Ajouter */}
        {!showAddPanel && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowAddPanel(true)}
            className="border-primary/40 hover:border-primary hover:bg-primary/5 group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed p-3 transition-all duration-300"
          >
            <div className="from-primary to-secondary group-hover:shadow-primary/50 flex size-8 items-center justify-center rounded-full bg-gradient-to-br shadow-lg transition-transform group-hover:scale-110">
              <UserPlus className="size-4 text-white" />
            </div>
            <span className="text-primary/70 group-hover:text-primary text-sm font-bold tracking-wide uppercase">
              Ajouter un joueur
            </span>
          </motion.button>
        )}

        {/* Lien vers gestion des profils */}
        {onManageProfiles && (
          <button
            onClick={onManageProfiles}
            className="text-muted-foreground hover:text-primary w-full py-2 text-center text-xs transition-colors"
          >
            Gérer les profils enregistrés →
          </button>
        )}
      </CardContent>
    </Card>
  )
}

export default LobbyPlayerList
