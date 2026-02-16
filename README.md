# 🎨 Pixel Art Logos

![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)

> Animations interactives de logos en pixel art avec React et Canvas API

![Demo](demo_pc.gif)

## Fonctionnalités

- Animation pixel par pixel au hover (desktop)
- Animation au scroll (mobile)
- Mode clair/sombre adaptatif
- Grille responsive (4→2 colonnes)

## Démarrage rapide

```bash
# Installation
npm install

# Lancement du serveur de développement
npm run dev
```

## Ajouter un logo

**1. Convertir l'image en matrice**  
Utilisez [Convertisseur Pixel Art](https://github.com/ELM-CIEL/convertisseur-pixel-art) pour générer la matrice

**2. Ajouter dans `src/assets/matrices.js`**

```javascript
export const MATRICES = {
  monlogo: [
    [0, 1, 1, 0],
    [1, 2, 2, 1],
    [0, 1, 1, 0],
  ],
};
```

**3. Configurer les couleurs dans `src/assets/couleurs.js`**

```javascript
export const COULEURS = {
  monlogo: { 0: "transparent", 1: "#FF5733", 2: "#FFC300" },
};
```

## Configuration

| Paramètre         | Valeur | Fichier         |
| ----------------- | ------ | --------------- |
| Pixels/frame      | 4      | `pixelLogo.jsx` |
| Interval          | 10ms   | `pixelLogo.jsx` |
| Fade duration     | 300ms  | `pixelLogo.jsx` |
| Shimmer           | 500ms  | `pixelLogo.jsx` |
| Mobile breakpoint | 768px  | `LogoGrid.jsx`  |

## Technologies

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## Licence

[MIT](LICENSE)

## Crédits

- Concept visuel inspiré par le travail de [Bakhtiyor Ganijon](https://github.com/thebkht)
- Matrices créées avec [Convertisseur Pixel Art](https://github.com/ELM-CIEL/convertisseur-pixel-art)
