'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Handshake, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface AccompagnementModalProps {
    isOpen: boolean
    onClose: () => void      // Called when closing without invoking (timer resumes)
    onInvoke: () => void     // Called when invoking (timer resets, action consumed)
    targetName: string
}

/**
 * Accompagnement Modal - Single popup with immediate invoke
 * 
 * - Timer PAUSES when modal opens (handled by parent)
 * - Close (X or click outside): Timer RESUMES, action NOT consumed
 * - Click [Invoquer]: Timer RESETS, action consumed, other actions greyed
 */
export function AccompagnementModal({
    isOpen,
    onClose,
    onInvoke,
    targetName,
}: AccompagnementModalProps) {

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md p-0 bg-transparent border-0 shadow-none overflow-visible">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-gradient-to-br from-indigo-900/95 to-purple-900/95 border-2 border-indigo-500/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(99,102,241,0.3)]"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Content */}
                    <div className="text-center space-y-5 pt-2">
                        <Handshake className="mx-auto h-12 w-12 text-indigo-400" />

                        <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                            🤝 Accompagnement
                        </h2>

                        <p className="text-white/70 text-sm">
                            Effectuez ce gage en duo
                        </p>

                        <Button
                            onClick={onInvoke}
                            className="w-full py-6 text-lg font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                        >
                            <Handshake className="mr-2 h-5 w-5" />
                            Invoquer {targetName}
                        </Button>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}
