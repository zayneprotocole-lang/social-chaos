'use client'

import { useState, useRef, useEffect } from 'react'
import { HelpCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTip, TIPS_ENABLED } from '@/lib/constants/tips'
import { cn } from '@/lib/utils'

interface TipBubbleProps {
    tipId: string
    className?: string
    iconSize?: number
}

/**
 * TipBubble - A small (?) icon that shows a tooltip popup on click
 * 
 * Position this component inside a relative container.
 * By default, it positions itself at top-right.
 * 
 * Usage:
 * ```tsx
 * <div className="relative">
 *   <TipBubble tipId="action-joker" />
 *   <Button>🃏 Joker</Button>
 * </div>
 * ```
 */
export function TipBubble({
    tipId,
    className,
    iconSize = 16,
}: TipBubbleProps) {
    const [isOpen, setIsOpen] = useState(false)
    const popupRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current && !popupRef.current.contains(e.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen])

    // Don't render if tips are disabled globally
    if (!TIPS_ENABLED) return null

    const tipContent = getTip(tipId)

    return (
        <>
            {/* Tip Icon */}
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
                className={cn(
                    "absolute -top-1 -right-1 z-10 p-0.5 rounded-full",
                    "bg-white/10 hover:bg-white/20 text-white/50 hover:text-white/80",
                    "transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    className
                )}
                aria-label="Afficher le conseil"
                aria-expanded={isOpen}
            >
                <HelpCircle size={iconSize} />
            </button>

            {/* Popup */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={popupRef}
                        initial={{ opacity: 0, scale: 0.9, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute z-50 top-6 right-0",
                            "w-64 p-3 rounded-lg",
                            "bg-gray-900 border border-white/20 shadow-xl",
                            "text-sm text-white/90"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-1 right-1 p-1 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
                            aria-label="Fermer"
                        >
                            <X size={14} />
                        </button>

                        {/* Arrow pointing to icon */}
                        <div className="absolute -top-2 right-3 w-3 h-3 bg-gray-900 border-l border-t border-white/20 rotate-45" />

                        {/* Content */}
                        <p className="pr-5">{tipContent}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

interface WithTipProps {
    tipId: string
    children: React.ReactNode
    className?: string
}

/**
 * WithTip - Wrapper component that adds a tip bubble to any element
 * 
 * Usage:
 * ```tsx
 * <WithTip tipId="action-joker">
 *   <Button>🃏 Joker</Button>
 * </WithTip>
 * ```
 */
export function WithTip({ tipId, children, className }: WithTipProps) {
    if (!TIPS_ENABLED) return <>{children}</>

    return (
        <div className={cn("relative", className)}>
            <TipBubble tipId={tipId} />
            {children}
        </div>
    )
}
