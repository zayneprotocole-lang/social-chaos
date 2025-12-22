/**
 * Page d'historique des Missions Quotidiennes
 */

'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, X, Calendar } from 'lucide-react'

import { useDailyMissionHistory } from '@/lib/store/useDailyMissionStore'
import { getCategoryById } from '@/lib/constants/dailyMissions'

export default function DailyMissionsHistoryPage() {
  const router = useRouter()
  const history = useDailyMissionHistory()

  // Sort by date descending
  const sortedHistory = [...history]
    .filter((h) => h.status !== 'pending')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateStr === today.toISOString().split('T')[0]) {
      return "Aujourd'hui"
    }
    if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Hier'
    }

    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 flex items-center gap-4 px-4 py-4">
        <button
          onClick={() => router.back()}
          className="rounded-full p-2 transition-colors hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Historique</h1>
          <p className="text-sm text-white/50">
            {sortedHistory.length} mission{sortedHistory.length > 1 ? 's' : ''}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        {sortedHistory.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
              <Calendar className="h-10 w-10 text-white/30" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Pas encore d&apos;historique
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Tes missions accomplies apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedHistory.map((entry, index) => {
              const category = getCategoryById(entry.mission.categoryId)
              const isCompleted = entry.status === 'completed'

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass rounded-xl border-l-4 p-4 ${
                    isCompleted ? 'border-l-emerald-500' : 'border-l-rose-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Status icon */}
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                        isCompleted ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <X className="h-5 w-5 text-rose-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">
                        {entry.mission.content}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs">{category?.emoji}</span>
                        <span className="text-xs text-white/40">
                          {formatDate(entry.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
