import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/gameStore.jsx'
import { usePlay } from '../hooks/soundContext.jsx'
import { useKeyboard } from '../hooks/useKeyboard.js'
import { CATEGORIES, WORD_DATA, totalPairs } from '../data/wordPairs.js'
import { loadCustomPairs, addCustomPair, removeCustomPair } from '../lib/storage.js'
import GlowCard from '../components/ui/GlowCard.jsx'
import NeonButton from '../components/ui/NeonButton.jsx'

// Mot de passe pour créer des cartes (volontairement simple : il sert juste à
// éviter que n'importe qui ajoute des cartes. Il est visible dans le code, donc
// ce n'est pas une vraie sécurité.)
const CREATE_PASSWORD = 'krash'
const CREATOR_FLAG = 'imposteur:creator'

// Catégories proposables à la création (tout sauf le « mix »).
const PICKABLE = Object.values(CATEGORIES).filter((c) => c.id !== 'mix')

function buildAllPairs() {
  const base = Object.entries(WORD_DATA).flatMap(([cat, arr]) =>
    arr.map((p, i) => ({ ...p, category: cat, key: `${cat}-${i}` })),
  )
  const custom = loadCustomPairs().map((p) => ({ ...p, key: p.id, custom: true }))
  return [...custom, ...base] // cartes perso en premier
}

function linkLabel(p) {
  if (p.link) return p.link
  if (p.aFrom && p.bFrom && p.aFrom === p.bFrom) return 'Même univers'
  return 'Mots proches'
}

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const emptyForm = { category: 'anime', a: '', aFrom: '', b: '', bFrom: '', link: '' }

export default function LibraryScreen() {
  const { dispatch } = useGame()
  const play = usePlay()

  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const [version, setVersion] = useState(0) // force le recalcul après ajout/suppression

  // Création de cartes (protégée par mot de passe)
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(CREATOR_FLAG) === '1'
    } catch {
      return false
    }
  })
  const [showCreate, setShowCreate] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [justAdded, setJustAdded] = useState('')

  const back = () => {
    play('click')
    dispatch({ type: 'SET_PHASE', phase: 'home' })
  }
  useKeyboard({ Escape: back })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allPairs = useMemo(buildAllPairs, [version])

  const filtered = useMemo(() => {
    const q = norm(query)
    return allPairs.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false
      if (!q) return true
      const hay = norm(
        [p.a, p.b, p.aFrom, p.bFrom, p.link, CATEGORIES[p.category]?.label].join(' '),
      )
      return hay.includes(q)
    })
  }, [allPairs, query, cat])

  const counts = useMemo(() => {
    const c = { all: allPairs.length }
    Object.keys(CATEGORIES).forEach((k) => (c[k] = 0))
    allPairs.forEach((p) => (c[p.category] = (c[p.category] || 0) + 1))
    return c
  }, [allPairs])

  // --- Actions création ---
  const tryUnlock = () => {
    if (pw.trim().toLowerCase() === CREATE_PASSWORD) {
      setUnlocked(true)
      setPwError('')
      setPw('')
      try {
        localStorage.setItem(CREATOR_FLAG, '1')
      } catch {
        /* ignore */
      }
      play('win')
    } else {
      setPwError('Mot de passe incorrect.')
      play('lose')
    }
  }

  const lock = () => {
    setUnlocked(false)
    setShowCreate(false)
    try {
      localStorage.removeItem(CREATOR_FLAG)
    } catch {
      /* ignore */
    }
    play('click')
  }

  const submitCard = () => {
    if (!form.a.trim() || !form.b.trim()) {
      setPwError('Il faut au moins les deux mots (Mot A et Mot B).')
      play('lose')
      return
    }
    addCustomPair({
      category: form.category,
      a: form.a.trim(),
      b: form.b.trim(),
      aFrom: form.aFrom.trim() || undefined,
      bFrom: form.bFrom.trim() || undefined,
      link: form.link.trim() || undefined,
    })
    setJustAdded(`${form.a.trim()} ↔ ${form.b.trim()}`)
    setForm((f) => ({ ...emptyForm, category: f.category })) // garde la catégorie
    setPwError('')
    setVersion((v) => v + 1)
    play('reveal')
  }

  const deleteCustom = (id) => {
    removeCustomPair(id)
    setVersion((v) => v + 1)
    play('click')
  }

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={back} className="text-sm text-ink-soft transition hover:text-ink">
          ← Accueil
        </button>
        <h2 className="font-display text-2xl font-bold neon-text">📚 Bibliothèque</h2>
        <div className="w-16" />
      </div>

      <p className="mb-6 text-center text-ink-soft">
        Toutes les cartes du jeu : {totalPairs()} duos, classés par catégorie.
        Chaque paire indique pourquoi les deux mots sont liés.
      </p>

      {/* Recherche + bouton créer */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un mot, un univers, un lien…"
          className="w-full rounded-2xl border border-white/15 bg-surface/60 px-5 py-3 text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-neon-primary focus:shadow-glow-soft"
        />
        <NeonButton
          variant="secondary"
          onClick={() => { play('click'); setShowCreate((s) => !s); setPwError('') }}
          className="shrink-0"
        >
          ➕ Créer une carte
        </NeonButton>
      </div>

      {/* Panneau de création (protégé par mot de passe) */}
      <AnimatePresence initial={false}>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <GlowCard className="p-6">
              {!unlocked ? (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="text-3xl">🔒</div>
                  <p className="text-sm text-ink-soft">
                    Création réservée. Entre le mot de passe pour débloquer.
                  </p>
                  <div className="flex w-full max-w-sm gap-2">
                    <input
                      type="password"
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && tryUnlock()}
                      placeholder="Mot de passe"
                      className="w-full rounded-xl border border-white/15 bg-surface/60 px-4 py-2.5 text-ink outline-none focus:border-neon-primary"
                    />
                    <NeonButton size="sm" onClick={tryUnlock}>Déverrouiller</NeonButton>
                  </div>
                  {pwError && <p className="text-sm text-rose-400">{pwError}</p>}
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold">➕ Nouvelle carte</h3>
                    <button onClick={lock} className="text-xs text-ink-soft hover:text-ink">
                      🔒 Verrouiller
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="text-sm">
                      <span className="mb-1 block text-ink-soft">Catégorie</span>
                      <select
                        value={form.category}
                        onChange={setF('category')}
                        className="w-full rounded-xl border border-white/15 bg-surface/60 px-3 py-2.5 text-ink outline-none focus:border-neon-primary"
                      >
                        {PICKABLE.map((c) => (
                          <option key={c.id} value={c.id} className="bg-surface text-ink">
                            {c.icon} {c.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-ink-soft">Lien (optionnel)</span>
                      <Input value={form.link} onChange={setF('link')} placeholder="ex. Se ressemblent" />
                    </label>

                    <label className="text-sm">
                      <span className="mb-1 block text-ink-soft">Mot A *</span>
                      <Input value={form.a} onChange={setF('a')} placeholder="ex. Pikachu" />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-ink-soft">Univers A (optionnel)</span>
                      <Input value={form.aFrom} onChange={setF('aFrom')} placeholder="ex. Pokémon" />
                    </label>

                    <label className="text-sm">
                      <span className="mb-1 block text-ink-soft">Mot B *</span>
                      <Input value={form.b} onChange={setF('b')} placeholder="ex. Raichu" />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block text-ink-soft">Univers B (optionnel)</span>
                      <Input value={form.bFrom} onChange={setF('bFrom')} placeholder="ex. Pokémon" />
                    </label>
                  </div>

                  {pwError && <p className="mt-3 text-sm text-rose-400">{pwError}</p>}
                  {justAdded && (
                    <p className="mt-3 text-sm text-emerald-400">✓ Carte ajoutée : {justAdded}</p>
                  )}

                  <div className="mt-4 flex justify-end">
                    <NeonButton size="sm" onClick={submitCard}>Ajouter la carte</NeonButton>
                  </div>
                  <p className="mt-3 text-xs text-ink-soft/70">
                    Les cartes créées sont enregistrées dans ce navigateur et entrent
                    directement dans le jeu et la bibliothèque.
                  </p>
                </div>
              )}
            </GlowCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtres par catégorie */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip active={cat === 'all'} onClick={() => { play('click'); setCat('all') }}>
          🎲 Toutes <span className="opacity-60">({counts.all})</span>
        </Chip>
        {PICKABLE.map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => { play('click'); setCat(c.id) }}>
            {c.icon} {c.label} <span className="opacity-60">({counts[c.id] || 0})</span>
          </Chip>
        ))}
      </div>

      {/* Grille des cartes */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">Aucune carte ne correspond à « {query} ».</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <motion.div key={p.key} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <GlowCard glow={false} className="relative h-full p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-ink-soft">
                    {CATEGORIES[p.category]?.icon} {CATEGORIES[p.category]?.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {p.custom && (
                      <span className="rounded-full bg-neon-secondary/15 px-2 py-0.5 text-[10px] font-semibold text-neon-secondary">
                        ✏️ perso
                      </span>
                    )}
                    {p.hardcore && (
                      <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                        🔥 très proche
                      </span>
                    )}
                    {p.custom && unlocked && (
                      <button
                        onClick={() => deleteCustom(p.id)}
                        title="Supprimer cette carte"
                        className="text-ink-soft transition hover:text-rose-400"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <WordSide word={p.a} from={p.aFrom} />
                  <span className="shrink-0 text-lg text-neon-primary">↔</span>
                  <WordSide word={p.b} from={p.bFrom} align="right" />
                </div>

                <div className="mt-3 border-t border-white/10 pt-2 text-center text-xs text-ink-soft">
                  🔗 {linkLabel(p)}
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-white/15 bg-surface/60 px-3 py-2.5 text-ink outline-none focus:border-neon-primary"
    />
  )
}

function WordSide({ word, from, align = 'left' }) {
  return (
    <div className={`min-w-0 flex-1 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <div className="truncate font-display font-semibold text-ink">{word}</div>
      {from && <div className="truncate text-[11px] text-ink-soft">{from}</div>}
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? 'border-neon-primary bg-neon-primary/15 text-ink shadow-glow-soft'
          : 'border-white/10 bg-surface-soft/40 text-ink-soft hover:border-white/30'
      }`}
    >
      {children}
    </button>
  )
}
