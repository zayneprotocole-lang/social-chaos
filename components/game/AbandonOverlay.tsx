import { Button } from '@/components/ui/button'
import { Skull, ArrowLeft, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AbandonOverlayProps {
    isOpen: boolean
    onCancel: () => void
    onConfirm: () => void
    penaltyText?: string
}

export default function AbandonOverlay({
    isOpen,
    onCancel,
    onConfirm,
    penaltyText
}: AbandonOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="bg-card border-2 border-red-500 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(239,68,68,0.3)] text-center space-y-5"
                    >
                        {/* Icon */}
                        <div className="relative mx-auto w-16 h-16">
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(239,68,68,0.3)',
                                        '0 0 40px rgba(239,68,68,0.6)',
                                        '0 0 20px rgba(239,68,68,0.3)'
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-full h-full rounded-full bg-red-500/20 flex items-center justify-center"
                            >
                                <Skull className="w-8 h-8 text-red-400" />
                            </motion.div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                            Abandonner ?
                        </h3>

                        {/* Warning */}
                        <p className="text-white/60 text-sm">
                            Si vous abandonnez, vous allez subir la <span className="text-red-400 font-bold">SENTENCE</span>
                        </p>

                        {/* Penalty Display */}
                        {penaltyText && (
                            <div className="relative p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 bg-card">
                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                                        Sentence
                                    </span>
                                </div>
                                <p className="text-white font-bold text-lg leading-relaxed">
                                    {penaltyText}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-2">
                            <Button
                                onClick={onCancel}
                                variant="outline"
                                className="w-full font-bold py-6 border-white/20 hover:border-white/40 hover:bg-white/5"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Revenir au gage
                            </Button>
                            <Button
                                onClick={onConfirm}
                                variant="destructive"
                                className="w-full font-bold py-6 shadow-[0_0_20px_var(--destructive)] hover:shadow-[0_0_30px_var(--destructive)]"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Sentence effectuée
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
