# PROJECT KNOWLEDGE - Social Chaos

# <!--

# INSTRUCTION AGENT IA - LIRE EN PRIORITÉ

Ce fichier est la source unique de vérité du projet.
Avant toute tâche (création, modification, debug, audit) :

1. Lis ce fichier entièrement
2. Réfère-toi aux sections pertinentes
3. # Mets à jour ce fichier si ta tâche modifie le projet
   -->

⚠️ **AGENT : Consulte ce fichier AVANT chaque tâche pour comprendre le contexte du projet.**

📅 **Dernière mise à jour** : 19 décembre 2024 15:00  
🔄 **Mis à jour par** : Réorganisation catégories, fix auth mobile, cleanup code, charte graphique

> 🆕 **[Voir les modifications des dernières 24h](#dernières-modifications-24h)** ← Nouveautés importantes !
>
> 🎨 **[Charte Graphique](./docs/CHARTE_GRAPHIQUE.md)** ← Design System officiel

---

## 📑 Table des Matières

1. [**→ Dernières Modifications (24h)**](#dernières-modifications-24h) ⭐ NOUVEAU
2. [Vision et Concept](#1-vision-et-concept)
3. [Stack Technique](#2-stack-technique)
4. [Structure du Projet](#3-structure-du-projet)
5. [Types TypeScript](#4-types-typescript)
6. [Stores et État](#5-stores-et-état)
7. [Services et Data Access](#6-services-et-data-access)
8. [Hooks Personnalisés](#7-hooks-personnalisés)
9. [Composants](#8-composants)
10. [Constants et Configuration](#9-constants-et-configuration)
11. [Routes et Pages](#10-routes-et-pages)
12. [Firebase Structure](#11-firebase-structure)
13. [Fonctionnalités](#12-fonctionnalités)
14. [Conventions du Projet](#13-conventions-du-projet)
15. [Index des README](#14-index-des-readme)
16. [Historique des Modifications](#15-historique-des-modifications)
17. [Workflow de Développement](#16-workflow-de-développement)
18. [Points d'Attention](#17-points-dattention)

---

## Dernières Modifications (24h)

> 📅 **19 Décembre 2024** - Réorganisation UI lobby, fix auth mobile, documentation

### 🎯 1. **Réorganisation Catégories Lobby** (UI MAJEUR)

- ✅ Catégories groupées en 3 thèmes : "Pour séduire", "Pour s'amuser", "Pour faire des rencontres"
- ✅ Nouveaux noms : Sauvage → **Rizz** 😎, Folie → **Absurde** 😈
- ✅ Nouveaux emojis : Échange 🤝
- ✅ Descriptions toujours visibles sous chaque catégorie
- ✅ Structure `categoryGroups` remplace `categories` (array flat)

### 🍺 2. **Mode Alcool Refondu**

- Carte explicative avec icône dynamique (🍺/☕)
- Couleurs : Amber pour alcool, Cyan pour sans alcool
- Description : "Pénalités = gorgées" vs "Pénalités = vérités"

### 🔢 3. **Contrainte 3 Catégories Minimum**

- Bouton "Démarrer" désactivé si < 3 catégories sélectionnées
- Message dynamique avec compteur

### 📱 4. **Fix Auth Mobile (Popup Blocked)**

- `signInWithRedirect` utilisé sur mobile (pas popup)
- `handleGoogleRedirectResult()` appelé au mount
- Page `/auth` : auto-redirect si déjà authentifié

### 🧹 5. **Cleanup Code**

**Fichiers SUPPRIMÉS** :

- ❌ `components/navigation/HamburgerMenu.tsx`
- ❌ `components/navigation/MenuItem.tsx`
- ❌ `components/home/` (dossier entier)
- ❌ `app/test-header/page.tsx`

**Settings page enrichie** : Liens Règles + Changelog ajoutés

### 📚 6. **Documentation**

- 🆕 `docs/CHARTE_GRAPHIQUE.md` créé (design system complet)
- `0_PROJECT_QUICK_REF.md` mis à jour
- `_PROJECT_KNOWLEDGE.md` mis à jour

---

> 📅 **17 Décembre 2024** - Intégration complète de l'authentification et refactoring majeur

### 🔐 1. **Authentification Firebase** (MAJEUR)

**Implémentation complète de Firebase Auth**

- ✅ Page `/auth` avec connexion Google + Email
- ✅ Hook `useAuth` pour état authentification global
- ✅ Hook `useInitUser` pour initialisation profils après login
- ✅ Redirection automatique si non authentifié lors création partie
- ✅ Firestore Rules sécurisées (users + sessions)

**Nouveaux fichiers créés** :

- `app/auth/page.tsx`
- `hooks/useAuth.ts`
- `hooks/useInitUser.ts`
- `components/auth/EmailAuthForm.tsx`
- `.env.local` (variables Firebase)

**Impact** : 🔴 **BREAKING** - Tous les utilisateurs doivent maintenant se connecter pour créer des parties.

---

### 👤 2. **Refactoring Système de Profils**

**Séparation Host / Guest** :

```typescript
// AVANT
profiles: LocalPlayerProfile[]  // Mélangés

// APRÈS
hostProfile: Profile | null      // Profil authentifié unique
guestProfiles: Profile[]         // Profils invités locaux
```

**Modifications clés** :

- `useProfileStore` refactoré complètement
- Synchronisation Firestore : `/users/{userId}` pour profils auth
- Migration automatique des anciens profils
- Photo Google **désactivée** comme avatar par défaut

**Page `/profiles` améliorée** :

- Affichage profil utilisateur en haut (photo, nom, email)
- Bouton "Se déconnecter" **déplacé** depuis hamburger menu
- Liste "Joueurs Invités" séparée

**Fichiers modifiés** :

- `lib/store/useProfileStore.ts` (refactoring complet)
- `components/profile/ProfileList.tsx`
- `app/profiles/page.tsx`
- `hooks/useInitUser.ts`

---

### 🐛 3. **Corrections Bugs Critiques**

#### a) **React Error #185 (Boucle Infinie)** ✅ RÉSOLU

**Problème** : `app/lobby/[code]/page.tsx` causait boucle infinie  
**Cause** : `getAllProfiles()` retournait nouvelle référence à chaque appel  
**Solution** :

```typescript
// AVANT
const allProfiles = useProfileStore((s) => s.getAllProfiles())

// APRÈS
const hostProfile = useProfileStore((s) => s.hostProfile)
const guestProfiles = useProfileStore((s) => s.guestProfiles)
const allProfiles = useMemo(
  () => (hostProfile ? [hostProfile, ...guestProfiles] : guestProfiles),
  [hostProfile, guestProfiles]
)
```

#### b) **Firestore "Missing Permissions"** ✅ RÉSOLU

**Problème** : Impossible de créer sessions ou initialiser profils  
**Solutions** :

1. **Collection `/users`** :

   ```javascript
   allow read, create, update, delete: if isAuthenticated() && isOwner(userId);
   ```

2. **Collection `/sessions`** :
   - Ajout `creatorId` et `participantIds` dans `SessionDocument`
   - `dataAccess.createSession` vérifie auth et ajoute automatiquement
   - Rules vérifi ent `creatorId == auth.uid`

**Fichiers modifiés** :

- `firestore.rules`
- `lib/services/dataAccess.ts`
- `types/index.ts` (SessionDocument étendu)

---

### 🎨 4. **Améliorations UI**

#### Homepage (`app/page.tsx`)

- ❌ **Supprimé** : Cartes Communauté, Mentor/Élève, Gestion
- ✅ **Conservé** : Profils, Bibliothèque, Historique
- ✅ **Ajouté** : Vérification auth avant création partie
- ✅ **Amélioré** : Messages d'erreur avec redirection `/auth`

#### ~~Hamburger Menu~~ **SUPPRIMÉ** (19 Déc)

> ⚠️ Ce composant a été supprimé. Settings et Premium sont maintenant dans le Header.

---

### 📊 5. **Structure de Données Firebase**

#### Nouvelle collection `/users/{userId}`

```typescript
interface UserProfile {
  name: string
  avatarId: string | null
  avatarUrl: string | null
  categoryPreferences: {
    want: string[]
    avoid: string[]
  }
}
```

#### Extension `/sessions/{sessionId}`

```typescript
interface SessionDocument {
  // ... champs existants
  creatorId: string // 🆕 UID créateur
  participantIds: string[] // 🆕 Liste UIDs participants
}
```

---

### ⚙️ 6. **Configuration Requise**

#### Variables d'environnement (`.env.local`) 🔴 OBLIGATOIRE

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

#### Déploiement Vercel

⚠️ **Action requise** : Ajouter toutes les variables Firebase dans Settings > Environment Variables

---

### 📦 7. **Résumé des Fichiers Modifiés**

| Catégorie      | Fichiers   | Changements                                                              |
| -------------- | ---------- | ------------------------------------------------------------------------ |
| **Nouveaux**   | 5 fichiers | auth/page.tsx, useAuth.ts, useInitUser.ts, EmailAuthForm.tsx, .env.local |
| **Stores**     | 1 fichier  | useProfileStore.ts (refactoring majeur)                                  |
| **Components** | 3 fichiers | ProfileList.tsx, HamburgerMenu.tsx, profiles/page.tsx                    |
| **Services**   | 1 fichier  | dataAccess.ts (creatorId/participantIds)                                 |
| **Types**      | 1 fichier  | types/index.ts (SessionDocument)                                         |
| **Pages**      | 2 fichiers | page.tsx, lobby/[code]/page.tsx                                          |
| **Config**     | 1 fichier  | firestore.rules                                                          |

**Total** : **14 fichiers** modifiés ou créés

---

### ✅ 8. **Status Actuel**

| Aspect       | État           | Notes                      |
| ------------ | -------------- | -------------------------- |
| **Build**    | ✅ Réussi      | 0 erreurs TypeScript       |
| **Lint**     | ✅ Propre      | 0 warnings                 |
| **Deploy**   | ✅ Production  | Vercel sync                |
| **Auth**     | ✅ Fonctionnel | Google + Email             |
| **Profiles** | ✅ Migré       | Host/Guest séparés         |
| **Sessions** | ✅ Sécurisé    | Firestore rules appliquées |

---

### 🚨 9. **Points d'Attention POST-DÉPLOIEMENT**

1. **Tester authentification Google en production**
2. **Vérifier création de partie après login**
3. **Vérifier migration profils existants**
4. **Valider domaines autorisés Firebase Console**
5. **Monitorer erreurs Firestore permissions**

---

### 🔄 10. **Migration Utilisateurs**

**Impact sur utilisateurs existants** :

- ✅ Profils locaux migrés automatiquement
- 🔴 Reconnexion obligatoire
- 🔴 Photo Google non utilisée → doivent choisir avatar personnalisé
- ✅ Pas de perte de données

**Workflow nouvelle connexion** :

1. Visit homepage
2. Click "JOUER EN EXTÉRIEUR"
3. Redirection `/auth` si non connecté
4. Login Google/Email
5. Profil initialisé automatiquement
6. Retour création partie

---

**📏 Lignes modifiées totales** : ~850 lignes  
**⏱️ Temps de développement** : ~4 heures  
**🎯 Impact** : MAJEUR - Architecture authentification complète

## 1. Vision et Concept

### Qu'est-ce que Social Chaos ?

**Social Chaos** est un jeu de soirée mobile/web interactif de type _"action ou vérité"_ modernisé. Les joueurs se réunissent en personne pour réaliser des défis amusants et dynamiques qui créent des moments mémorables.

### Problème résolu

- **Facilite les soirées** : Génère automatiquement des défis variés
- **Engage tous les joueurs** : Système de rotation équitable
- **Gamification** : Points, jokers, et mécaniques de jeu pour maintenir l'intérêt
- **Progressif** : Les défis s'adaptent au niveau de difficulté choisi

### Cible utilisateur

- **Groupes d'amis** (18-35 ans principalement)
- **Soirées décontractées** ou pré-soirées
- **Mobile-first** : Jouable sur smartphone en passant l'appareil

---

## 2. Stack Technique

### Technologies principales

| Tech              | Version  | Pourquoi ce choix                            |
| ----------------- | -------- | -------------------------------------------- |
| **Next.js**       | 16.0.7   | App Router, Server Components, optimisations |
| **React**         | 19.2.3   | UI déclarative, écosystème riche             |
| **TypeScript**    | 5.x      | Typage fort, meilleure DX                    |
| **Firebase**      | 12.6.0   | Backend complet (Auth, Firestore, Storage)   |
| **Zustand**       | 5.0.8    | État global simple et performant             |
| **React Query**   | 5.90.11  | Gestion cache et sync serveur                |
| **Framer Motion** | 12.23.24 | Animations fluides                           |
| **Tailwind CSS**  | 4.x      | Styling rapide et utilitaire                 |
| **shadcn/ui**     | -        | Composants UI accessibles (Radix)            |

### Outils de développement

- **ESLint 9** : Qualité de code (0 erreurs actuellement ✅)
- **Prettier** : Formatage automatique
- **Vitest** : Tests unitaires
- **Husky + lint-staged** : Pre-commit hooks
- **Vercel** : Hébergement et déploiement

### Versions critiques

- **Node.js** : ≥ 20.x recommandé
- **npm** : Gestionnaire de packages utilisé

---

## 3. Structure du Projet

```
social-chaos/
├── app/                        # Routes Next.js (App Router)
│   ├── page.tsx               # 🏠 Page d'accueil
│   ├── layout.tsx             # Layout racine avec providers
│   ├── globals.css            # Styles globaux Tailwind
│   ├── actions/               # Server Actions Next.js
│   │   └── game.ts           # Actions de jeu serveur
│   ├── game/[id]/            # 🎮 Session de jeu en cours
│   │   └── page.tsx
│   ├── lobby/[code]/         # 🎭 Lobby multi-joueurs
│   │   └── page.tsx
│   ├── profiles/             # 👤 Gestion des profils
│   │   └── page.tsx
│   ├── library/              # 📚 Favoris sauvegardés
│   │   └── page.tsx
│   └── history/              # 📜 Historique des parties
│       └── page.tsx
│
├── components/                # Composants React organisés par domaine
│   ├── game/                 # Composants de jeu (14 fichiers)
│   │   ├── DareCard.tsx
│   │   ├── GameTimer.tsx
│   │   ├── Controls.tsx
│   │   ├── GameEndScreen.tsx
│   │   ├── SuccessPopup.tsx
│   │   ├── SentencePopup.tsx
│   │   ├── AbandonOverlay.tsx
│   │   ├── GameSidebar.tsx
│   │   ├── ActionDock.tsx
│   │   ├── AccompagnementModal.tsx
│   │   ├── PausePlayerManager.tsx
│   │   ├── OptionsMenu.tsx
│   │   ├── GameSkeleton.tsx
│   │   └── index.ts
│   ├── lobby/                # Composants lobby
│   │   ├── LobbyPlayerList.tsx
│   │   ├── PlayerProfileRow.tsx
│   │   ├── GameSettings.tsx
│   │   ├── DurationCard.tsx
│   │   ├── LobbyControls.tsx
│   │   └── index.ts
│   ├── profile/              # Création/édition profils
│   │   ├── ProfileCreator.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── AvatarSelector.tsx
│   │   ├── CategoryPreferencesSelector.tsx
│   │   └── index.ts
│   ├── ui/                   # Primitives UI (shadcn/radix)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── switch.tsx
│   │   ├── label.tsx
│   │   ├── LoadingScreen.tsx
│   │   └── ...
│   ├── help/                 # Modal d'aide
│   │   └── HelpModal.tsx
│   ├── premium/              # Modal premium
│   │   └── PremiumModal.tsx
│   ├── settings/             # Modal paramètres
│   │   └── SettingsModal.tsx
│   ├── home/                 # Composants page accueil
│   │   ├── ResumeGameCard.tsx
│   │   └── QuickActions.tsx
│   └── providers/            # React Query provider
│       └── QueryProvider.tsx
│
├── hooks/                    # Hooks personnalisés (9 fichiers)
│   ├── useGameFlow.ts        # Logique flux de jeu
│   ├── useGameActions.ts     # Actions joueur (joker, swap)
│   ├── useLobbyLogicV2.ts    # Logique lobby
│   ├── useGameSession.ts     # Chargement session
│   ├── useSessionQuery.ts    # React Query pour sessions
│   ├── useSessionMutations.ts# Mutations sessions
│   ├── useImagePicker.ts     # Sélection images
│   └── index.ts
│
├── lib/                      # Code partagé
│   ├── store/               # Stores Zustand (8 fichiers)
│   │   ├── useGameStore.ts
│   │   ├── useProfileStore.ts
│   │   ├── useSettingsStore.ts
│   │   ├── useSavedGameStore.ts
│   │   ├── useLobbyStore.ts
│   │   ├── useGuestStore.ts
│   │   ├── useLoadingStore.ts
│   │   └── useMentorEleveStore.ts
│   ├── services/            # Couche accès données
│   │   ├── dataAccess.ts    # Service principal Firebase
│   │   ├── gameService.ts   # Logique métier jeu
│   │   ├── historyService.ts
│   │   └── index.ts
│   ├── firebase/            # Client Firebase
│   │   ├── firestore.ts
│   │   ├── storage.ts
│   │   └── auth.ts
│   ├── constants/           # Config et constantes
│   │   ├── config.ts        # GAME_CONFIG, DIFFICULTY_CONFIG
│   │   ├── avatars.ts       # Liste avatars
│   │   └── index.ts
│   ├── validation/          # Schémas Zod
│   │   ├── profileSchema.ts
│   │   └── index.ts
│   ├── utils/               # Utilitaires
│   │   └── ...
│   ├── queries/             # Définitions React Query
│   │   └── ...
│   ├── utils.ts             # Utilitaires généraux (cn, etc.)
│   ├── types.ts             # Re-export types
│   └── queryClient.ts       # Config React Query
│
├── types/                   # Définitions TypeScript (7 fichiers)
│   ├── index.ts            # Types principaux
│   ├── profile.ts          # Types profils
│   ├── saved-game.ts       # Types sauvegarde
│   ├── history.ts          # Types historique
│   ├── lobby.ts            # Types lobby
│   ├── mentor-eleve.ts     # Types système mentor/élève
│   └── ...
│
├── public/                 # Assets statiques
│   ├── avatars/           # Images d'avatars (15 fichiers)
│   ├── icons/             # Icônes PWA
│   ├── manifest.json      # Manifest PWA
│   └── favicon.ico
│
└── firebase/              # Configuration Firebase
    ├── firestore.rules
    ├── firestore.indexes.json
    ├── storage.rules
    └── firebase.json
```

---

## 4. Types TypeScript

### Types principaux (`types/index.ts`)

#### 4.1 Types de base

```typescript
// Niveaux de difficulté
type DifficultyLevel = 1 | 2 | 3 | 4

// Catégories de défis
type DareCategory =
  | 'Alcool'
  | 'Soft'
  | 'Humiliant'
  | 'Drague'
  | 'Public'
  | 'Chaos'
  | 'Fun'
```

#### 4.2 Interface Dare

```typescript
interface Dare {
  id: string
  content: string
  difficultyLevel: DifficultyLevel
  categoryTags: DareCategory[]
  penaltyText?: string
  xpReward: number
}
```

#### 4.3 Interface Player

```typescript
interface Player {
  id: string
  name: string
  avatar?: string | null
  score: number
  jokersLeft: number // Actions "passer le défi"
  rerollsLeft: number // Actions "nouveau défi"
  exchangeLeft: number // Actions "échanger avec autre joueur"
  isHost: boolean
  isPaused?: boolean // Mode Gold (pause)
  hasBeenPaused?: boolean // A été disqualifié du ranking
  turnOrder?: number // Position dans l'ordre (0-based)
  createdAt?: Date
  profileId?: string // Lien vers LocalPlayerProfile
  preferences?: {
    want: string[] // Catégories préférées
    avoid: string[] // Catégories à éviter
  }

  // Système Accompagnement (V11)
  hasAccompagnement?: boolean
  accompagnementPartnerId?: string
  accompagnementPartnerName?: string
  accompagnementUsed?: boolean
}
```

#### 4.4 Interface GameSettings

```typescript
interface GameSettings {
  difficulty: DifficultyLevel
  tags: DareCategory[]
  timerDuration: number // en secondes
  alcoholMode: boolean
  includeCustomDares?: boolean
}
```

#### 4.5 Interface GameSession

```typescript
interface GameSession {
  id: string
  roomCode: string
  status: 'WAITING' | 'ACTIVE' | 'FINISHED'
  settings: GameSettings
  players: Player[]
  currentTurnPlayerId?: string
  currentDare?: Dare
  isPaused: boolean
  startedAt?: Date

  // Gestion tours (V4.0)
  roundsTotal: number
  roundsCompleted: number
  playersPlayedThisRound: number
  isProgressiveMode: boolean // Difficulté croissante
  endedAt?: Date | null

  // Mécaniques avancées
  turnCounter: number // Pour forcer reset timer
  swapUsedByPlayerIds?: string[] // Anti-revenge swap
}
```

#### 4.6 Documents Firestore

```typescript
// /sessions/{sessionId}
interface SessionDocument {
  id: string
  roomCode: string
  status: 'WAITING' | 'ACTIVE' | 'FINISHED
  settings: GameSettings
  createdAt: Timestamp
  roundsTotal: number
  roundsCompleted: number
  isProgressiveMode: boolean

  // Métadonnées historique (V9.1)
  winnerName?: string | null
  loserName?: string | null
  roundsPlayed?: number | null
  difficultyLabel?: string | null
  playedAt?: Timestamp | null

  // État dynamique
  currentTurnPlayerId?: string
  currentDare?: Dare
  isPaused?: boolean
  playersPlayedThisRound?: number
  startedAt?: Timestamp
  turnCounter: number
  swapUsedByPlayerIds?: string[]
}

// /sessions/{sessionId}/players/{playerId}
interface SessionPlayerDocument {
  id: string
  name: string
  avatar?: string | null
  score: number
  jokersLeft: number
  rerollsLeft: number
  exchangeLeft: number
  isHost: boolean
  hasBeenPaused?: boolean
  createdAt: Timestamp
  preferences?: {
    want: string[]
    avoid: string[]
  }
}

// /dares/{dareId}
interface DareDocument {
  id: string
  content: string
  difficultyLevel: DifficultyLevel
  categoryTags: DareCategory[]
  penaltyText?: string
  xpReward: number
}
```

### Types de profils (`types/profile.ts`)

```typescript
interface LocalPlayerProfile {
  id: string // UUID v4
  name: string
  avatarUri?: string
  createdAt: string // ISO 8601
  isHost: boolean // Un seul host par appareil
  preferences: {
    want: string[]
    avoid: string[]
  }
}

interface CreateProfileInput {
  name: string
  avatarUri?: string
  isHost?: boolean
  preferences?: {
    want: string[]
    avoid: string[]
  }
}
```

### Types sauvegarde (`types/saved-game.ts`)

```typescript
interface SavedGame {
  id: string
  savedAt: Date
  settings: {
    difficulty: DifficultyLevel
    totalTurns: number
    categories: DareCategory[]
    alcoholMode: boolean
    timerDuration: number
    isProgressiveMode: boolean
  }
  currentTurn: number
  roundsCompleted: number
  turnCounter: number
  currentPlayerId: string
  currentBoardState: {
    playersPlayedThisRound: number
  }
  players: SavedPlayer[]
  preview: {
    playerNames: string[]
    turnInfo: string // "Tour 3/6"
    currentPlayerName: string // "C'est à Marie"
  }
}
```

---

## 5. Stores et État

### Vue d'ensemble

L'application utilise **Zustand** pour l'état global et **React Query** pour l'état serveur.

### 5.1 useGameStore (`lib/store/useGameStore.ts`)

**Rôle** : Gestion session de jeu active (état volatil)

**State** :

```typescript
{
  activeSessionId: string | null
  activeRoomCode: string | null
  // Utilisé avec React Query pour synchronisation
}
```

**Actions** :

- `setActiveSession(id, code)` : Définit la session active
- `clearActiveSession()` : Nettoie la session

**Persistance** : ❌ Non (volatil)

---

### 5.2 useProfileStore (`lib/store/useProfileStore.ts`)

**Rôle** : Gestion profils joueurs locaux

**State** :

```typescript
{
  profiles: LocalPlayerProfile[]
  hostProfileId: string | null
}
```

**Actions** :

- `createProfile(input)` : Crée un nouveau profil
- `updateProfile(input)` : Met à jour un profil
- `deleteProfile(id)` : Supprime un profil
- `setHostProfile(id)` : Définit le profil host
- `getHostProfile()` : Récupère le profil host
- `getProfileById(id)` : Récupère un profil par ID
- `getNonHostProfiles()` : Liste profils non-host

**Persistance** : ✅ localStorage (`social-chaos-profiles`)

**Config** :

- MAX_AVATAR_SIZE: 200KB
- MAX_NAME_LENGTH: 30
- AVATAR_MAX_DIMENSION: 256px

---

### 5.3 useSettingsStore (`lib/store/useSettingsStore.ts`)

**Rôle** : Préférences utilisateur globales

**State** :

```typescript
{
  soundEnabled: boolean
  vibrationEnabled: boolean
  // Autres préférences UI
}
```

**Persistance** : ✅ localStorage

---

### 5.4 useSavedGameStore (`lib/store/useSavedGameStore.ts`)

**Rôle** : Sauvegarde de partie en cours

**State** :

```typescript
{
  savedGame: SavedGame | null
}
```

**Actions** :

- `saveGame(session)` : Sauvegarde la session actuelle
- `loadGame()` : Charge la partie sauvegardée
- `deleteGame()` : Supprime la sauvegarde
- `hasSavedGame()` : Vérifie existence sauvegarde

**Persistance** : ✅ localStorage (`social-chaos-saved-game`)

**Règles** :

- Auto-nettoyage après 24h
- Ne sauvegarde PAS les parties terminées
- Version-based migration

---

### 5.5 useMentorEleveStore (`lib/store/useMentorEleveStore.ts`)

**Rôle** : Système liens Mentor/Élève (GOAT/Chèvre)

**State** :

```typescript
{
  links: MentorEleveLink[]   // Liens actifs
}
```

**Link structure** :

```typescript
interface MentorEleveLink {
  id: string
  mentorProfileId: string // GOAT
  eleveProfileId: string // Chèvre
  createdAt: number
  isConsumed: boolean // Utilisé dans une partie
  mentorUsedAccompagnement?: boolean
  eleveUsedAccompagnement?: boolean
}
```

**Actions** :

- `createLink(mentorId, eleveId)` : Crée nouveau lien
- `consumeLink(id)` : Marque comme utilisé
- `updateLink(id, mentorId, eleveId)` : Met à jour rôles
- `deleteConsumedLinks()` : Nettoie liens consommés
- `getActiveLink(id1, id2)` : Récupère lien actif
- `getConsumedLink(id1, id2)` : Récupère lien consommé
- `markAccompagnementUsed(linkId, isEleve)` : Marque accompagnement utilisé

**Persistance** : ✅ localStorage

---

## 6. Services et Data Access

### 6.1 dataAccess Service (`lib/services/dataAccess.ts`)

Service centralisé pour toutes les opérations Firestore.

#### Sessions Operations

| Méthode                | Signature                                 | Description             |
| ---------------------- | ----------------------------------------- | ----------------------- |
| `createSession`        | `(data) => Promise<string>`               | Crée nouvelle session   |
| `getSession`           | `(sessionId) => Promise<SessionDocument>` | Récupère session par ID |
| `getSessionByRoomCode` | `(code) => Promise<SessionDocument>`      | Récupère par code       |
| `updateSession`        | `(id, data) => Promise<void>`             | Met à jour session      |
| `deleteSession`        | `(id) => Promise<void>`                   | Supprime session        |

#### Players Operations (Subcollection)

| Méthode                 | Signature                                          | Description      |
| ----------------------- | -------------------------------------------------- | ---------------- |
| `addPlayerToSession`    | `(sessionId, playerData) => Promise<string>`       | Ajoute joueur    |
| `getSessionPlayers`     | `(sessionId) => Promise<Player[]>`                 | Liste joueurs    |
| `updatePlayerScore`     | `(sessionId, playerId, score) => Promise<void>`    | MAJ score        |
| `updatePlayerPowerups`  | `(sessionId, playerId, powerups) => Promise<void>` | MAJ actions      |
| `updatePlayerStatus`    | `(sessionId, playerId, updates) => Promise<void>`  | MAJ statut       |
| `updateAllPlayerScores` | `(sessionId, players) => Promise<void>`            | MAJ batch scores |

#### History Operations

| Méthode              | Signature                                | Description              |
| -------------------- | ---------------------------------------- | ------------------------ |
| `getFinishedGames`   | `(limit?) => Promise<SessionDocument[]>` | Parties terminées        |
| `saveGameHistory`    | `(historyData) => Promise<void>`         | Sauvegarde historique    |
| `archiveGameSession` | `(id, metadata) => Promise<void>`        | Archive avec métadonnées |

#### Dares Operations

| Méthode                | Signature                          | Description          |
| ---------------------- | ---------------------------------- | -------------------- |
| `getDaresByDifficulty` | `(level) => Promise<Dare[]>`       | Défis par difficulté |
| `getFilteredDares`     | `(level, tags) => Promise<Dare[]>` | Défis filtrés        |

#### Real-time Listeners

| Méthode              | Signature                       | Description                |
| -------------------- | ------------------------------- | -------------------------- |
| `subscribeToSession` | `(id, callback) => Unsubscribe` | Écoute changements session |
| `subscribeToPlayers` | `(id, callback) => Unsubscribe` | Écoute changements joueurs |

#### Atomic Updates (Game Actions)

| Méthode                        | Signature                                                         | Description                  |
| ------------------------------ | ----------------------------------------------------------------- | ---------------------------- |
| `atomicIncrementTurnCounter`   | `(id) => Promise<void>`                                           | Incrémente tour atomiquement |
| `atomicUpdateSessionAndPlayer` | `(sessionId, sessionData, playerId, playerData) => Promise<void>` | MAJ atomique                 |

---

### 6.2 gameService (`lib/services/gameService.ts`)

**Logique métier** du jeu (sélection défis, calcul scores, etc.)

**Fonctions** :

- `selectRandomDare(difficulty, categories, avoidCategories?)` : Sélectionne un défi
- `calculateScore(difficultyLevel, timeBonus?)` : Calcule points
- `getNextPlayer(players, currentPlayerId)` : Joueur suivant

---

## 7. Hooks Personnalisés

### 7.1 useGameFlow (`hooks/useGameFlow.ts`)

**Rôle** : Gestion complète du flux de jeu

**Retour** :

```typescript
{
  // État UI
  isCardVisible: boolean
  isCardRevealed: boolean
  gameStatus: 'IDLE' | 'PLAYING' | 'SUCCESS' | 'FAILURE'
  controlStep: 'START' | 'WAITING' | 'VALIDATING'
  isTimerActive: boolean
  isSentenceOpen: boolean

  // Actions
  handleStartTurn: () => void
  handleNextTurn: () => void
  handleSuccess: () => void
  handleAbandon: () => void
  handleSentenceNext: () => void
  pauseTimerOnServer: () => Promise<void>
  resumeGame: () => Promise<void>
}
```

**Responsabilités** :

- Gestion états UI (carte visible/révélée)
- Contrôle timer
- Transitions entre tours
- Gestion success/failure
- Popups (success, sentence)

---

### 7.2 useGameActions (`hooks/useGameActions.ts`)

**Rôle** : Actions spéciales joueur (Joker, Reroll, Swap, Next)

**Retour** :

```typescript
{
  handleJoker: () => Promise<void>
  handleReroll: () => Promise<void>
  handleSwap: (targetPlayerId) => Promise<void>
  handleNext: () => Promise<void>
  canUseAction: {
    joker: boolean
    reroll: boolean
    swap: boolean
    next: boolean
  }
}
```

---

### 7.3 useGameSession (`hooks/useGameSession.ts`)

**Rôle** : Chargement et synchronisation session via React Query

**Paramètres** : `sessionId: string`

**Retour** :

```typescript
{
  session: GameSession | null
  players: Player[]
  currentPlayer: Player | null
  isLoading: boolean
  error: Error | null
}
```

---

### 7.4 useLobbyLogicV2 (`hooks/useLobbyLogicV2.ts`)

**Rôle** : Logique complète du lobby

**Retour** :

```typescript
{
  // État
  localPlayers: Player[]
  lobbyPlayers: Player[]
  canStartGame: boolean
  allPlayersReady: boolean

  // Configuration
  roundsTotal: number
  setRoundsTotal: (n: number) => void
  isProgressiveMode: boolean
  setIsProgressiveMode: (b: boolean) => void

  // Actions
  addLocalPlayer: (profile: LocalPlayerProfile) => void
  removeLocalPlayer: (playerId: string) => void
  startGame: () => Promise<void>
  getPlayersForSession: () => Player[]
}
```

---

## 8. Composants

### 8.1 Composants de jeu (`components/game/`)

| Composant               | Props clés                                                    | Rôle                             |
| ----------------------- | ------------------------------------------------------------- | -------------------------------- |
| **DareCard**            | `dare: Dare, isVisible: boolean`                              | Affiche défi avec flip animation |
| **GameTimer**           | `duration: number, isActive: boolean, onComplete: () => void` | Compte à rebours                 |
| **Controls**            | `player: Player, onAction: (type) => void`                    | Contrôles (joker, reroll, etc.)  |
| **GameEndScreen**       | `players: Player[], session: GameSession`                     | Écran fin avec podium            |
| **SuccessPopup**        | `isOpen: boolean, playerName: string`                         | Animation succès                 |
| **SentencePopup**       | `isOpen: boolean, sentenceText: string`                       | Affiche sentence                 |
| **AbandonOverlay**      | `isOpen: boolean, onConfirm: () => void`                      | Confirmation abandon             |
| **GameSidebar**         | `players: Player[], currentPlayerId: string`                  | Liste joueurs lat érale          |
| **ActionDock**          | `actions: Action[]`                                           | Dock actions bas écran           |
| **AccompagnementModal** | `partnerId: string, onUse: () => void`                        | Modal accompagnement duo         |
| **PausePlayerManager**  | `players: Player[], onTogglePause: (id) => void`              | Gestion pause (Gold mode)        |
| **OptionsMenu**         | `onEndGame: () => void`                                       | Menu options                     |
| **GameSkeleton**        | -                                                             | Skeleton loading                 |

---

### 8.2 Composants lobby (`components/lobby/`)

| Composant            | Props clés                                          | Rôle                        |
| -------------------- | --------------------------------------------------- | --------------------------- |
| **LobbyPlayerList**  | `players: Player[], onRemove: (id) => void`         | Liste joueurs avec actions  |
| **PlayerProfileRow** | `profile: LocalPlayerProfile, onSelect: () => void` | Ligne profil sélectionnable |
| **GameSettings**     | `settings: GameSettings, onChange: (s) => void`     | Config pré-partie           |
| **DurationCard**     | `rounds: number, onChangeRounds: (n) => void`       | Sélection durée             |
| **LobbyControls**    | `canStart: boolean, onStart: () => void`            | Boutons host                |

---

### 8.3 Composants profils (`components/profile/`)

| Composant                       | Props clés                                                              | Rôle                        |
| ------------------------------- | ----------------------------------------------------------------------- | --------------------------- |
| **ProfileCreator**              | `onSave: (profile) => void, initialData?: Partial<Profile>`             | Formulaire création/édition |
| **ProfileCard**                 | `profile: LocalPlayerProfile, onEdit: () => void, onDelete: () => void` | Carte profil                |
| **AvatarSelector**              | `selected: string, onSelect: (uri) => void`                             | Grille avatars              |
| **CategoryPreferencesSelector** | `want: string[], avoid: string[], onChange: (w, a) => void`             | Sélection préférences       |

---

### 8.4 Composants UI (`components/ui/`)

Primitives shadcn/radix préconfigurées :

- `Button`, `Card`, `Dialog`, `Avatar`, `Badge`
- `Progress`, `Select`, `Slider`, `Switch`, `Label`
- `Collapsible`, `LoadingScreen`

**Tous utilisent** :

- Tailwind CSS pour styling
- Radix UI pour accessibilité
- `cn()` utility pour merge class names

---

## 9. Constants et Configuration

### 9.1 GAME_CONFIG (`lib/constants/config.ts`)

```typescript
{
  TIMERS: {
    DEFAULT: 30,
    SHORT: 15,
    LONG: 60
  },
  ROUNDS: {
    MIN: 5,
    MAX: 50,
    DEFAULT: 6
  },
  COLORS: {
    PRIMARY: '#7c3aed',
    SECONDARY: '#db2777',
    SUCCESS: '#10b981',
    ERROR: '#ef4444',
    GOLD: '#eab308',
    PROGRESSIVE: {
      BORDER: '#FF1493',
      BG_GRADIENT: '...',
      SHADOW: '...'
    },
    UI: {
      BACKGROUND_OVERLAY: '...',
      WINNER: '#eab308',
      LOSER: '#ef4444'
    }
  }
}
```

### 9.2 DIFFICULTY_CONFIG

```typescript
{
  1: {
    name: 'Échauffement',
    color: '#39FF14',
    timer: 0,
    description: "Juste pour rire",
    backgroundClass: "from-green-900/20..."
  },
  2: {
    name: 'Audace',
    color: '#FFC300',
    timer: 120,
    description: "On monte d'un cran"
  },
  3: {
    name: 'Chaos',
    color: '#FF4500',
    timer: 60,
    description: "Préparez-vous à souffrir"
  },
  4: {
    name: 'Apocalypse',
    color: '#8A2BE2',
    timer: 30,
    description: "Plus de règles"
  }
}
```

### 9.3 CATEGORY_CONFIG

```typescript
{
  'Fun': { label: 'Fun', color: 'bg-yellow-500' },
  'Alcool': { label: 'Alcool', color: 'bg-orange-500' },
  'Soft': { label: 'Soft', color: 'bg-green-500' },
  'Humiliant': { label: 'Humiliant', color: 'bg-red-500' },
  'Drague': { label: 'Drague', color: 'bg-pink-500' },
  'Public': { label: 'Public', color: 'bg-blue-500' },
  'Chaos': { label: 'Chaos', color: 'bg-purple-500' }
}
```

### 9.4 AVATARS (`lib/constants/avatars.ts`)

**15 avatars disponibles** sous forme de data URIs (base64) :

- Optimisés pour mobile (<20KB chacun)
- Styles variés (animaux, objets, abstraits)

---

## 10. Routes et Pages

### 10.1 `/` - Page d'accueil (`app/page.tsx`)

**Fonctionnalités** :

- ✅ Reprise partie sauvegardée
- ✅ Nouvelle partie (crée lobby)
- ✅ Rejoindre partie (code)
- ✅ Accès profils, bibliothèque, historique
- ✅ Modales Help, Premium, Settings

**State utilisé** :

- `useSavedGameStore` : Partie suspendue
- `useProfileStore` : Profil host

**Clé** : Point d'entrée principal

---

### 10.2 `/lobby/[code]` - Lobby pré-partie (`app/lobby/[code]/page.tsx`)

**Fonctionnalités** :

- ✅ Affichage joueurs connectés (temps réel)
- ✅ Ajout joueurs locaux (profils + invités)
- ✅ Configuration partie (difficulté, durée, catégories, modes)
- ✅ Bouton démarrer (host uniquement)

**Hooks utilisés** :

- `useLobbyLogicV2` : Logique complète
- `useSessionQuery` : Sync temps réel

**Navigation** :

- Démarrage → `/game/[sessionId]`
- Retour → `/`

---

### 10.3 `/game/[id]` - Session de jeu (`app/game/[id]/page.tsx`)

**Fonctionnalités** :

- ✅ Affichage défi actuel (DareCard)
- ✅ Timer avec pause/reprise
- ✅ Actions joueur (joker, reroll, swap, next, accompagnement)
- ✅ Gestion tours rotatifs
- ✅ Popups success/sentence
- ✅ Sidebar joueurs
- ✅ Menu options
- ✅ Écran de fin automatique

**Hooks utilisés** :

- `useGameSession` : Chargement session
- `useGameFlow` : Flux de jeu
- `useGameActions` : Actions

**State local** :

- Accompagnement modal
- Timer pause state
- UI transient state

**Navigation** :

- Fin partie → Reste sur `/game/[id]` (GameEndScreen)
- Retour home → `/`

---

### 10.4 `/profiles` - Gestion profils (`app/profiles/page.tsx`)

**Fonctionnalités** :

- ✅ Liste profils existants
- ✅ Création nouveau profil
- ✅ Édition profil
- ✅ Suppression profil
- ✅ Définir host

**Store utilisé** :

- `useProfileStore` : CRUD profils

---

### 10.5 `/library` - Bibliothèque favoris (`app/library/page.tsx`)

**Fonctionnalités** :

- ✅ Liste défis favoris (localStorage)
- ✅ Suppression individuelle
- ✅ Affichage métadonnées (difficulté, catégories)

**Storage** : localStorage (`socialchaos-favorites`)

---

### 10.6 `/history` - Historique (`app/history/page.tsx`)

**Fonctionnalités** :

- ✅ Liste parties terminées (Firestore)
- ✅ Détails partie (vainqueur, perdant, score, durée)
- ✅ Accordéon joueurs participants

**Service utilisé** :

- `dataAccess.getFinishedGames()`

---

## 11. Firebase Structure

### 11.1 Collections Firestore

```
/dares                              # Collection défis
  ├── {dareId}                     # Document défi
  │   ├── content: string
  │   ├── difficultyLevel: 1-4
  │   ├── categoryTags: string[]
  │   ├── penaltyText?: string
  │   └── xpReward: number

/sessions                           # Collection sessions
  ├── {sessionId}                  # Document session
  │   ├── roomCode: string (6 char)
  │   ├── status: 'WAITING' | 'ACTIVE' | 'FINISHED'
  │   ├── settings: GameSettings
  │   ├── roundsTotal: number
  │   ├── roundsCompleted: number
  │   ├── currentTurnPlayerId?: string
  │   ├── currentDare?: Dare
  │   ├── turnCounter: number
  │   ├── winnerName?: string      # Historique
  │   ├── loserName?: string
  │   └── /players                 # Subcollection joueurs
  │       └── {playerId}
  │           ├── name: string
  │           ├── score: number
  │           ├── jokersLeft: number
  │           ├── rerollsLeft: number
  │           ├── exchangeLeft: number
  │           └── ...

/users                              # Collection utilisateurs (rarement utilisé)
  └── {userId}
      ├── username: string
      └── gamesPlayed: number
```

### 11.2 Règles Firestore (`firebase/firestore.rules`)

```javascript
// Lecture publique des défis
allow read: if true on /dares

// Sessions : lecture pub, écriture restreinte
allow read: if true on /sessions
allow write: if request.auth != null on /sessions

// Players subcollection : idem session parente
```

### 11.3 Storage (`firebase/storage.rules`)

```javascript
// Upload avatars
allow write: if
  request.resource.size < 200 * 1024 && // 200KB max
  request.resource.contentType.matches('image/.*')
```

---

## 12. Fonctionnalités

### ✅ Implémentées et fonctionnelles

#### **Core Gameplay**

**Système de tours**

- ✅ Rotation automatique des joueurs
- ✅ Ordre fixe défini au démarrage
- ✅ Compteur de tours (`turnCounter`) pour sync
- ✅ Détection fin de partie automatique

**Affichage défis**

- ✅ Carte flip 3D animation (Framer Motion)
- ✅ Sélection aléatoire dans pool
- ✅ Filtrage par difficulté + catégories
- ✅ Respect préférences joueur (want/avoid)
- ✅ Alternative sentence si abandon

**Timer**

- ✅ Durée configurable par difficulté (0s, 30s, 60s, 120s)
- ✅ Pause/Reprise
- ✅ Reset automatique nouveau tour
- ✅ Indicateur visuel progression

**Système de points**

- ✅ XP par défi réussi (basé difficulté)
- ✅ Bonus temps (si timer actif)
- ✅ Accumulation scores
- ✅ Classement temps réel

#### **Actions Joueur (Powerups)**

| Action             | Quantité initiale | Effet                                            | Condition                              |
| ------------------ | ----------------- | ------------------------------------------------ | -------------------------------------- |
| **Joker**          | 1                 | Passe le défi sans pénalité, tour suivant        | `jokersLeft > 0`                       |
| **Reroll**         | 2                 | Tire nouveau défi différent                      | `rerollsLeft > 0`                      |
| **Swap (Échange)** | 2                 | Échange tour avec autre joueur                   | `exchangeLeft > 0` + cible non-bloquée |
| **Next**           | ∞                 | Valide défi réussi, avance au tour suivant       | Tour actif                             |
| **Abandon**        | ∞                 | Abandonne défi → Affiche sentence                | Toujours                               |
| **Accompagnement** | 1/partie          | Réalise défi en duo avec partenaire mentor/élève | Lien actif + non utilisé               |

**Règles spéciales Swap** :

- ❌ Impossible d'échanger avec soi-même
- ❌ Anti-revenge : Impossible de swap avec quelqu'un qui a déjà swap ce tour
- ✅ `swapUsedByPlayerIds` array track tous les swaps du tour
- ✅ Reset à chaque nouveau tour

#### **Multi-joueurs**

**Lobby système**

- ✅ Création lobby avec code 6 chars aléatoire
- ✅ Partage code pour rejoindre
- ✅ Sync temps réel Firebase (listeners)
- ✅ Host détecté automatiquement (premier joueur)
- ✅ min 1 joueur, recommandé max 8

**Gestion joueurs**

- ✅ Ajout joueurs depuis profils locaux
- ✅ Création invités temporaires (30min)
- ✅ Suppression joueurs (host uniquement)
- ✅ Affichage avatars + noms
- ✅ Indication host avec icône

#### **Profils Locaux**

**CRUD Profils**

- ✅ Création avec nom + avatar + préférences
- ✅ Édition profil existant
- ✅ Suppression profil
- ✅ Définir profil host (1 seul par appareil)
- ✅ Stockage localStorage persistant

**Avatars**

- ✅ 15 avatars préchargés (base64)
- ✅ Sélecteur grille visuelle
- ✅ Upload custom (Storage Firebase) - PAS ENCORE UTILISÉ
- ✅ Compression/resize automatique
- ✅ Limite 200KB par image

**Préférences catégories**

- ✅ Sélection catégories "J'adore" (want)
- ✅ Sélection catégories "J'évite" (avoid)
- ✅ Influence sélection défis
- ✅ UI toggle chips interactif

#### **Système Mentor/Élève (V11)**

**Création liens**

- ✅ GOAT (1er) devient mentor de Chèvre (dernier)
- ✅ Lien créé automatiquement fin partie
- ✅ Stockage localStorage global
- ✅ Condition : Les 2 joueurs ont profileId
- ✅ Condition : Le GOAT a score > Chèvre

**Gestion liens**

- ✅ Renouvellement si même duo rejoue (update rôles)
- ✅ Création nouveau lien si nouveaux adversaires
- ✅ Tracking liens "consommés" (utilisés en partie)
- ✅ Nettoyage auto liens consommés (hors renouvellement)

**Action Accompagnement**

- ✅ Détection du lien au démarrage de partie
- ✅ Affichage bouton "Accompagnement" si duo présent
- ✅ Modal confirmation avec nom partenaire
- ✅ Utilisation unique par partie
- ✅ Bonus : Duo réalise défi ensemble

#### **Sauvegarde et Persistance**

**Partie en cours**

- ✅ Auto-save toutes les X secondes (via Zustand persist)
- ✅ Sauvegarde : session, joueurs, scores, tour actuel
- ✅ Reprise depuis bouton home
- ✅ Validation session (suppression si terminée/inexistante)
- ✅ Nettoyage auto après 24h
- ✅ Version-based migration (évite bugs anciens formats)

**Bibliothèque favoris**

- ✅ Bouton ❤️ sur chaque carte défi
- ✅ Toggle favori (ajout/retrait)
- ✅ Stockage localStorage `socialchaos-favorites`
- ✅ Page `/library` liste tous les favoris
- ✅ Suppression individuelle
- ✅ Affichage métadonnées (difficulté, catégories)

**Historique parties**

- ✅ Sauvegarde auto fin partie dans Firestore
- ✅ Métadonnées : vainqueur, perdant, score, difficulté, durée
- ✅ Liste participants avec accordéon
- ✅ Page `/history` affiche 20 dernières parties
- ✅ Tri antéchronologique

#### **Configuration Partie**

**Paramètres lobby**

- ✅ Difficulté : 1-4 (Échauffement → Apocalypse)
- ✅ Durée : 4, 6, 8, ou 10 tours
- ✅ Catégories : Alcool, Soft, Humiliant, Drague, Public, Chaos, Fun
- ✅ Mode Alcool : Toggle inclusion catégorie Alcool
- ✅ Mode Progressif : Difficulté +1 tous les 2 tours
- ✅ Timer : Auto-ajusté selon difficulté (ou 0 = infini)

**Validations**

- ✅ Min 1 joueur requis
- ✅ Tous champs configurables avant start
- ✅ Sauvegarde config dans session Firestore

#### **Modes Spéciaux**

**Mode Progressif**

- ✅ Difficulté démarre au niveau choisi
- ✅ Incrémente de 1 tous les 2 tours
- ✅ Max difficulté 4 (Apocalypse)
- ✅ Indicateur visuel (gradient rose pulsant)

**Mode Alcool**

- ✅ Toggle ON : Inclut catégorie "Alcool"
- ✅ Toggle OFF : Exclut catégorie "Alcool"
- ✅ Affecte pool défis disponibles

**Mode Gold / Pause**

- ✅ Host peut mettre joueur en "pause" (Gold Mode)
- ✅ Joueur pausé saute automatiquement ses tours
- ✅ Flag `hasBeenPaused` = disqualifié du podium
- ✅ Catégorie "Aventuriers" affichée à la fin
- ✅ Modal PausePlayerManager pour gestion

#### **Écran de Fin**

**GameEndScreen**

- ✅ Calcul automatique GOAT (vainqueur) et Chèvre (dernier)
- ✅ Classement complet tous joueurs
- ✅ Séparation Compétiteurs / Aventuriers (pausés)
- ✅ Affichage scores finaux
- ✅ Cartes explicatives rôles Mentor/Élève
- ✅ Indicateur lien créé/renouvelé
- ✅ Message incitatif si pas de profils
- ✅ Bouton "Terminer" → retour home

#### **UI/UX Avancés**

**Animations**

- ✅ Framer Motion : Fade, Slide, Scale, Rotate
- ✅ Flip 3D carte défi
- ✅ Confetti animation succès (particles)
- ✅ Transitions pages fluides
- ✅ Skeleton loaders
- ✅ Loading states spinners

**Feedback tactile**

- ✅ Vibrations mobiles (Vibration API)
- ✅ Patterns variés (succès, erreur, action)
- ✅ Fallback gracieux si non supporté

**Responsive Design**

- ✅ Mobile-first (320px+)
- ✅ Tablet optimisé (768px+)
- ✅ Desktop fonctionnel (1024px+)
- ✅ Touch-friendly (boutons 44px min)

**PWA**

- ✅ Manifest.json configuré
- ✅ Icônes multiples tailles (192px, 512px)
- ✅ Install prompt supporté
- ✅ Offline fallback pages
- ⚠️ Service Worker PAS ENCORE implémenté

**Modales**

- ✅ Help : Explications règles et actions
- ✅ Premium : Aperçu fonctionnalités premium (UI seul)
- ✅ Settings : Paramètres globaux
- ✅ Accompagnement : Confirmation duo
- ✅ PausePlayerManager : Gestion mode Gold

**Accessibilité**

- ✅ Radix UI composants accessibles
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus visible
- ⚠️ Screen reader optimization partiel

### 🔄 En cours / Partiellement implémentés

- 🔄 **Tests unitaires** : Infra Vitest présente, tests à écrire
- 🔄 **Mode offline complet** : PWA configuré mais pas full offline
- 🔄 **Service Worker** : Manifest OK, SW à implémenter
- 🔄 **Upload avatars custom** : Storage rules OK, UI à créer

### ❌ À faire / Roadmap

**Core**

- ❌ Auth Firebase email/password (actuellement anonyme)
- ❌ Comptes utilisateurs multi-devices
- ❌ Cloud sync profils

**Contenu**

- ❌ Création défis custom par users
- ❌ Vote communautaire défis
- ❌ Packs défis thématiques

**Social**

- ❌ Partage résultats réseaux sociaux
- ❌ Screenshots podium auto
- ❌ Invitations par lien

**Gamification**

- ❌ Achievements/Badges
- ❌ Système XP/Niveau global
- ❌ Statistiques joueur détaillées
- ❌ Leaderboards globaux

**Modes de jeu**

- ❌ Mode Solo (AI opponents)
- ❌ Mode Tournoi (bracket system)
- ❌ Mode Équipes (2v2, 3v3)
- ❌ Mode Story (campagne défis)

**Premium** (UI existe, backend manquant)

- ❌ Achat in-app
- ❌ Déblocage packs défis exclusifs
- ❌ Avatars premium
- ❌ Thèmes couleurs custom
- ❌ Statistiques avancées
- ❌ Priorité support

**Technique**

- ❌ i18n (FR → EN, ES, etc.)
- ❌ Analytics Firebase
- ❌ Crash reporting (Sentry)
- ❌ A/B testing
- ❌ Push notifications

---

## 13. Conventions du Projet

### 13.1 Nommage fichiers

| Type       | Convention                     | Exemple              |
| ---------- | ------------------------------ | -------------------- |
| Composants | PascalCase.tsx                 | `DareCard.tsx`       |
| Hooks      | camelCase.ts + préfixe `use`   | `useGameFlow.ts`     |
| Stores     | camelCase.ts + `use` + `Store` | `useProfileStore.ts` |
| Types      | kebab-case.ts                  | `saved-game.ts`      |
| Services   | camelCase.ts                   | `dataAccess.ts`      |
| Constants  | kebab-case.ts                  | `config.ts`          |

### 13.2 Nommage variables

```typescript
// Variables et fonctions
const playerScore = 10
function calculateScore() {}

// Composants et types
const DareCard = () => {}
interface Player {}
type GameStatus = '...'

// Constantes globales
const MAX_PLAYERS = 8
```

### 13.3 Imports

**Ordre** :

1. React et libs externes
2. Composants UI
3. Composants locaux
4. Hooks et stores
5. Types et utils

**Exemple** :

```typescript
import { useState } from 'react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'

import GameTimer from '@/components/game/GameTimer'

import { useGameStore } from '@/lib/store/useGameStore'

import type { Player } from '@/types'
import { cn } from '@/lib/utils'
```

### 13.4 Patterns de code

**Composants** :

```typescript
'use client' // Si utilise hooks

interface ComponentProps {
  // ...
}

export default function Component({ prop }: ComponentProps) {
  // Hooks
  // State local
  // Handlers
  // Render
}
```

**Hooks** :

```typescript
export function useCustomHook(param: Type) {
  // Logic

  return {
    // Named exports
  }
}
```

**Stores Zustand** :

```typescript
export const useExampleStore = create<StoreType>()(
  persist(
    (set, get) => ({
      value: initialValue,
      action: () =>
        set((state) => ({
          /* update */
        })),
    }),
    { name: 'storage-key' }
  )
)
```

### 13.5 Règles ESLint

⚠️ **0 erreur tolérée** (actuellement 0 ✅)

**Règles clés** :

- Pas de `any` sans `eslint-disable` justifié
- Pas d'imports inutilisés
- Hooks deps arrays complets
- Pas d'impure functions en render (`Math.random`, `Date.now`)
  - Utiliser `useState(() => ...)` lazy initializer
  - Utiliser `useMemo` avec deps correctes

**Pre-commit** : Husky + lint-staged valident automatiquement

---

## 14. Index des README

| Fichier        | Chemin                  | Résumé                           |
| -------------- | ----------------------- | -------------------------------- |
| **Principal**  | `/README.md`            | Setup Next.js de base (template) |
| **Components** | `/components/README.md` | Structure composants par domaine |
| **Hooks**      | `/hooks/README.md`      | Liste hooks et rôles             |
| **Lib**        | `/lib/README.md`        | Organisation code partagé        |

**Note** : `_PROJECT_KNOWLEDGE.md` (ce fichier) est la référence complète.

---

## 15. Historique des Modifications

| Date                  | Version | Modification                        | Impact                                          |
| --------------------- | ------- | ----------------------------------- | ----------------------------------------------- |
| **15 déc 2024 21:56** | -       | 📝 Documentation enrichie complète  | Indexation complète types, services, composants |
| **15 déc 2024 21:50** | -       | 📝 Création `_PROJECT_KNOWLEDGE.md` | Documentation centralisée initiale              |
| **15 déc 2024**       | -       | ✅ Résolution complète ESLint       | 34 → 0 erreurs + 7 warnings                     |
| **Déc 2024**          | V11     | 🤝 Système Accompagnement           | Action duo mentor/élève                         |
| **Déc 2024**          | V10.1   | 🎖️ Système Mentor/Élève             | Liens GOAT/Chèvre persistants                   |
| **Déc 2024**          | V10.0   | 👤 Profils locaux complets          | ProfileStore, avatars, préfs                    |
| **Déc 2024**          | V9.6    | 🏅 Tracking disqualification        | `hasBeenPaused` pour classement                 |
| **Déc 2024**          | V9.4    | 🔄 Anti-revenge swap                | `swapUsedByPlayerIds` array                     |
| **Déc 2024**          | V9.3    | ⏱️ Timer fix offline-first          | `turnCounter` atomique                          |
| **Déc 2024**          | V9.1    | 📜 Historique parties               | Métadonnées winner/loser                        |
| **Nov 2024**          | V4.0    | 🎮 Durée et mode progressif         | rounds system, difficulty increase              |
| **Oct 2024**          | V1.0    | 🚀 Core gameplay                    | Défis, tours, timer initial                     |
| **Oct 2024**          | -       | 🏗️ Setup projet                     | Next.js 16, Firebase, architecture              |

---

## 16. Workflow de Développement

### 16.1 Commandes

```bash
# Développement
npm run dev            # Dev server :3000

# Build
npm run build          # Production build
npm start              # Serve production

# Qualité
npm run lint           # ESLint (0 errors required)
npm run test           # Vitest
npm run test:ui        # Vitest UI

# Firebase
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
firebase emulators:start
```

### 16.2 Git workflow

```bash
git checkout -b feature/nom-feature
# Développement
git commit -m "feat: description"  # Husky valide auto
git push origin feature/nom-feature
# PR
```

**Husky pre-commit** :

- ✅ ESLint --fix
- ✅ Prettier --write
- ❌ Bloque si erreurs

---

## 17. Points d'Attention

### 17.1 Sécurité

- 🔒 Firestore Rules : Lecture publique défis, écriture auth
- 🔒 Storage Rules : Upload 200KB max, images only
- ⚠️ **Auth actuellement anonyme** → À sécuriser production

### 17.2 Performance

- ⚡ React Query cache 5min, stale 1min
- ⚡ Avatars optimisés base64
- ⚡ Bundle Next.js code-split auto
- ⚡ Framer Motion animations GPU

### 17.3 Bugs connus

- ⚠️ Vibration API incompatible certains navigateurs
- ⚠️ Timer peut désyncer si multiple tabs (localStorage)

### 17.4 Limites

- 📱 Mobile-first (desktop OK mais pas prioritaire)
- 🌐 FR uniquement (pas i18n)
- 👥 Max 8 joueurs recommandé (UI)
- 💾 localStorage limité ~5MB

---

**🎯 Ce fichier est vivant : mets-le à jour à chaque modification architecturale !**

**Dernière section à jour** : 15 déc 2024 21:56
