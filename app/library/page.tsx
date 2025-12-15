'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
    const updated = favorites.filter((d) => d.id !== dareId)
    setFavorites(updated)
    localStorage.setItem('socialchaos-favorites', JSON.stringify(updated))
  }

  return (
    <div className="bg-background min-h-screen p-4 pb-24">
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
          <h1 className="from-primary to-secondary flex items-center gap-2 bg-gradient-to-r bg-clip-text text-3xl font-black text-transparent">
            <BookHeart className="text-primary h-8 w-8" />
            BIBLIOTHÈQUE
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Vos gages favoris sauvegardés
          </p>
        </div>
      </header>

      {favorites.length === 0 ? (
        <Card className="bg-card/50 border-primary/20 p-12">
          <div className="space-y-4 text-center">
            <Heart className="text-muted-foreground mx-auto h-16 w-16 opacity-50" />
            <h2 className="text-muted-foreground text-xl font-bold">
              Aucun favori pour le moment
            </h2>
            <p className="text-muted-foreground mx-auto max-w-md text-sm">
              Pendant une partie, cliquez sur le cœur sur les cartes de gage
              pour les ajouter à votre bibliothèque.
            </p>
            <Button onClick={() => router.push('/')} className="mt-4">
              Retour à l&apos;accueil
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((dare) => (
            <Card
              key={dare.id}
              className="bg-card/50 border-primary/20 group hover:border-primary/50 relative transition-all"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="border-primary text-primary"
                  >
                    Niveau {dare.difficultyLevel}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFavorite(dare.id)}
                    className="text-destructive hover:bg-destructive/10 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-lg leading-tight font-bold">
                  {dare.content}
                </p>
                <div className="flex flex-wrap gap-1">
                  {dare.categoryTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px]"
                    >
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
