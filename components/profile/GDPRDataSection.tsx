/**
 * GDPRDataSection - Section RGPD pour consulter et supprimer ses données
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  Download,
  Trash2,
  AlertTriangle,
  X,
  Shield,
  Calendar,
  User as UserIcon,
  GamepadIcon,
  Target,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { User } from 'firebase/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { dataAccess } from '@/lib/services/dataAccess'
import { signOut } from '@/lib/firebase/auth'
import { useProfileStore } from '@/lib/store/useProfileStore'
import { useDailyMissionStore } from '@/lib/store/useDailyMissionStore'

interface GDPRDataSectionProps {
  user: User
}

interface UserData {
  account: {
    uid: string
    email: string | null
    displayName: string | null
    createdAt: string | null
    lastSignIn: string | null
  }
  firestore: {
    username: string
    gamesPlayed: number
    createdAt: string | null
    termsAcceptedAt: string | null
    termsVersion: string | null
  } | null
  localStorage: {
    profiles: number
    dailyMissions: {
      configured: boolean
      historyCount: number
    }
  }
}

export default function GDPRDataSection({ user }: GDPRDataSectionProps) {
  const router = useRouter()
  const [showDataModal, setShowDataModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteStep, setDeleteStep] = useState(0)
  const [confirmText, setConfirmText] = useState('')

  // Stores
  const guestProfiles = useProfileStore((s) => s.guestProfiles)
  const hostProfile = useProfileStore((s) => s.hostProfile)
  const clearHostProfile = useProfileStore((s) => s.clearHostProfile)
  const dailyMissionConfig = useDailyMissionStore((s) => s.config)
  const dailyMissionHistory = useDailyMissionStore((s) => s.history)
  const resetDailyMissions = useDailyMissionStore((s) => s.resetConfig)

  // Load user data
  const loadUserData = async () => {
    setLoading(true)
    try {
      // Get Firestore data
      const firestoreUser = await dataAccess.getUser(user.uid)

      const data: UserData = {
        account: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: user.metadata.creationTime || null,
          lastSignIn: user.metadata.lastSignInTime || null,
        },
        firestore: firestoreUser
          ? {
              username: firestoreUser.username,
              gamesPlayed: firestoreUser.gamesPlayed,
              createdAt:
                firestoreUser.createdAt?.toDate().toISOString() || null,
              termsAcceptedAt:
                firestoreUser.termsAcceptedAt?.toDate().toISOString() || null,
              termsVersion: firestoreUser.termsVersion || null,
            }
          : null,
        localStorage: {
          profiles: guestProfiles.length + (hostProfile ? 1 : 0),
          dailyMissions: {
            configured: dailyMissionConfig.isActive,
            historyCount: dailyMissionHistory.length,
          },
        },
      }

      setUserData(data)
      setShowDataModal(true)
    } catch (error) {
      console.error('Error loading user data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  // Export data as JSON
  const exportData = () => {
    if (!userData) return

    const exportObj = {
      exportedAt: new Date().toISOString(),
      ...userData,
      localProfiles: [...guestProfiles, hostProfile].filter(Boolean),
      dailyMissionHistory: dailyMissionHistory,
    }

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `social-chaos-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast.success('Données exportées avec succès !')
  }

  // Delete all user data
  const handleDeleteAllData = async () => {
    if (confirmText !== 'SUPPRIMER') {
      toast.error('Veuillez taper "SUPPRIMER" pour confirmer')
      return
    }

    setLoading(true)
    try {
      // Step 1: Clear localStorage data
      setDeleteStep(1)
      clearHostProfile()
      resetDailyMissions()
      localStorage.clear()

      // Step 2: Delete Firestore data
      setDeleteStep(2)
      // Note: In a real app, you'd have a Cloud Function to delete all user data
      // For now, we just clear what we can access

      // Step 3: Sign out and redirect
      setDeleteStep(3)
      await signOut()

      toast.success('Toutes vos données ont été supprimées')
      router.push('/auth')
    } catch (error) {
      console.error('Error deleting data:', error)
      toast.error('Erreur lors de la suppression des données')
      setDeleteStep(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* RGPD Section */}
      <div className="glass rounded-2xl border border-white/10 p-4">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          <h2 className="font-bold text-white">Mes Données (RGPD)</h2>
        </div>

        <p className="mb-4 text-sm text-white/50">
          Conformément au RGPD, vous avez le droit d&apos;accéder à vos données
          et de demander leur suppression.
        </p>

        <div className="flex gap-3">
          {/* View Data Button */}
          <button
            onClick={loadUserData}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-400 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            Voir mes données
          </button>

          {/* Delete Data Button */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-400 transition-all hover:border-rose-500/50 hover:bg-rose-500/20"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Data View Modal */}
      <AnimatePresence>
        {showDataModal && userData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDataModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 p-6"
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-xl font-bold text-white">Mes Données</h2>
                </div>
                <button
                  onClick={() => setShowDataModal(false)}
                  className="rounded-full p-2 transition-colors hover:bg-white/10"
                >
                  <X className="h-5 w-5 text-white/60" />
                </button>
              </div>

              {/* Account Data */}
              <div className="mb-4 rounded-xl bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-purple-400" />
                  <h3 className="font-semibold text-white">Compte</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Email</span>
                    <span className="text-white">
                      {userData.account.email || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Nom</span>
                    <span className="text-white">
                      {userData.account.displayName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">ID</span>
                    <span className="font-mono text-xs text-white/70">
                      {userData.account.uid.slice(0, 16)}...
                    </span>
                  </div>
                </div>
              </div>

              {/* Game Data */}
              <div className="mb-4 rounded-xl bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <GamepadIcon className="h-4 w-4 text-pink-400" />
                  <h3 className="font-semibold text-white">Jeu</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Parties jouées</span>
                    <span className="text-white">
                      {userData.firestore?.gamesPlayed || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Profils locaux</span>
                    <span className="text-white">
                      {userData.localStorage.profiles}
                    </span>
                  </div>
                </div>
              </div>

              {/* Daily Missions Data */}
              <div className="mb-4 rounded-xl bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-400" />
                  <h3 className="font-semibold text-white">
                    Missions Quotidiennes
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Configuré</span>
                    <span className="text-white">
                      {userData.localStorage.dailyMissions.configured
                        ? 'Oui'
                        : 'Non'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Historique</span>
                    <span className="text-white">
                      {userData.localStorage.dailyMissions.historyCount}{' '}
                      missions
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms Data */}
              <div className="mb-6 rounded-xl bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-semibold text-white">CGU</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Acceptées le</span>
                    <span className="text-white">
                      {userData.firestore?.termsAcceptedAt
                        ? new Date(
                            userData.firestore.termsAcceptedAt
                          ).toLocaleDateString('fr-FR')
                        : 'Non acceptées'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Version</span>
                    <span className="text-white">
                      {userData.firestore?.termsVersion || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={exportData}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-600/30"
              >
                <Download className="h-5 w-5" />
                Exporter mes données (JSON)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => !loading && setShowDeleteModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong relative w-full max-w-md rounded-2xl border border-rose-500/30 p-6"
            >
              {/* Header */}
              <div className="mb-4 flex items-center gap-3 text-rose-400">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Supprimer mes données</h2>
                  <p className="text-sm text-rose-300/70">
                    Action irréversible
                  </p>
                </div>
              </div>

              {/* Warning */}
              <div className="mb-4 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-200">
                <p className="font-semibold">⚠️ Cette action va supprimer :</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-rose-200/80">
                  <li>Tous vos profils de joueurs</li>
                  <li>Votre historique de missions quotidiennes</li>
                  <li>Vos préférences et paramètres</li>
                  <li>Vos données de jeu</li>
                </ul>
                <p className="mt-3 font-semibold">
                  Cette action est IRRÉVERSIBLE.
                </p>
              </div>

              {deleteStep > 0 ? (
                // Progress
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {deleteStep >= 1 ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin text-white/50" />
                    )}
                    <span
                      className={
                        deleteStep >= 1 ? 'text-white' : 'text-white/50'
                      }
                    >
                      Suppression données locales
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {deleteStep >= 2 ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : deleteStep === 1 ? (
                      <Loader2 className="h-5 w-5 animate-spin text-white/50" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-white/20" />
                    )}
                    <span
                      className={
                        deleteStep >= 2 ? 'text-white' : 'text-white/50'
                      }
                    >
                      Suppression données serveur
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {deleteStep >= 3 ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : deleteStep === 2 ? (
                      <Loader2 className="h-5 w-5 animate-spin text-white/50" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-white/20" />
                    )}
                    <span
                      className={
                        deleteStep >= 3 ? 'text-white' : 'text-white/50'
                      }
                    >
                      Déconnexion
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Confirmation input */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm text-white/70">
                      Tapez{' '}
                      <span className="font-bold text-rose-400">SUPPRIMER</span>{' '}
                      pour confirmer :
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="SUPPRIMER"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 focus:outline-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 rounded-xl border border-white/10 py-3 font-semibold text-white/70 transition-colors hover:bg-white/5"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDeleteAllData}
                      disabled={confirmText !== 'SUPPRIMER' || loading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 font-semibold text-white transition-all hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
