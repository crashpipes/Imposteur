import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../store/gameStore.jsx'
import { usePlay } from '../hooks/soundContext.jsx'
import { useKeyboard } from '../hooks/useKeyboard.js'
import NeonButton from '../components/ui/NeonButton.jsx'
import GlowCard from '../components/ui/GlowCard.jsx'

export default function ResultScreen() {
  const { state, dispatch } = useGame()
  const play = usePlay()
  const { result, settings } = state

  const playersWin = result?.outcome === 'players'

  useEffect(() => {
    play(playersWin ? 'win' : 'lose')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const replay = () => {
    play('flip')
    dispatch({ type: 'START_ROUND' }) // relance immédiatement avec les mêmes réglages
  }
  const newGame = () => {
    play('click')
    dispatch({ type: 'NEW_GAME' })
  }

  useKeyboard({ Enter: replay, Escape: newGame })

  if (!result) return null

  return (
    <div className="relative mx-auto max-w-3xl px-6 py-12">
      {settings.animations && <Confetti win={playersWin} />}

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="mb-8 text-center"
      >
        <div className="mb-3 text-7xl">{playersWin ? '🏆' : '🕵️'}</div>
        <h2
          className={`font-display text-5xl font-bold neon-text ${
            playersWin ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {playersWin ? 'Les joueurs gagnent !' : "L'imposteur gagne !"}
        </h2>
        <p className="mt-3 text-ink-soft">
          {result.correctGuess === true &&
            `L'imposteur a deviné le mot principal : « ${result.guessedWord} ».`}
          {result.correctGuess === false &&
            `Mauvaise réponse de l'imposteur (« ${result.guessedWord} »). Démasqué !`}
          {result.reason && result.reason}
        </p>
      </motion.div>

      {/* Mots de la manche */}
      <GlowCard className="mb-6 p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-2xl bg-emerald-500/10 p-4">
            <div className="text-xs uppercase tracking-widest text-ink-soft">Mot principal</div>
            <div className="mt-1 font-display text-2xl font-bold text-emerald-400">
              {result.mainWord}
            </div>
            {result.mainFrom && (
              <div className="mt-1 text-xs text-ink-soft">📚 {result.mainFrom}</div>
            )}
          </div>
          <div className="rounded-2xl bg-rose-500/10 p-4">
            <div className="text-xs uppercase tracking-widest text-ink-soft">Mot imposteur</div>
            <div className="mt-1 font-display text-2xl font-bold text-rose-400">
              {result.impostorWord || 'Mr. White 🕵️'}
            </div>
            {result.impostorFrom ? (
              <div className="mt-1 text-xs text-ink-soft">📚 {result.impostorFrom}</div>
            ) : !result.impostorWord ? (
              <div className="mt-1 text-xs text-ink-soft">aucun mot</div>
            ) : null}
          </div>
        </div>
      </GlowCard>

      {/* Récap des rôles */}
      <GlowCard className="mb-8 p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">Les rôles</h3>
        <ul className="space-y-2">
          {result.roles.map((role, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
            >
              <span className="flex items-center gap-2 font-medium">
                <span>{role.isImpostor ? '🕵️' : '🧑‍🚀'}</span>
                {role.name}
              </span>
              <span
                className={`text-right text-sm ${role.isImpostor ? 'text-rose-400' : 'text-emerald-400'}`}
              >
                {role.isImpostor ? 'Imposteur' : 'Joueur'} · {role.word || 'Mr. White'}
                {role.origin && (
                  <span className="block text-xs text-ink-soft">{role.origin}</span>
                )}
              </span>
            </motion.li>
          ))}
        </ul>
      </GlowCard>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <NeonButton size="lg" onClick={replay}>
          🔄 Rejouer (même équipe)
        </NeonButton>
        <NeonButton size="lg" variant="secondary" onClick={newGame}>
          🏠 Nouvelle partie
        </NeonButton>
      </div>
      <p className="mt-4 text-center text-xs text-ink-soft/70">
        <kbd className="rounded bg-white/10 px-1.5 py-0.5">Entrée</kbd> rejouer ·{' '}
        <kbd className="rounded bg-white/10 px-1.5 py-0.5">Échap</kbd> accueil
      </p>
    </div>
  )
}

/* Confettis légers en pur Framer Motion (pas de lib externe). */
function Confetti({ win }) {
  const colors = win
    ? ['#34d399', '#22d3ee', '#a78bfa', '#fbbf24']
    : ['#f43f5e', '#fb923c', '#a78bfa', '#f472b6']
  const pieces = Array.from({ length: 40 })
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 0.6
        const dur = 2.2 + Math.random() * 1.6
        const size = 6 + Math.random() * 8
        return (
          <motion.span
            key={i}
            initial={{ y: -40, opacity: 0, rotate: 0 }}
            animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              left: `${left}%`,
              width: size,
              height: size * 0.5,
              background: colors[i % colors.length],
              borderRadius: 2,
            }}
          />
        )
      })}
    </div>
  )
}
