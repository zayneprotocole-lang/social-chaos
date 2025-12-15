/**
 * Site Texts Schema
 * 
 * This schema mirrors the structure of lib/constants/texts.ts
 * All user-facing text can be edited via Sanity Studio
 */

import { defineField, defineType } from 'sanity'

export const siteTexts = defineType({
    name: 'siteTexts',
    title: 'Textes du site',
    type: 'document',
    fields: [
        // ========================================
        // APP GENERAL
        // ========================================
        defineField({
            name: 'app',
            title: 'Application',
            type: 'object',
            fields: [
                { name: 'name', title: 'Nom', type: 'string' },
                { name: 'tagline', title: 'Tagline', type: 'string' },
                { name: 'version', title: 'Version', type: 'string' },
            ],
        }),

        // ========================================
        // HOME PAGE
        // ========================================
        defineField({
            name: 'home',
            title: 'Page d\'accueil',
            type: 'object',
            fields: [
                { name: 'title', title: 'Titre', type: 'string' },
                { name: 'subtitle', title: 'Sous-titre', type: 'text' },
                { name: 'playButton', title: 'Bouton Jouer', type: 'string' },
                { name: 'creatingButton', title: 'Bouton Création', type: 'string' },
                { name: 'cardTitle', title: 'Titre Card', type: 'string' },
                { name: 'cardDescription', title: 'Description Card', type: 'string' },
            ],
        }),

        // ========================================
        // GAME
        // ========================================
        defineField({
            name: 'game',
            title: 'Jeu',
            type: 'object',
            fields: [
                { name: 'drawCard', title: 'Tirer une carte', type: 'string' },
                { name: 'validate', title: 'Valider', type: 'string' },
                { name: 'abandon', title: 'Abandonner', type: 'string' },
                { name: 'ongoing', title: 'En cours', type: 'string' },
                { name: 'successTitle', title: 'Titre succès', type: 'string' },
                { name: 'successMessage', title: 'Message succès', type: 'string' },
            ],
        }),

        // ========================================
        // ACTIONS
        // ========================================
        defineField({
            name: 'actions',
            title: 'Actions',
            type: 'object',
            fields: [
                {
                    name: 'joker',
                    title: 'Joker',
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Nom', type: 'string' },
                        { name: 'description', title: 'Description', type: 'string' },
                    ],
                },
                {
                    name: 'reroll',
                    title: 'Nouvelle carte',
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Nom', type: 'string' },
                        { name: 'description', title: 'Description', type: 'string' },
                    ],
                },
                {
                    name: 'swap',
                    title: 'Échanger',
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Nom', type: 'string' },
                        { name: 'description', title: 'Description', type: 'string' },
                    ],
                },
                {
                    name: 'accompagnement',
                    title: 'Accompagnement',
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Nom', type: 'string' },
                        { name: 'title', title: 'Titre modal', type: 'string' },
                        { name: 'subtitle', title: 'Sous-titre', type: 'string' },
                        { name: 'invoke', title: 'Bouton invoquer', type: 'string' },
                    ],
                },
            ],
        }),

        // ========================================
        // PREMIUM
        // ========================================
        defineField({
            name: 'premium',
            title: 'Premium',
            type: 'object',
            fields: [
                { name: 'title', title: 'Titre', type: 'string' },
                { name: 'subtitle', title: 'Sous-titre', type: 'string' },
                { name: 'button', title: 'Bouton', type: 'string' },
                { name: 'comingSoon', title: 'Bientôt disponible', type: 'string' },
                {
                    name: 'benefits',
                    title: 'Avantages',
                    type: 'array',
                    of: [{
                        type: 'object',
                        fields: [
                            { name: 'title', title: 'Titre', type: 'string' },
                            { name: 'description', title: 'Description', type: 'string' },
                        ],
                    }],
                },
            ],
        }),

        // ========================================
        // END GAME
        // ========================================
        defineField({
            name: 'endGame',
            title: 'Fin de partie',
            type: 'object',
            fields: [
                { name: 'title', title: 'Titre', type: 'string' },
                { name: 'winner', title: 'Gagnant', type: 'string' },
                { name: 'loser', title: 'Perdant', type: 'string' },
                { name: 'goat', title: 'GOAT', type: 'string' },
                { name: 'chevre', title: 'Chèvre', type: 'string' },
                { name: 'playAgain', title: 'Rejouer', type: 'string' },
                { name: 'backToHome', title: 'Retour accueil', type: 'string' },
            ],
        }),

        // ========================================
        // LOADING
        // ========================================
        defineField({
            name: 'loading',
            title: 'Chargement',
            type: 'object',
            fields: [
                { name: 'preparing', title: 'Préparation', type: 'string' },
                { name: 'shuffling', title: 'Mélange', type: 'string' },
                { name: 'loading', title: 'Chargement', type: 'string' },
            ],
        }),

        // ========================================
        // COMMON
        // ========================================
        defineField({
            name: 'common',
            title: 'Commun',
            type: 'object',
            fields: [
                { name: 'yes', title: 'Oui', type: 'string' },
                { name: 'no', title: 'Non', type: 'string' },
                { name: 'cancel', title: 'Annuler', type: 'string' },
                { name: 'confirm', title: 'Confirmer', type: 'string' },
                { name: 'save', title: 'Sauvegarder', type: 'string' },
                { name: 'close', title: 'Fermer', type: 'string' },
                { name: 'back', title: 'Retour', type: 'string' },
                { name: 'next', title: 'Suivant', type: 'string' },
            ],
        }),
    ],

    preview: {
        prepare() {
            return {
                title: 'Textes du site',
                subtitle: 'Contenu éditable',
            }
        },
    },
})
