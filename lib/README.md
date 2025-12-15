# Lib

Code partagé et utilitaires de l'application.

## Structure

```
lib/
├── constants/     # Configurations et valeurs constantes
├── firebase/      # Client Firebase (auth, firestore)
├── services/      # Couche d'accès aux données
├── store/         # Stores Zustand (état global)
├── utils/         # Fonctions utilitaires
├── validation/    # Schémas de validation (Zod)
├── actions/       # Server Actions Next.js
└── queries/       # Définitions React Query
```

## Fichiers racine

| Fichier          | Description                             |
| ---------------- | --------------------------------------- |
| `utils.ts`       | Utilitaires généraux (cn, getTimestamp) |
| `types.ts`       | Re-export des types depuis `/types`     |
| `queryClient.ts` | Configuration React Query               |

## Conventions

- **Stores**: Préfixe `use` (ex: `useProfileStore`)
- **Services**: Objets singleton (ex: `dataAccess`)
- **Exports**: Chaque sous-dossier a un `index.ts`
