# 📋 PROJECT QUICK REFERENCE - Social Chaos

> **Version condensée** - Pour détails complets → [`_PROJECT_KNOWLEDGE.md`](./_PROJECT_KNOWLEDGE.md)
>
> 🎨 **Charte Graphique** → [`docs/CHARTE_GRAPHIQUE.md`](./docs/CHARTE_GRAPHIQUE.md)

📅 **Dernière MAJ** : 19 décembre 2024  
🎯 **Agent IA** : Lis ce fichier EN PREMIER pour vue d'ensemble rapide

---

## 🆕 **Modifications Récentes (19 Déc 2024)**

### UI/UX Améliorations

- ✅ **Catégories réorganisées** : 3 groupes thématiques (Pour séduire, Pour s'amuser, Pour faire des rencontres)
- ✅ **Nouveaux noms** : Sauvage → Rizz 😎, Folie → Absurde 😈, Échange 🤝
- ✅ **Descriptions visibles** : Sous chaque catégorie
- ✅ **Mode Alcool refondu** : Carte explicative avec icône dynamique (🍺/☕)
- ✅ **Contrainte 3 catégories minimum** : Pour lancer une partie

### Auth Mobile Fix

- ✅ **Popup blocked fix** : `signInWithRedirect` sur mobile
- ✅ **Auto-redirect** : Page `/auth` redirige si déjà connecté

### Cleanup

- ❌ **Supprimé** : HamburgerMenu, MenuItem, components/home/
- ✅ **Settings enrichi** : Liens Règles + Changelog

**[Historique complet →](_PROJECT_KNOWLEDGE.md#dernières-modifications-24h)**

---

## 🎮 Projet en 30 secondes

**Social Chaos** = Jeu de soirée mobile type "action ou vérité" modernisé  
**Stack** : Next.js 16 + React 19 + TypeScript + Firebase + Zustand  
**Déploiement** : Vercel  
**Statut** : Production, 0 erreurs ESLint ✅, **Auth Actif** 🔐

---

## 📂 Structure Clé

```
app/          → Routes (/, /auth, /lobby/[code], /game/[id], /profiles, /library, /history, /settings, /rules, /changelog, /legal, /premium)
components/   → UI par domaine (game/, lobby/, profile/, auth/, navigation/, ui/, layout/)
hooks/        → Logique métier (useGameFlow, useAuth, useInitUser, useLobbyLogicV2)
lib/
  ├── store/    → 7 stores Zustand (profiles, settings, savedGame, lobby, guest, loading, mentorEleve)
  ├── services/ → dataAccess (Firebase), gameService, userDataService
  └── constants/→ GAME_CONFIG, DIFFICULTY_CONFIG, CATEGORY_CONFIG
types/        → Types TS (Dare, Player, GameSession, Profile)
docs/         → 🆕 CHARTE_GRAPHIQUE.md
```

---

## 🎨 Design System (Résumé)

> Détails complets → [`docs/CHARTE_GRAPHIQUE.md`](./docs/CHARTE_GRAPHIQUE.md)

### Couleurs

- **Primary**: Purple (`#a855f7`)
- **Secondary**: Cyan (`#06b6d4`)
- **Accent**: Pink (`#ec4899`)
- **Mode Alcool**: Amber/Orange

### Glassmorphism

```css
.glass              /* Base: blur-12, bg-white/5, border-white/10 */
.glass-strong       /* Renforcé: blur-16, bg-white/8 */
.glass-interactive  /* Boutons: hover scale + glow purple */
```

### Glows

```css
.glow-purple .glow-cyan .glow-pink .glow-gold
```

---

## 🔑 Concepts Importants

### Types Core

- **Dare** : Défi avec difficulté (1-4), catégories, XP
- **Player** : Joueur avec score, actions (jokers, rerolls, swaps), profileId
- **GameSession** : Session avec status, settings, players, turnCounter

### Stores Zustand (7)

| Store               | Rôle                                  | Persistance    |
| ------------------- | ------------------------------------- | -------------- |
| `useProfileStore`   | Profils (hostProfile + guestProfiles) | localStorage   |
| `useLobbyStore`     | Joueurs lobby en cours                | Volatil        |
| `useSavedGameStore` | Partie suspendue                      | localStorage   |
| `useSettingsStore`  | Préférences UI                        | localStorage   |
| `useGuestStore`     | Invités temporaires                   | sessionStorage |

### Hooks Critiques

- **useAuth** : État authentification Firebase + Google redirect
- **useInitUser** : Initialisation profil après login
- **useGameFlow** : Flux complet jeu (tours, timer, popups)
- **useLobbyLogicV2** : Logique lobby complète

### Services

- **dataAccess** : 35+ méthodes Firestore
- **userDataService** : `saveUserProfile()` sync Firestore

---

## ⚡ Actions Joueur

| Action | Qté | Effet                       |
| ------ | --- | --------------------------- |
| Joker  | 1   | Skip défi, next tour        |
| Reroll | 2   | Nouveau défi                |
| Swap   | 2   | Échange tour (anti-revenge) |

---

## 🎯 Fonctionnalités Clés

**✅ Implémentées**

- Authentification Google/Email (popup desktop, redirect mobile)
- Profils synchro Firestore
- Catégories groupées avec descriptions
- Mode Alcool explicatif
- Contrainte 3 catégories minimum
- Core gameplay, multi-joueurs, sauvegarde
- UI responsive, glassmorphism, PWA

**❌ À faire**

- Redesign page `/game/[id]`
- Premium backend
- i18n

---

## 📜 Conventions

### Nommage

- Composants : `PascalCase.tsx`
- Hooks : `use{Name}.ts`
- Stores : `use{Name}Store.ts`

### Règles Code

- **0 erreur ESLint** tolérée
- Imports : `@/` alias absolu
- Types stricts, pas de `any`

### Git

```bash
npm run dev      # Dev :3000
npm run build    # Prod build (doit passer!)
npm run lint     # Doit retourner 0 erreurs
vercel --prod    # Deploy production
```

---

## 🚨 Points d'Attention

### Composants Supprimés (Ne plus référencer)

- ❌ `HamburgerMenu.tsx` - Supprimé
- ❌ `MenuItem.tsx` - Supprimé
- ❌ `components/home/` - Supprimé

### Auth Mobile

- Utilise `signInWithRedirect` sur mobile (pas popup)
- `handleGoogleRedirectResult()` appelé au mount

### Lobby

- `categoryGroups` remplace `categories` (array flat)
- `allCategories` pour la logique de sélection

---

## 📚 Documentation

| Fichier                                                  | Contenu                                 |
| -------------------------------------------------------- | --------------------------------------- |
| [`_PROJECT_KNOWLEDGE.md`](./_PROJECT_KNOWLEDGE.md)       | Documentation exhaustive (~1800 lignes) |
| [`docs/CHARTE_GRAPHIQUE.md`](./docs/CHARTE_GRAPHIQUE.md) | 🆕 Design system complet                |
| [`README.md`](./README.md)                               | Getting started                         |

---

## 🔄 Workflow Agent IA

1. **Lire ce fichier** pour contexte rapide
2. **Charte graphique** → `docs/CHARTE_GRAPHIQUE.md` pour toute UI
3. **Si besoin détails** → `_PROJECT_KNOWLEDGE.md`
4. **Après tâche majeure** → MAJ les 3 fichiers + date

---

**📏 Taille** : ~200 lignes (lecture 3min)
