/**
 * CategoryPicker - Sélecteur de catégorie de mission
 */

'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { DAILY_MISSION_CATEGORIES } from '@/lib/constants/dailyMissions'
import type { DailyMissionCategoryId } from '@/lib/types/dailyMission'

interface CategoryPickerProps {
  selectedCategory: DailyMissionCategoryId | null
  onSelect: (categoryId: DailyMissionCategoryId) => void
}

export default function CategoryPicker({
  selectedCategory,
  onSelect,
}: CategoryPickerProps) {
  return (
    <div className="space-y-3">
      {DAILY_MISSION_CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id

        return (
          <motion.button
            key={category.id}
            onClick={() => onSelect(category.id)}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full overflow-hidden rounded-2xl border-2 p-4 text-left transition-all ${
              isSelected
                ? `border-transparent bg-gradient-to-r ${category.gradient} shadow-lg`
                : 'glass border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Emoji */}
              <div
                className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-3xl ${
                  isSelected ? 'bg-white/20' : 'bg-white/5'
                }`}
              >
                {category.emoji}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className={`text-lg font-bold ${
                    isSelected ? 'text-white' : 'text-white/90'
                  }`}
                >
                  {category.name}
                </h3>
                <p
                  className={`text-sm ${
                    isSelected ? 'text-white/80' : 'text-white/50'
                  }`}
                >
                  {category.description}
                </p>
              </div>

              {/* Check mark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"
                >
                  <Check className="h-5 w-5 text-white" />
                </motion.div>
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
