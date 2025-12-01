
export const SOFT_SENTENCES = [
    "Fais un compliment à chaque personne de la table.",
    "Raconte un secret que personne ne connais autour de la table.",
    "Quelle est ta plus longue période sans te laver et date de ta dernière douche ?",
    "Date de ta dernière branlette / activité sexuelle ?",
    "Quelle est la personne que tu trouve la plus belle de la pièce ? Fais un bruit de loup !"
];

export const getPenaltyText = (difficulty: number, isAlcoholMode: boolean): string => {
    if (!isAlcoholMode) {
        return SOFT_SENTENCES[Math.floor(Math.random() * SOFT_SENTENCES.length)];
    }

    switch (difficulty) {
        case 1:
            return "Boire 2 gorgées";
        case 2:
            return "Boire 5 gorgées";
        case 3:
            return "Demi cul sec";
        case 4:
            return "Cul sec";
        default:
            return "Boire 2 gorgées";
    }
};
