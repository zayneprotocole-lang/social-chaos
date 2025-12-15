/**
 * Hook pour la sélection et compression d'images
 * Gère l'upload depuis galerie et la capture caméra
 */

import { useState, useCallback, useRef } from 'react'
import { PROFILE_CONFIG } from '@/types/profile'

// ========================================
// TYPES
// ========================================

export interface ImagePickerState {
    /** Image compressée en base64 data URI */
    imageUri: string | null
    /** État de chargement */
    isLoading: boolean
    /** Message d'erreur éventuel */
    error: string | null
}

export interface ImagePickerActions {
    /** Ouvre le sélecteur de fichiers (galerie) */
    pickFromGallery: () => void
    /** Ouvre la caméra (si disponible) */
    captureFromCamera: () => void
    /** Supprime l'image actuelle */
    clearImage: () => void
    /** Définit une image directement (pour l'édition) */
    setImage: (uri: string | null) => void
    /** Traite un fichier (exposé pour usage direct) */
    processFile: (file: File) => Promise<void>
}

export interface UseImagePickerResult extends ImagePickerState, ImagePickerActions {
    /** Ref pour l'input file galerie */
    galleryInputRef: React.RefObject<HTMLInputElement | null>
    /** Ref pour l'input file caméra */
    cameraInputRef: React.RefObject<HTMLInputElement | null>
    /** Vérifie si la caméra est disponible */
    isCameraAvailable: boolean
    /** Handler pour onChange des inputs */
    handleFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

// ========================================
// CONFIGURATION
// ========================================

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_DIMENSION = PROFILE_CONFIG.AVATAR_MAX_DIMENSION
const COMPRESSION_QUALITY = PROFILE_CONFIG.AVATAR_COMPRESSION_QUALITY
const MAX_SIZE_BYTES = PROFILE_CONFIG.MAX_AVATAR_SIZE_BYTES

// ========================================
// IMAGE COMPRESSION UTILITY
// ========================================

/**
 * Compresse et redimensionne une image via Canvas
 * 
 * @param file - Fichier image à compresser
 * @param maxDimension - Dimension maximale (largeur ou hauteur)
 * @param quality - Qualité JPEG (0-1)
 * @returns Promise avec le data URI base64
 */
async function compressImage(
    file: File,
    maxDimension: number = MAX_DIMENSION,
    quality: number = COMPRESSION_QUALITY
): Promise<string> {
    return new Promise((resolve, reject) => {
        // Créer un objet URL pour l'image
        const objectUrl = URL.createObjectURL(file)
        const img = new Image()

        img.onload = () => {
            // Libérer l'objet URL
            URL.revokeObjectURL(objectUrl)

            // Calculer les nouvelles dimensions
            let { width, height } = img

            if (width > maxDimension || height > maxDimension) {
                const ratio = Math.min(maxDimension / width, maxDimension / height)
                width = Math.round(width * ratio)
                height = Math.round(height * ratio)
            }

            // Créer le canvas pour le redimensionnement
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                reject(new Error('Canvas context not available'))
                return
            }

            // Appliquer un fond blanc (pour les PNG transparents -> JPEG)
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, width, height)

            // Dessiner l'image redimensionnée
            ctx.drawImage(img, 0, 0, width, height)

            // Convertir en base64 JPEG
            const dataUri = canvas.toDataURL('image/jpeg', quality)

            // Vérifier la taille finale
            const base64Data = dataUri.split(',')[1]
            const sizeInBytes = (base64Data.length * 3) / 4

            if (sizeInBytes > MAX_SIZE_BYTES) {
                // Compression plus agressive si toujours trop gros
                const aggressiveQuality = Math.max(0.3, quality * 0.7)
                const finalDataUri = canvas.toDataURL('image/jpeg', aggressiveQuality)
                resolve(finalDataUri)
            } else {
                resolve(dataUri)
            }
        }

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error('Failed to load image'))
        }

        img.src = objectUrl
    })
}

/**
 * Vérifie si le type de fichier est accepté
 */
function isAcceptedType(file: File): boolean {
    return ACCEPTED_TYPES.includes(file.type)
}

// ========================================
// HOOK
// ========================================

export function useImagePicker(initialImage?: string | null): UseImagePickerResult {
    const [imageUri, setImageUri] = useState<string | null>(initialImage ?? null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Refs pour les inputs file cachés
    const galleryInputRef = useRef<HTMLInputElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)

    // Vérifier si la caméra est disponible (mediaDevices API)
    const isCameraAvailable =
        typeof navigator !== 'undefined' &&
        'mediaDevices' in navigator &&
        'getUserMedia' in navigator.mediaDevices

    /**
     * Traite un fichier sélectionné
     */
    const processFile = useCallback(async (file: File) => {
        setError(null)
        setIsLoading(true)

        try {
            // Vérifier le type
            if (!isAcceptedType(file)) {
                throw new Error('Format non supporté. Utilisez JPEG, PNG ou WebP.')
            }

            // Vérifier la taille initiale (limite raisonnable avant compression)
            const MAX_INITIAL_SIZE = 10 * 1024 * 1024 // 10MB
            if (file.size > MAX_INITIAL_SIZE) {
                throw new Error('Image trop volumineuse (max 10MB)')
            }

            // Compresser l'image
            const compressedUri = await compressImage(file)
            setImageUri(compressedUri)
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Erreur lors du traitement de l'image"
            setError(message)
            console.error('Image processing error:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    /**
     * Handler pour le changement d'input file
     */
    const handleFileInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            if (file) {
                processFile(file)
            }
            // Reset l'input pour permettre de resélectionner le même fichier
            event.target.value = ''
        },
        [processFile]
    )

    /**
     * Ouvre le sélecteur de fichiers (galerie)
     */
    const pickFromGallery = useCallback(() => {
        setError(null)
        galleryInputRef.current?.click()
    }, [])

    /**
     * Ouvre la caméra
     */
    const captureFromCamera = useCallback(() => {
        setError(null)
        if (!isCameraAvailable) {
            setError("La caméra n'est pas disponible sur cet appareil")
            return
        }
        cameraInputRef.current?.click()
    }, [isCameraAvailable])

    /**
     * Supprime l'image actuelle
     */
    const clearImage = useCallback(() => {
        setImageUri(null)
        setError(null)
    }, [])

    /**
     * Définit une image directement
     */
    const setImage = useCallback((uri: string | null) => {
        setImageUri(uri)
        setError(null)
    }, [])

    return {
        // State
        imageUri,
        isLoading,
        error,

        // Actions
        pickFromGallery,
        captureFromCamera,
        clearImage,
        setImage,
        processFile,
        handleFileInputChange,

        // Refs & Utils
        galleryInputRef,
        cameraInputRef,
        isCameraAvailable,
    }
}

// ========================================
// EXPORTS
// ========================================

export { ACCEPTED_TYPES }

