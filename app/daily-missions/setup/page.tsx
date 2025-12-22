/**
 * Page de configuration des Missions Quotidiennes
 *
 * 2 étapes:
 * 1. Choix de la catégorie
 * 2. Choix des jours + notifications
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Bell, BellOff } from 'lucide-react'
import { toast } from 'sonner'

import { CategoryPicker, DaysPicker } from '@/components/daily-missions'
import { useDailyMissionStore } from '@/lib/store/useDailyMissionStore'
import type { DailyMissionCategoryId } from '@/lib/types/dailyMission'

export default function DailyMissionsSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Store
  const config = useDailyMissionStore((s) => s.config)
  const setCategory = useDailyMissionStore((s) => s.setCategory)
  const toggleDay = useDailyMissionStore((s) => s.toggleDay)
  const setNotificationsEnabled = useDailyMissionStore(
    (s) => s.setNotificationsEnabled
  )
  const activate = useDailyMissionStore((s) => s.activate)

  // Local state for step navigation
  const [selectedCategory, setSelectedCategory] =
    useState<DailyMissionCategoryId | null>(config.categoryId)
  const [selectedDays, setSelectedDays] = useState<number[]>(config.activeDays)
  const [notificationsEnabled, setNotificationsEnabledLocal] = useState(
    config.notificationsEnabled
  )

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error(
        'Les notifications ne sont pas supportées par votre navigateur'
      )
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      toast.error(
        'Les notifications sont bloquées. Activez-les dans les paramètres du navigateur'
      )
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission()
      if (granted) {
        setNotificationsEnabledLocal(true)
        toast.success('Notifications activées !')
      }
    } else {
      setNotificationsEnabledLocal(false)
    }
  }

  const handleNext = () => {
    if (step === 1 && !selectedCategory) {
      toast.error('Choisis une catégorie pour continuer')
      return
    }
    if (step < 2) {
      setStep(step + 1)
    }
  }

  const handleComplete = () => {
    if (!selectedCategory) return

    if (selectedDays.length === 0) {
      toast.error('Sélectionne au moins un jour')
      return
    }

    // Save to store
    setCategory(selectedCategory)
    selectedDays.forEach((day) => {
      if (!config.activeDays.includes(day)) {
        toggleDay(day)
      }
    })
    config.activeDays.forEach((day) => {
      if (!selectedDays.includes(day)) {
        toggleDay(day)
      }
    })
    setNotificationsEnabled(notificationsEnabled)
    activate()

    toast.success('Mission quotidienne activée ! 🚀')
    router.push('/daily-missions')
  }

  const handleDayToggle = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 flex items-center gap-4 px-4 py-4">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
          className="rounded-full p-2 transition-colors hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Mission Quotidienne</h1>
          <p className="text-sm text-white/50">Configuration</p>
        </div>
        {/* Step indicator */}
        <div className="flex gap-1">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 w-6 rounded-full transition-colors ${
                s === step
                  ? 'bg-purple-500'
                  : s < step
                    ? 'bg-purple-500/50'
                    : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col p-4">
        {/* Step 1: Category */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-1 flex-col"
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white">
                Choisis ton objectif
              </h2>
              <p className="mt-2 text-white/60">
                Dans quel domaine veux-tu progresser ?
              </p>
            </div>

            <CategoryPicker
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </motion.div>
        )}

        {/* Step 2: Days + Notifications */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-1 flex-col"
          >
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-white">
                Quand es-tu disponible ?
              </h2>
              <p className="mt-2 text-white/60">
                Sélectionne les jours où tu recevras une mission
              </p>
            </div>

            <DaysPicker
              selectedDays={selectedDays}
              onToggle={handleDayToggle}
            />

            <div className="mt-4 text-center">
              <p className="text-sm text-white/40">
                {selectedDays.length === 0
                  ? 'Aucun jour sélectionné'
                  : `${selectedDays.length} jour${selectedDays.length > 1 ? 's' : ''} sélectionné${selectedDays.length > 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Notifications toggle - under days */}
            <div className="mt-8">
              <button
                onClick={handleToggleNotifications}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 transition-all ${
                  notificationsEnabled
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'glass border-white/10 hover:border-white/20'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    notificationsEnabled ? 'bg-purple-500' : 'bg-white/10'
                  }`}
                >
                  {notificationsEnabled ? (
                    <Bell className="h-6 w-6 text-white" />
                  ) : (
                    <BellOff className="h-6 w-6 text-white/50" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-white">
                    {notificationsEnabled
                      ? 'Notifications activées'
                      : 'Activer les notifications'}
                  </p>
                  <p className="text-sm text-white/50">
                    {notificationsEnabled
                      ? 'Tu recevras ta mission à 9h'
                      : 'Rappel quotidien de ta mission'}
                  </p>
                </div>
                <div
                  className={`h-6 w-11 rounded-full p-1 transition-colors ${
                    notificationsEnabled ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    animate={{ x: notificationsEnabled ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="h-4 w-4 rounded-full bg-white"
                  />
                </div>
              </button>
              <p className="mt-2 text-center text-xs text-white/30">
                Tu peux aussi consulter ta mission directement dans l&apos;app
              </p>
            </div>
          </motion.div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={step === 2 ? handleComplete : handleNext}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 font-bold text-white shadow-lg shadow-purple-600/30"
        >
          {step === 2 ? (
            'Commencer les missions'
          ) : (
            <>
              Continuer
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </motion.button>
      </main>
    </div>
  )
}
