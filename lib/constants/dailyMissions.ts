/**
 * Constantes pour les Missions Quotidiennes
 *
 * Contient les catégories et les missions associées.
 */

import type {
  DailyMissionCategory,
  DailyMission,
  DailyMissionCategoryId,
} from '@/lib/types/dailyMission'

// ========================================
// CATÉGORIES
// ========================================

export const DAILY_MISSION_CATEGORIES: DailyMissionCategory[] = [
  {
    id: 'kindness',
    name: 'Bonne Action',
    emoji: '🤝',
    description: 'Répands la bienveillance autour de toi',
    color: '#10b981', // Emerald
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'growth',
    name: 'Dépassement de Soi',
    emoji: '🔥',
    description: 'Sors de ta zone de confort',
    color: '#f97316', // Orange
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'seduction',
    name: 'Séduction',
    emoji: '💘',
    description: 'Développe ton charme naturel',
    color: '#ec4899', // Pink
    gradient: 'from-pink-500 to-rose-500',
  },
]

// Helper pour récupérer une catégorie
export function getCategoryById(
  id: DailyMissionCategoryId
): DailyMissionCategory | undefined {
  return DAILY_MISSION_CATEGORIES.find((cat) => cat.id === id)
}

// ========================================
// MISSIONS PAR CATÉGORIE
// ========================================

export const DAILY_MISSIONS: DailyMission[] = [
  // ================================================
  // 🤝 BONNE ACTION
  // ================================================
  {
    id: 'kindness-01',
    categoryId: 'kindness',
    content: "Offre un café ou un thé à quelqu'un aujourd'hui",
    tips: "Choisis quelqu'un qui a l'air fatigué ou stressé",
  },
  {
    id: 'kindness-02',
    categoryId: 'kindness',
    content: 'Fais un compliment sincère à 3 personnes différentes',
    tips: 'Sois précis dans tes compliments, évite les généralités',
  },
  {
    id: 'kindness-03',
    categoryId: 'kindness',
    content: "Aide quelqu'un sans qu'on te le demande",
    tips: "Ouvre l'œil : quelqu'un qui porte des sacs lourds, qui cherche son chemin...",
  },
  {
    id: 'kindness-04',
    categoryId: 'kindness',
    content: "Envoie un message de remerciement à quelqu'un qui t'a aidé",
    tips: "Pense à un prof, un mentor, un ami... quelqu'un que tu n'as pas remercié",
  },
  {
    id: 'kindness-05',
    categoryId: 'kindness',
    content: 'Donne un pourboire généreux à un serveur ou livreur',
    tips: 'Accompagne-le d\'un sourire et d\'un "bonne journée"',
  },
  {
    id: 'kindness-06',
    categoryId: 'kindness',
    content: "Laisse passer quelqu'un devant toi dans une file",
    tips: "Choisis quelqu'un qui a l'air pressé ou qui porte peu d'articles",
  },
  {
    id: 'kindness-07',
    categoryId: 'kindness',
    content: 'Appelle un proche juste pour prendre de ses nouvelles',
    tips: "Pense à quelqu'un que tu n'as pas appelé depuis longtemps",
  },
  {
    id: 'kindness-08',
    categoryId: 'kindness',
    content: 'Ramasse un déchet qui traîne dans la rue',
    tips: "Petit geste, grand impact. Fais-le devant d'autres pour inspirer",
  },
  {
    id: 'kindness-09',
    categoryId: 'kindness',
    content: 'Souris et dis bonjour à 5 inconnus',
    tips: 'Contact visuel + sourire sincère = magie',
  },
  {
    id: 'kindness-10',
    categoryId: 'kindness',
    content:
      'Écris un post positif ou un commentaire encourageant sur les réseaux',
    tips: "Trouve quelqu'un qui partage son travail et encourage-le",
  },

  // ================================================
  // 🔥 DÉPASSEMENT DE SOI
  // ================================================
  {
    id: 'growth-01',
    categoryId: 'growth',
    content: 'Adresse la parole à un parfait inconnu pendant au moins 1 minute',
    tips: "Trouve un prétexte : demander l'heure, une direction, ou juste commenter la situation",
  },
  {
    id: 'growth-02',
    categoryId: 'growth',
    content: 'Chante ou fredonne en public (rue, transport, magasin)',
    tips: "Ça peut être discret au début, l'important c'est de le faire !",
  },
  {
    id: 'growth-03',
    categoryId: 'growth',
    content: 'Dis "non" à quelque chose que tu aurais accepté par politesse',
    tips: "Apprendre à poser ses limites, c'est se respecter",
  },
  {
    id: 'growth-04',
    categoryId: 'growth',
    content: 'Fais quelque chose seul que tu fais habituellement accompagné',
    tips: 'Restaurant, cinéma, concert... profite de ta propre compagnie',
  },
  {
    id: 'growth-05',
    categoryId: 'growth',
    content: 'Danse 30 secondes dans un lieu public',
    tips: 'Avec des écouteurs, ça passe mieux. Assume le regard des autres !',
  },
  {
    id: 'growth-06',
    categoryId: 'growth',
    content: "Exprime ton désaccord avec quelqu'un (respectueusement)",
    tips: 'Ton avis compte. Exprime-le avec bienveillance',
  },
  {
    id: 'growth-07',
    categoryId: 'growth',
    content:
      "Fais un discours improvisé de 30 secondes sur n'importe quel sujet",
    tips: 'Devant un ami, un collègue, ou même seul face au miroir',
  },
  {
    id: 'growth-08',
    categoryId: 'growth',
    content: 'Demande une réduction ou un avantage quelque part',
    tips: 'La pire chose qui puisse arriver : un "non". Et alors ?',
  },
  {
    id: 'growth-09',
    categoryId: 'growth',
    content:
      "Regarde les gens dans les yeux pendant les conversations aujourd'hui",
    tips: 'Contact visuel = confiance. Maintiens-le 3-5 secondes',
  },
  {
    id: 'growth-10',
    categoryId: 'growth',
    content: 'Partage une opinion impopulaire que tu as vraiment',
    tips: 'En groupe ou en conversation, ose exprimer ta vraie pensée',
  },

  // ================================================
  // 💘 SÉDUCTION
  // ================================================
  {
    id: 'seduction-01',
    categoryId: 'seduction',
    content: "Fais sourire quelqu'un qui te plaît avec un compliment original",
    tips: 'Évite les compliments physiques basiques. Sois créatif !',
  },
  {
    id: 'seduction-02',
    categoryId: 'seduction',
    content:
      "Maintiens un contact visuel de 3 secondes avec quelqu'un qui t'attire",
    tips: 'Souris légèrement. Le regard est le premier langage de la séduction',
  },
  {
    id: 'seduction-03',
    categoryId: 'seduction',
    content: "Engage une conversation avec quelqu'un qui t'attire",
    tips: 'Un commentaire sur le contexte suffit pour briser la glace',
  },
  {
    id: 'seduction-04',
    categoryId: 'seduction',
    content:
      "Demande le prénom de quelqu'un et utilise-le dans la conversation",
    tips: "Les gens adorent entendre leur prénom. C'est magique",
  },
  {
    id: 'seduction-05',
    categoryId: 'seduction',
    content: "Fais preuve d'humour avec quelqu'un qui te plaît",
    tips: "L'autodérision fonctionne bien. Ne te prends pas trop au sérieux",
  },
  {
    id: 'seduction-06',
    categoryId: 'seduction',
    content: "Propose un plan à quelqu'un (café, verre, balade...)",
    tips: 'Sois direct mais décontracté. Le pire c\'est un "non", et c\'est OK',
  },
  {
    id: 'seduction-07',
    categoryId: 'seduction',
    content: "Envoie un message flirt à quelqu'un qui te plaît",
    tips: 'Sois toi-même, avec une touche de mystère',
  },
  {
    id: 'seduction-08',
    categoryId: 'seduction',
    content:
      "Demande le numéro ou l'insta de quelqu'un que tu trouves attirant",
    tips: "C'est juste un numéro. Le courage, c'est sexy",
  },
  {
    id: 'seduction-09',
    categoryId: 'seduction',
    content: "Pose une question personnelle intéressante à quelqu'un",
    tips: '"C\'est quoi ton rêve le plus fou ?" crée de la connexion',
  },
  {
    id: 'seduction-10',
    categoryId: 'seduction',
    content: "Complimente le style vestimentaire de quelqu'un",
    tips: 'Sois précis : "J\'adore ta veste" > "T\'es bien habillé"',
  },
]

// Helper pour récupérer les missions d'une catégorie
export function getMissionsByCategory(
  categoryId: DailyMissionCategoryId
): DailyMission[] {
  return DAILY_MISSIONS.filter((m) => m.categoryId === categoryId)
}

// Helper pour récupérer une mission aléatoire d'une catégorie
export function getRandomMission(
  categoryId: DailyMissionCategoryId
): DailyMission | null {
  const missions = getMissionsByCategory(categoryId)
  if (missions.length === 0) return null
  return missions[Math.floor(Math.random() * missions.length)]
}

// Helper pour récupérer une mission par ID
export function getMissionById(id: string): DailyMission | undefined {
  return DAILY_MISSIONS.find((m) => m.id === id)
}

// ========================================
// CONSTANTES DE CONFIGURATION
// ========================================

export const DAYS_OF_WEEK = [
  { id: 0, short: 'D', name: 'Dimanche' },
  { id: 1, short: 'L', name: 'Lundi' },
  { id: 2, short: 'M', name: 'Mardi' },
  { id: 3, short: 'M', name: 'Mercredi' },
  { id: 4, short: 'J', name: 'Jeudi' },
  { id: 5, short: 'V', name: 'Vendredi' },
  { id: 6, short: 'S', name: 'Samedi' },
]

export const DEFAULT_NOTIFICATION_TIME = '09:00'
