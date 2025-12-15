# Hooks

Hooks React personnalisés pour la logique métier de l'application.

## Fichiers

| Hook                  | Description                                   |
| --------------------- | --------------------------------------------- |
| `useGameActions`      | Actions du joueur (joker, reroll, swap)       |
| `useGameFlow`         | Logique du flux de jeu (tours, timer, popups) |
| `useGameSession`      | Chargement et gestion de la session de jeu    |
| `useImagePicker`      | Sélection d'images (avatar)                   |
| `useLobbyLogicV2`     | Logique du lobby (joueurs, démarrage)         |
| `useSessionMutations` | Mutations React Query pour les sessions       |
| `useSessionQuery`     | Queries React Query pour les sessions         |

## Conventions

- **Nommage**: camelCase avec préfixe `use` (ex: `useGameFlow`)
- **Patterns**: Utilise React Query pour les opérations async
- **Exports**: Centralisés dans `index.ts`
