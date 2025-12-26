'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dare } from '@/lib/types'
import { DIFFICULTY_CONFIG } from '@/lib/constants/config'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DareCardProps {
  dare: Dare
  isVisible: boolean
  difficulty?: 1 | 2 | 3
}

// Mapping des noms de difficulté pour le dos de carte
const DIFFICULTY_DISPLAY = {
  1: {
    name: 'Chaos Gentil',
    icon: '⚡',
    gradient: 'from-cyan-500 to-teal-500',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    deckColor: '#0d9488', // teal-600 for deck edge
  },
  2: {
    name: 'Chaos Sauvage',
    icon: '⚡⚡',
    gradient: 'from-purple-500 to-pink-500',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    deckColor: '#9333ea', // purple-600 for deck edge
  },
  3: {
    name: 'Chaos Chaotique',
    icon: '💀',
    gradient: 'from-orange-500 to-red-500',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    deckColor: '#dc2626', // red-600 for deck edge
  },
} as const

// Nombre de couches pour l'effet d'épaisseur du deck
const DECK_LAYERS = 10

const DareCard = React.memo(
  ({ dare, isVisible, difficulty }: DareCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false)

    const currentDifficulty = (difficulty || dare.difficultyLevel || 1) as
      | 1
      | 2
      | 3
    const difficultyDisplay =
      DIFFICULTY_DISPLAY[currentDifficulty] || DIFFICULTY_DISPLAY[1]

    // Générer le box-shadow multiple pour l'effet d'épaisseur du deck
    const deckShadow = useMemo(() => {
      const layers = []
      for (let i = 1; i <= DECK_LAYERS; i++) {
        // Chaque couche décalée de 2px vers le bas et 1px vers la droite
        layers.push(`${i}px ${i * 2}px 0 0 ${difficultyDisplay.deckColor}`)
      }
      // Ajouter l'ombre portée finale pour la profondeur
      layers.push(
        `${DECK_LAYERS + 5}px ${DECK_LAYERS * 2 + 10}px 20px rgba(0, 0, 0, 0.4)`
      )
      return layers.join(', ')
    }, [difficultyDisplay.deckColor])

    useEffect(() => {
      const stored = localStorage.getItem('socialchaos-favorites')
      if (stored) {
        try {
          const favorites: Dare[] = JSON.parse(stored)
          setIsFavorite(favorites.some((d) => d.id === dare.id))
        } catch (e) {
          console.error('Failed to load favorites:', e)
        }
      }
    }, [dare.id])

    const toggleFavorite = () => {
      const stored = localStorage.getItem('socialchaos-favorites')
      let favorites: Dare[] = []

      if (stored) {
        try {
          favorites = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to load favorites:', e)
        }
      }

      if (isFavorite) {
        favorites = favorites.filter((d) => d.id !== dare.id)
      } else {
        favorites.push(dare)
      }

      localStorage.setItem('socialchaos-favorites', JSON.stringify(favorites))
      setIsFavorite(!isFavorite)

      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }

    return (
      <div
        className="relative mx-auto h-56 w-full max-w-[260px] min-[390px]:h-64 min-[390px]:max-w-xs min-[430px]:h-72 min-[430px]:max-w-sm"
        style={{ perspective: '1000px' }}
      >
        {/* Carte principale (celle qui flip) */}
        <motion.div
          className="relative h-full w-full"
          style={{
            transformStyle: 'preserve-3d',
            zIndex: 10,
          }}
          animate={{
            rotateY: isVisible ? 0 : 180,
            y: isVisible ? 0 : 0,
          }}
          transition={{
            duration: 0.6,
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
        >
          {/* Front (The Dare) - visible when isVisible=true */}
          <motion.div
            className={cn(
              'absolute inset-0 overflow-hidden rounded-2xl border-2 backdrop-blur-sm',
              currentDifficulty === 1 &&
                'border-cyan-500/60 bg-gradient-to-br from-cyan-900/50 via-teal-900/40 to-cyan-950/50',
              currentDifficulty === 2 &&
                'border-purple-500/60 bg-gradient-to-br from-purple-900/50 via-fuchsia-900/40 to-purple-950/50',
              currentDifficulty === 3 &&
                'border-orange-500/60 bg-gradient-to-br from-orange-900/50 via-red-900/40 to-orange-950/50'
            )}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              boxShadow: `0 0 30px ${difficultyDisplay.glowColor}`,
            }}
          >
            {/* Decorative inner border */}
            <div
              className={cn(
                'pointer-events-none absolute inset-2 rounded-xl border',
                currentDifficulty === 1 && 'border-cyan-400/20',
                currentDifficulty === 2 && 'border-purple-400/20',
                currentDifficulty === 3 && 'border-orange-400/20'
              )}
            />

            {/* Card front background image */}
            <div className="absolute inset-0 bg-[url('/card-front.png')] bg-cover bg-center" />

            {/* Diamond pattern background (subtle) */}
            <div className="absolute inset-0 opacity-5">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="diamonds-front"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#diamonds-front)" />
              </svg>
            </div>

            {/* Corner decorations (matching back) */}
            <div
              className={cn(
                'absolute top-3 left-3 text-sm font-bold',
                currentDifficulty === 1 && 'text-cyan-400/30',
                currentDifficulty === 2 && 'text-purple-400/30',
                currentDifficulty === 3 && 'text-orange-400/30'
              )}
            >
              ♠
            </div>
            <div
              className={cn(
                'absolute top-3 right-3 text-sm font-bold',
                currentDifficulty === 1 && 'text-cyan-400/30',
                currentDifficulty === 2 && 'text-purple-400/30',
                currentDifficulty === 3 && 'text-orange-400/30'
              )}
            >
              ♥
            </div>

            {/* Header: Category + Favorite */}
            <div className="relative z-10 flex items-center justify-between px-4 pt-4">
              <Badge
                className={cn(
                  'border text-[10px] font-bold tracking-wider uppercase',
                  currentDifficulty === 1 &&
                    'border-cyan-400/50 bg-cyan-500/20 text-cyan-300',
                  currentDifficulty === 2 &&
                    'border-purple-400/50 bg-purple-500/20 text-purple-300',
                  currentDifficulty === 3 &&
                    'border-orange-400/50 bg-orange-500/20 text-orange-300'
                )}
              >
                {dare.categoryTags[0] || 'Défi'}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className={cn(
                  'h-8 w-8 rounded-full transition-all hover:scale-110',
                  currentDifficulty === 1 && 'hover:bg-cyan-500/20',
                  currentDifficulty === 2 && 'hover:bg-purple-500/20',
                  currentDifficulty === 3 && 'hover:bg-orange-500/20'
                )}
              >
                <Heart
                  className={cn(
                    'h-5 w-5 transition-all',
                    isFavorite
                      ? 'scale-110 fill-red-500 text-red-500'
                      : 'text-white/60'
                  )}
                />
              </Button>
            </div>

            {/* Content: Dare text */}
            <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-4">
              <p className="text-center text-lg leading-tight font-black text-white drop-shadow-lg min-[390px]:text-xl min-[430px]:text-2xl">
                {dare.content}
              </p>
            </div>

            {/* Footer: Difficulty badge */}
            <div className="relative z-10 flex justify-center pb-4">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-sm',
                  currentDifficulty === 1 &&
                    'border-cyan-400/40 bg-cyan-500/20',
                  currentDifficulty === 2 &&
                    'border-purple-400/40 bg-purple-500/20',
                  currentDifficulty === 3 &&
                    'border-orange-400/40 bg-orange-500/20'
                )}
              >
                <span className="text-base">{difficultyDisplay.icon}</span>
                <span
                  className={cn(
                    'text-[10px] font-bold tracking-wider uppercase',
                    currentDifficulty === 1 && 'text-cyan-300',
                    currentDifficulty === 2 && 'text-purple-300',
                    currentDifficulty === 3 && 'text-orange-300'
                  )}
                >
                  {difficultyDisplay.name}
                </span>
              </div>
            </div>

            {/* Bottom corner decorations */}
            <div
              className={cn(
                'absolute bottom-3 left-3 rotate-180 text-sm font-bold',
                currentDifficulty === 1 && 'text-cyan-400/30',
                currentDifficulty === 2 && 'text-purple-400/30',
                currentDifficulty === 3 && 'text-orange-400/30'
              )}
            >
              ♦
            </div>
            <div
              className={cn(
                'absolute right-3 bottom-3 rotate-180 text-sm font-bold',
                currentDifficulty === 1 && 'text-cyan-400/30',
                currentDifficulty === 2 && 'text-purple-400/30',
                currentDifficulty === 3 && 'text-orange-400/30'
              )}
            >
              ♣
            </div>
          </motion.div>

          {/* Back (Card Back Design) - visible when isVisible=false */}
          <AnimatePresence>
            <motion.div
              className={cn(
                'absolute inset-0 overflow-hidden rounded-2xl',
                `bg-gradient-to-br ${difficultyDisplay.gradient}`
              )}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              animate={{
                boxShadow: isVisible
                  ? `0 0 30px ${difficultyDisplay.glowColor}`
                  : `0 0 30px ${difficultyDisplay.glowColor}, ${deckShadow}`,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Decorative border */}
              <div className="pointer-events-none absolute inset-2 rounded-xl border-2 border-white/30" />

              {/* Card back background image */}
              <div className="absolute inset-0 bg-[url('/card-back.png')] bg-cover bg-center opacity-50 mix-blend-overlay" />

              {/* Diamond pattern background */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  className="h-full w-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="diamonds"
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#diamonds)" />
                </svg>
              </div>

              {/* Centered content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Logo */}
                <div className="mb-3 text-center">
                  <p className="text-3xl font-black tracking-tight text-white drop-shadow-lg">
                    SOCIAL
                  </p>
                  <p className="text-3xl font-black tracking-tight text-white drop-shadow-lg">
                    CHAOS
                  </p>
                </div>

                {/* Difficulty icon */}
                <div className="mb-3 text-4xl drop-shadow-lg">
                  {difficultyDisplay.icon}
                </div>

                {/* Difficulty name badge */}
                <div className="rounded-full bg-black/30 px-4 py-1.5 backdrop-blur-sm">
                  <p className="text-xs font-bold tracking-wider text-white uppercase">
                    {difficultyDisplay.name}
                  </p>
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-3 left-3 text-lg font-bold text-white/40">
                ♠
              </div>
              <div className="absolute top-3 right-3 text-lg font-bold text-white/40">
                ♥
              </div>
              <div className="absolute bottom-3 left-3 rotate-180 text-lg font-bold text-white/40">
                ♦
              </div>
              <div className="absolute right-3 bottom-3 rotate-180 text-lg font-bold text-white/40">
                ♣
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    )
  }
)

DareCard.displayName = 'DareCard'
export default DareCard
