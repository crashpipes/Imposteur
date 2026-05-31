/**
 * STOCKAGE LOCAL (localStorage)
 * ----------------------------------------------------------------------------
 * Tout est local : réglages persistants + historique + cartes personnalisées.
 * Aucune base de données, aucun compte. Sûr en cas de mode privé (try/catch).
 * ----------------------------------------------------------------------------
 */

const SETTINGS_KEY = 'imposteur:settings'
const HISTORY_KEY = 'imposteur:history'
const CUSTOM_KEY = 'imposteur:customPairs'

export const defaultSettings = {
  theme: 'nebula',
  sound: true,
  timer: true,
  timerSeconds: 180,
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings }
  } catch {
    return { ...defaultSettings }
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    /* ignore (mode privé) */
  }
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addHistoryEntry(entry) {
  try {
    const history = loadHistory()
    const next = [{ ...entry, id: Date.now(), date: new Date().toISOString() }, ...history].slice(0, 30)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
    return next
  } catch {
    return loadHistory()
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {
    /* ignore */
  }
  return []
}

/* ------------------------------------------------------------------ */
/* CARTES PERSONNALISÉES                                               */
/* Créées depuis la bibliothèque (protégées par mot de passe), stockées */
/* dans le navigateur. Elles s'ajoutent au jeu ET à la bibliothèque.   */
/* ------------------------------------------------------------------ */
export function loadCustomPairs() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function saveCustomPairs(arr) {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(arr))
  } catch {
    /* ignore */
  }
}

export function addCustomPair(pair) {
  const arr = loadCustomPairs()
  const entry = { ...pair, id: 'c' + Date.now() + Math.floor(Math.random() * 1000), custom: true }
  const next = [entry, ...arr]
  saveCustomPairs(next)
  return next
}

export function removeCustomPair(id) {
  const next = loadCustomPairs().filter((p) => p.id !== id)
  saveCustomPairs(next)
  return next
}
