'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookHeart, Trash2 } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import GlassCard from '@/components/ui/GlassCard'
import PrimaryButton from '@/components/ui/PrimaryButton'
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
    <>
      <PageHeader title="Bibliothèque" />

      <main className="px-4 pt-20 pb-8">
        {favorites.length === 0 ? (
          // État vide
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="glass mb-6 flex h-20 w-20 items-center justify-center rounded-full">
              <BookHeart className="h-10 w-10 text-cyan-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">Aucun favori</h2>
            <p className="mb-6 max-w-md text-white/60">
              Pendant une partie, likez des gages pour les retrouver ici.
            </p>
            <PrimaryButton onClick={() => router.push('/')}>
              Retour à l'accueil
            </PrimaryButton>
          </div>
        ) : (
          // Liste des favoris
          <div className="grid gap-4 md:grid-cols-2">
            {favorites.map((dare) => (
              <GlassCard key={dare.id} className="p-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-300">
                    Niveau {dare.difficultyLevel}
                  </span>
                  <button
                    onClick={() => removeFavorite(dare.id)}
                    className="rounded-full p-2 text-red-400 transition-colors hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <p className="mb-3 text-base leading-tight font-bold text-white">
                  {dare.content}
                </p>

                <div className="flex flex-wrap gap-1">
                  {dare.categoryTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
