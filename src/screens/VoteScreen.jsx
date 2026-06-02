import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/gameStore.jsx'
import { usePlay } from '../hooks/soundContext.jsx'
import { checkImpostorGuess } from '../lib/wordGenerator.js'
import NeonButton from '../components/ui/NeonButton.jsx'
import GlowCard from '../components/ui/GlowCard.jsx'

export default function VoteScreen() {
  const { state, dispatch } = useGame()
  const play = usePlay()
  const { round, eliminated } = state

  const [stage, setStage] = useState('select') // select | reveal | wrong | guess
  const [accused, setAccused] = useState(null) // index du joueur accusé
  const [guess, setGuess] = useState('')

  if (!round) return null

  const impostorIndexes = round.roles.map((r, i) => (r.isImpostor ? i : -1)).filter((i) => i >= 0)
  const remainingImpostors = impostorIndexes.filter((i) => !eliminated.includes(i))

  // L'hôte accuse un joueur.
  const accuse = (i) => {
    play('suspense')
    setAccused(i)
    setStage('reveal')
  }

  // Après l'animation de révélation, on branche selon le rôle.
  const onRevealEnd = () => {
    const role = round.roles[accused]
    if (role.isImpostor) {
      play('reveal')
      setStage('guess')
    } else {
      // Pas de son ici : le son (doux) de défaite est joué une seule fois,
      // sur l'écran de résultat. (Évite le doublon.)
      setStage('wrong')
    }
  }

  // Mauvaise accusation = partie perdue, on NE revote PAS : l'imposteur l'emporte.
  const impostorsWinByMistake = () => {
    finish('impostor', { reason: "Mauvaise accusation : l'imposteur n'a pas été trouvé." })
  }

  // L'imposteur accusé tente de deviner le mot principal.
  const submitGuess = () => {
    const correct = checkImpostorGuess(guess, round.mainWord)
    if (correct) {
      play('win')
      finish('impostor', { guessedWord: guess, correctGuess: true })
    } else {
      // Imposteur démasqué et raté.
      dispatch({ type: 'ELIMINATE', index: accused })
      const stillLeft = remainingImpostors.filter((i) => i !== accused)
      if (stillLeft.length === 0) {
        play('win')
        finish('players', { guessedWord: guess, correctGuess: false })
      } else {
        // D'autres imposteurs subsistent : on continue de chercher.
        play('lose')
        setAccused(null)
        setGuess('')
        setStage('select')
      }
    }
  }

  const finish = (outcome, extra = {}) => {
    const winners =
      outcome === 'players'
        ? round.roles.filter((r) => !r.isImpostor).map((r) => r.name)
        : round.roles.filter((r) => r.isImpostor).map((r) => r.name)
    const result = {
      outcome,
      winners,
      mainWord: round.mainWord,
      mainFrom: round.mainFrom,
      impostorWord: round.impostorWord,
      impostorFrom: round.impostorFrom,
      roles: round.roles,
      accusedName: accused !== null ? round.roles[accused].name : null,
      ...extra,
    }
    dispatch({ type: 'SET_RESULT', result })
    dispatch({
      type: 'SAVE_HISTORY',
      entry: {
        outcome,
        mainWord: round.mainWord,
        impostorWord: round.impostorWord,
        players: round.roles.length,
      },
    })
    dispatch({ type: 'GOTO', phase: 'result' })
  }

  const accusedRole = accused !== null ? round.roles[accused] : null

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-2 text-center text-sm uppercase tracking-[0.4em] text-ink-soft">
        Le vote
      </div>
      <h2 className="mb-8 text-center font-display text-4xl font-bold neon-text">
        Qui est l'imposteur ? 🗳️
      </h2>

      {/* SÉLECTION */}
      {stage === 'select' && (
        <>
          <p className="mb-6 text-center text-ink-soft">
            L'hôte sélectionne le joueur éliminé par le groupe.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {round.roles.map((role, i) => {
              const out = eliminated.includes(i)
              return (
                <motion.button
                  key={i}
                  whileHover={out ? undefined : { scale: 1.05 }}
                  whileTap={out ? undefined : { scale: 0.97 }}
                  disabled={out}
                  onClick={() => accuse(i)}
                  className={`flex h-28 flex-col items-center justify-center rounded-2xl border transition ${
                    out
                      ? 'border-white/5 bg-surface/30 text-ink-soft/40 line-through'
                      : 'border-white/10 bg-surface-soft/60 text-ink shadow-glow-soft hover:border-rose-500/60'
                  }`}
                >
                  <span className="text-2xl">{out ? '💀' : '🧑‍🚀'}</span>
                  <span className="mt-1 font-display font-semibold">{role.name}</span>
                </motion.button>
              )
            })}
          </div>
        </>
      )}

      {/* RÉVÉLATION DU RÔLE ACCUSÉ */}
      <AnimatePresence>
        {stage === 'reveal' && accusedRole && (
          <RevealAccused role={accusedRole} onDone={onRevealEnd} />
        )}
      </AnimatePresence>

      {/* MAUVAISE ACCUSATION : c'est perdu, pas de second vote. */}
      {stage === 'wrong' && accusedRole && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <GlowCard className="p-8 text-center">
            <div className="mb-4 text-6xl">😬</div>
            <h3 className="mb-2 font-display text-2xl font-bold text-rose-400">
              {accusedRole.name} n'était pas l'imposteur !
            </h3>
            <p className="mb-2 text-ink-soft">
              Le mot de {accusedRole.name} était «&nbsp;{accusedRole.word}&nbsp;»
              {accusedRole.origin ? ` (${accusedRole.origin})` : ''}.
            </p>
            <p className="mb-6 font-medium text-rose-300">
              Mauvaise accusation : l'imposteur l'emporte.
            </p>
            <div className="flex justify-center">
              <NeonButton variant="danger" onClick={impostorsWinByMistake}>
                Voir le résultat
              </NeonButton>
            </div>
          </GlowCard>
        </motion.div>
      )}

      {/* DEVINETTE DE L'IMPOSTEUR */}
      {stage === 'guess' && accusedRole && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <GlowCard className="p-8 text-center">
            <div className="mb-4 text-6xl">🕵️</div>
            <h3 className="mb-1 font-display text-2xl font-bold text-rose-400">
              {accusedRole.name} était l'imposteur !
            </h3>
            <p className="mb-6 text-ink-soft">
              Dernière chance : devine le <strong>mot principal</strong> des autres
              joueurs pour renverser la partie.
            </p>
            <input
              autoFocus
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && guess.trim() && submitGuess()}
              placeholder="Tape ta réponse…"
              className="mb-5 w-full rounded-2xl border border-white/15 bg-surface/60 px-5 py-4 text-center font-display text-xl text-ink outline-none focus:border-neon-primary focus:shadow-glow-soft"
            />
            <NeonButton size="lg" disabled={!guess.trim()} onClick={submitGuess}>
              Valider ma réponse
            </NeonButton>
          </GlowCard>
        </motion.div>
      )}
    </div>
  )
}

/* Animation de suspense lors de la révélation du rôle accusé. */
function RevealAccused({ role, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => setTimeout(onDone, 1300)}
      className="flex flex-col items-center"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 1.2, repeat: 1 }}
        className="my-6 text-7xl"
      >
        🥁
      </motion.div>
      <p className="font-display text-2xl text-ink-soft">Roulement de tambour…</p>
      <p className="mt-2 text-ink-soft">On révèle le rôle de {role.name}</p>
    </motion.div>
  )
}
