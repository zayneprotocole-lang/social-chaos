/**
 * INDOOR DARES LIBRARY
 * Mode: "Maison"
 * Vibe: Piccolo x Truth or Dare x Social Chaos
 *
 * Levels:
 * 1 (Chill): Icebreakers, Fun, Anecdotes
 * 2 (Spicy): Physique, Vérité, Drague, Tension
 * 3 (Chaos): Phone leaks, Social risks, Hardcore truths
 */

import { DareDocument } from '@/types'

export const INDOOR_DARES: Omit<DareDocument, 'id'>[] = [
  // ==========================================
  // NIVEAU 1 : CHILL (Brise-glace & Fun)
  // ==========================================
  {
    content:
      "Fais un discours de 1 minute pour expliquer pourquoi l'hôte de la soirée est une personne incroyable (ou horrible, au choix).",
    difficultyLevel: 1,
    categoryTags: ['Fun', 'Indoor', 'Acting'],
    xpReward: 10,
  },
  {
    content:
      "Imite une personne présente dans la pièce. Les autres doivent deviner qui c'est. Si personne ne trouve, tu bois 3 gorgées.",
    difficultyLevel: 1,
    categoryTags: ['Fun', 'Indoor', 'Acting'],
    xpReward: 10,
  },
  {
    content:
      "Le groupe choisit un mot interdit. Jusqu'à ton prochain tour, si tu le dis, tu bois.",
    difficultyLevel: 1,
    categoryTags: ['Fun', 'Indoor', 'Soft'],
    xpReward: 10,
  },
  {
    content:
      'Battle de regards avec la personne à ta droite. Le premier qui rit ou cligne des yeux a perdu.',
    difficultyLevel: 1,
    categoryTags: ['Indoor', 'Soft', 'Duel'],
    xpReward: 10,
  },
  {
    content:
      "Raconte ta pire date ou ton pire râteau. Si l'histoire n'est pas assez gênante (jugement du groupe), tu bois.",
    difficultyLevel: 1,
    categoryTags: ['Truth', 'Indoor', 'Soft'],
    xpReward: 15,
  },
  {
    content: 'Mime ton job (ou tes études) de façon sexy. Le groupe vote /10.',
    difficultyLevel: 1,
    categoryTags: ['Fun', 'Indoor', 'Acting'],
    xpReward: 15,
  },
  {
    content:
      'Nomme 3 personnes dans la pièce avec qui tu pourrais survivre sur une île déserte et pourquoi.',
    difficultyLevel: 1,
    categoryTags: ['Truth', 'Indoor', 'Social'],
    xpReward: 10,
  },
  {
    content:
      'Quel est le pire cadeau que tu aies jamais reçu ? Dis la vérité ou bois 2 gorgées.',
    difficultyLevel: 1,
    categoryTags: ['Truth', 'Indoor', 'Soft'],
    xpReward: 10,
  },

  // ==========================================
  // NIVEAU 2 : SPICY (Tension, Contact, Vérité)
  // ==========================================
  {
    content:
      "Choisis deux personnes dans la pièce. Elles doivent s'embrasser (sur la joue ou...) sinon elles boivent toutes les deux.",
    difficultyLevel: 2,
    categoryTags: ['Spicy', 'Indoor', 'Cupidon'],
    xpReward: 20,
  },
  {
    content:
      'Laisse la personne à ta gauche te recoiffer (ou te décoiffer) comme elle veut pendant 1 minute.',
    difficultyLevel: 2,
    categoryTags: ['Physique', 'Indoor', 'Humiliant'],
    xpReward: 20,
  },
  {
    content: 'Masse les épaules de ton voisin de droite pendant 2 tours.',
    difficultyLevel: 2,
    categoryTags: ['Physique', 'Indoor', 'Soft'],
    xpReward: 20,
  },
  {
    content:
      'Fais un compliment sincère et physique à la personne que tu trouves la plus attirante ici.',
    difficultyLevel: 2,
    categoryTags: ['Drague', 'Indoor', 'Truth'],
    xpReward: 25,
  },
  {
    content:
      "Assieds-toi sur les genoux de quelqu'un (choisi par le groupe) pour les 2 prochains tours.",
    difficultyLevel: 2,
    categoryTags: ['Physique', 'Indoor', 'Drague'],
    xpReward: 25,
  },
  {
    content:
      'Le groupe te pose 3 questions indiscrètes. Tu dois répondre honnêtement ou finir ton verre.',
    difficultyLevel: 2,
    categoryTags: ['Truth', 'Indoor', 'Chaos'],
    xpReward: 25,
  },
  {
    content:
      'Échange un vêtement (t-shirt, chaussette, accessoire) avec la personne de ton choix.',
    difficultyLevel: 2,
    categoryTags: ['Fun', 'Indoor', 'Soft'],
    xpReward: 20,
  },
  {
    content:
      'Refais la scène de Titanic (Je vole Jack !) avec la personne de ton choix au milieu de la pièce.',
    difficultyLevel: 2,
    categoryTags: ['Acting', 'Indoor', 'Duo'],
    xpReward: 20,
  },
  {
    content:
      "Joue à 'Je n'ai jamais' : Dis une chose que tu as déjà faite. Tous ceux qui l'ont fait boivent. Si personne ne boit, tu finis ton verre.",
    difficultyLevel: 2,
    categoryTags: ['Truth', 'Indoor', 'Group'],
    xpReward: 20,
  },
  {
    content:
      'Les yeux bandés, tu as 1 minute pour reconnaître 2 personnes au toucher (mains ou visage uniquement).',
    difficultyLevel: 2,
    categoryTags: ['Physique', 'Indoor', 'Sensuel'],
    xpReward: 25,
  },

  // ==========================================
  // NIVEAU 3 : CHAOS (Digital, Social Risk, Hardcore)
  // ==========================================
  {
    content:
      "Déverrouille ton téléphone et donne-le à ton voisin de droite. Il a 30 secondes pour regarder ce qu'il veut (photos, notes, dms) sans rien modifier.",
    difficultyLevel: 3,
    categoryTags: ['Chaos', 'Indoor', 'Phone'],
    xpReward: 50,
  },
  {
    content:
      "Envoie un message vocal à ton dernier match Tinder/Bumble : 'J'ai rêvé de toi cette nuit, c'était bizarre...'",
    difficultyLevel: 3,
    categoryTags: ['Chaos', 'Indoor', 'Phone'],
    xpReward: 40,
  },
  {
    content:
      'Le groupe choisit une photo dans ta galerie. Tu dois la poster en Story Instagram/Snapchat avec la légende de leur choix.',
    difficultyLevel: 3,
    categoryTags: ['Chaos', 'Indoor', 'Social'],
    xpReward: 45,
  },
  {
    content:
      'Appelle un de tes parents et dis-leur que tu vas te marier le mois prochain. Tu ne peux pas démentir avant 2 minutes.',
    difficultyLevel: 3,
    categoryTags: ['Chaos', 'Indoor', 'Phone'],
    xpReward: 50,
  },
  {
    content:
      'Montre au groupe ta dernière recherche Google et ta dernière vidéo YouTube/TikTok likée.',
    difficultyLevel: 3,
    categoryTags: ['Chaos', 'Indoor', 'Phone'],
    xpReward: 30,
  },
  {
    content:
      "DM ta célébrité préférée et demande-lui de l'argent. Montre la preuve.",
    difficultyLevel: 3,
    categoryTags: ['Chaos', 'Indoor', 'Social'],
    xpReward: 35,
  },
  {
    content:
      "Note secrètement chaque personne de la pièce sur 10 sur un bout de papier. L'hôte lit les notes à voix haute sans dire qui est qui.",
    difficultyLevel: 3,
    categoryTags: ['Chaos', 'Indoor', 'Truth'],
    xpReward: 50,
  },
  {
    content:
      "Envoie 'Je t'aime' à la 5ème personne de tes contacts récents (SMS/WhatsApp). Pas d'explications avant demain.",
    difficultyLevel: 3,
    categoryTags: ['Chaos', 'Indoor', 'Phone'],
    xpReward: 60,
  },
]
