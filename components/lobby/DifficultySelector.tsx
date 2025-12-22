/**
 * DifficultySelector - Composant de sélection de la difficulté
 *
 * Extrait depuis lobby/[code]/page.tsx pour améliorer la maintenabilité.
 */

'use client'

import {
  STANDARD_DIFFICULTIES,
  PROGRESSIVE_DIFFICULTY,
  DIFFICULTY_COLOR_CLASSES,
  DIFFICULTY_GLOW_COLORS,
} from '@/lib/constants/difficulties'

interface DifficultySelectorProps {
  selectedDifficulty: string
  onDifficultyChange: (difficultyId: string) => void
}

export default function DifficultySelector({
  selectedDifficulty,
  onDifficultyChange,
}: DifficultySelectorProps) {
  return (
    <div className="space-y-3">
      {/* 3 standard difficulty levels */}
      <div className="grid grid-cols-3 gap-1.5">
        {STANDARD_DIFFICULTIES.map((diff) => (
          <button
            key={diff.id}
            onClick={() => onDifficultyChange(diff.id)}
            className={`rounded-lg p-1.5 text-center transition-all duration-200 ${
              selectedDifficulty === diff.id
                ? `${DIFFICULTY_COLOR_CLASSES[diff.color]} border-2 ${DIFFICULTY_GLOW_COLORS[diff.color]}`
                : `${DIFFICULTY_COLOR_CLASSES[diff.color].replace('/50', '/5')} border border-${diff.color}-500/10 opacity-40`
            } `}
          >
            <span className="mb-0.5 block text-lg">{diff.emoji}</span>
            <span className="block text-[10px] leading-tight font-medium text-white">
              {diff.name}
            </span>
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-white/10"></div>
        <span className="text-xs text-white/30">ou</span>
        <div className="h-px flex-1 bg-white/10"></div>
      </div>

      {/* Progressive mode */}
      {PROGRESSIVE_DIFFICULTY && (
        <button
          onClick={() => onDifficultyChange('progressif')}
          className={`w-full rounded-lg p-2.5 transition-all duration-200 ${
            selectedDifficulty === 'progressif'
              ? 'border-2 border-purple-500 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
              : 'glass border border-white/10 hover:border-white/20'
          } `}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">{PROGRESSIVE_DIFFICULTY.emoji}</span>
            <div className="text-left">
              <span className="block font-semibold text-white">
                {PROGRESSIVE_DIFFICULTY.name}
              </span>
              <span className="text-xs text-white/50">
                {PROGRESSIVE_DIFFICULTY.desc}
              </span>
            </div>
          </div>
        </button>
      )}
    </div>
  )
}
