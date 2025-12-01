'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Heart, Trash2, BookHeart } from 'lucide-react'
import { Dare } from '@/lib/types'

export default function LibraryPage() {
    const router = useRouter()
    const [favorites, setFavorites] = useState<Dare[]>([])

    useEffect(() => {
        // Load favorites from localStorage
        const stored = localStorage.getItem('socialchaos-favorites')
        if (stored) {
            try {
                setFavorites(JSON.parse(stored))
            } catch (e) {
                console.error('Failed to load favorites:', e)
            }
        }
    }, [])

    const removeFavorite = (dareId: string) => {
        const updated = favorites.filter(d => d.id !== dareId)
        setFavorites(updated)
        localStorage.setItem('socialchaos-favorites', JSON.stringify(updated))
    }

    return (
        <div className="min-h-screen p-4 pb-24 bg-background">
            <header className="mb-8 flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/')}
                    className="text-primary hover:text-primary/80"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary flex items-center gap-2">
                        <BookHeart className="h-8 w-8 text-primary" />
                        BIBLIOTHÈQUE
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Vos gages favoris sauvegardés
                    </p>
                </div>
            </header>

            {favorites.length === 0 ? (
                <Card className="bg-card/50 border-primary/20 p-12">
                    <div className="text-center space-y-4">
                        <Heart className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                        <h2 className="text-xl font-bold text-muted-foreground">
                            Aucun favori pour le moment
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Pendant une partie, cliquez sur le cœur sur les cartes de gage pour les ajouter à votre bibliothèque.
                        </p>
                        <Button
                            onClick={() => router.push('/')}
                            className="mt-4"
                        >
                            Retour à l'accueil
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((dare) => (
                        <Card
                            key={dare.id}
                            className="bg-card/50 border-primary/20 relative group hover:border-primary/50 transition-all"
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <Badge variant="outline" className="border-primary text-primary">
                                        Niveau {dare.difficultyLevel}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFavorite(dare.id)}
                                        className="h-8 w-8 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-bold leading-tight mb-4">
                                    {dare.content}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {dare.categoryTags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-[10px]">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
