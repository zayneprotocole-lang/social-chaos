/**
 * Centralized Copywriting / Text Content
 * 
 * All user-facing text in the app should be defined here.
 * This makes it easy to:
 * - Update wording without touching components
 * - Prepare for future i18n/translations
 * - Maintain consistency across the app
 * 
 * Usage:
 * import { TEXTS } from '@/lib/constants/texts'
 * <h1>{TEXTS.home.title}</h1>
 */

export const TEXTS = {
    // ========================================
    // APP GENERAL
    // ========================================
    app: {
        name: "Social Chaos",
        tagline: "Le jeu de soirée qui va détruire votre dignité (et vos amitiés).",
        version: "1.2.0",
    },

    // ========================================
    // HOME PAGE
    // ========================================
    home: {
        title: "SOCIAL CHAOS",
        subtitle: "Le jeu de soirée qui va détruire votre dignité (et vos amitiés).",
        playButton: "JOUER",
        creatingButton: "CRÉATION...",
        resumeGame: "REPRENDRE LA PARTIE",

        features: {
            multiplayer: "Multi-joueurs",
            hardcore: "Gages Hardcore",
            fastPace: "Rythme Rapide",
        },

        card: {
            title: "Prêt à jouer ?",
            description: "Lance une partie locale et détruis des amitiés.",
        },
    },

    // ========================================
    // NAVIGATION
    // ========================================
    nav: {
        library: "Bibliothèque",
        profiles: "Profils",
        history: "Historique",
        premium: "Premium",
        help: "Aide",
        settings: "Paramètres",
    },

    // ========================================
    // LOBBY
    // ========================================
    lobby: {
        title: "Lobby",
        addPlayer: "Ajouter un joueur",
        addGuest: "Ajouter un invité",
        startGame: "LANCER LA PARTIE",
        minPlayers: "Minimum 1 joueur requis",

        settings: {
            difficulty: "Difficulté",
            duration: "Durée",
            progressive: "Mode Progressif",
            categories: "Catégories",
        },

        difficulties: {
            soft: { name: "Soft", description: "Pas de timer, gages faciles" },
            spicy: { name: "Spicy", description: "Timer 90s, gages pimentés" },
            intense: { name: "Intense", description: "Timer 60s, gages corsés" },
            apocalypse: { name: "Apocalypse", description: "Timer 45s, gages extrêmes" },
        },

        timeEstimate: "Durée estimée",
    },

    // ========================================
    // GAME
    // ========================================
    game: {
        drawCard: "TIRER UNE CARTE",
        validate: "Défi Validé ✓",
        abandon: "Abandonner",
        ongoing: "En cours...",

        actions: {
            joker: "Joker",
            reroll: "Nouvelle carte",
            swap: "Échanger",
            accompagnement: "Accompagnement",
        },

        sentence: {
            title: "Sentence",
            backToDare: "Revenir au gage",
            done: "Sentence effectuée",
        },

        success: {
            title: "Bien joué ! 🎉",
            message: "Tu as relevé le défi.",
        },

        timer: {
            expired: "Temps écoulé !",
        },

        turn: "Tour",
        round: "Manche",
    },

    // ========================================
    // END GAME
    // ========================================
    endGame: {
        title: "Partie terminée !",
        winner: "Vainqueur",
        loser: "Perdant",
        goat: "GOAT 👑",
        chevre: "Chèvre 🐐",

        mentorLink: {
            created: "Lien Mentor/Élève créé !",
            renewed: "Lien Mentor/Élève renouvelé !",
        },

        playAgain: "Rejouer",
        backToHome: "Retour à l'accueil",
    },

    // ========================================
    // ACTIONS
    // ========================================
    actions: {
        joker: {
            name: "Joker",
            description: "Passe le gage sans pénalité",
            remaining: "restant",
        },
        reroll: {
            name: "Nouvelle carte",
            description: "Tire une nouvelle carte",
            remaining: "restant",
        },
        swap: {
            name: "Échanger",
            description: "Échange le gage avec un autre joueur",
            remaining: "restant",
        },
        accompagnement: {
            name: "Accompagnement",
            title: "Accompagnement",
            subtitle: "Effectuez ce gage en duo avec votre partenaire",
            invoke: "Invoquer",
            indicator: "En duo avec",
        },
    },

    // ========================================
    // PREMIUM
    // ========================================
    premium: {
        title: "Premium",
        subtitle: "Débloquez l'expérience ultime",
        button: "Devenir Premium",
        comingSoon: "Bientôt disponible !",
        workingOnIt: "Nous travaillons dessus 🚀",

        pricing: {
            monthly: "/mois",
            yearly: "/an",
            save: "économisez",
        },

        benefits: {
            packs: { title: "Packs de gages exclusifs", desc: "Accès à tous les packs thématiques" },
            noAds: { title: "Aucune publicité", desc: "Expérience fluide sans interruption" },
            exclusive: { title: "Gages Premium", desc: "Des défis inédits et épicés" },
            earlyAccess: { title: "Avant-premières", desc: "Accès anticipé aux nouvelles fonctionnalités" },
        },
    },

    // ========================================
    // SETTINGS
    // ========================================
    settings: {
        title: "Paramètres",
        language: "Langue",
        colorblind: {
            title: "Mode daltonien",
            description: "Adapte les couleurs",
        },
        legal: "CGU & Mentions légales",
        back: "Retour",
    },

    // ========================================
    // HELP
    // ========================================
    help: {
        title: "Aide & Informations",
        tabs: {
            rules: "Règles",
            changelog: "Mises à jour",
        },
        currentVersion: "Actuelle",
    },

    // ========================================
    // PROFILES
    // ========================================
    profiles: {
        title: "Profils",
        create: "Créer un profil",
        edit: "Modifier",
        delete: "Supprimer",
        preferences: "Préférences",
        saveProfile: "Sauvegarder le profil",
    },

    // ========================================
    // SAVED GAME
    // ========================================
    savedGame: {
        title: "Partie en cours",
        resume: "Reprendre",
        delete: "Supprimer",
        players: "joueurs",
        round: "Tour",
    },

    // ========================================
    // LOADING
    // ========================================
    loading: {
        preparing: "Préparation de la partie...",
        shuffling: "Mélange des cartes...",
        loading: "Chargement...",
    },

    // ========================================
    // COMMON
    // ========================================
    common: {
        yes: "Oui",
        no: "Non",
        cancel: "Annuler",
        confirm: "Confirmer",
        save: "Sauvegarder",
        close: "Fermer",
        back: "Retour",
        next: "Suivant",
        points: "points",
        player: "joueur",
        players: "joueurs",
    },

    // ========================================
    // ERRORS
    // ========================================
    errors: {
        generic: "Une erreur est survenue",
        networkError: "Erreur de connexion",
        sessionNotFound: "Partie introuvable",
        tryAgain: "Réessayer",
    },
}

/**
 * Helper to get nested text values safely
 * Usage: getText('home.title') // Returns "SOCIAL CHAOS"
 */
export function getText(path: string, fallback: string = ''): string {
    const keys = path.split('.')
    let result: unknown = TEXTS

    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = (result as Record<string, unknown>)[key]
        } else {
            return fallback
        }
    }

    return typeof result === 'string' ? result : fallback
}
