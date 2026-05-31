import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../store/gameStore.jsx'
import { usePlay } from '../hooks/soundContext.jsx'
import { useKeyboard } from '../hooks/useKeyboard.js'
import { CATEGORIES, WORD_DATA, totalPairs } from '../data/wordPairs.js'
import GlowCard from '../components/ui/GlowCard.jsx'

// Liste « à plat » de toutes les paires, avec leur catégorie.
const ALL_PAIRS = Object.entries(WORD_DATA).flatMap(([cat, arr]) =>
  arr.map((p, i) => ({ ...p, category: cat, key: `${cat}-${i}` })),
)

// Texte affiché pour la nature du lien (jamais montré en partie, seulement ici).
function linkLabel(p) {
  if (p.link) return p.link
  if (p.aFrom && p.bFrom && p.aFrom === p.bFrom) return 'Même univers'
  return 'Mots proches'
}

function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export default function LibraryScreen() {
  const { dispatch } = useGame()
  const play = usePlay()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')

  const back = () => {
    play('click')
    dispatch({ type: 'SET_PHASE', phase: 'home' })
  }
  useKeyboard({ Escape: back })

  const filtered = useMemo(() => {
    const q = norm(query)
    return ALL_PAIRS.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false
      if (!q) return true
      const hay = norm(
        [p.a, p.b, p.aFrom, p.bFrom, p.link, CATEGORIES[p.category]?.label].join(' '),
      )
      return hay.includes(q)
    })
  }, [query, cat])

  // Compteur par catégorie pour les puces de filtre.
  const counts = useMemo(() => {
    const c = { all: ALL_PAIRS.length }
    Object.keys(WORD_DATA).forEach((k) => (c[k] = WORD_DATA[k].length))
    return c
  }, [])

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

      {/* Recherche */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un mot, un univers, un lien…"
        className="mb-4 w-full rounded-2xl border border-white/15 bg-surface/60 px-5 py-3 text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-neon-primary focus:shadow-glow-soft"
      />

      {/* Filtres par catégorie */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip active={cat === 'all'} onClick={() => { play('click'); setCat('all') }}>
          🎲 Toutes <span className="opacity-60">({counts.all})</span>
        </Chip>
        {Object.values(CATEGORIES)
          .filter((c) => c.id !== 'mix')
          .map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => { play('click'); setCat(c.id) }}>
              {c.icon} {c.label} <span className="opacity-60">({counts[c.id]})</span>
            </Chip>
          ))}
      </div>

      {/* Grille des cartes */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">Aucune carte ne correspond à « {query} ».</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <motion.div
              key={p.key}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <GlowCard glow={false} className="h-full p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-ink-soft">
                    {CATEGORIES[p.category]?.icon} {CATEGORIES[p.category]?.label}
                  </span>
                  {p.hardcore && (
                    <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                      🔥 très proche
                    </span>
                  )}
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
