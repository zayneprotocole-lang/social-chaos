'use client'

import { User, Crown, Pencil, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import ProfileList from '@/components/profile/ProfileList'
import ProfileCreator from '@/components/profile/ProfileCreator'
import GDPRDataSection from '@/components/profile/GDPRDataSection'
import { useAuth } from '@/hooks/useAuth'
import { useHostProfile } from '@/lib/store/useProfileStore'
import { signOut } from '@/lib/firebase/auth'

export default function ProfilesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const hostProfile = useHostProfile()
  const [isEditingHost, setIsEditingHost] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/auth')
    } catch (error) {
      console.error('Logout error:', error)
      alert('Erreur lors de la déconnexion')
    }
  }

  return (
    <>
      <PageHeader title="Profils" />

      <main className="space-y-6 px-4 pt-20 pb-8">
        {/* Section Profil Utilisateur Authentifié */}
        {isAuthenticated && user && (
          <>
            <div className="glass rounded-2xl border border-white/10 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Mon Profil</h2>
              </div>

              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  {hostProfile?.avatarUri || user.photoURL ? (
                    <img
                      src={hostProfile?.avatarUri || user.photoURL || ''}
                      alt="Photo de profil"
                      className="ring-offset-background h-20 w-20 rounded-full object-cover ring-2 ring-purple-500/50 ring-offset-2"
                    />
                  ) : (
                    <div className="ring-offset-background flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/30 ring-2 ring-purple-500/50 ring-offset-2">
                      <span className="text-2xl font-bold text-white">
                        {(hostProfile?.name || user.displayName || user.email)
                          ?.charAt(0)
                          ?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Informations */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="truncate text-xl font-bold text-white">
                      {hostProfile?.name || user.displayName || 'Utilisateur'}
                    </p>
                    <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">
                      Hôte
                    </span>
                  </div>
                  <p className="mb-2 truncate text-sm text-white/60">
                    {user.email || 'Non renseigné'}
                  </p>

                  {/* Préférences si disponibles */}
                  {hostProfile?.preferences &&
                    hostProfile.preferences.want.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {hostProfile.preferences.want.slice(0, 3).map((cat) => (
                          <span
                            key={cat}
                            className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-300"
                          >
                            {cat}
                          </span>
                        ))}
                        {hostProfile.preferences.want.length > 3 && (
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/40">
                            +{hostProfile.preferences.want.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                </div>

                {/* Bouton éditer */}
                <button
                  onClick={() => setIsEditingHost(true)}
                  className="glass-interactive rounded-xl p-3 transition-colors hover:bg-white/10"
                  title="Modifier mon profil"
                >
                  <Pencil className="h-5 w-5 text-purple-400" />
                </button>
              </div>
            </div>

            {/* Section RGPD */}
            <GDPRDataSection user={user} />

            {/* Bouton déconnexion */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 transition-all hover:border-red-500/50 hover:bg-red-500/20"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-semibold">Se déconnecter</span>
            </button>
          </>
        )}

        {/* Séparateur */}
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-xs tracking-wider text-white/30 uppercase">
              Joueurs Invités
            </span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>
        )}

        {/* Liste des profils invités */}
        <ProfileList />

        {/* Modal d'édition du profil host */}
        {isEditingHost && hostProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <ProfileCreator
              profile={hostProfile}
              onSuccess={() => setIsEditingHost(false)}
              onCancel={() => setIsEditingHost(false)}
            />
          </div>
        )}
      </main>
    </>
  )
}
