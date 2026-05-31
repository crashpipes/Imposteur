# 🕵️ IMPOSTEUR — Party Game

Jeu social type « Imposteur », pensé pour **un seul écran contrôlé par un hôte**
(idéal en partage d'écran sur Discord ou en IRL). Aucun réseau, aucun compte,
aucun backend : tout tourne dans le navigateur.

## Le concept

- Tous les joueurs reçoivent le **même mot**… sauf un (ou plusieurs) : **l'imposteur**.
- L'imposteur reçoit un mot **proche mais différent** (même univers, rôle, licence…).
  - Naruto / Sasuke · Iron Man / Batman · Walter White / Saul Goodman · Pikachu / Raichu…
- Les joueurs discutent et tentent de **démasquer l'imposteur**.
- Démasqué, l'imposteur a une dernière chance : **deviner le mot principal** pour l'emporter.

## Lancer le projet

```bash
npm install
npm run dev      # serveur de dev (http://localhost:5173)
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build
```

## Déroulé d'une partie

1. **Accueil** — bouton « Créer une partie » + historique des parties.
2. **Configuration** — joueurs, nombre d'imposteurs, catégories, options.
3. **Distribution** — l'hôte tend l'écran à chaque joueur : carte plein écran,
   suspense, puis « Masquer ».
4. **Discussion** — tour par tour : chaque joueur parle à son tour et l'hôte
   clique « Suivant ». Nombre de tours de table réglable (1 à 5) + minuteur
   optionnel qui se réinitialise à chaque joueur.
5. **Vote** — l'hôte sélectionne l'éliminé, révélation, et devinette de l'imposteur.
6. **Résultat** — gagnants, rôles, mots, rejouer.

## Options & bonus

Bibliothèque de cartes consultable depuis l'accueil (recherche + filtre par
catégorie), 9 catégories dont **Pays, Objets, Nourriture et Animaux**, des duos
basés sur la ressemblance ou le comportement (pas seulement le même univers) et
plusieurs duos possibles par personnage (Luffy / Zoro, Luffy / Shanks…).
Sons synthétisés (Web Audio, aucun fichier), 4 thèmes néon
(🟣 nebula, 🟠 inferno, 🟢 matrix, 🩷 vapor), **mode Mr. White** (l'imposteur n'a
aucun mot et ne commence jamais à parler), bouton « Autre carte » pour retirer un
duo déjà joué, historique local, ordre de parole aléatoire, et raccourcis clavier.

| Touche | Action |
|--------|--------|
| `Entrée` | Action principale de l'écran (démarrer / voter / rejouer) |
| `Échap` | Retour accueil (écran de résultat) |
| `T` | Changer de thème |
| `M` | Couper / activer le son |

## Architecture

```
src/
├── data/wordPairs.js       # base de données de mots liés (extensible)
├── lib/
│   ├── wordGenerator.js    # génération mots + rôles, vérif. devinette
│   └── storage.js          # persistance localStorage (réglages + historique)
├── store/gameStore.jsx     # état global (Context + useReducer)
├── hooks/                  # useSound, useKeyboard, soundContext
├── components/ui/          # NeonButton, GlowCard, Background, Timer
├── components/QuickControls.jsx
├── screens/                # Home, Setup, Reveal, Discussion, Vote, Result
├── App.jsx                 # routage par phase + transitions
└── main.jsx
```

La **logique** (données + génération) est volontairement séparée de l'**UI**.

## Ajouter des mots

Tout se passe dans `src/data/wordPairs.js`. Chaque catégorie contient une liste
de **paires** de mots confusables :

```js
{ a: 'Luffy', aFrom: 'One Piece', b: 'Zoro', bFrom: 'One Piece', hardcore: false }
```

- `a` / `b` : les deux mots proches (on tire aléatoirement lequel est le mot principal).
- `aFrom` / `bFrom` : l'œuvre d'origine de chaque mot, affichée sous le mot pendant
  la distribution pour lever l'ambiguïté entre personnages homonymes.
- `hardcore: true` : paire très subtile, privilégiée en mode hardcore.

Ajoutez simplement des objets dans la bonne catégorie : aucune autre modification
n'est nécessaire ailleurs.

## Stack

React 18 · Vite 5 · TailwindCSS 3 · Framer Motion 11. Stockage local uniquement.
