/**
 * Insère automatiquement des cartes dans src/data/wordPairs.js.
 * ----------------------------------------------------------------------------
 * Usage (depuis la racine du projet) :
 *     node outils/ajouter-cartes.mjs                # lit outils/cartes.json
 *     node outils/ajouter-cartes.mjs mon-fichier.json
 *
 * Le JSON doit être un tableau d'objets :
 *   [ { "category": "anime", "a": "X", "b": "Y",
 *       "aFrom": "...", "bFrom": "...", "link": "...", "hardcore": true } ]
 * (aFrom, bFrom, link, hardcore sont optionnels)
 *
 * Le script :
 *   - regroupe les cartes par catégorie ;
 *   - insère les lignes juste avant le `],` qui ferme chaque tableau ;
 *   - fait une sauvegarde .bak et vérifie que le fichier reste valide
 *     (sinon il restaure automatiquement).
 * ----------------------------------------------------------------------------
 */

import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const TARGET = resolve(root, 'src/data/wordPairs.js')
const jsonPath = resolve(process.cwd(), process.argv[2] || resolve(here, 'cartes.json'))

const q = (s) => JSON.stringify(String(s))

function cardLine(c) {
  const p = [`a: ${q(c.a)}`]
  if (c.aFrom) p.push(`aFrom: ${q(c.aFrom)}`)
  p.push(`b: ${q(c.b)}`)
  if (c.bFrom) p.push(`bFrom: ${q(c.bFrom)}`)
  if (c.link) p.push(`link: ${q(c.link)}`)
  if (c.hardcore) p.push('hardcore: true')
  return `    { ${p.join(', ')} },`
}

function main() {
  let cards
  try {
    cards = JSON.parse(readFileSync(jsonPath, 'utf8'))
  } catch (e) {
    console.error(`❌ Impossible de lire/parsers le JSON : ${jsonPath}\n   ${e.message}`)
    process.exit(1)
  }
  if (!Array.isArray(cards) || cards.length === 0) {
    console.error('❌ Le JSON doit être un tableau non vide de cartes.')
    process.exit(1)
  }

  let src = readFileSync(TARGET, 'utf8')

  // Regroupe par catégorie en conservant l'ordre.
  const byCat = {}
  for (const c of cards) {
    if (!c || !c.category || !c.a || !c.b) {
      console.error('❌ Carte invalide (il faut au moins category, a et b) :', JSON.stringify(c))
      process.exit(1)
    }
    ;(byCat[c.category] ||= []).push(c)
  }

  const summary = []
  for (const [cat, list] of Object.entries(byCat)) {
    const startMarker = `\n  ${cat}: [`
    const start = src.indexOf(startMarker)
    if (start === -1) {
      console.error(`❌ Catégorie introuvable dans wordPairs.js : "${cat}"`)
      process.exit(1)
    }
    // Cherche le `],` (fermeture du tableau, indentation 2 espaces) après le début.
    const close = src.indexOf('\n  ],', start)
    if (close === -1) {
      console.error(`❌ Fin du tableau introuvable pour la catégorie : "${cat}"`)
      process.exit(1)
    }
    const lines = list.map(cardLine).join('\n')
    src = src.slice(0, close) + '\n' + lines + src.slice(close)
    summary.push(`${cat} : +${list.length}`)
  }

  // Sauvegarde puis écriture.
  copyFileSync(TARGET, TARGET + '.bak')
  writeFileSync(TARGET, src, 'utf8')

  // Vérifie que le fichier se charge toujours ; sinon on restaure.
  import(pathToFileURL(TARGET).href + '?t=' + Date.now())
    .then((mod) => {
      const total = mod.totalPairs ? mod.totalPairs() : '?'
      console.log('✅ Cartes ajoutées : ' + summary.join(' · '))
      console.log('   Total de paires dans la base : ' + total)
      console.log('   (sauvegarde dans src/data/wordPairs.js.bak)')
    })
    .catch((e) => {
      copyFileSync(TARGET + '.bak', TARGET)
      console.error('❌ Le fichier généré est invalide — restauration de la sauvegarde.')
      console.error('   ' + e.message)
      process.exit(1)
    })
}

main()
