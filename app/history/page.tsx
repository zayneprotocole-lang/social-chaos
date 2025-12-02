'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { HistoryCard } from '@/components/history/HistoryCard'
import { useGameHistory } from '@/lib/queries/historyQueries'

export default function HistoryPage() {
  const { data: history, isLoading } = useGameHistory()

  if (isLoading) {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen space-y-6 p-4 pb-24">
      <header className="mb-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-3xl font-black text-transparent">
          HISTORIQUE
        </h1>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!history || history.length === 0 ? (
          <div className="text-muted-foreground col-span-full py-12 text-center">
            <p>Aucune partie terminée pour le moment.</p>
          </div>
        ) : (
          history.map((game) => <HistoryCard key={game.id} game={game} />)
        )}
      </div>
    </div>
  )
}
