'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
}

const DareCard = React.memo(({ dare, isVisible }: DareCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    // Check if this dare is favorited
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
      // Remove from favorites
      favorites = favorites.filter((d) => d.id !== dare.id)
    } else {
      // Add to favorites
      favorites.push(dare)
    }

    localStorage.setItem('socialchaos-favorites', JSON.stringify(favorites))
    setIsFavorite(!isFavorite)

    // Vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  return (
    <div className="perspective-1000 mx-auto h-96 w-full max-w-sm">
      <motion.div
        className="preserve-3d relative h-full w-full"
        animate={{ rotateY: isVisible ? 0 : 180 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Front (The Dare) */}
        <Card className="border-primary/50 bg-card/90 absolute inset-0 flex flex-col justify-between shadow-[0_0_30px_rgba(168,85,247,0.2)] backdrop-blur backface-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-primary text-primary">
                {DIFFICULTY_CONFIG[dare.difficultyLevel].name}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className="h-8 w-8 transition-transform hover:scale-110"
              >
                <Heart
                  className={`h-5 w-5 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6 text-center">
            <p className="text-foreground text-2xl leading-tight font-black md:text-3xl">
              {dare.content}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-2 pb-6">
            {dare.categoryTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] opacity-70"
              >
                {tag}
              </Badge>
            ))}
          </CardFooter>
        </Card>

        {/* Back (Hidden) */}
        <Card
          className={cn(
            'absolute inset-0 flex rotate-y-180 flex-col items-center justify-center border-2 bg-black shadow-[0_0_20px_currentColor] backface-hidden',
            `border-[${DIFFICULTY_CONFIG[dare.difficultyLevel].color}] text-[${DIFFICULTY_CONFIG[dare.difficultyLevel].color}]`
          )}
          style={{
            borderColor: DIFFICULTY_CONFIG[dare.difficultyLevel].color,
            color: DIFFICULTY_CONFIG[dare.difficultyLevel].color,
          }}
        >
          <CardContent className="space-y-4 text-center">
            <div className="text-4xl leading-none font-black tracking-tighter">
              SOCIAL
              <br />
              CHAOS
            </div>
            <div className="rounded bg-white/10 px-4 py-1 text-xl font-bold tracking-widest text-white uppercase">
              {DIFFICULTY_CONFIG[dare.difficultyLevel].name.toUpperCase()}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
})

DareCard.displayName = 'DareCard'
export default DareCard
