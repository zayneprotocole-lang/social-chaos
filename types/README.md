# Types

Types TypeScript centralisés pour l'application.

## Fichiers

| Fichier           | Description                                        |
| ----------------- | -------------------------------------------------- |
| `index.ts`        | Types principaux (Player, GameSession, Dare, etc.) |
| `profile.ts`      | Types pour les profils joueurs locaux              |
| `lobby.ts`        | Types pour le lobby                                |
| `history.ts`      | Types pour l'historique des parties                |
| `saved-game.ts`   | Types pour les parties sauvegardées                |
| `mentor-eleve.ts` | Types pour le système Mentor/Élève                 |

## Convention

Tous les types sont exportés via `index.ts` pour un import simplifié:

```typescript
import { Player, GameSession, Dare } from '@/types'
```

## Types Firestore

Les interfaces suffixées par `Document` représentent la structure Firestore:

- `SessionDocument`
- `SessionPlayerDocument`
- `DareDocument`
- `UserDocument`
