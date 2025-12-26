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
          <Card
            className="border-primary/50 bg-card/95 absolute inset-0 flex flex-col justify-between shadow-[0_0_30px_rgba(168,85,247,0.2)] backdrop-blur-sm"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="border-primary text-primary text-xs"
                >
                  {DIFFICULTY_CONFIG[dare.difficultyLevel]?.name ||
                    difficultyDisplay.name}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFavorite}
                  className="h-7 w-7 transition-transform hover:scale-110"
                >
                  <Heart
                    className={`h-4 w-4 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center p-4 text-center">
              <p className="text-foreground text-xl leading-tight font-black md:text-2xl">
                {dare.content}
              </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-1.5 pb-4">
              {dare.categoryTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[9px] opacity-70"
                >
                  {tag}
                </Badge>
              ))}
            </CardFooter>
          </Card>

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
