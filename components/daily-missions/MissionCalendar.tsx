/**
 * MissionCalendar - Calendrier visuel des missions
 * Cliquable pour voir les détails de chaque mission
 */

'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, X, Lightbulb } from 'lucide-react'
import { getCategoryById } from '@/lib/constants/dailyMissions'
import type { MissionHistoryEntry } from '@/lib/types/dailyMission'

interface MissionCalendarProps {
  history: MissionHistoryEntry[]
  activeDays: number[]
}

const DAYS_SHORT = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]

export default function MissionCalendar({
  history,
  activeDays,
}: MissionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedMission, setSelectedMission] =
    useState<MissionHistoryEntry | null>(null)

  const { weeks, month, year } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of month
    const firstDay = new Date(year, month, 1)
    const startingDay = firstDay.getDay()

    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Build weeks array
    const weeks: (number | null)[][] = []
    let currentWeek: (number | null)[] = []

    // Fill empty days at start
    for (let i = 0; i < startingDay; i++) {
      currentWeek.push(null)
    }

    // Fill days
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }

    // Fill remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null)
      }
      weeks.push(currentWeek)
    }

    return { weeks, month, year }
  }, [currentDate])

  const getMissionForDay = (day: number): MissionHistoryEntry | undefined => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return history.find((h) => h.date === dateStr)
  }

  const isActiveDay = (day: number) => {
    const date = new Date(year, month, day)
    return activeDays.includes(date.getDay())
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDayClick = (day: number) => {
    const mission = getMissionForDay(day)
    if (mission && mission.status !== 'pending') {
      setSelectedMission(mission)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <>
      <div className="glass rounded-2xl p-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="rounded-full p-2 transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5 text-white/60" />
          </button>
          <h3 className="font-semibold text-white">
            {MONTHS[month]} {year}
          </h3>
          <button
            onClick={nextMonth}
            className="rounded-full p-2 transition-colors hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5 text-white/60" />
          </button>
        </div>

        {/* Days header */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {DAYS_SHORT.map((day, i) => (
            <div
              key={i}
              className="py-1 text-center text-xs font-medium text-white/40"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return <div key={dayIndex} className="h-10" />
                }

                const mission = getMissionForDay(day)
                const active = isActiveDay(day)
                const today = isToday(day)
                const hasMission = mission && mission.status !== 'pending'

                return (
                  <motion.button
                    key={dayIndex}
                    whileHover={{ scale: hasMission ? 1.15 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDayClick(day)}
                    disabled={!hasMission}
                    className={`relative flex h-10 items-center justify-center rounded-lg text-sm transition-colors ${
                      hasMission ? 'cursor-pointer' : 'cursor-default'
                    } ${today ? 'ring-2 ring-purple-500' : ''} ${
                      mission?.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : mission?.status === 'skipped'
                          ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                          : active
                            ? 'bg-white/5 text-white/60'
                            : 'text-white/20'
                    }`}
                  >
                    <span className="font-medium">{day}</span>

                    {/* Status indicator */}
                    {mission?.status === 'completed' && (
                      <Check className="absolute -top-1 -right-1 h-3 w-3 text-emerald-400" />
                    )}
                    {mission?.status === 'skipped' && (
                      <X className="absolute -top-1 -right-1 h-3 w-3 text-rose-400" />
                    )}
                  </motion.button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/40">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-emerald-500/30" />
            <span>Réussi</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-rose-500/30" />
            <span>Passé</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-white/10" />
            <span>Actif</span>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-white/30">
          Clique sur un jour coloré pour voir la mission
        </p>
      </div>

      {/* Mission Detail Modal */}
      <AnimatePresence>
        {selectedMission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMission(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`glass-strong relative w-full max-w-md overflow-hidden rounded-2xl border-2 p-6 ${
                selectedMission.status === 'completed'
                  ? 'border-emerald-500/50'
                  : 'border-rose-500/50'
              }`}
            >
              {/* Status overlay */}
              <div
                className={`absolute inset-0 ${
                  selectedMission.status === 'completed'
                    ? 'bg-emerald-500/5'
                    : 'bg-rose-500/5'
                }`}
              />

              <div className="relative">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {
                        getCategoryById(selectedMission.mission.categoryId)
                          ?.emoji
                      }
                    </span>
                    <span className="font-semibold text-white/60">
                      {
                        getCategoryById(selectedMission.mission.categoryId)
                          ?.name
                      }
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                      selectedMission.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {selectedMission.status === 'completed' ? (
                      <>
                        <Check className="h-4 w-4" />
                        Réussi
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        Passé
                      </>
                    )}
                  </div>
                </div>

                {/* Date */}
                <p className="mb-3 text-sm text-white/40">
                  {formatDate(selectedMission.date)}
                </p>

                {/* Mission content */}
                <p className="text-lg font-bold text-white">
                  "{selectedMission.mission.content}"
                </p>

                {/* Tips */}
                {selectedMission.mission.tips && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-500/10 p-3">
                    <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                    <p className="text-sm text-amber-200/80">
                      {selectedMission.mission.tips}
                    </p>
                  </div>
                )}

                {/* Close button */}
                <button
                  onClick={() => setSelectedMission(null)}
                  className="mt-6 w-full rounded-xl bg-white/10 py-3 font-semibold text-white transition-colors hover:bg-white/20"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
