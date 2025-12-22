'use client'

/**
 * Composant de création/édition de profil joueur local
 *
 * Features:
 * - Input nom avec validation (1-30 caractères)
 * - Upload photo depuis galerie
 * - Capture photo via caméra
 * - Preview circulaire de la photo
 * - Compression automatique des images
 * - Mode création et édition
 * - Préférences de catégories
 * - Synchronisation Firestore pour profil hôte
 */

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  ImagePlus,
  Trash2,
  User,
  Save,
  Plus,
  X,
  Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'

import { useProfileStore } from '@/lib/store/useProfileStore'
import { useImagePicker, ACCEPTED_TYPES } from '@/hooks/useImagePicker'
import { LocalPlayerProfile, PROFILE_CONFIG } from '@/types/profile'
import { CategoryPreferencesSelector } from './CategoryPreferencesSelector'
import { saveUserProfile } from '@/lib/services/userDataService'

// ========================================
// TYPES
// ========================================

export interface ProfileCreatorProps {
  /** Profil à éditer (undefined = mode création) */
  profile?: LocalPlayerProfile
  /** Données initiales pour pré-remplir (ex: conversion invité) */
  initialData?: { name: string; avatarUri?: string | null }
  /** Callback appelé après création/sauvegarde */
  onSuccess?: (profile: LocalPlayerProfile) => void
  /** Callback pour annuler */
  onCancel?: () => void
  /** Si true, le profil sera défini comme host */
  setAsHost?: boolean
  /** Classes CSS additionnelles */
  className?: string
}

// ========================================
// COMPOSANT
// ========================================

export function ProfileCreator({
  profile,
  initialData,
  onSuccess,
  onCancel,
  setAsHost = false,
  className = '',
}: ProfileCreatorProps) {
  // Mode édition vs création
  const isEditMode = !!profile

  // Store actions
  const createProfile = useProfileStore((state) => state.createProfile)
  const updateProfile = useProfileStore((state) => state.updateProfile)

  // State local
  const [name, setName] = useState(profile?.name ?? initialData?.name ?? '')
  const [preferences, setPreferences] = useState<{
    want: string[]
    avoid: string[]
  }>(profile?.preferences ?? { want: [], avoid: [] })
  const [nameError, setNameError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Image picker hook
  const {
    imageUri,
    isLoading: isImageLoading,
    error: imageError,
    pickFromGallery,
    captureFromCamera,
    clearImage,
    setImage,
    handleFileInputChange,
    galleryInputRef,
    cameraInputRef,
    isCameraAvailable,
  } = useImagePicker(profile?.avatarUri ?? initialData?.avatarUri ?? undefined)

  // Synchroniser l'image si on passe en mode édition ou change les data initiales
  useEffect(() => {
    const uri = profile?.avatarUri ?? initialData?.avatarUri
    if (uri) {
      setImage(uri)
    }
  }, [profile?.avatarUri, initialData?.avatarUri, setImage])

  /**
   * Valide le nom
   */
  const validateName = useCallback((value: string): string | null => {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      return 'Le nom est requis'
    }
    if (trimmed.length < PROFILE_CONFIG.MIN_NAME_LENGTH) {
      return `Minimum ${PROFILE_CONFIG.MIN_NAME_LENGTH} caractère`
    }
    if (trimmed.length > PROFILE_CONFIG.MAX_NAME_LENGTH) {
      return `Maximum ${PROFILE_CONFIG.MAX_NAME_LENGTH} caractères`
    }
    return null
  }, [])

  /**
   * Handler de changement du nom
   */
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setName(value)
      // Valider en temps réel pour le feedback
      if (nameError) {
        setNameError(validateName(value))
      }
    },
    [nameError, validateName]
  )

  /**
   * Handler de blur du nom (validation)
   */
  const handleNameBlur = useCallback(() => {
    setNameError(validateName(name))
  }, [name, validateName])

  /**
   * Soumet le formulaire
   */
  const handleSubmit = useCallback(async () => {
    // Validation finale
    const error = validateName(name)
    if (error) {
      setNameError(error)
      return
    }

    setIsSubmitting(true)

    try {
      let result: LocalPlayerProfile | null = null

      if (profile) {
        // Editing existing
        result = updateProfile({
          id: profile.id,
          name: name.trim(),
          avatarUri: imageUri || undefined,
          preferences,
        })

        // Si c'est un profil hôte, synchroniser vers Firestore
        if (profile.isHost && result) {
          try {
            await saveUserProfile({
              name: name.trim(),
              avatarId: null,
              avatarUrl: imageUri || null,
              categoryPreferences: preferences,
            })
            console.log('Host profile synced to Firestore')
          } catch (syncError) {
            console.error('Error syncing host profile to Firestore:', syncError)
            // On ne bloque pas la sauvegarde locale, juste un warning
          }
        }
      } else {
        // Creating new
        result = createProfile({
          name: name.trim(),
          avatarUri: imageUri || undefined,
          preferences,
          isHost: setAsHost,
        })

        // Si on crée un nouveau profil hôte, synchroniser vers Firestore
        if (setAsHost && result) {
          try {
            await saveUserProfile({
              name: name.trim(),
              avatarId: null,
              avatarUrl: imageUri || null,
              categoryPreferences: preferences,
            })
            console.log('New host profile synced to Firestore')
          } catch (syncError) {
            console.error(
              'Error syncing new host profile to Firestore:',
              syncError
            )
          }
        }
      }

      if (result) {
        onSuccess?.(result)
      }
    } catch (err) {
      console.error('Error saving profile:', err)
    } finally {
      setIsSubmitting(false)
    }
  }, [
    name,
    imageUri,
    isEditMode,
    profile,
    setAsHost,
    validateName,
    createProfile,
    updateProfile,
    onSuccess,
    preferences,
  ])

  /**
   * Vérifie si le formulaire est valide
   */
  const isFormValid =
    name.trim().length >= PROFILE_CONFIG.MIN_NAME_LENGTH &&
    name.trim().length <= PROFILE_CONFIG.MAX_NAME_LENGTH

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mx-auto w-full max-w-md ${className}`}
    >
      {/* Card Container avec Glassmorphism */}
      <div className="bg-card/80 relative rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl">
        {/* Glow effect */}
        <div className="from-primary/20 via-secondary/20 to-primary/20 absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-r opacity-50 blur-xl" />

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-foreground text-xl font-bold">
            {isEditMode ? 'Modifier le profil' : 'Nouveau profil'}
          </h2>
          {onCancel && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* Avatar Section */}
        <div className="mb-6 flex flex-col items-center">
          {/* Avatar Preview */}
          <div className="group relative mb-4">
            <Avatar className="ring-primary/50 ring-offset-background size-24 ring-2 ring-offset-2">
              {imageUri ? (
                <AvatarImage src={imageUri} alt="Preview" />
              ) : (
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <User className="size-10" />
                </AvatarFallback>
              )}
            </Avatar>

            {/* Loading overlay */}
            <AnimatePresence>
              {isImageLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50"
                >
                  <Loader2 className="size-6 animate-spin text-white" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Delete button overlay */}
            {imageUri && !isImageLoading && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearImage}
                className="bg-destructive hover:bg-destructive/90 absolute -top-1 -right-1 rounded-full p-1.5 text-white shadow-lg transition-colors"
                title="Supprimer la photo"
              >
                <Trash2 className="size-3.5" />
              </motion.button>
            )}
          </div>

          {/* Photo Buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={pickFromGallery}
              disabled={isImageLoading}
              className="gap-1.5"
            >
              <ImagePlus className="size-4" />
              <span className="hidden sm:inline">Galerie</span>
            </Button>

            {isCameraAvailable && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={captureFromCamera}
                disabled={isImageLoading}
                className="gap-1.5"
              >
                <Camera className="size-4" />
                <span className="hidden sm:inline">Caméra</span>
              </Button>
            )}
          </div>

          {/* Image Error */}
          <AnimatePresence>
            {imageError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-destructive mt-2 text-sm"
              >
                {imageError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Name Input */}
        <div className="mb-6 space-y-2">
          <Label htmlFor="profile-name" className="text-sm font-medium">
            Nom / Pseudo
          </Label>
          <Input
            id="profile-name"
            type="text"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            placeholder="Entrez votre nom..."
            maxLength={PROFILE_CONFIG.MAX_NAME_LENGTH}
            aria-invalid={!!nameError}
            className={
              nameError ? 'border-destructive ring-destructive/20' : ''
            }
          />

          {/* Character count & Error */}
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {nameError ? (
                <motion.p
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-destructive text-sm"
                >
                  {nameError}
                </motion.p>
              ) : (
                <motion.span key="empty" />
              )}
            </AnimatePresence>
            <span className="text-muted-foreground text-xs">
              {name.length}/{PROFILE_CONFIG.MAX_NAME_LENGTH}
            </span>
          </div>
        </div>

        {/* Categories Preferences */}
        <div className="mb-6">
          <CategoryPreferencesSelector
            preferences={preferences}
            onChange={setPreferences}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Annuler
            </Button>
          )}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting || isImageLoading}
            className="flex-1 gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isEditMode ? (
              <Save className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
            {isEditMode ? 'Sauvegarder' : 'Créer le profil'}
          </Button>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={galleryInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          aria-hidden="true"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileInputChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>
    </motion.div>
  )
}

export default ProfileCreator
