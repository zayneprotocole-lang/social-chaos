'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X, Users, UserPlus, UserCircle } from 'lucide-react'
import { useLobbyLogicV2 } from '@/hooks/useLobbyLogicV2'
import { useLobbyStore } from '@/lib/store/useLobbyStore'
import { useProfileStore } from '@/lib/store/useProfileStore'
import LobbySkeleton from '@/components/lobby/LobbySkeleton'
import LobbySection from '@/components/lobby/LobbySection'
import ProfileCreator from '@/components/profile/ProfileCreator'
import { LocalPlayerProfile } from '@/types/profile'
import { TEXTS } from '@/lib/constants/texts'

// Catégories groupées par thème
const categoryGroups = [
  {
    theme: 'Pour séduire',
    emoji: '💘',
    categories: [
      {
        id: 'sauvage',
        emoji: '😎',
        name: 'Rizz',
        desc: 'Un crush ? Brisez la glace',
        warning: null,
      },
      {
        id: 'echange',
        emoji: '🤝',
        name: 'Échange',
        desc: 'Idéal pour se rapprocher',
        warning: 'echange' as const,
      },
      {
        id: 'karaoke',
        emoji: '🎤',
        name: 'Karaoké',
        desc: 'Pour une nuit caliente',
        warning: 'karaoke' as const,
      },
    ],
  },
  {
    theme: "Pour s'amuser",
    emoji: '🎉',
    categories: [
      {
        id: 'folie',
        emoji: '😈',
        name: 'Absurde',
        desc: 'Gênance et honte maximum',
        warning: null,
      },
      {
        id: 'jeux',
        emoji: '🎲',
        name: 'Jeux',
        desc: 'Rencontre fun et amusante',
        warning: null,
      },
      {
        id: 'favoris',
        emoji: '⭐',
        name: 'Favoris',
        desc: 'Vos gages préférés',
        warning: null,
      },
    ],
  },
  {
    theme: 'Pour faire des rencontres',
    emoji: '🤝',
    categories: [
      {
        id: 'philo',
        emoji: '🧠',
        name: 'Philo',
        desc: 'Discussion profonde et amusante',
        warning: null,
      },
      {
        id: 'enquete',
        emoji: '🔍',
        name: 'Enquête',
        desc: 'Facile, idéal pour poser les bases',
        warning: null,
      },
      {
        id: 'mignon',
        emoji: '🥰',
        name: 'Mignon',
        desc: 'Bienveillance et bonne action',
        warning: null,
      },
    ],
  },
]

// Flat list pour la logique (sélection, etc.)
const allCategories = categoryGroups.flatMap((g) => g.categories)

const difficulties = [
  {
    id: 'gentil',
    name: 'Chaos Gentil',
    emoji: '😇',
    desc: 'Facile, pour débuter',
    color: 'yellow' as const,
  },
  {
    id: 'sauvage',
    name: 'Chaos Sauvage',
    emoji: '🔥',
    desc: 'Modéré, ça monte',
    color: 'orange' as const,
  },
  {
    id: 'chaotique',
    name: 'Chaos Chaotique',
    emoji: '💀',
    desc: 'Extrême, sans pitié',
    color: 'red' as const,
  },
  {
    id: 'progressif',
    name: 'Chaos Progressif',
    emoji: '📈',
    desc: 'Gentil → Chaotique',
    color: 'purple' as const,
    special: true,
  },
]

const colorClasses = {
  yellow: 'border-yellow-500 bg-yellow-500/50',
  orange: 'border-orange-500 bg-orange-500/50',
  red: 'border-red-500 bg-red-500/50',
  purple: 'border-purple-500 bg-purple-500/50',
}

const glowColors = {
  yellow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
  orange: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
  red: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  purple: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
}

const categoryBgColors: Record<string, string> = {
  sauvage: 'bg-purple-500/15 border-purple-500/25',
  jeux: 'bg-cyan-500/15 border-cyan-500/25',
  philo: 'bg-violet-500/15 border-violet-500/25',
  mignon: 'bg-pink-500/15 border-pink-500/25',
  folie: 'bg-purple-600/15 border-purple-600/25',
  enquete: 'bg-cyan-600/15 border-cyan-600/25',
  echange: 'bg-violet-600/15 border-violet-600/25',
  karaoke: 'bg-fuchsia-500/15 border-fuchsia-500/25',
  favoris: 'bg-purple-400/15 border-purple-400/25',
}

const categorySelectedColors: Record<string, string> = {
  sauvage:
    'bg-purple-500/55 border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]',
  jeux: 'bg-cyan-500/55 border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
  philo:
    'bg-violet-500/55 border-2 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.4)]',
  mignon:
    'bg-pink-500/55 border-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)]',
  folie:
    'bg-purple-600/55 border-2 border-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.4)]',
  enquete:
    'bg-cyan-600/55 border-2 border-cyan-600 shadow-[0_0_20px_rgba(8,145,178,0.4)]',
  echange:
    'bg-violet-600/55 border-2 border-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.4)]',
  karaoke:
    'bg-fuchsia-500/55 border-2 border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.4)]',
  favoris:
    'bg-purple-400/55 border-2 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.4)]',
}

export default function LobbyPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  // State for categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'sauvage',
    'jeux',
    'mignon',
  ])
  const [warningPopup, setWarningPopup] = useState<string | null>(null)

  // State for difficulty
  const [selectedDifficulty, setSelectedDifficulty] = useState('sauvage')

  // State for options
  const [tours, setTours] = useState(6)
  const [alcoolMode, setAlcoolMode] = useState(false)

  // Lobby store actions
  const addPlayerFromProfile = useLobbyStore((s) => s.addPlayerFromProfile)
  const addGuestPlayer = useLobbyStore((s) => s.addGuestPlayer)
  const removePlayer = useLobbyStore((s) => s.removePlayer)

  // Profile store
  // Profile store - FIX: Use stable selectors to avoid infinite loops
  const hostProfile = useProfileStore((s) => s.hostProfile)
  const guestProfiles = useProfileStore((s) => s.guestProfiles)

  // States for modals
  const [showProfileCreator, setShowProfileCreator] = useState(false)
  const [showGuestInput, setShowGuestInput] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [playerToSave, setPlayerToSave] = useState<{
    id: string
    name: string
  } | null>(null)

  const {
    session,
    isLoading,
    lobbyPlayers,
    playerCount,
    canStartGame,
    startGameError,
    startGame,
  } = useLobbyLogicV2(code)

  const handleCategoryToggle = (category: (typeof allCategories)[0]) => {
    // Si déjà sélectionnée, on désélectionne
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories((prev) => prev.filter((id) => id !== category.id))
      return
    }

    // Si elle a un warning et n'est pas encore sélectionnée, on affiche le popup
    if (category.warning) {
      setWarningPopup(category.warning)
      return
    }

    // Sinon on l'ajoute directement
    setSelectedCategories((prev) => [...prev, category.id])
  }

  const confirmCategory = (categoryId: string) => {
    setSelectedCategories((prev) => [...prev, categoryId])
    setWarningPopup(null)
  }

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

  return (
    <>
      {/* Header avec retour */}
      <header className="glass-strong sticky top-0 z-50 flex items-center gap-4 rounded-none border-x-0 border-t-0 px-4 py-4">
        <button
          onClick={() => router.push('/')}
          className="rounded-full p-2 transition-colors hover:bg-white/10"
          aria-label="Retour"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">Créer une partie</h1>
      </header>

      {/* Contenu scrollable */}
      <main className="space-y-2.5 px-4 pt-4 pb-2">
        {/* Section 1: Joueurs */}
        <LobbySection
          icon="👥"
          title="Joueurs"
          helpText={TEXTS.lobby.help.players}
        >
          <div className="space-y-2">
            {/* Liste des joueurs */}
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

                {/* Nom et badges */}
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
                  {/* Bouton sauvegarder (si invité) */}
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

                  {/* Bouton retirer */}
                  {!player.isHost && (
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="flex-shrink-0 rounded-full p-2 transition-colors hover:bg-red-500/20"
                      aria-label="Retirer joueur"
                    >
                      <X className="h-5 w-5 text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Bouton/Case d'ajout */}
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
                  {/* Input pour nom */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nom du joueur"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && guestName.trim()) {
                          addGuestPlayer(guestName.trim())
                          setGuestName('')
                        }
                        if (e.key === 'Escape') {
                          setShowGuestInput(false)
                          setGuestName('')
                        }
                      }}
                      autoFocus
                      className="glass flex-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (guestName.trim()) {
                          addGuestPlayer(guestName.trim())
                          setGuestName('')
                        }
                      }}
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

                  {/* Liste des profils enregistrés */}
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
                              }}
                              className="glass-interactive flex w-full items-center gap-2 rounded-lg p-2 text-left"
                            >
                              {/* Avatar */}
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
            {/* Nombre de tours */}
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

            {/* Mode alcool - Carte explicative */}
            <div
              onClick={() => setAlcoolMode(!alcoolMode)}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${
                alcoolMode
                  ? 'border-amber-500/50 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20'
                  : 'border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-teal-500/5 to-cyan-500/10'
              } `}
              style={{
                boxShadow: alcoolMode
                  ? '0 0 25px rgba(245, 158, 11, 0.2)'
                  : '0 0 15px rgba(6, 182, 212, 0.1)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Icône + Contenu */}
                <div className="flex items-start gap-3">
                  {/* Icône dynamique */}
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      alcoolMode
                        ? 'bg-amber-500/30 text-amber-400'
                        : 'bg-cyan-500/20 text-cyan-400'
                    } `}
                  >
                    <span className="text-xl">{alcoolMode ? '🍺' : '☕'}</span>
                  </div>

                  {/* Texte explicatif */}
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`text-base font-bold transition-colors ${alcoolMode ? 'text-amber-300' : 'text-cyan-300'} `}
                    >
                      {alcoolMode ? 'Mode Alcool' : 'Mode Sans Alcool'}
                    </span>
                    <span className="text-xs text-white/60">
                      {alcoolMode
                        ? 'Pénalités = gorgées à boire'
                        : 'Pénalités = vérités à avouer'}
                    </span>
                  </div>
                </div>

                {/* Toggle visuel */}
                <div
                  className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-all duration-300 ${alcoolMode ? 'bg-amber-500' : 'bg-cyan-500/50'} `}
                >
                  <div
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 ${alcoolMode ? 'left-6' : 'left-1'} `}
                  />
                </div>
              </div>
            </div>
          </div>
        </LobbySection>

        {/* Section 3: Catégories */}
        <LobbySection
          icon="🎯"
          title="Catégories"
          helpText={TEXTS.lobby.help.categories}
        >
          <div className="space-y-4">
            {categoryGroups.map((group, groupIndex) => (
              <div key={group.theme}>
                {/* Séparateur entre groupes */}
                {groupIndex > 0 && <div className="mb-4 h-px bg-white/10" />}

                {/* Label du thème */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-base">{group.emoji}</span>
                  <span className="text-xs font-medium tracking-wide text-white/60 uppercase">
                    {group.theme}
                  </span>
                </div>

                {/* Catégories du groupe */}
                <div className="grid grid-cols-3 gap-2">
                  {group.categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id)
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryToggle(cat)}
                        className={`flex min-h-[70px] flex-col items-center justify-center rounded-xl border-2 p-2 text-center transition-all duration-200 active:scale-95 ${
                          isSelected
                            ? categorySelectedColors[cat.id]
                            : `${categoryBgColors[cat.id]} border-transparent opacity-50 hover:opacity-75`
                        } `}
                      >
                        <span className="mb-0.5 text-xl">{cat.emoji}</span>
                        <span
                          className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-white/80'}`}
                        >
                          {cat.name}
                        </span>
                        <span
                          className={`mt-0.5 text-[8px] leading-tight ${isSelected ? 'text-white/70' : 'text-white/50'}`}
                        >
                          {cat.desc}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </LobbySection>

        {/* Section 4: Difficulté */}
        <LobbySection
          icon="⚡"
          title="Difficulté"
          helpText={TEXTS.lobby.help.difficulty}
        >
          <div className="space-y-3">
            {/* 3 niveaux fixes */}
            <div className="grid grid-cols-3 gap-1.5">
              {difficulties
                .filter((d) => !d.special)
                .map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`rounded-lg p-1.5 text-center transition-all duration-200 ${
                      selectedDifficulty === diff.id
                        ? `${colorClasses[diff.color]} border-2 ${glowColors[diff.color]}`
                        : `${colorClasses[diff.color].replace('/50', '/5')} border border-${diff.color}-500/10 opacity-40`
                    } `}
                  >
                    <span className="mb-0.5 block text-lg">{diff.emoji}</span>
                    <span className="block text-[10px] leading-tight font-medium text-white">
                      {diff.name}
                    </span>
                  </button>
                ))}
            </div>

            {/* Séparateur */}
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="text-xs text-white/30">ou</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            {/* Mode progressif */}
            <button
              onClick={() => setSelectedDifficulty('progressif')}
              className={`w-full rounded-lg p-2.5 transition-all duration-200 ${
                selectedDifficulty === 'progressif'
                  ? 'border-2 border-purple-500 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                  : 'glass border border-white/10 hover:border-white/20'
              } `}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">📈</span>
                <div className="text-left">
                  <span className="block font-semibold text-white">
                    Chaos Progressif
                  </span>
                  <span className="text-xs text-white/50">
                    Commence gentil, finit chaotique
                  </span>
                </div>
              </div>
            </button>
          </div>
        </LobbySection>
      </main>

      {/* Section Lancement */}
      <div className="px-4 pt-3 pb-8">
        {/* Message de validation catégories */}
        <div className="mb-3 text-center">
          {selectedCategories.length < 3 ? (
            <p className="flex items-center justify-center gap-2 text-sm text-amber-400">
              <span>⚠️</span>
              <span>
                Sélectionne au moins 3 catégories ({selectedCategories.length}
                /3)
              </span>
            </p>
          ) : (
            <p className="flex items-center justify-center gap-2 text-sm text-green-400">
              <span>✓</span>
              <span>{selectedCategories.length} catégories sélectionnées</span>
            </p>
          )}
        </div>

        <button
          onClick={startGame}
          disabled={selectedCategories.length < 3 || playerCount === 0}
          className={`flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-5 py-3 text-base font-bold text-white transition-all duration-300 ${
            selectedCategories.length < 3 || playerCount === 0
              ? 'cursor-not-allowed opacity-50 grayscale'
              : 'glow-purple hover:scale-[1.02]'
          } `}
        >
          <span className="text-lg">🚀</span>
          <span>Démarrer la pire partie de votre vie</span>
        </button>

        {/* Message si pas assez de joueurs */}
        {playerCount === 0 && (
          <p className="mt-2 text-center text-xs text-red-400">
            Ajoute au moins un joueur pour commencer
          </p>
        )}
      </div>

      {/* Popup d'avertissement Échange */}
      {warningPopup === 'echange' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="glass-strong w-full max-w-sm rounded-2xl p-6">
            <div className="mb-4 text-center">
              <span className="text-4xl">⚠️</span>
              <h3 className="mt-2 text-xl font-bold text-white">Attention</h3>
            </div>

            <p className="mb-4 text-sm text-white/80">
              Cette catégorie peut inclure des gages impliquant :
            </p>

            <ul className="mb-6 space-y-2 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <span>•</span> Offrir des verres ou boissons
              </li>
              <li className="flex items-center gap-2">
                <span>•</span> Petits achats ou cadeaux
              </li>
              <li className="flex items-center gap-2">
                <span>•</span> Consommation d&apos;alcool
              </li>
            </ul>

            <p className="mb-6 text-center text-sm font-medium text-purple-300">
              Tu n&apos;es jamais obligé de dépenser si tu ne veux pas.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setWarningPopup(null)}
                className="glass-interactive flex-1 rounded-xl py-3 font-medium text-white"
              >
                Annuler
              </button>
              <button
                onClick={() => confirmCategory('echange')}
                className="flex-1 rounded-xl bg-purple-600 py-3 font-medium text-white transition-colors hover:bg-purple-500"
              >
                J&apos;ai compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup d'avertissement Karaoké */}
      {warningPopup === 'karaoke' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="glass-strong w-full max-w-sm rounded-2xl p-6">
            <div className="mb-4 text-center">
              <span className="text-4xl">🎤</span>
              <h3 className="mt-2 text-xl font-bold text-white">
                Lieu adapté requis
              </h3>
            </div>

            <p className="mb-4 text-sm text-white/80">
              Cette catégorie nécessite un environnement adapté :
            </p>

            <ul className="mb-6 space-y-2 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <span>•</span> Soirée karaoké
              </li>
              <li className="flex items-center gap-2">
                <span>•</span> Bar dansant
              </li>
              <li className="flex items-center gap-2">
                <span>•</span> Boîte de nuit
              </li>
            </ul>

            <p className="mb-6 text-center text-sm font-medium text-cyan-300">
              Les gages incluent du chant et de la danse.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setWarningPopup(null)}
                className="glass-interactive flex-1 rounded-xl py-3 font-medium text-white"
              >
                Annuler
              </button>
              <button
                onClick={() => confirmCategory('karaoke')}
                className="flex-1 rounded-xl bg-cyan-600 py-3 font-medium text-white transition-colors hover:bg-cyan-500"
              >
                J&apos;ai compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Créateur de Profil */}
      {showProfileCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <ProfileCreator
            initialData={playerToSave ? { name: playerToSave.name } : undefined}
            onSuccess={(profile) => {
              // Si on sauvegarde un joueur temporaire, le remplacer par le profil
              if (playerToSave) {
                removePlayer(playerToSave.id)
                addPlayerFromProfile(profile)
                setPlayerToSave(null)
              } else {
                // Sinon juste ajouter le profil
                addPlayerFromProfile(profile)
              }
              setShowProfileCreator(false)
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
