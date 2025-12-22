/**
 * DaysPicker - Sélecteur de jours de la semaine
 */

'use client'

import { motion } from 'framer-motion'
import { DAYS_OF_WEEK } from '@/lib/constants/dailyMissions'

interface DaysPickerProps {
  selectedDays: number[]
  onToggle: (day: number) => void
}

export default function DaysPicker({
  selectedDays,
  onToggle,
}: DaysPickerProps) {
  return (
    <div className="flex justify-center gap-2">
      {DAYS_OF_WEEK.map((day) => {
        const isSelected = selectedDays.includes(day.id)

        return (
          <motion.button
            key={day.id}
            onClick={() => onToggle(day.id)}
            whileTap={{ scale: 0.9 }}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-all ${
              isSelected
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'glass border border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
            }`}
            title={day.name}
          >
            {day.short}
          </motion.button>
        )
      })}
    </div>
  )
}
