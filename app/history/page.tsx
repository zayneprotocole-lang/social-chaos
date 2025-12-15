'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { HistoryCard } from '@/components/history/HistoryCard'
import { useGameHistory } from '@/lib/queries/historyQueries'
import HistorySkeleton from '@/components/history/HistorySkeleton'

export default function HistoryPage() {
  const { data: history, isLoading } = useGameHistory()

  // Task 7.3: Instant Shell Interface - Show skeleton while loading
  if (isLoading) {
    return <HistorySkeleton />
  }

  // Task 7.3: Smooth Transition Animation - Fade in content
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-background min-h-screen space-y-6 p-4 pb-24"
    >
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
            <p>Aucune partie termin├®e pour le moment.</p>
          </div>
        ) : (
          history.map((game) => <HistoryCard key={game.id} game={game} />)
        )}
      </div>
    </motion.div>
  )
}
