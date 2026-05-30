# Déployer sur GitHub Pages

Le projet est déjà prêt : `vite.config.js` utilise `base: './'` (chemins
relatifs) et un workflow GitHub Actions est fourni dans
`.github/workflows/deploy.yml`. À chaque `git push` sur `main`, le site est
reconstruit et publié automatiquement.

## 1. Créer le dépôt GitHub

Sur https://github.com/new : donne un nom (ex. `imposteur`), laisse-le **public**,
ne coche rien d'autre, puis « Create repository ».

## 2. Envoyer le code (depuis le dossier du projet)

```bash
git init
git add .
git commit -m "Imposteur party game"
git branch -M main
git remote add origin https://github.com/TON_PSEUDO/imposteur.git
git push -u origin main
```

Remplace `TON_PSEUDO` et `imposteur` par les tiens.

## 3. Activer GitHub Pages

Sur ton dépôt GitHub : **Settings → Pages → Build and deployment → Source**,
choisis **GitHub Actions**. (Une seule fois.)

## 4. C'est déployé

Va dans l'onglet **Actions** : le workflow « Deploy to GitHub Pages » tourne
(~1 min). Une fois en vert, ton jeu est en ligne à :

```
https://TON_PSEUDO.github.io/imposteur/
```

Ensuite, chaque `git push` met le site à jour tout seul.

---

## Alternative manuelle (sans GitHub Actions)

Si tu préfères déployer à la main avec le paquet `gh-pages` :

```bash
npm install --save-dev gh-pages
```

Ajoute ces deux scripts dans `package.json` :

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

Puis, à chaque mise à jour :

```bash
npm run deploy
```

Et dans **Settings → Pages**, choisis la branche `gh-pages` comme source.

---

## Notes

- `base: './'` rend les chemins relatifs : le jeu marche quel que soit le nom du
  dépôt, sans rien régler. Si un jour tu déploies sur un domaine racine
  (`ton-domaine.com`), ça marche aussi tel quel.
- Tout est 100 % côté navigateur (pas de serveur), donc GitHub Pages suffit
  parfaitement.
- L'historique des parties est stocké dans le navigateur de l'hôte
  (localStorage) : il reste local à la machine, ce qui est parfait pour un usage
  en stream Discord.
