# 🛠️ Outils perso — ajouter des cartes facilement

Ces fichiers servent **uniquement à toi**, en local, pour enrichir la base de
cartes sans écrire le `.js` à la main. Ils ne font PAS partie du site (le dossier
`outils/` n'est jamais inclus dans la version déployée).

Deux façons de faire, de la plus simple à la plus automatique.

## Option 1 — La page (la plus simple, sans rien installer)

1. Ouvre **`outils/ajouter-cartes.html`** dans ton navigateur (double-clic).
2. Remplis le formulaire (catégorie, Mot A, Mot B, et univers/lien si tu veux),
   clique « Ajouter à la liste ». Recommence autant de fois que tu veux.
   (Ta liste est sauvegardée automatiquement dans le navigateur.)
3. Deux possibilités pour finir :
   - **Copier-coller** : clique « Générer le code à coller », puis copie le bloc
     de chaque catégorie **juste avant le `],`** qui ferme ce tableau dans
     `src/data/wordPairs.js`.
   - **Automatique** : clique « ⬇️ Exporter JSON » → tu obtiens `cartes.json` →
     passe à l'Option 2.

L'outil gère tout seul les apostrophes et les accents (pas d'erreur de syntaxe).

## Option 2 — Le script (zéro copier-coller)

1. Mets ton fichier JSON dans `outils/cartes.json` (ou garde le nom exporté).
   Format = un tableau de cartes (voir `cartes.example.json`).
2. Depuis la racine du projet, lance :

   ```bash
   node outils/ajouter-cartes.mjs
   # ou : node outils/ajouter-cartes.mjs chemin/vers/mon-fichier.json
   ```

3. Le script insère les cartes dans `src/data/wordPairs.js` à la bonne place,
   fait une sauvegarde `.bak`, et vérifie que le fichier reste valide
   (sinon il restaure automatiquement).

Ensuite, comme d'habitude : `git add . && git commit && git push` pour mettre
la version en ligne à jour.

## Format d'une carte (JSON)

```json
{
  "category": "anime",
  "a": "Pikachu",
  "b": "Raichu",
  "aFrom": "Pokémon",
  "bFrom": "Pokémon",
  "link": "Évolution",
  "hardcore": true
}
```

- `category` (obligatoire) : `films`, `series`, `anime`, `jeux`, `personnages`,
  `personnalites`, `pokemon`, `pays`, `objets`, `nourriture`, `animaux`.
- `a`, `b` (obligatoires) : les deux mots proches.
- `aFrom`, `bFrom`, `link`, `hardcore` : optionnels.
