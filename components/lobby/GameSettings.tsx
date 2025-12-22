'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { GameSettings, DifficultyLevel, DareCategory } from '@/lib/types'
import { Beer, Coffee, TrendingUp, BookHeart } from 'lucide-react'
import { cn } from '@/lib/utils'

import {
  GAME_CONFIG,
  DIFFICULTY_CONFIG,
  CATEGORY_CONFIG,
} from '@/lib/constants/config'

interface GameSettingsProps {
  defaultSettings: GameSettings
  onUpdate: (settings: GameSettings) => void
  isProgressiveMode?: boolean
  onProgressiveModeChange?: (enabled: boolean) => void
}

const CATEGORIES = Object.entries(CATEGORY_CONFIG).map(([id, config]) => ({
  id: id as DareCategory,
  ...config,
}))

const DIFFICULTY_LEVELS = Object.entries(DIFFICULTY_CONFIG).map(
  ([level, config]) => ({
    level: Number(level) as DifficultyLevel,
    ...config,
  })
)

export default function GameSettingsPanel({
  defaultSettings,
  onUpdate,
  isProgressiveMode = false,
  onProgressiveModeChange,
}: GameSettingsProps) {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings)

  const handleDifficultyChange = (level: DifficultyLevel) => {
    const levelData = DIFFICULTY_LEVELS.find((l) => l.level === level)
    const newSettings = {
      ...settings,
      difficulty: level,
      timerDuration: levelData ? levelData.timer : 0,
    }
    setSettings(newSettings)
    onUpdate(newSettings)
  }

  const toggleCategory = (category: DareCategory) => {
    const newTags = settings.tags.includes(category)
      ? settings.tags.filter((t) => t !== category)
      : [...settings.tags, category]

    const newSettings = { ...settings, tags: newTags }
    setSettings(newSettings)
    onUpdate(newSettings)
  }

  const toggleAlcoholMode = (checked: boolean) => {
    const newSettings = { ...settings, alcoholMode: checked }
    setSettings(newSettings)
    onUpdate(newSettings)
  }

  const currentLevel =
    DIFFICULTY_LEVELS.find((l) => l.level === settings.difficulty) ||
    DIFFICULTY_LEVELS[0]

  return (
    <div className="space-y-8 rounded-xl border border-white/10 bg-black/80 p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
      {/* Alcohol Mode Toggle - Carte explicative */}
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border-2 p-5 transition-all duration-300',
          settings.alcoholMode
            ? 'border-amber-500/50 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20'
            : 'border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-teal-500/5 to-cyan-500/10'
        )}
        style={{
          boxShadow: settings.alcoholMode
            ? '0 0 30px rgba(245, 158, 11, 0.2)'
            : '0 0 20px rgba(6, 182, 212, 0.15)',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Icône + Contenu */}
          <div className="flex items-start gap-4">
            {/* Icône dynamique */}
            <div
              className={cn(
                'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300',
                settings.alcoholMode
                  ? 'bg-amber-500/30 text-amber-400'
                  : 'bg-cyan-500/20 text-cyan-400'
              )}
            >
              {settings.alcoholMode ? (
                <Beer className="h-6 w-6" />
              ) : (
                <Coffee className="h-6 w-6" />
              )}
            </div>

            {/* Texte explicatif */}
            <div className="flex flex-col gap-1">
              <span
                className={cn(
                  'text-lg font-bold transition-colors',
                  settings.alcoholMode ? 'text-amber-300' : 'text-cyan-300'
                )}
              >
                {settings.alcoholMode
                  ? '🍺 Mode Alcool'
                  : '☕ Mode Sans Alcool'}
              </span>
              <span className="text-sm text-white/70">
                {settings.alcoholMode
                  ? 'Les pénalités seront des gorgées à boire'
                  : 'Les pénalités seront des vérités à avouer'}
              </span>
              <span className="mt-1 text-xs text-white/40">
                {settings.alcoholMode
                  ? 'Quantité selon la difficulté du gage'
                  : 'Confessions embarrassantes garanties'}
              </span>
            </div>
          </div>

          {/* Toggle */}
          <Switch
            checked={settings.alcoholMode}
            onCheckedChange={toggleAlcoholMode}
            className={cn(
              'mt-1 flex-shrink-0',
              settings.alcoholMode
                ? 'data-[state=checked]:bg-amber-500'
                : 'data-[state=unchecked]:bg-cyan-500/50'
            )}
          />
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="space-y-4">
        <Label className="text-lg font-bold tracking-wider text-white uppercase">
          Niveau de Difficulté
        </Label>
        <div className="flex items-start gap-4">
          <div className="grid flex-1 grid-cols-2 gap-3">
            {DIFFICULTY_LEVELS.map((lvl) => (
              <button
                key={lvl.level}
                onClick={() => handleDifficultyChange(lvl.level)}
                disabled={isProgressiveMode}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all duration-300',
                  settings.difficulty === lvl.level && !isProgressiveMode
                    ? 'scale-105 bg-white/10 shadow-[0_0_15px_currentColor]'
                    : 'border-white/20 bg-transparent opacity-70 hover:border-white/40 hover:opacity-100',
                  isProgressiveMode &&
                    'cursor-not-allowed opacity-30 grayscale hover:border-white/20 hover:opacity-30'
                )}
                style={{
                  borderColor:
                    settings.difficulty === lvl.level && !isProgressiveMode
                      ? lvl.color
                      : undefined,
                  color:
                    settings.difficulty === lvl.level && !isProgressiveMode
                      ? lvl.color
                      : 'white',
                  boxShadow:
                    settings.difficulty === lvl.level && !isProgressiveMode
                      ? `0 0 15px ${lvl.color}40`
                      : 'none',
                }}
              >
                <span className="font-mono text-lg font-bold">{lvl.name}</span>
                <span className="font-sans text-xs opacity-80">
                  {lvl.timer === 0
                    ? 'Pas de Timer'
                    : lvl.timer >= 60
                      ? `${lvl.timer / 60} min`
                      : `${lvl.timer} sec`}
                </span>
              </button>
            ))}
          </div>

          {/* Progressive Mode Toggle - Rainbow Pink */}
          {onProgressiveModeChange && (
            <div
              className="flex w-[140px] flex-col items-center justify-center rounded-lg border-2 p-4 transition-all duration-300"
              style={{
                borderColor: isProgressiveMode
                  ? GAME_CONFIG.COLORS.PROGRESSIVE.BORDER
                  : 'rgba(255, 255, 255, 0.2)',
                background: isProgressiveMode
                  ? GAME_CONFIG.COLORS.PROGRESSIVE.BG_GRADIENT
                  : 'transparent',
                boxShadow: isProgressiveMode
                  ? GAME_CONFIG.COLORS.PROGRESSIVE.SHADOW
                  : 'none',
              }}
            >
              <TrendingUp
                className="mb-3 h-8 w-8"
                style={{
                  color: isProgressiveMode
                    ? 'white'
                    : GAME_CONFIG.COLORS.PROGRESSIVE.BORDER,
                }}
              />
              <span
                className="mb-3 text-center font-mono text-sm leading-tight font-bold"
                style={{
                  color: isProgressiveMode
                    ? 'white'
                    : GAME_CONFIG.COLORS.PROGRESSIVE.BORDER,
                }}
              >
                MODE
                <br />
                PROGRESSIF
              </span>
              <Switch
                checked={isProgressiveMode}
                onCheckedChange={onProgressiveModeChange}
                className="data-[state=checked]:bg-white"
              />
            </div>
          )}
        </div>
        <p
          className="text-center font-mono text-sm"
          style={{ color: currentLevel.color }}
        >
          {currentLevel.level === 1 && DIFFICULTY_CONFIG[1].description}
          {currentLevel.level === 2 && DIFFICULTY_CONFIG[2].description}
          {currentLevel.level === 3 && DIFFICULTY_CONFIG[3].description}
          {currentLevel.level === 4 && DIFFICULTY_CONFIG[4].description}
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <Label className="text-lg font-bold tracking-wider text-white uppercase">
          Catégories
        </Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((cat) => {
            if (!settings.alcoholMode && cat.id === 'Alcool') return null
            const isActive = settings.tags.includes(cat.id)

            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={cn(
                  'flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-sans text-sm font-medium transition-all duration-200 select-none',
                  'active:scale-95',
                  isActive
                    ? `${cat.color} border-white/30 font-bold text-white shadow-lg`
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white/80'
                )}
                style={
                  isActive
                    ? {
                        boxShadow: `0 4px 20px ${
                          cat.color.includes('yellow')
                            ? 'rgba(234, 179, 8, 0.4)'
                            : cat.color.includes('orange')
                              ? 'rgba(249, 115, 22, 0.4)'
                              : cat.color.includes('green')
                                ? 'rgba(34, 197, 94, 0.4)'
                                : cat.color.includes('red')
                                  ? 'rgba(239, 68, 68, 0.4)'
                                  : cat.color.includes('pink')
                                    ? 'rgba(236, 72, 153, 0.4)'
                                    : cat.color.includes('blue')
                                      ? 'rgba(59, 130, 246, 0.4)'
                                      : 'rgba(168, 85, 247, 0.4)'
                        }`,
                      }
                    : undefined
                }
              >
                {cat.label}
              </button>
            )
          })}

          {/* Custom / Library Link (Toggle) */}
          <button
            onClick={() => {
              const newSettings = {
                ...settings,
                includeCustomDares: !settings.includeCustomDares,
              }
              setSettings(newSettings)
              onUpdate(newSettings)
            }}
            className={cn(
              'flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 font-sans text-sm font-medium transition-all duration-200 select-none',
              'active:scale-95',
              settings.includeCustomDares
                ? 'border-white/30 bg-pink-500 font-bold text-white shadow-lg'
                : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40 hover:bg-white/10 hover:text-white/80'
            )}
            style={
              settings.includeCustomDares
                ? {
                    boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)',
                  }
                : undefined
            }
          >
            <BookHeart className="h-4 w-4" />
            Personnalisé
          </button>
        </div>
      </div>
    </div>
  )
}
