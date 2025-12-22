/**
 * Lobby Page - Refactored
 *
 * Configuration de partie avant le lancement.
 * Utilise des composants extraits pour une meilleure maintenabilité.
 */

'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

// Hooks
import { useLobbyLogicV2 } from '@/hooks/useLobbyLogicV2'
import { useLobbyStore } from '@/lib/store/useLobbyStore'
import { useProfileStore } from '@/lib/store/useProfileStore'

// Components
import LobbySkeleton from '@/components/lobby/LobbySkeleton'
import LobbySection from '@/components/lobby/LobbySection'
import ProfileCreator from '@/components/profile/ProfileCreator'
import CategorySelector, {
  ALL_CATEGORIES,
  MIN_CATEGORIES_REQUIRED,
  type Category,
} from '@/components/lobby/CategorySelector'
import DifficultySelector from '@/components/lobby/DifficultySelector'
import AlcoholModeToggle from '@/components/lobby/AlcoholModeToggle'
import CategoryWarningPopup from '@/components/lobby/CategoryWarningPopup'

// Constants
import { TEXTS } from '@/lib/constants/texts'
import { DEFAULT_SELECTED_CATEGORIES } from '@/lib/constants/categories'
import { DEFAULT_DIFFICULTY } from '@/lib/constants/difficulties'

export default function LobbyPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  // ========================================
  // STATE
  // ========================================

  // Categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    DEFAULT_SELECTED_CATEGORIES
  )
  const [warningPopup, setWarningPopup] = useState<
    'echange' | 'karaoke' | null
  >(null)

  // Difficulty
  const [selectedDifficulty, setSelectedDifficulty] =
    useState(DEFAULT_DIFFICULTY)

  // Options
  const [tours, setTours] = useState(6)
  const [alcoolMode, setAlcoolMode] = useState(false)

  // Modals
  const [showProfileCreator, setShowProfileCreator] = useState(false)
  const [showGuestInput, setShowGuestInput] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [playerToSave, setPlayerToSave] = useState<{
    id: string
    name: string
  } | null>(null)

  // ========================================
  // STORES
  // ========================================

  const addPlayerFromProfile = useLobbyStore((s) => s.addPlayerFromProfile)
  const addGuestPlayer = useLobbyStore((s) => s.addGuestPlayer)
  const removePlayer = useLobbyStore((s) => s.removePlayer)
  const hostProfile = useProfileStore((s) => s.hostProfile)
  const guestProfiles = useProfileStore((s) => s.guestProfiles)

  // ========================================
  // LOBBY LOGIC HOOK
  // ========================================

  const { session, isLoading, lobbyPlayers, playerCount, startGame } =
    useLobbyLogicV2(code)

  const isIndoor = session?.settings?.tags?.includes('Indoor') || false

  // ========================================
  // HANDLERS
  // ========================================

  const handleCategoryToggle = (category: Category) => {
    // If already selected, deselect
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories((prev) => prev.filter((id) => id !== category.id))
      return
    }

    // If it has a warning and not selected, show popup
    if (category.warning) {
      setWarningPopup(category.warning)
      return
    }

    // Otherwise add it directly
    setSelectedCategories((prev) => [...prev, category.id])
  }

  const confirmCategory = (categoryId: string) => {
    setSelectedCategories((prev) => [...prev, categoryId])
    setWarningPopup(null)
    toast.success(`Catégorie "${categoryId}" ajoutée`)
  }

  const handleAddGuest = () => {
    if (guestName.trim()) {
      addGuestPlayer(guestName.trim())
      setGuestName('')
      toast.success(`${guestName} ajouté à la partie`)
    }
  }

  const handleStartGame = async () => {
    // Validations (skip categories for Indoor mode)
    if (!isIndoor && selectedCategories.length < MIN_CATEGORIES_REQUIRED) {
      toast.error(`Sélectionne au moins ${MIN_CATEGORIES_REQUIRED} catégories`)
      return
    }

    if (playerCount === 0) {
      toast.error('Ajoute au moins un joueur')
      return
    }

    try {
      await startGame()
      toast.success("C'est parti ! 🚀")
    } catch (error) {
      toast.error('Erreur lors du lancement de la partie')
      console.error('Start game error:', error)
    }
  }

  // ========================================
  // LOADING & ERROR STATES
  // ========================================

  if (isLoading) {
    return <LobbySkeleton />
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold text-white">Session introuvable</h1>
        <p className="text-white/60">
          Le code {code} ne correspond à aucune partie active.
        </p>
        <button
          onClick={() => router.push('/')}
          className="glass-interactive rounded-xl px-6 py-3 font-semibold text-white"
        >
          Retour à l&apos;accueil
        </button>
      </div>
    )
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <>
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 flex items-center gap-4 rounded-none border-x-0 border-t-0 px-4 py-4">
        <button
          onClick={() => router.push('/')}
          className="rounded-full p-2 transition-colors hover:bg-white/10"
          aria-label="Retour"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white">
            {session?.settings?.tags?.includes('Indoor')
              ? 'Mode Maison 🏠'
              : 'Créer une partie'}
          </h1>
          {session?.settings?.tags?.includes('Indoor') && (
            <span className="text-xs font-medium text-cyan-400">
              Règles spéciales activées
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="space-y-2.5 px-4 pt-4 pb-2">
        {/* Section 1: Players */}
        <LobbySection
          icon="👥"
          title="Joueurs"
          helpText={TEXTS.lobby.help.players}
        >
          <div className="space-y-2">
            {/* Player list */}
            {lobbyPlayers.map((player) => (
              <div
                key={player.id}
                className={`glass flex items-center gap-3 rounded-xl p-2 transition-all ${
                  player.isHost
                    ? 'border-l-2 border-l-purple-500 bg-purple-500/5'
                    : !player.profileId
                      ? 'border-l-2 border-l-cyan-500 bg-cyan-500/5'
                      : ''
                }`}
              >
                {/* Avatar */}
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/30">
                  {player.avatarUri ? (
                    <img
                      src={player.avatarUri}
                      className="h-full w-full rounded-full object-cover"
                      alt={player.name}
                    />
                  ) : (
                    <span className="text-base font-medium text-white">
                      {player.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Name and badges */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium text-white">
                      {player.name}
                    </span>
                    {player.isHost && (
                      <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">
                        Hôte
                      </span>
                    )}
                    {!player.profileId && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/40">
                        Invité
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {!player.profileId && (
                    <button
                      onClick={() => {
                        setPlayerToSave({ id: player.id, name: player.name })
                        setShowProfileCreator(true)
                      }}
                      className="flex-shrink-0 rounded-full p-2 transition-colors hover:bg-green-500/20"
                      title="Sauvegarder ce joueur"
                    >
                      <Plus className="h-4 w-4 text-green-400" />
                    </button>
                  )}

                  {!player.isHost && (
                    <button
                      onClick={() => {
                        removePlayer(player.id)
                        toast.info(`${player.name} retiré`)
                      }}
                      className="flex-shrink-0 rounded-full p-2 transition-colors hover:bg-red-500/20"
                      aria-label="Retirer joueur"
                    >
                      <X className="h-5 w-5 text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Add player section */}
            <div className="mt-3">
              {!showGuestInput ? (
                <button
                  onClick={() => setShowGuestInput(true)}
                  className="glass-interactive flex w-full items-center justify-center gap-2 rounded-xl p-3"
                >
                  <Plus className="h-5 w-5 text-purple-400" />
                  <span className="text-white/80">Ajouter un joueur</span>
                </button>
              ) : (
                <div className="glass space-y-3 rounded-xl p-3">
                  {/* Input for name */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nom du joueur"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddGuest()
                        if (e.key === 'Escape') {
                          setShowGuestInput(false)
                          setGuestName('')
                        }
                      }}
                      autoFocus
                      className="glass flex-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={handleAddGuest}
                      disabled={!guestName.trim()}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Ajouter
                    </button>
                    <button
                      onClick={() => {
                        setShowGuestInput(false)
                        setGuestName('')
                      }}
                      className="rounded-lg p-2 transition-colors hover:bg-white/10"
                    >
                      <X className="h-5 w-5 text-white/60" />
                    </button>
                  </div>

                  {/* Saved profiles list */}
                  {guestProfiles.filter(
                    (p) => !lobbyPlayers.some((lp) => lp.profileId === p.id)
                  ).length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] tracking-wide text-white/40 uppercase">
                        Profils enregistrés
                      </p>
                      <div className="space-y-1">
                        {guestProfiles
                          .filter(
                            (p) =>
                              !lobbyPlayers.some((lp) => lp.profileId === p.id)
                          )
                          .map((profile) => (
                            <button
                              key={profile.id}
                              onClick={() => {
                                addPlayerFromProfile(profile)
                                setShowGuestInput(false)
                                toast.success(`${profile.name} ajouté`)
                              }}
                              className="glass-interactive flex w-full items-center gap-2 rounded-lg p-2 text-left"
                            >
                              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/30">
                                {profile.avatarUri ? (
                                  <img
                                    src={profile.avatarUri}
                                    className="h-full w-full rounded-full object-cover"
                                    alt={profile.name}
                                  />
                                ) : (
                                  <span className="text-xs font-medium text-white">
                                    {profile.name.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-white/80">
                                {profile.name}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </LobbySection>

        {/* Section 2: Options (Tours + Alcool) */}
        <LobbySection
          icon="⚙️"
          title="Options"
          helpText={TEXTS.lobby.help.options}
        >
          <div className="space-y-4">
            {/* Number of turns */}
            <div>
              <label className="mb-2 block text-sm text-white/60">
                Nombre de tours
              </label>
              <div className="flex gap-2">
                {[4, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTours(num)}
                    className={`flex-1 rounded-lg py-2 text-center text-sm font-bold transition-all ${
                      tours === num
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'border border-purple-500/20 bg-purple-500/10 text-white/60 hover:bg-purple-500/20 hover:text-white'
                    } `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Alcohol mode toggle */}
            <AlcoholModeToggle
              alcoolMode={alcoolMode}
              onToggle={() => setAlcoolMode(!alcoolMode)}
            />
          </div>
        </LobbySection>

        {/* Section 3: Categories (Hidden/Fixed for Indoor Mode) */}
        {!isIndoor ? (
          <LobbySection
            icon="🎯"
            title="Catégories"
            helpText={TEXTS.lobby.help.categories}
          >
            <CategorySelector
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
            />
          </LobbySection>
        ) : (
          <LobbySection
            icon="🏠"
            title="Mode Maison"
            helpText="Gages spécialement conçus pour les soirées en appartement."
          >
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/30 p-4">
              <p className="mb-2 text-sm font-medium text-cyan-200">
                Catégories automatiques :
              </p>
              <div className="flex flex-wrap gap-2">
                {['Maison', 'Vérité', 'Physique', 'Réseaux', 'Fun'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-200"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
              <p className="mt-3 text-xs text-cyan-400 italic">
                Les catégories sont fixes pour ce mode de jeu pour garantir un
                chaos optimal en intérieur.
              </p>
            </div>
          </LobbySection>
        )}

        {/* Section 4: Difficulty */}
        <LobbySection
          icon="⚡"
          title="Difficulté"
          helpText={TEXTS.lobby.help.difficulty}
        >
          {!isIndoor ? (
            <DifficultySelector
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Chill (Niv 1) */}
              <button
                onClick={() => setSelectedDifficulty(1 as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
                className={`relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
                  Number(selectedDifficulty) === 1
                    ? 'border-green-400 bg-green-900/40 shadow-[0_0_20px_rgba(74,222,128,0.3)]'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-bold text-green-400">CHILL 🧊</span>
                  {Number(selectedDifficulty) === 1 && (
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  )}
                </div>
                <p className="text-xs text-white/60">
                  Pour commencer en douceur. Anecdotes et fun.
                </p>
              </button>

              {/* Spicy (Niv 2) */}
              <button
                onClick={() => setSelectedDifficulty(2 as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
                className={`relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
                  Number(selectedDifficulty) === 2
                    ? 'border-pink-500 bg-pink-900/40 shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-bold text-pink-500">SPICY 🌶️</span>
                  {Number(selectedDifficulty) === 2 && (
                    <div className="h-2 w-2 animate-pulse rounded-full bg-pink-500" />
                  )}
                </div>
                <p className="text-xs text-white/60">
                  Contacts physiques, tension et séduction.
                </p>
              </button>

              {/* Chaos (Niv 3) */}
              <button
                onClick={() => setSelectedDifficulty(3 as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
                className={`relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
                  Number(selectedDifficulty) === 3
                    ? 'border-purple-600 bg-purple-900/40 shadow-[0_0_20px_rgba(147,51,234,0.3)]'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-bold text-purple-400">CHAOS 💀</span>
                  {Number(selectedDifficulty) === 3 && (
                    <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
                  )}
                </div>
                <p className="text-xs text-white/60">
                  Téléphones déverrouillés et secrets révélés.
                </p>
              </button>
            </div>
          )}
        </LobbySection>
      </main>

      {/* Start Section */}
      <div className="px-4 pt-3 pb-8">
        {/* Category validation message (Only for Outdoor) */}
        {!isIndoor && (
          <div className="mb-3 text-center">
            {selectedCategories.length < MIN_CATEGORIES_REQUIRED ? (
              <p className="flex items-center justify-center gap-2 text-sm text-amber-400">
                <span>⚠️</span>
                <span>
                  Sélectionne au moins {MIN_CATEGORIES_REQUIRED} catégories (
                  {selectedCategories.length}/{MIN_CATEGORIES_REQUIRED})
                </span>
              </p>
            ) : (
              <p className="flex items-center justify-center gap-2 text-sm text-green-400">
                <span>✓</span>
                <span>
                  {selectedCategories.length} catégories sélectionnées
                </span>
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleStartGame}
          disabled={
            (!isIndoor &&
              selectedCategories.length < MIN_CATEGORIES_REQUIRED) ||
            playerCount === 0
          }
          className={`flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-5 py-3 text-base font-bold text-white transition-all duration-300 ${
            (!isIndoor &&
              selectedCategories.length < MIN_CATEGORIES_REQUIRED) ||
            playerCount === 0
              ? 'cursor-not-allowed opacity-50 grayscale'
              : 'glow-purple hover:scale-[1.02]'
          } `}
        >
          <span className="text-lg">🚀</span>
          <span>Démarrer la pire partie de votre vie</span>
        </button>

        {/* Message if not enough players */}
        {playerCount === 0 && (
          <p className="mt-2 text-center text-xs text-red-400">
            Ajoute au moins un joueur pour commencer
          </p>
        )}
      </div>

      {/* Warning Popups */}
      <CategoryWarningPopup
        warningType={warningPopup}
        onConfirm={confirmCategory}
        onCancel={() => setWarningPopup(null)}
      />

      {/* Modal: Profile Creator */}
      {showProfileCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <ProfileCreator
            initialData={playerToSave ? { name: playerToSave.name } : undefined}
            onSuccess={(profile) => {
              if (playerToSave) {
                removePlayer(playerToSave.id)
                addPlayerFromProfile(profile)
                setPlayerToSave(null)
              } else {
                addPlayerFromProfile(profile)
              }
              setShowProfileCreator(false)
              toast.success(`Profil "${profile.name}" créé`)
            }}
            onCancel={() => {
              setShowProfileCreator(false)
              setPlayerToSave(null)
            }}
          />
        </div>
      )}
    </>
  )
}
