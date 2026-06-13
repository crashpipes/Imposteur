import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame, useT } from '../store/gameStore.jsx'
import { usePlay } from '../hooks/soundContext.jsx'
import { useKeyboard } from '../hooks/useKeyboard.js'
import { shuffle } from '../lib/wordGenerator.js'
import NeonButton from '../components/ui/NeonButton.jsx'
import GlowCard from '../components/ui/GlowCard.jsx'
import Timer from '../components/ui/Timer.jsx'

export default function DiscussionScreen() {
  const { state, dispatch } = useGame()
  const { t } = useT()
  const play = usePlay()
  const { round, settings, config } = state

  // turn = compteur global de prises de parole (0 .. nbJoueurs*tours - 1)
  const [turn, setTurn] = useState(0)

  // Ordre de parole RANDOMISÉ, tiré une seule fois par partie (au montage de
  // l'écran). Ainsi ce n'est pas toujours le même joueur qui commence, mais
  // l'ordre reste stable d'un tour à l'autre pendant toute la discussion.
  const [order] = useState(() => {
    if (!round) return []
    const ord = shuffle(round.roles.map((_, i) => i))
    // En mode Mr. White, l'imposteur ne doit JAMAIS commencer à parler
    // (sinon, sans aucun mot, c'est trop dur) : on place un joueur normal en 1er.
    if (round.mrWhite && round.roles[ord[0]].isImpostor) {
      const swap = ord.findIndex((idx) => !round.roles[idx].isImpostor)
      if (swap > 0) [ord[0], ord[swap]] = [ord[swap], ord[0]]
    }
    return ord
  })

  if (!round) return null

  const count = round.roles.length
  const tours = config.tours || 1
  const totalTurns = count * tours

  const finished = turn >= totalTurns
  const pos = finished ? -1 : turn % count // position dans le tour courant (0-based)
  const currentIndex = finished ? -1 : order[pos] // index réel du joueur qui parle
  const currentTour = finished ? tours : Math.floor(turn / count) + 1
  const current = currentIndex >= 0 ? round.roles[currentIndex] : null

  const next = () => {
    play('click')
    setTurn((t) => Math.min(t + 1, totalTurns))
  }
  const goVote = () => {
    play('reveal')
    dispatch({ type: 'GOTO', phase: 'vote' })
  }

  // Entrée / Espace = joueur suivant (ou vote si terminé)
  useKeyboard({ Enter: finished ? goVote : next, ' ': finished ? goVote : next }, [finished])

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center px-6 py-12">
      <div className="mb-2 text-center text-sm uppercase tracking-[0.4em] text-ink-soft">
        {t('disc.eyebrow')}
      </div>
      <h2 className="mb-6 text-center font-display text-4xl font-bold neon-text">
        {t('disc.title')}
      </h2>

      {/* Compteur de tours */}
      <div className="mb-8 flex items-center gap-2">
        {Array.from({ length: tours }, (_, i) => (
          <span
            key={i}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              i + 1 < currentTour
                ? 'bg-emerald-500/20 text-emerald-300'
                : i + 1 === currentTour
                  ? 'bg-neon-primary/25 text-neon-primary shadow-glow-soft'
                  : 'bg-white/5 text-ink-soft'
            }`}
          >
            {t('disc.tour', { n: i + 1 })}
          </span>
        ))}
      </div>

      {/* Carte du joueur courant / écran de fin */}
      <div className="mb-8 w-full max-w-md">
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={turn}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlowCard className="p-8 text-center">
                <div className="text-xs uppercase tracking-[0.3em] text-ink-soft">
                  {t('disc.tourProgress', { tour: currentTour, tours, pos: pos + 1, count })}
                </div>
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className="my-5 text-6xl"
                >
                  🎤
                </motion.div>
                <div className="text-sm text-ink-soft">{t('disc.turnOf')}</div>
                <div className="mb-2 font-display text-4xl font-bold neon-text">
                  {current.name}
                </div>
                <p className="text-sm text-ink-soft">
                  {t('disc.clue')}
                </p>

                {settings.timer && (
                  <div className="mt-6 flex justify-center">
                    {/* key={turn} -> le minuteur se réinitialise à chaque joueur */}
                    <Timer
                      key={turn}
                      seconds={settings.timerSeconds}
                      onTick={() => play('tick')}
                      onEnd={() => play('lose')}
                    />
                  </div>
                )}
              </GlowCard>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              <GlowCard className="p-8 text-center">
                <div className="my-4 text-6xl">✅</div>
                <h3 className="mb-2 font-display text-2xl font-bold">
                  {t('disc.doneTitle')}
                </h3>
                <p className="text-ink-soft">
                  {t('disc.doneDesc')}
                </p>
              </GlowCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pastilles des joueurs, affichées DANS L'ORDRE DE PAROLE de la partie */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {order.map((roleIndex, slot) => (
          <span
            key={roleIndex}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              roleIndex === currentIndex
                ? 'border-neon-primary bg-neon-primary/15 text-ink shadow-glow-soft'
                : 'border-white/10 bg-surface-soft/40 text-ink-soft'
            }`}
          >
            <span className="mr-1 opacity-50">{slot + 1}.</span>
            {roleIndex === currentIndex ? '🎤 ' : ''}
            {round.roles[roleIndex].name}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3">
        {!finished ? (
          <NeonButton size="xl" onClick={next}>
            {turn + 1 === totalTurns ? t('disc.lastPlayer') : t('disc.nextPlayer')}
          </NeonButton>
        ) : (
          <NeonButton size="xl" onClick={goVote}>
            {t('disc.toVote')}
          </NeonButton>
        )}

        <div className="flex items-center gap-4 text-xs text-ink-soft/70">
          <span>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5">{t('disc.kbdEnter')}</kbd> /{' '}
            <kbd className="rounded bg-white/10 px-1.5 py-0.5">{t('disc.kbdSpace')}</kbd>{' '}
            {finished ? t('disc.kbdVote') : t('disc.kbdNext')}
          </span>
          {!finished && (
            <button onClick={goVote} className="underline-offset-4 transition hover:text-ink hover:underline">
              {t('disc.skipToVote')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
