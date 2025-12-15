# Components

Ce dossier contient tous les composants React de l'application, organisés par domaine fonctionnel.

## Structure

```
components/
├── game/       # Composants de la phase de jeu
├── lobby/      # Composants du lobby (avant la partie)
├── profile/    # Gestion des profils joueurs
├── ui/         # Primitives UI (shadcn/radix)
├── history/    # Affichage de l'historique
├── home/       # Page d'accueil
├── help/       # Modal d'aide
├── premium/    # Modal premium
├── settings/   # Modal paramètres
└── providers/  # React Query provider
```

## Conventions

- **Nommage**: PascalCase pour les composants (ex: `GameEndScreen.tsx`)
- **Exports**: Chaque dossier a un `index.ts` pour les barrel exports
- **Props**: Les types de props sont définis dans le même fichier
