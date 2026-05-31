import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../store/gameStore.jsx'
import { usePlay } from '../hooks/soundContext.jsx'
import { useKeyboard } from '../hooks/useKeyboard.js'
import { CATEGORIES } from '../data/wordPairs.js'
import NeonButton from '../components/ui/NeonButton.jsx'
import GlowCard from '../components/ui/GlowCard.jsx'

export default function HomeScreen() {
  const { state, dispatch } = useGame()
  const play = usePlay()
  const [showHistory, setShowHistory] = useState(false)

  const start = () => {
    play('flip')
    dispatch({ type: 'SET_PHASE', phase: 'setup' })
  }
  const openLibrary = () => {
    play('click')
    dispatch({ type: 'SET_PHASE', phase: 'library' })
  }

  useKeyboard({ Enter: start })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      {/* Titre */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
        className="font-display text-7xl font-bold leading-none neon-text sm:text-8xl"
      >
        IMPOST<span className="text-neon-primary">EUR</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-5 max-w-md text-ink-soft"
      >
        Tout le monde reçoit le même mot… sauf un. Démasquez l'imposteur avant
        qu'il ne devine le vôtre.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex flex-col items-center gap-4"
      >
        <NeonButton size="xl" onClick={start} onMouseEnter={() => play('hover')}>
          ▶ Créer une partie
        </NeonButton>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <NeonButton size="sm" variant="secondary" onClick={openLibrary}>
            📚 Voir toutes les cartes
          </NeonButton>
          <button
            onClick={() => { play('click'); setShowHistory((s) => !s) }}
            className="text-sm text-ink-soft underline-offset-4 transition hover:text-ink hover:underline"
          >
            {showHistory ? 'Masquer l\'historique' : `Historique (${state.history.length})`}
          </button>
        </div>
      </motion.div>

      {/* Mini galerie de catégories */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-12 flex flex-wrap justify-center gap-3"
      >
        {Object.values(CATEGORIES).map((c) => (
          <span
            key={c.id}
            className="rounded-full border border-white/10 bg-surface-soft/50 px-4 py-2 text-sm text-ink-soft backdrop-blur"
          >
            {c.icon} {c.label}
          </span>
        ))}
      </motion.div>

      {/* Historique */}
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-10 w-full max-w-xl"
        >
          <GlowCard className="p-6 text-left">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Dernières parties</h3>
              {state.history.length > 0 && (
                <button
                  onClick={() => { play('click'); dispatch({ type: 'CLEAR_HISTORY' }) }}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Tout effacer
                </button>
              )}
            </div>
            {state.history.length === 0 ? (
              <p className="text-sm text-ink-soft">Aucune partie pour l'instant.</p>
            ) : (
              <ul className="space-y-2">
                {state.history.map((h) => (
                  <li
                    key={h.id}
                    className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2 text-sm"
                  >
                    <span className="text-ink-soft">
                      {new Date(h.date).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="font-medium">
                      {h.mainWord} <span className="text-ink-soft">vs</span> {h.impostorWord || 'Mr. White'}
                    </span>
                    <span
                      className={
                        h.outcome === 'players' ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      {h.outcome === 'players' ? '👥 Joueurs' : '🕵️ Imposteur'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </GlowCard>
        </motion.div>
      )}

      <p className="mt-12 text-xs text-ink-soft/70">
        Astuce : appuyez sur <kbd className="rounded bg-white/10 px-1.5 py-0.5">Entrée</kbd> pour commencer.
      </p>
    </div>
  )
}
