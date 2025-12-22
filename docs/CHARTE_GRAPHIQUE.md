# 🎨 CHARTE GRAPHIQUE - Social Chaos

> **Design System officiel** - À consulter pour toute création UI
>
> 📅 **Dernière MAJ** : 19 décembre 2024  
> 📍 **Références** : [`_PROJECT_KNOWLEDGE.md`](../_PROJECT_KNOWLEDGE.md) | [`0_PROJECT_QUICK_REF.md`](../0_PROJECT_QUICK_REF.md)

---

## 📑 Table des Matières

1. [Identité Visuelle](#1-identité-visuelle)
2. [Palette de Couleurs](#2-palette-de-couleurs)
3. [Glassmorphism](#3-glassmorphism)
4. [Typographie](#4-typographie)
5. [Effets Lumineux (Glow)](#5-effets-lumineux-glow)
6. [Composants UI](#6-composants-ui)
7. [Layouts de Page](#7-layouts-de-page)
8. [Animations](#8-animations)
9. [Guidelines Mobile-First](#9-guidelines-mobile-first)

---

## 1. Identité Visuelle

### Logo Textuel

```
SOCIAL   ← Texte cyan-400 avec text-shadow cyan
CHAOS    ← Texte purple-400 avec text-shadow purple
```

**Code de référence** (`app/page.tsx`):

```tsx
<h1 className="leading-none font-black tracking-tighter">
  <span
    className="text-6xl text-cyan-400"
    style={{
      textShadow:
        '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(6, 182, 212, 0.3)',
    }}
  >
    SOCIAL
  </span>
  <span
    className="text-6xl text-purple-400"
    style={{
      textShadow:
        '0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)',
    }}
  >
    CHAOS
  </span>
</h1>
```

### Tagline

> "Le jeu qui détruit votre dignité."

- Couleur: `text-white/60`
- Taille: `text-lg`

---

## 2. Palette de Couleurs

### Couleurs Primaires

| Nom        | Tailwind             | Hex       | Usage                         |
| ---------- | -------------------- | --------- | ----------------------------- |
| **Purple** | `purple-400/500/600` | `#a855f7` | Accent principal, boutons CTA |
| **Cyan**   | `cyan-400/500`       | `#06b6d4` | Accent secondaire, liens      |
| **Pink**   | `pink-400/500/600`   | `#ec4899` | Gradients, boutons action     |

### Couleurs de Catégories

| Catégorie | Couleur    | Classe Active                          |
| --------- | ---------- | -------------------------------------- |
| Rizz      | Purple     | `bg-purple-500/55 border-purple-500`   |
| Jeux      | Cyan       | `bg-cyan-500/55 border-cyan-500`       |
| Absurde   | Purple-600 | `bg-purple-600/55 border-purple-600`   |
| Philo     | Violet     | `bg-violet-500/55 border-violet-500`   |
| Mignon    | Pink       | `bg-pink-500/55 border-pink-500`       |
| Enquête   | Cyan-600   | `bg-cyan-600/55 border-cyan-600`       |
| Échange   | Violet-600 | `bg-violet-600/55 border-violet-600`   |
| Karaoké   | Fuchsia    | `bg-fuchsia-500/55 border-fuchsia-500` |
| Favoris   | Purple-400 | `bg-purple-400/55 border-purple-400`   |

### Couleurs État

| État            | Couleur      | Usage                                     |
| --------------- | ------------ | ----------------------------------------- |
| Mode Alcool ON  | Amber/Orange | `amber-500`, gradient `from-amber-500/20` |
| Mode Alcool OFF | Cyan/Teal    | `cyan-500`, gradient `from-cyan-500/10`   |
| Succès          | Green        | `green-400/500`                           |
| Erreur          | Red          | `red-400/500`                             |
| Désactivé       | White/40-60  | `opacity-50`, `text-white/40`             |

### Couleurs de Fond

- **Background global**: Deep dark purple/black (`oklch(0.1 0.02 280)`)
- **Cards/Glass**: Semi-transparent (`rgba(255,255,255,0.05-0.08)`)
- **Overlays**: `bg-black/60` avec `backdrop-blur-sm`

---

## 3. Glassmorphism

### Classes Principales

Définies dans `app/globals.css`:

```css
/* Glassmorphism de base */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Glassmorphism renforcé (header, modals) */
.glass-strong {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Glassmorphism interactif (boutons, cards cliquables) */
.glass-interactive {
  /* Base glass */
  transition: all 0.3s ease;
  cursor: pointer;
}
.glass-interactive:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(168, 85, 247, 0.5);
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
  transform: scale(1.02);
}
```

### Utilisation

| Contexte                 | Classe                         |
| ------------------------ | ------------------------------ |
| Cards statiques          | `glass` ou `glass rounded-2xl` |
| Header fixe              | `glass-strong`                 |
| Boutons/Cards cliquables | `glass-interactive`            |
| Modals/Popups            | `glass-strong rounded-2xl`     |
| Overlays                 | `bg-black/60 backdrop-blur-sm` |

---

## 4. Typographie

### Familles de Police

- **Sans-serif**: Geist Sans (variable: `--font-geist-sans`)
- **Monospace**: Geist Mono (variable: `--font-geist-mono`)

### Hiérarchie

| Élément          | Classes                                      | Exemple               |
| ---------------- | -------------------------------------------- | --------------------- |
| Titre H1         | `text-6xl font-black tracking-tighter`       | Logo SOCIAL CHAOS     |
| Titre Section    | `text-lg font-bold uppercase tracking-wider` | Labels sections lobby |
| Texte Corps      | `text-base text-white`                       | Contenu principal     |
| Texte Secondaire | `text-sm text-white/60`                      | Descriptions          |
| Micro-texte      | `text-xs text-white/40`                      | Hints, notes          |

### Poids

- `font-black` (900): Logos, titres majeurs
- `font-bold` (700): Titres sections, boutons
- `font-semibold` (600): Labels importants
- `font-medium` (500): Texte normal mis en évidence
- `font-normal` (400): Texte courant

---

## 5. Effets Lumineux (Glow)

### Classes Glow

```css
.glow-purple {
  box-shadow: 0 0 25px rgba(168, 85, 247, 0.35);
}
.glow-cyan {
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.35);
}
.glow-pink {
  box-shadow: 0 0 25px rgba(236, 72, 153, 0.35);
}
.glow-gold {
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.35);
}
```

### Box-Shadows Personnalisés

```tsx
// Catégories sélectionnées
style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}

// Mode alcool actif
style={{ boxShadow: '0 0 25px rgba(245, 158, 11, 0.2)' }}

// Hover interactif
style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)' }}
```

### Text Shadows (Logo)

```css
/* Cyan text glow */
text-shadow:
  0 0 30px rgba(6, 182, 212, 0.5),
  0 0 60px rgba(6, 182, 212, 0.3);

/* Purple text glow */
text-shadow:
  0 0 30px rgba(168, 85, 247, 0.5),
  0 0 60px rgba(168, 85, 247, 0.3);
```

---

## 6. Composants UI

### Boutons

#### Bouton Principal (CTA)

```tsx
<button className="glow-purple w-full rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-6 py-5 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]">
  JOUER
</button>
```

#### Bouton Secondaire (Glass)

```tsx
<button className="glass-interactive rounded-xl px-4 py-2 font-semibold text-white">
  Action
</button>
```

#### Bouton Désactivé

```tsx
<button className="cursor-not-allowed opacity-50 grayscale">Désactivé</button>
```

### Cards

#### Card Glassmorphism

```tsx
<div className="glass rounded-2xl border border-white/10 p-4">Contenu</div>
```

#### Card Interactive

```tsx
<Link href="/page">
  <div className="glass-interactive group rounded-2xl p-4">
    Contenu avec hover
  </div>
</Link>
```

### Header

```tsx
<header className="
  glass-strong
  fixed top-0 left-0 right-0
  z-50
  px-4 py-3
  rounded-2xl
">
  <!-- Contenu: Settings (gauche), Premium (droite) -->
</header>
```

---

## 7. Layouts de Page

### Page Standard (Homepage, Auth)

```tsx
<main className="// Espace pour header fixe flex min-h-screen flex-col px-4 pt-28 pb-8">
  {/* Contenu */}
</main>
```

### Page Lobby (Scrollable)

```tsx
<>
  <header className="glass-strong sticky top-0 z-50">
    {/* Header avec retour */}
  </header>

  <main className="space-y-2.5 px-4 pt-4 pb-2">
    <LobbySection icon="👥" title="Joueurs">
      {/* ... */}
    </LobbySection>
    <LobbySection icon="⚙️" title="Options">
      {/* ... */}
    </LobbySection>
    <LobbySection icon="🎯" title="Catégories">
      {/* ... */}
    </LobbySection>
    <LobbySection icon="⚡" title="Difficulté">
      {/* ... */}
    </LobbySection>
  </main>

  <div className="px-4 pt-3 pb-8">{/* Bouton Démarrer */}</div>
</>
```

### Modals/Popups

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
  <div className="glass-strong w-full max-w-sm rounded-2xl p-6">
    {/* Contenu modal */}
  </div>
</div>
```

---

## 8. Animations

### Transitions Standard

```css
transition-all duration-300   /* Défaut pour la plupart des éléments */
transition-all duration-200   /* Boutons, interactions rapides */
```

### Hover Effects

- `hover:scale-[1.02]` - Scale léger pour CTA
- `hover:scale-105` - Scale plus marqué pour icônes
- `active:scale-95` - Feedback tactile (press)

### Animations Tailwind

- `animate-spin` - Loaders
- `animate-pulse` - Indicateurs

### Framer Motion (si utilisé)

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
```

---

## 9. Guidelines Mobile-First

### Breakpoints

| Breakpoint      | Classe        | Usage              |
| --------------- | ------------- | ------------------ |
| Mobile (défaut) | -             | < 640px            |
| Tablet          | `sm:`         | ≥ 640px            |
| Desktop         | `md:` / `lg:` | ≥ 768px / ≥ 1024px |

### Touch Targets

- **Minimum**: `min-h-[44px]` ou `min-h-[48px]`
- Padding généreux: `py-3 px-4` pour boutons

### Espacements

| Contexte          | Espacement                 |
| ----------------- | -------------------------- |
| Entre sections    | `space-y-4` ou `gap-4`     |
| Grille catégories | `gap-2` à `gap-3`          |
| Padding page      | `px-4`                     |
| Marges header     | `pt-28` (avec header fixe) |

### Grilles

```tsx
// Catégories: 3 colonnes
<div className="grid grid-cols-3 gap-2">

// Quick access: 3 colonnes
<div className="grid grid-cols-3 gap-3">

// Options lobby (avant): 2 colonnes, maintenant stack
<div className="space-y-4">
```

---

## 📋 Checklist Design

Avant de créer un nouveau composant, vérifier:

- [ ] Utilise les couleurs de la palette (purple, cyan, pink)
- [ ] Applique le glassmorphism (`glass`, `glass-strong`, `glass-interactive`)
- [ ] Respecte la hiérarchie typographique
- [ ] Ajoute des effets glow pour les éléments actifs
- [ ] Transitions smooth (`duration-300`)
- [ ] Touch targets ≥ 44px sur mobile
- [ ] Padding/margins cohérents (`px-4`, `gap-3`)
- [ ] Hover et active states définis
- [ ] Dark theme seulement (pas de light mode)

---

## 📚 Fichiers de Référence

| Fichier                                                                   | Contenu                              |
| ------------------------------------------------------------------------- | ------------------------------------ |
| [`app/globals.css`](../app/globals.css)                                   | Variables CSS, glassmorphism, glows  |
| [`app/page.tsx`](../app/page.tsx)                                         | Homepage - Logo, CTA, Quick Access   |
| [`app/lobby/[code]/page.tsx`](../app/lobby/[code]/page.tsx)               | Lobby - Catégories, Options, Joueurs |
| [`components/navigation/Header.tsx`](../components/navigation/Header.tsx) | Header avec Settings et Premium      |

---

**⚠️ Note**: La page `/game/[id]` (partie en cours) doit être redesignée et n'est PAS une référence pour cette charte.
