'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Play, Trash2, Clock, Users, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSavedGameStore } from '@/lib/store/useSavedGameStore'

// Simple relative time function (no date-fns dependency)
function getRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'à l\'instant'
    if (diffMins < 60) return `il y a ${diffMins} min`
    if (diffHours < 24) return `il y a ${diffHours}h`
    if (diffDays === 1) return 'hier'
    if (diffDays < 7) return `il y a ${diffDays} jours`
    return 'il y a plus d\'une semaine'
}

interface SavedGameCardProps {
    onResume: () => void
    onDelete: () => void
}

export function SavedGameCard({ onResume, onDelete }: SavedGameCardProps) {
    const savedGame = useSavedGameStore(s => s.savedGame)

    const timeAgo = useMemo(() => {
        if (!savedGame) return ''
        try {
            const date = new Date(savedGame.savedAt)
            return getRelativeTime(date)
        } catch {
            return 'récemment'
        }
    }, [savedGame])


    if (!savedGame) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
            <Card className="relative overflow-hidden border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-card to-secondary/10 shadow-xl shadow-primary/10">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

                <CardContent className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Play className="size-4 text-primary" />
                            </div>
                            <span className="font-bold text-foreground">Partie en cours</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            <span>Sauvegardé {timeAgo}</span>
                        </div>
                    </div>

                    {/* Players */}
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="size-4 text-muted-foreground" />
                        <span className="text-foreground/90 truncate">
                            {savedGame.preview.playerNames.join(', ')}
                        </span>
                    </div>

                    {/* Turn info */}
                    <div className="flex items-center gap-2 text-sm">
                        <Target className="size-4 text-muted-foreground" />
                        <span className="text-foreground/90">
                            {savedGame.preview.turnInfo} · {savedGame.preview.currentPlayerName}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={onResume}
                            className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/30"
                        >
                            <Play className="size-4" />
                            Reprendre
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onDelete}
                            className="text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10"
                            title="Supprimer la sauvegarde"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
