'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import ProfileList from '@/components/profile/ProfileList'
import { motion } from 'framer-motion'

export default function ProfilesPage() {
    const router = useRouter()

    return (
        <main className="bg-background text-foreground min-h-screen p-4 flex flex-col items-center">
            <div className="w-full max-w-2xl space-y-8 mt-12">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/')}
                        className="rounded-full size-10 p-0 hover:bg-white/10"
                    >
                        <ArrowLeft className="size-6" />
                    </Button>
                    <h1 className="text-3xl font-black uppercase tracking-wider text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                        Gestion des Profils
                    </h1>
                </div>

                {/* Profile List Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-card/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl"
                >
                    <ProfileList className="max-w-xl mx-auto" />
                </motion.div>
            </div>
        </main>
    )
}
