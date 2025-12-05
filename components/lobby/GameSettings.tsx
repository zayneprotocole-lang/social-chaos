'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { GameSettings, DifficultyLevel, DareCategory } from '@/lib/types'
import { Beer, Coffee, TrendingUp, BookHeart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

import { GAME_CONFIG, DIFFICULTY_CONFIG, CATEGORY_CONFIG } from '@/lib/constants/config'

interface GameSettingsProps {
    defaultSettings: GameSettings
    onUpdate: (settings: GameSettings) => void
    isProgressiveMode?: boolean
    onProgressiveModeChange?: (enabled: boolean) => void
}

const CATEGORIES = Object.entries(CATEGORY_CONFIG).map(([id, config]) => ({
    id: id as DareCategory,
    ...config
}));

const DIFFICULTY_LEVELS = Object.entries(DIFFICULTY_CONFIG).map(([level, config]) => ({
    level: Number(level) as DifficultyLevel,
    ...config
}));

export default function GameSettingsPanel({ defaultSettings, onUpdate, isProgressiveMode = false, onProgressiveModeChange }: GameSettingsProps) {
    const router = useRouter()
    const [settings, setSettings] = useState<GameSettings>(defaultSettings)

    const handleDifficultyChange = (level: DifficultyLevel) => {
        const levelData = DIFFICULTY_LEVELS.find(l => l.level === level)
        const newSettings = {
            ...settings,
            difficulty: level,
            timerDuration: levelData ? levelData.timer : 0
        }
        setSettings(newSettings)
        onUpdate(newSettings)
    }

    const toggleCategory = (category: DareCategory) => {
        const newTags = settings.tags.includes(category)
            ? settings.tags.filter(t => t !== category)
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

    const currentLevel = DIFFICULTY_LEVELS.find(l => l.level === settings.difficulty) || DIFFICULTY_LEVELS[0]

    return (
        <div className="space-y-8 p-6 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">

            {/* Alcohol Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                    {settings.alcoholMode ? <Beer className="text-yellow-400 w-6 h-6" /> : <Coffee className="text-green-400 w-6 h-6" />}
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-lg">Mode {settings.alcoholMode ? 'Soirée Arrosée' : 'Soft / Chill'}</span>
                        <span className="text-xs text-gray-400">{settings.alcoholMode ? 'Les gages alcool sont activés' : 'Aucun gage ne demande de boire'}</span>
                    </div>
                </div>
                <Switch
                    checked={settings.alcoholMode}
                    onCheckedChange={toggleAlcoholMode}
                    className="data-[state=checked]:bg-yellow-500"
                />
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-4">
                <Label className="text-lg font-bold text-white uppercase tracking-wider">Niveau de Difficulté</Label>
                <div className="flex gap-4 items-start">
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        {DIFFICULTY_LEVELS.map((lvl) => (
                            <button
                                key={lvl.level}
                                onClick={() => handleDifficultyChange(lvl.level)}
                                disabled={isProgressiveMode}
                                className={cn(
                                    "p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2",
                                    settings.difficulty === lvl.level && !isProgressiveMode
                                        ? "bg-white/10 shadow-[0_0_15px_currentColor] scale-105"
                                        : "bg-transparent border-white/20 hover:border-white/40 opacity-70 hover:opacity-100",
                                    isProgressiveMode && "opacity-30 grayscale cursor-not-allowed hover:border-white/20 hover:opacity-30"
                                )}
                                style={{
                                    borderColor: settings.difficulty === lvl.level && !isProgressiveMode ? lvl.color : undefined,
                                    color: settings.difficulty === lvl.level && !isProgressiveMode ? lvl.color : 'white',
                                    boxShadow: settings.difficulty === lvl.level && !isProgressiveMode ? `0 0 15px ${lvl.color}40` : 'none'
                                }}
                            >
                                <span className="font-mono font-bold text-lg">{lvl.name}</span>
                                <span className="text-xs opacity-80 font-sans">
                                    {lvl.timer === 0 ? 'Pas de Timer' : lvl.timer >= 60 ? `${lvl.timer / 60} min` : `${lvl.timer} sec`}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Progressive Mode Toggle - Rainbow Pink */}
                    {onProgressiveModeChange && (
                        <div className="flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300 w-[140px]"
                            style={{
                                borderColor: isProgressiveMode ? GAME_CONFIG.COLORS.PROGRESSIVE.BORDER : 'rgba(255, 255, 255, 0.2)',
                                background: isProgressiveMode
                                    ? GAME_CONFIG.COLORS.PROGRESSIVE.BG_GRADIENT
                                    : 'transparent',
                                boxShadow: isProgressiveMode ? GAME_CONFIG.COLORS.PROGRESSIVE.SHADOW : 'none',
                            }}
                        >
                            <TrendingUp className="w-8 h-8 mb-3" style={{ color: isProgressiveMode ? 'white' : GAME_CONFIG.COLORS.PROGRESSIVE.BORDER }} />
                            <span className="font-mono font-bold text-sm text-center mb-3 leading-tight" style={{ color: isProgressiveMode ? 'white' : GAME_CONFIG.COLORS.PROGRESSIVE.BORDER }}>
                                MODE<br />PROGRESSIF
                            </span>
                            <Switch
                                checked={isProgressiveMode}
                                onCheckedChange={onProgressiveModeChange}
                                className="data-[state=checked]:bg-white"
                            />
                        </div>
                    )}
                </div>
                <p className="text-sm text-center font-mono" style={{ color: currentLevel.color }}>
                    {currentLevel.level === 1 && DIFFICULTY_CONFIG[1].description}
                    {currentLevel.level === 2 && DIFFICULTY_CONFIG[2].description}
                    {currentLevel.level === 3 && DIFFICULTY_CONFIG[3].description}
                    {currentLevel.level === 4 && DIFFICULTY_CONFIG[4].description}
                </p>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <Label className="text-lg font-bold text-white uppercase tracking-wider">Catégories</Label>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                        if (!settings.alcoholMode && cat.id === 'Alcool') return null;
                        const isActive = settings.tags.includes(cat.id);

                        return (
                            <div
                                key={cat.id}
                                onClick={() => toggleCategory(cat.id)}
                                className={cn(
                                    "cursor-pointer px-3 py-2 rounded-md border transition-all select-none font-mono text-sm",
                                    isActive
                                        ? `${cat.color} text-white border-transparent shadow-lg`
                                        : "bg-white/5 border-white/10 hover:border-white/30 text-gray-400"
                                )}
                            >
                                {cat.label}
                            </div>
                        )
                    })}

                    {/* Custom / Library Link (Toggle) */}
                    <div
                        onClick={() => {
                            const newSettings = { ...settings, includeCustomDares: !settings.includeCustomDares }
                            setSettings(newSettings)
                            onUpdate(newSettings)
                        }}
                        className={cn(
                            "cursor-pointer px-3 py-2 rounded-md border border-dashed transition-all select-none font-mono text-sm flex items-center gap-2",
                            settings.includeCustomDares
                                ? "bg-pink-500 text-white border-transparent shadow-lg"
                                : "border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white"
                        )}
                    >
                        <BookHeart className="w-4 h-4" />
                        Personnalisé
                    </div>
                </div>
            </div>
        </div>
    )
}
