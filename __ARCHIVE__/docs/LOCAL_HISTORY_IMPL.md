# 💾 Sauvegarde Locale de l'Historique (Offline-First)

## 🎯 Objectif
Permettre aux utilisateurs de conserver un historique de leurs 10 dernières parties directement sur leur appareil, garantissant un accès même sans connexion internet.

## ⚙️ Implémentation

### 1. Service `localHistory` (`lib/services/localHistory.ts`)

Ce service gère toutes les interactions avec le `localStorage`.

**Fonctionnalités Clés :**
- **`save(item)`** :
  - Ajoute une nouvelle partie à l'historique.
  - Trie automatiquement par date (plus récent en premier).
  - **Limite stricte à 10 entrées** : Supprime automatiquement la plus ancienne si la limite est atteinte.
  - Génère un ID unique pour chaque entrée locale.
- **`getAll()`** :
  - Récupère l'historique complet.
  - Gère le parsing JSON et les erreurs potentielles.
  - Retourne un tableau vide si aucune donnée n'est trouvée.

### 2. Intégration dans le Flux de Jeu (`hooks/useGameFlow.ts`)

Lorsqu'une partie se termine (condition `roundsCompleted >= roundsTotal`), le système déclenche la sauvegarde locale en parallèle de la sauvegarde Firestore.

```typescript
// Extrait de useGameFlow.ts
if (roundsCompleted >= roundsTotal) {
  // ...
  
  // Sauvegarde Locale
  const { localHistory } = await import('@/lib/services/localHistory')
  localHistory.save({
    winner: { ... },
    loser: { ... },
    totalRounds: roundsCompleted,
    difficulty: session.settings.difficulty,
    categories: session.settings.tags,
    playedAt: Date.now()
  })
  
  // ...
}
```

## 📊 Structure des Données

Chaque entrée d'historique contient :

```typescript
interface LocalHistoryItem {
  id: string              // UUID généré localement
  winner: PlayerSummary   // { id, name, avatar, score }
  loser: PlayerSummary    // { id, name, avatar, score }
  otherPlayers: { name, avatar }[]
  totalRounds: number
  difficulty: DifficultyLevel
  categories: DareCategory[]
  playedAt: number        // Timestamp (ms)
}
```

## 🧪 Vérification

- [x] La sauvegarde se déclenche uniquement à la fin naturelle de la partie.
- [x] Les données sont persistées dans le `localStorage` sous la clé `social_chaos_history`.
- [x] La limite de 10 éléments est respectée (rotation FIFO).
- [x] Le tri est correct (plus récent en haut).
- [x] Fonctionne sans erreur de build.

## 🚀 Prochaines Étapes

- Afficher cet historique local sur la page `/history` (actuellement elle affiche probablement des données mockées ou Firestore).
- Ajouter un bouton pour effacer l'historique local.
