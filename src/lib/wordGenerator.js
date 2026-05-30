/**
 * GÉNÉRATEUR DE MOTS & DE RÔLES
 * ----------------------------------------------------------------------------
 * Sépare totalement la logique de jeu de l'UI.
 *   - choisit une paire de mots cohérente selon les catégories
 *   - en mode hardcore, privilégie les paires très proches
 *   - répartit les rôles (imposteurs vs joueurs normaux)
 *   - attache l'œuvre d'origine (origin) à chaque rôle pour l'affichage
 * ----------------------------------------------------------------------------
 */

import { poolForCategories } from '../data/wordPairs.js'

/** Mélange un tableau (Fisher–Yates), sans muter l'original. */
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickPair(categoryIds, hardcore) {
  let pool = poolForCategories(categoryIds)
  // En hardcore on ne garde que les paires les plus subtiles (si possible).
  if (hardcore) {
    const subtle = pool.filter((p) => p.hardcore)
    if (subtle.length > 0) pool = subtle
  }
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Génère une manche complète.
 * @param {Object} opts
 * @param {string[]} opts.players      - noms des joueurs
 * @param {number}   opts.impostorCount- nombre d'imposteurs
 * @param {string[]} opts.categories   - catégories choisies
 * @param {boolean}  opts.hardcore     - mode mots très proches
 * @returns {{
 *   mainWord: string, mainFrom?: string,
 *   impostorWord: string, impostorFrom?: string,
 *   category: string,
 *   roles: Array<{ name: string, isImpostor: boolean, word: string, origin?: string }>
 * }}
 */
export function generateRound({ players, impostorCount = 1, categories = [], hardcore = false }) {
  const clean = players.map((p) => p.trim()).filter(Boolean)
  if (clean.length < 3) {
    throw new Error('Il faut au moins 3 joueurs.')
  }

  const pair = pickPair(categories, hardcore)

  // On décide aléatoirement quel mot de la paire est le mot principal.
  const flip = Math.random() < 0.5
  const mainWord = flip ? pair.a : pair.b
  const mainFrom = flip ? pair.aFrom : pair.bFrom
  const impostorWord = flip ? pair.b : pair.a
  const impostorFrom = flip ? pair.bFrom : pair.aFrom

  // On borne le nombre d'imposteurs : au moins 1, et on laisse toujours
  // une majorité de joueurs normaux.
  const maxImpostors = Math.max(1, Math.floor((clean.length - 1) / 2))
  const count = Math.min(Math.max(1, impostorCount), maxImpostors)

  // Tirage des index imposteurs.
  const indexes = shuffle(clean.map((_, i) => i)).slice(0, count)
  const impostorSet = new Set(indexes)

  const roles = clean.map((name, i) => {
    const isImpostor = impostorSet.has(i)
    return {
      name,
      isImpostor,
      word: isImpostor ? impostorWord : mainWord,
      origin: isImpostor ? impostorFrom : mainFrom,
    }
  })

  return {
    mainWord,
    mainFrom,
    impostorWord,
    impostorFrom,
    category: pair.category,
    roles,
  }
}

/**
 * Vérifie si la proposition de l'imposteur correspond au mot principal.
 * Tolérant : insensible à la casse/accents, accepte les correspondances proches
 * (sous-chaîne ou distance de Levenshtein faible) => "victoire si proche ou exacte".
 */
export function checkImpostorGuess(guess, mainWord) {
  const norm = (s) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // retire les accents (marques diacritiques)
      .replace(/[^a-z0-9 ]/g, '')
      .trim()

  const g = norm(guess)
  const m = norm(mainWord)
  if (!g) return false
  if (g === m) return true
  // Tolérance : l'un contient l'autre (ex: "iron" pour "iron man").
  if (m.includes(g) && g.length >= 3) return true
  if (g.includes(m) && m.length >= 3) return true
  // Tolérance fautes de frappe : distance de Levenshtein <= 2.
  return levenshtein(g, m) <= 2
}

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)])
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}
