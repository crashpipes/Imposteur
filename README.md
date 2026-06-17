# 🕵️ IMPOSTEUR — Party Game

Jeu social type « Imposteur », pensé pour **un seul écran contrôlé par un hôte**
(idéal en partage d'écran sur Discord ou en IRL). Aucun réseau, aucun compte,
aucun backend : tout tourne dans le navigateur.

## Le concept

Tous les joueurs reçoivent le **même mot**… sauf un (ou plusieurs) : **l'imposteur**.
L'imposteur reçoit un mot **proche mais différent** (même univers, même rôle, même
métier, ressemblance physique, comportement similaire…) — par exemple
Naruto / Sasuke, Iron Man / Batman, Walter White / Saul Goodman, Messi / Ronaldo.
Les joueurs discutent et tentent de **démasquer l'imposteur**. Une fois démasqué,
l'imposteur a une dernière chance : **deviner le mot principal** pour renverser
la partie.

## Lancer le projet

```bash
npm install
npm run dev      # serveur de dev (http://localhost:5173)
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build
```

Le déploiement sur GitHub Pages est documenté dans **`DEPLOY.md`** (workflow
GitHub Actions déjà fourni : un `git push` reconstruit et publie le site).

## Déroulé d'une partie

1. **Accueil** — l'emblème détective + le titre, le bouton « Créer une partie »,
   l'accès à la bibliothèque et à l'historique des parties.
2. **Configuration** — noms des joueurs, nombre d'imposteurs, nombre de **tours
   de parole** (1 à 5), choix des **catégories**, et options (timer, mode
   Mr. White, mode QR code).
3. **Distribution** — l'hôte révèle la carte de chaque joueur, chacun son tour.
   La carte est **identique pour tout le monde** (couleur, icône, son) : rien
   n'indique le rôle, l'imposteur le découvre en jouant. Pilotable à la souris
   ou entièrement au clavier (**Espace** = montrer / masquer, joueur suivant).
   Bouton **« 🔄 Autre carte »** pour retirer un duo déjà joué.
4. **Discussion** — tour par tour : chaque joueur parle à son tour, l'ordre de
   parole est **tiré au hasard à chaque partie**, avec minuteur optionnel.
5. **Vote** — l'hôte désigne l'éliminé. Mauvaise cible = **partie perdue, pas de
   second vote**. Si c'est l'imposteur, il tente de **deviner le mot principal**.
6. **Résultat** — gagnants, rôles, mots (+ univers), points de la manche, et le
   **score de session**. Trois choix : **Rejouer**, **Nouvelle partie** (retour
   au lobby de config) ou **Score final**.
7. **Classement** — podium de fin de session, puis retour au menu.

## Score de session

Un score est tenu pendant toute la session (en mémoire) : **+1 point par joueur
innocent** quand les joueurs gagnent, **+2 points par imposteur** quand
l'imposteur gagne. Le score est **conservé** quand on rejoue ou qu'on relance une
partie, et **remis à zéro** uniquement au retour au menu d'accueil.

## Modes & options

- **Mr. White** — l'imposteur n'a **aucun mot** : il doit deviner le mot commun
  en se fondant dans la masse. Pour équilibrer, **il ne commence jamais** à
  parler pendant la discussion.
- **Mode QR code** — à la distribution, chaque joueur scanne un **QR code** (ou
  ouvre un lien) qui affiche son mot sur **son propre téléphone**. Pratique pour
  jouer à distance. Le mot est encodé dans l'URL (site statique, sans serveur) ;
  chaque joueur ne doit scanner que son QR. Fonctionne sur la version en ligne.
- **Timer** — minuteur de discussion qui se réinitialise à chaque joueur.
- **Plusieurs imposteurs** — réglable selon le nombre de joueurs.

## Catégories (500 duos)

Films · Séries · Anime · Jeux vidéo · Personnages fictifs · **Personnalités
publiques** · **Pokémon** · **League of Legends** · Pays · Objets · Nourriture ·
Animaux — plus le **Mélange aléatoire** qui pioche dans tout.

Les liens entre deux mots ne sont pas que « même univers » : on s'appuie aussi
sur la **ressemblance physique** (Gojo / Kakashi), le **comportement / archétype**
(Naruto / Luffy), le **métier** (Messi / Ronaldo), la forme (Léopard / Guépard)…
Un même personnage peut avoir **plusieurs duos** (Luffy / Zoro, Luffy / Shanks…).

## Bibliothèque & création de cartes

Depuis l'accueil, la **bibliothèque** liste toutes les cartes (recherche + filtre
par catégorie) et indique pourquoi chaque duo est lié. On peut aussi **créer ses
propres cartes** directement dans l'app : la création est **protégée par un mot de
passe** ; les cartes créées sont stockées **dans le navigateur** (localStorage)
et entrent aussitôt dans le jeu et la bibliothèque.

> Note : les cartes créées dans l'app restent **locales à ce navigateur**. Pour
> des cartes permanentes partagées par tous, ajoute-les à la base (voir ci-dessous).

## Ajouter des cartes en masse (`outils/`)

Le dossier `outils/` (hors-ligne, non inclus dans le site) facilite l'ajout :

- **`outils/ajouter-cartes.html`** — page à ouvrir dans le navigateur :
  formulaire, liste sauvegardée, génération du code à coller, export/import JSON.
- **`outils/ajouter-cartes.mjs`** — script qui insère un lot de cartes (JSON)
  directement dans `src/data/wordPairs.js`, avec sauvegarde et vérification :

  ```bash
  node outils/ajouter-cartes.mjs            # lit outils/cartes.json
  node outils/ajouter-cartes.mjs mon.json   # ou un fichier précis
  ```

Détails dans `outils/README.md`.

## Format d'une carte

Tout est dans `src/data/wordPairs.js`. Chaque catégorie contient une liste de
**paires** :

```js
{ a: 'Pikachu', aFrom: 'Pokémon', b: 'Raichu', bFrom: 'Pokémon', link: 'Évolution' }
```

- `a` / `b` : les deux mots proches (on tire au hasard lequel est le mot principal).
- `aFrom` / `bFrom` : l'œuvre / l'univers de chaque mot, affiché sous le mot
  pendant la distribution (optionnel).
- `link` : nature du lien, montrée **uniquement dans la bibliothèque** (optionnel).
- `hardcore` : `true` pour signaler un duo très proche (indicateur de bibliothèque).

Ajouter une carte ne demande rien d'autre : la bibliothèque, le générateur et le
mélange la prennent en compte automatiquement.

## Architecture

```
src/
├── data/wordPairs.js         # base de données des duos (+ poolForCategories, totalPairs)
├── lib/
│   ├── wordGenerator.js      # tirage des mots + rôles, vérif. de la devinette
│   ├── storage.js            # localStorage : réglages, historique, cartes perso
│   └── cardLink.js           # encodage/décodage du lien des cartes (mode QR)
├── store/gameStore.jsx       # état global (Context + useReducer) + score de session
├── hooks/                    # useSound, useKeyboard, soundContext
├── components/
│   ├── DetectiveLogo.jsx     # ancien logo SVG themable (gardé en secours)
│   ├── QuickControls.jsx     # bouton son
│   └── ui/                   # NeonButton, GlowCard, Timer, Background
├── assets/detective.svg      # emblème détective affiché sur l'accueil
├── screens/                  # Home, Library, Setup, Reveal, Discussion, Vote, Result, Scoreboard
├── CardView.jsx              # page « carte » autonome ouverte après scan du QR
├── App.jsx                   # routage par phase
└── main.jsx                  # point d'entrée (affiche CardView si l'URL contient ?card=)
```

La **logique** (données + génération) est séparée de l'**UI**.

## Apparence

Thème visuel unique (violet doux), sons légers synthétisés (Web Audio, aucun
fichier audio), interface sobre pensée pour le partage d'écran. Raccourcis :
`Entrée` (action principale de l'écran), `Espace` (distribution), `Échap`,
`M` (couper le son).

## Stack

React 18 · Vite 5 · TailwindCSS 3 · Framer Motion 11 · qrcode. Stockage local
uniquement, pas de backend.
