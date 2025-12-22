/**
 * Page principale des Missions Quotidiennes
 *
 * Affiche:
 * - La mission du jour (si jour actif)
 * - Calendrier historique en bas
 * - Stats
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Settings, Calendar, Flame } from 'lucide-react'
import { toast } from 'sonner'

import {
  MissionCard,
  MissionCalendar,
  SuccessConfetti,
} from '@/components/daily-missions'
import {
  useDailyMissionStore,
  useDailyMissionConfig,
  useTodayMission,
  useDailyMissionHistory,
} from '@/lib/store/useDailyMissionStore'
import { getCategoryById, DAYS_OF_WEEK } from '@/lib/constants/dailyMissions'

export default function DailyMissionsPage() {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)

  // Store
  const config = useDailyMissionConfig()
  const todayMission = useTodayMission()
  const history = useDailyMissionHistory()
  const isTodayActive = useDailyMissionStore((s) => s.isTodayActive)
  const generateTodayMission = useDailyMissionStore(
    (s) => s.generateTodayMission
  )
  const completeMission = useDailyMissionStore((s) => s.completeMission)
  const skipMission = useDailyMissionStore((s) => s.skipMission)
  const getStats = useDailyMissionStore((s) => s.getStats)

  const stats = getStats()
  const category = config.categoryId ? getCategoryById(config.categoryId) : null

  // Redirect to setup if not configured
  useEffect(() => {
    if (!config.isActive || !config.categoryId) {
      router.replace('/daily-missions/setup')
    }
  }, [config.isActive, config.categoryId, router])

  // Generate today's mission on mount
  useEffect(() => {
    if (config.isActive && config.categoryId && isTodayActive()) {
      generateTodayMission()
    }
  }, [config.isActive, config.categoryId, isTodayActive, generateTodayMission])

  const handleComplete = () => {
    completeMission()
    setShowConfetti(true)
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100])
  }

  const handleSkip = () => {
    skipMission()
    toast.info('Mission passée. Ce sera pour la prochaine fois !')
  }

  // Loading state
  if (!config.isActive || !config.categoryId) {
    return null
  }

  // Get today's day name
  const today = new Date().getDay()
  const todayName = DAYS_OF_WEEK.find((d) => d.id === today)?.name || ''
  const isActiveToday = isTodayActive()

  // Get next active day
  const getNextActiveDay = () => {
    const today = new Date().getDay()
    for (let i = 1; i <= 7; i++) {
      const nextDay = (today + i) % 7
      if (config.activeDays.includes(nextDay)) {
        return DAYS_OF_WEEK.find((d) => d.id === nextDay)?.name || ''
      }
    }
    return ''
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 flex items-center gap-4 px-4 py-4">
        <button
          onClick={() => router.push('/')}
          className="rounded-full p-2 transition-colors hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Mission Quotidienne</h1>
          <p className="text-sm text-white/50">{todayName}</p>
        </div>
        <button
          onClick={() => router.push('/daily-missions/setup')}
          className="rounded-full p-2 transition-colors hover:bg-white/10"
          title="Paramètres"
        >
          <Settings className="h-5 w-5 text-white/60" />
        </button>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col gap-6 p-4">
        {isActiveToday && todayMission ? (
          // Show today's mission
          <MissionCard
            mission={todayMission}
            onComplete={handleComplete}
            onSkip={handleSkip}
            streak={stats.currentStreak}
          />
        ) : isActiveToday && !todayMission ? (
          // Loading / generating
          <div className="flex flex-1 items-center justify-center">
            <p className="text-white/50">Chargement de ta mission...</p>
          </div>
        ) : (
          // Not an active day
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/5">
              <Calendar className="h-12 w-12 text-white/30" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Pas de mission aujourd&apos;hui
            </h2>
            <p className="mt-2 text-white/50">
              Prochaine mission : {getNextActiveDay()}
            </p>
            <p className="mt-4 text-sm text-white/30">
              Profite de cette journée de repos ! 😌
            </p>
          </motion.div>
        )}

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4"
        >
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-white">
                {stats.completedMissions}
              </p>
              <p className="text-xs text-white/50">Accomplies</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <p className="text-2xl font-bold text-white">
                  {stats.currentStreak}
                </p>
              </div>
              <p className="text-xs text-white/50">Streak</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">
                {stats.completionRate}%
              </p>
              <p className="text-xs text-white/50">Réussite</p>
            </div>
          </div>
        </motion.div>

        {/* Category indicator */}
        {category && (
          <div className="text-center">
            <p className="text-sm text-white/40">
              Mode actuel : {category.emoji} {category.name}
            </p>
          </div>
        )}

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-3 text-sm font-semibold text-white/60">
            📅 Historique
          </h3>
          <MissionCalendar history={history} activeDays={config.activeDays} />
        </motion.div>
      </main>

      {/* Success Confetti Popup */}
      <SuccessConfetti
        isOpen={showConfetti}
        onClose={() => setShowConfetti(false)}
        streak={stats.currentStreak}
      />
    </div>
  )
}
