# 🛠️ Fix: `createdAt.getTime is not a function`

## 📋 Problème
En production, le site crashait avec l'erreur `Uncaught TypeError: e.createdAt.getTime is not a function`.
Cela était dû au fait que la propriété `createdAt` des joueurs n'était pas toujours un objet `Date` JavaScript valide lors du tri. Elle pouvait être :
- Un `Timestamp` Firestore (qui n'a pas de méthode `getTime()`).
- Une `string` (sérialisation JSON).
- `null` ou `undefined`.

## ✅ Solution Implémentée

### 1. **Utilitaire Robuste (`lib/utils.ts`)**
Création de la fonction `getTimestamp(date: any): number` qui gère tous les cas possibles :
- `Date` → `date.getTime()`
- `number` → `date`
- `Timestamp` Firestore → `date.toMillis()` (via duck typing pour éviter d'importer le SDK lourd)
- `Object` { seconds, nanoseconds } → conversion manuelle
- `string` → `new Date(date).getTime()`
- `null`/`undefined` → `0`

### 2. **Correction du Tri (`GameSidebar.tsx`)**
Remplacement de la comparaison directe par l'utilisation de l'utilitaire :
```typescript
// Avant (Crash si pas Date)
return a.createdAt.getTime() - b.createdAt.getTime()

// Après (Robuste)
return getTimestamp(a.createdAt) - getTimestamp(b.createdAt)
```

### 3. **Blindage du Mapper (`lib/services/dataAccess.ts`)**
Mise à jour de `getSessionPlayers` et `subscribeToPlayers` pour convertir explicitement les `Timestamp` Firestore en objets `Date` dès la récupération des données.

```typescript
createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null
```

## 🛡️ Prévention Future
- L'utilitaire `getTimestamp` doit être utilisé partout où des dates sont comparées ou manipulées, surtout si la source de données est incertaine (props, API, Firestore).
- Le typage TypeScript `Player` indique `createdAt?: Date`, et le mapper garantit maintenant que c'est respecté à l'exécution.

## 🧪 Vérification
- Build de production réussi (`npm run build`).
- Le tri des joueurs dans la sidebar est maintenant sécurisé contre les erreurs de type.
