'use client'

import {
  User,
  BookHeart,
  History,
  Building2,
  Home,
  CalendarCheck,
  Lock,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/navigation/Header'
import { dataAccess } from '@/lib/services/dataAccess'
import { GAME_CONFIG } from '@/lib/constants/config'
import { useInitUser } from '@/hooks'

type CardColor = 'purple' | 'cyan' | 'pink'

const quickAccessCards: Array<{
  icon: typeof User
  label: string
  description: string
  href: string
  color: CardColor
}> = [
  {
    icon: User,
    label: 'Profils',
    description: 'Gérer les joueurs',
    href: '/profiles',
    color: 'purple',
  },
  {
    icon: BookHeart,
    label: 'Bibliothèque',
    description: 'Vos favoris',
    href: '/library',
    color: 'cyan',
  },
  {
    icon: History,
    label: 'Historique',
    description: 'Parties jouées',
    href: '/history',
    color: 'pink',
  },
]

const colorClasses: Record<CardColor, string> = {
  purple: 'text-purple-400 group-hover:text-purple-300',
  cyan: 'text-cyan-400 group-hover:text-cyan-300',
  pink: 'text-pink-400 group-hover:text-pink-300',
}

const glowClasses: Record<CardColor, string> = {
  purple: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
  cyan: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]',
  pink: 'group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]',
}

const lockedModes = [
  {
    icon: Home,
    label: 'Maison',
    description: 'Entre amis, gênant et spicy',
  },
  {
    icon: CalendarCheck,
    label: 'Mission',
    description: 'Un défi social par jour',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  // Initialize user data after login
  useInitUser()

  const createRoom = async () => {
    setIsCreating(true)
    try {
      // Check if user is authenticated
      const { getAuth } = await import('firebase/auth')
      const auth = getAuth()
      const currentUser = auth.currentUser

      if (!currentUser) {
        alert(
          'Vous devez être connecté pour créer une partie.\nRedirection vers la page de connexion...'
        )
        router.push('/auth')
        setIsCreating(false)
        return
      }

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

      // Better error messages
      if (error instanceof Error) {
        if (error.message.includes('authenticated')) {
          alert(
            'Vous devez être connecté pour créer une partie.\nRedirection vers la page de connexion...'
          )
          router.push('/auth')
        } else if (error.message.includes('permission')) {
          alert(
            'Erreur de permissions Firestore.\nVeuillez réessayer ou contacter le support.'
          )
        } else {
          alert(`Erreur lors de la création de la partie:\n${error.message}`)
        }
      } else {
        alert('Erreur inconnue lors de la création de la partie.')
      }

      setIsCreating(false)
    }
  }
  return (
    <>
      <Header />

      <main className="flex min-h-screen flex-col px-4 pt-28 pb-8">
        {/* Logo Titre */}
        <div className="mb-8 text-center">
          {/* Titre sur deux lignes */}
          <h1 className="mb-4 leading-none font-black tracking-tighter">
            <span
              className="block text-6xl text-cyan-400 sm:text-7xl"
              style={{
                textShadow:
                  '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(6, 182, 212, 0.3)',
              }}
            >
              SOCIAL
            </span>
            <span
              className="block text-6xl text-purple-400 sm:text-7xl"
              style={{
                textShadow:
                  '0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)',
              }}
            >
              CHAOS
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-2 text-lg text-white/60">
            Le jeu qui détruit votre dignité.
          </p>
        </div>

        {/* Mode principal - JOUER EN EXTÉRIEUR */}
        <div className="mb-3">
          <button
            onClick={createRoom}
            disabled={isCreating}
            className="glow-purple flex w-full flex-col items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] px-6 py-5 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-right hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6" />
              <span>{isCreating ? 'Création...' : 'JOUER EN EXTÉRIEUR'}</span>
            </div>
            <span className="text-sm font-normal text-white/70">
              Gages sociaux avec des inconnus
            </span>
          </button>
        </div>

        {/* Modes verrouillés */}
        <div className="mb-4 space-y-2">
          {lockedModes.map((mode, idx) => (
            <button
              key={idx}
              onClick={() => alert('Bientôt disponible !')}
              className="glass relative flex w-full flex-col items-center justify-center gap-1 rounded-2xl px-6 py-5 opacity-50 transition-all duration-300"
            >
              {/* Cadenas */}
              <div className="absolute top-3 right-3">
                <Lock className="h-5 w-5 text-white/40" />
              </div>

              {/* Contenu */}
              <div className="flex items-center gap-3">
                <mode.icon className="h-6 w-6 text-white/60" />
                <span className="text-lg font-bold text-white/70">
                  {mode.label.toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-normal text-white/40">
                {mode.description}
              </span>
            </button>
          ))}
        </div>

        {/* Séparateur */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10"></div>
          <span className="text-xs tracking-wider text-white/30 uppercase">
            Accès rapide
          </span>
          <div className="h-px flex-1 bg-white/10"></div>
        </div>

        {/* Bouton Premium (Mis en avant) */}

        {/* 3 Cartes d'accès rapide */}
        <div className="grid grid-cols-3 gap-3">
          {quickAccessCards.map((card) => (
            <Link key={card.href} href={card.href}>
              <div
                className={`glass-interactive group h-full rounded-2xl p-4 text-center ${glowClasses[card.color]} `}
              >
                {/* Icône */}
                <div
                  className={`mb-2 text-3xl transition-all duration-300 group-hover:scale-110 ${colorClasses[card.color]} `}
                >
                  <card.icon className="mx-auto h-8 w-8" />
                </div>

                {/* Label */}
                <div className="text-sm font-semibold text-white">
                  {card.label}
                </div>

                {/* Description */}
                <div className="mt-1 text-xs text-white/40">
                  {card.description}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Spacer pour pousser le contenu vers le haut */}
        <div className="flex-1" />
      </main>
    </>
  )
}
