/**
 * MissionCard - Carte de la mission du jour
 */

'use client'

import { motion } from 'framer-motion'
import { Check, X, Lightbulb, Trophy } from 'lucide-react'
import { getCategoryById } from '@/lib/constants/dailyMissions'
import type { MissionHistoryEntry } from '@/lib/types/dailyMission'

interface MissionCardProps {
  mission: MissionHistoryEntry
  onComplete: () => void
  onSkip: () => void
  streak?: number
}

export default function MissionCard({
  mission,
  onComplete,
  onSkip,
  streak = 0,
}: MissionCardProps) {
  const category = getCategoryById(mission.mission.categoryId)
  const isCompleted = mission.status === 'completed'
  const isSkipped = mission.status === 'skipped'
  const isPending = mission.status === 'pending'

  return (
    <div className="space-y-6">
      {/* Category Badge */}
      <div className="flex justify-center">
        <div
          className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-4 py-2 ${category?.gradient || 'from-purple-500 to-pink-500'}`}
        >
          <span className="text-lg">{category?.emoji}</span>
          <span className="font-semibold text-white">{category?.name}</span>
        </div>
      </div>

      {/* Mission Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-strong relative overflow-hidden rounded-3xl border-2 p-6 ${
          isCompleted
            ? 'border-emerald-500/50'
            : isSkipped
              ? 'border-rose-500/50'
              : 'border-white/10'
        }`}
      >
        {/* Success/Skip overlay */}
        {!isPending && (
          <div
            className={`absolute inset-0 ${
              isCompleted ? 'bg-emerald-500/10' : 'bg-rose-500/10'
            }`}
          />
        )}

        {/* Content */}
        <div className="relative space-y-4">
          {/* Mission text */}
          <p className="text-center text-xl leading-relaxed font-bold text-white">
            "{mission.mission.content}"
          </p>

          {/* Tips */}
          {mission.mission.tips && (
            <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 p-4">
              <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
              <p className="text-sm text-amber-200/80">
                {mission.mission.tips}
              </p>
            </div>
          )}

          {/* Status badge */}
          {!isPending && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex justify-center"
            >
              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-500 text-white'
                }`}
              >
                {isCompleted ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span className="font-semibold">Mission Accomplie !</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5" />
                    <span className="font-semibold">Mission Passée</span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons (only if pending) */}
      {isPending && (
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onSkip}
            className="glass-interactive flex flex-1 items-center justify-center gap-2 rounded-xl py-4 font-semibold text-white/70 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
            Passer
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 font-bold text-white shadow-lg shadow-emerald-500/30"
          >
            <Check className="h-5 w-5" />
            Mission Accomplie
          </motion.button>
        </div>
      )}

      {/* Streak indicator */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 text-amber-400"
        >
          <Trophy className="h-5 w-5" />
          <span className="font-semibold">
            🔥 Streak: {streak} jour{streak > 1 ? 's' : ''}
          </span>
        </motion.div>
      )}
    </div>
  )
}
