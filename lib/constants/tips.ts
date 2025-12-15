/**
 * Centralized tips content for the TipBubble system
 * 
 * Add your tip texts here. Components reference tips by their ID.
 * This makes it easy to update all tips in one place.
 */

export const tips: Record<string, string> = {
    // === ACTIONS DE JEU ===
    "action-joker": "Conseil à venir...",
    "action-reroll": "Conseil à venir...",
    "action-swap": "Conseil à venir...",
    "action-accompagnement": "Conseil à venir...",
    "action-validate": "Conseil à venir...",
    "action-abandon": "Conseil à venir...",
    "action-ongoing": "Conseil à venir...",

    // === LOBBY ===
    "lobby-add-player": "Conseil à venir...",
    "lobby-difficulty": "Conseil à venir...",
    "lobby-duration": "Conseil à venir...",
    "lobby-progressive": "Conseil à venir...",
    "lobby-start": "Conseil à venir...",

    // === PROFILS ===
    "profile-preferences": "Conseil à venir...",
    "profile-save-guest": "Conseil à venir...",

    // === ÉCRAN DE FIN ===
    "endgame-goat": "Conseil à venir...",
    "endgame-chevre": "Conseil à venir...",
    "endgame-mentor-link": "Conseil à venir...",

    // === GÉNÉRAL ===
    "timer": "Conseil à venir...",
    "score": "Conseil à venir...",
    "turn-indicator": "Conseil à venir...",
}

/**
 * Get a tip by ID with fallback
 */
export function getTip(tipId: string): string {
    return tips[tipId] || "Conseil à venir..."
}

/**
 * Check if tips are enabled globally
 * Set to false to hide all tips in the app
 */
export const TIPS_ENABLED = true
