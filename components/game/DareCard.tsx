'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
                setIsFavorite(favorites.some(d => d.id === dare.id))
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
            favorites = favorites.filter(d => d.id !== dare.id)
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
        <div className="perspective-1000 w-full max-w-sm mx-auto h-96">
            <motion.div
                className="relative w-full h-full preserve-3d"
                animate={{ rotateY: isVisible ? 0 : 180 }}
                transition={{ duration: 0.6, type: 'spring' }}
            >
                {/* Front (The Dare) */}
                <Card className="absolute inset-0 backface-hidden flex flex-col justify-between border-primary/50 bg-card/90 backdrop-blur shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <Badge variant="outline" className="border-primary text-primary">
                                {DIFFICULTY_CONFIG[dare.difficultyLevel].name}
                            </Badge>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleFavorite}
                                className="h-8 w-8 hover:scale-110 transition-transform"
                            >
                                <Heart
                                    className={`h-5 w-5 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                                />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center text-center p-6">
                        <p className="text-2xl md:text-3xl font-black leading-tight text-foreground">
                            {dare.content}
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-2 pb-6">
                        {dare.categoryTags.map(tag => (
                            <Badge key={tag} variant="secondary" className="opacity-70 text-[10px]">
                                {tag}
                            </Badge>
                        ))}
                    </CardFooter>
                </Card>

                {/* Back (Hidden) */}
                <Card className={cn(
                    "absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-black border-2 shadow-[0_0_20px_currentColor]",
                    `border-[${DIFFICULTY_CONFIG[dare.difficultyLevel].color}] text-[${DIFFICULTY_CONFIG[dare.difficultyLevel].color}]`
                )}
                    style={{
                        borderColor: DIFFICULTY_CONFIG[dare.difficultyLevel].color,
                        color: DIFFICULTY_CONFIG[dare.difficultyLevel].color
                    }}
                >
                    <CardContent className="text-center space-y-4">
                        <div className="text-4xl font-black tracking-tighter leading-none">
                            SOCIAL<br />CHAOS
                        </div>
                        <div className="text-xl font-bold text-white uppercase tracking-widest bg-white/10 px-4 py-1 rounded">
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
