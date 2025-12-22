'use client'

import { History, Play } from 'lucide-react'
import Link from 'next/link'
import PageHeader from '@/components/ui/PageHeader'
import GlassCard from '@/components/ui/GlassCard'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { useGameHistory } from '@/lib/queries/historyQueries'
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function HistoryPage() {
  const { data: history, isLoading } = useGameHistory()

  if (isLoading) {
    return (
      <>
        <PageHeader title="Historique" />
        <main className="px-4 pt-20 pb-8">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <GlassCard key={i} className="animate-pulse p-4">
                <div className="mb-3 h-4 w-1/2 rounded bg-white/10"></div>
                <div className="h-3 w-3/4 rounded bg-white/10"></div>
              </GlassCard>
            ))}
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Historique" />

      <main className="px-4 pt-20 pb-8">
        {!history || history.length === 0 ? (
          // État vide
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="glass mb-6 flex h-20 w-20 items-center justify-center rounded-full">
              <History className="h-10 w-10 text-pink-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">
              Aucune partie jouée
            </h2>
            <p className="mb-6 text-white/60">Lancez votre première partie !</p>
            <Link href="/">
              <PrimaryButton icon={<Play className="h-5 w-5" />}>
                Nouvelle partie
              </PrimaryButton>
            </Link>
          </div>
        ) : (
          // Liste des parties
          <div className="space-y-4">
            {history.map((game) => {
              const totalPlayers =
                1 + (game.otherPlayers?.length || 0) + (game.loser ? 1 : 0)

              return (
                <GlassCard key={game.id} className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="text-sm text-white/60">
                      {formatDistance(game.playedAt, new Date(), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </div>
                    <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-300">
                      Niveau {game.difficulty}
                    </span>
                  </div>

                  <div className="mb-4 flex items-center gap-4 text-sm text-white/80">
                    <span>⏱ {game.totalRounds} Tours</span>
                    <span>👥 {totalPlayers} Joueurs</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-400">
                      <span>👑</span>
                      <span className="font-medium">LE GOAT</span>
                      <span className="text-white/60">
                        - {game.winner.name}
                      </span>
                      <span className="text-xs text-white/40">
                        ({game.winner.score} pts)
                      </span>
                    </div>
                    {game.loser && (
                      <div className="flex items-center gap-2 text-red-400">
                        <span>🐐</span>
                        <span className="font-medium">LA CHÈVRE</span>
                        <span className="text-white/60">
                          - {game.loser.name}
                        </span>
                        <span className="text-xs text-white/40">
                          ({game.loser.score} pts)
                        </span>
                      </div>
                    )}
                  </div>
                </GlassCard>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
