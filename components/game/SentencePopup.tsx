'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skull } from "lucide-react"
import { GAME_CONFIG } from "@/lib/constants/config"

interface SentencePopupProps {
    isOpen: boolean
    onClose: () => void
    onNext: () => void
    penaltyText: string
}

export default function SentencePopup({ isOpen, onClose, onNext, penaltyText }: SentencePopupProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black/90 border-red-900/50 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className={`text-center text-3xl font-black text-[${GAME_CONFIG.COLORS.ERROR}] flex items-center justify-center gap-2 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]`}>
                        <Skull className="w-8 h-8" /> SENTENCE
                    </DialogTitle>
                </DialogHeader>

                <div className="py-8 text-center">
                    <p className="text-2xl font-bold leading-relaxed animate-pulse">
                        {penaltyText}
                    </p>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button
                        onClick={onNext}
                        className={`w-full sm:w-auto bg-[${GAME_CONFIG.COLORS.ERROR}] hover:bg-red-700 text-white font-bold text-lg px-8 py-6 shadow-[0_0_20px_rgba(220,38,38,0.4)]`}
                    >
                        SUIVANT
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
