'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Settings, X, Globe, Eye, FileText, ChevronRight, Check } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSettingsStore } from '@/lib/store/useSettingsStore'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

type SettingsView = 'main' | 'language' | 'legal'

const LANGUAGES = [
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
]

const LEGAL_CONTENT = {
    cgu: {
        title: "Conditions Générales d'Utilisation",
        content: "Contenu des CGU à venir...\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    safe: {
        title: "Politique Safe - Jeu Responsable",
        content: "Notre politique de jeu responsable...\n\n• Jouez dans un cadre bienveillant\n• Respectez les limites de chacun\n• Ne forcez personne à réaliser un gage\n• L'alcool doit être consommé avec modération\n• Tout le monde a le droit de dire non"
    },
    privacy: {
        title: "Politique de Confidentialité",
        content: "Politique de confidentialité à venir...\n\nVos données restent sur votre appareil. Nous ne collectons aucune information personnelle."
    }
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [view, setView] = useState<SettingsView>('main')
    const { language, colorblindMode, setLanguage, toggleColorblindMode } = useSettingsStore()

    const handleClose = () => {
        setView('main') // Reset to main view on close
        onClose()
    }

    const currentLanguage = LANGUAGES.find(l => l.code === language)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md p-0 bg-transparent border-0 shadow-none overflow-visible max-h-[90vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-gradient-to-br from-slate-900/95 to-gray-900/95 border-2 border-white/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 z-10 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center pt-6 pb-4 px-6">
                        <Settings className="mx-auto h-10 w-10 text-primary" />
                        <h2 className="mt-2 text-xl font-bold text-white">
                            {view === 'main' && 'Paramètres'}
                            {view === 'language' && 'Langue'}
                            {view === 'legal' && 'Mentions légales'}
                        </h2>
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {view === 'main' && (
                            <motion.div
                                key="main"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="px-4 pb-6 space-y-3"
                            >
                                {/* Language Selector */}
                                <button
                                    onClick={() => setView('language')}
                                    className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-primary" />
                                        <span className="text-white font-medium">Langue</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/60">
                                        <span>{currentLanguage?.flag} {currentLanguage?.name}</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </button>

                                {/* Colorblind Mode Toggle */}
                                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <Eye className="w-5 h-5 text-primary" />
                                        <div>
                                            <span className="text-white font-medium block">Mode daltonien</span>
                                            <span className="text-xs text-white/50">Adapte les couleurs</span>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={colorblindMode}
                                        onCheckedChange={toggleColorblindMode}
                                    />
                                </div>

                                {/* Legal Links */}
                                <button
                                    onClick={() => setView('legal')}
                                    className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-primary" />
                                        <span className="text-white font-medium">CGU & Mentions légales</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/60" />
                                </button>
                            </motion.div>
                        )}

                        {view === 'language' && (
                            <motion.div
                                key="language"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="px-4 pb-6"
                            >
                                <Button
                                    variant="ghost"
                                    onClick={() => setView('main')}
                                    className="mb-4 text-white/60 hover:text-white"
                                >
                                    ← Retour
                                </Button>
                                <div className="space-y-2">
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code)
                                                setView('main')
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 rounded-lg border transition-colors",
                                                language === lang.code
                                                    ? "bg-primary/20 border-primary/50 text-white"
                                                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{lang.flag}</span>
                                                <span className="font-medium">{lang.name}</span>
                                            </div>
                                            {language === lang.code && (
                                                <Check className="w-5 h-5 text-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {view === 'legal' && (
                            <motion.div
                                key="legal"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="px-4 pb-6"
                            >
                                <Button
                                    variant="ghost"
                                    onClick={() => setView('main')}
                                    className="mb-4 text-white/60 hover:text-white"
                                >
                                    ← Retour
                                </Button>
                                <ScrollArea className="h-[350px] pr-2">
                                    <div className="space-y-4">
                                        {Object.entries(LEGAL_CONTENT).map(([key, section]) => (
                                            <div
                                                key={key}
                                                className="p-4 rounded-lg bg-white/5 border border-white/10"
                                            >
                                                <h3 className="font-bold text-white mb-2">
                                                    {section.title}
                                                </h3>
                                                <p className="text-sm text-white/60 whitespace-pre-line">
                                                    {section.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}

interface SettingsButtonProps {
    onClick: () => void
    className?: string
}

/**
 * Settings button for the home page
 */
export function SettingsButton({ onClick, className }: SettingsButtonProps) {
    return (
        <Button
            onClick={onClick}
            variant="outline"
            size="icon"
            className={cn(
                "border-white/20 bg-background/80 backdrop-blur-sm",
                "hover:border-primary/50 hover:bg-primary/10",
                "text-white/60 hover:text-primary",
                className
            )}
        >
            <Settings className="h-5 w-5" />
        </Button>
    )
}
