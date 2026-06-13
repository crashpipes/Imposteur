import { motion } from 'framer-motion'
import { useGame, useT } from '../store/gameStore.jsx'
import { usePlay } from '../hooks/soundContext.jsx'
import { useKeyboard } from '../hooks/useKeyboard.js'
import NeonButton from '../components/ui/NeonButton.jsx'
import GlowCard from '../components/ui/GlowCard.jsx'

const MEDALS = ['🥇', '🥈', '🥉']

export default function ScoreboardScreen() {
  const { state, dispatch } = useGame()
  const { t } = useT()
  const play = usePlay()

  const ranking = Object.entries(state.scores)
    .map(([name, points]) => ({ name, points }))
    .sort((a, b) => b.points - a.points)

  const topScore = ranking.length ? ranking[0].points : 0
  const winners = ranking.filter((r) => r.points === topScore && topScore > 0).map((r) => r.name)

  const keepPlaying = () => {
    play('flip')
    dispatch({ type: 'START_ROUND' }) // on garde le score, nouvelle manche
  }
  const toMenu = () => {
    play('click')
    dispatch({ type: 'NEW_GAME' }) // remet le score à zéro
  }
  useKeyboard({ Escape: toMenu })

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-2 text-center text-sm uppercase tracking-[0.4em] text-ink-soft">
        {t('score.eyebrow')}
      </div>
      <h2 className="mb-2 text-center font-display text-4xl font-bold neon-text">{t('score.title')}</h2>

      {winners.length > 0 && (
        <p className="mb-8 text-center text-ink-soft">
          {winners.length === 1 ? t('score.leader') : t('score.tied')}
          <span className="font-semibold text-ink">{winners.join(', ')}</span>
        </p>
      )}

      {ranking.length === 0 ? (
        <GlowCard className="mb-8 p-8 text-center text-ink-soft">
          {t('score.noRounds')}
        </GlowCard>
      ) : (
        <GlowCard className="mb-8 p-6">
          <ul className="space-y-2">
            {ranking.map((r, i) => {
              const leader = r.points === topScore && topScore > 0
              return (
                <motion.li
                  key={r.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                    leader ? 'border border-neon-primary/30 bg-neon-primary/10' : 'bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-3 font-medium">
                    <span className="w-7 text-center text-lg">{MEDALS[i] || `${i + 1}.`}</span>
                    {r.name}
                  </span>
                  <span className="font-display text-xl font-bold tabular-nums">
                    {r.points}
                    <span className="ml-1 text-sm font-normal text-ink-soft">{t('score.pts')}</span>
                  </span>
                </motion.li>
              )
            })}
          </ul>
        </GlowCard>
      )}

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <NeonButton size="lg" onClick={keepPlaying}>
          {t('score.keepPlaying')}
        </NeonButton>
        <NeonButton size="lg" variant="secondary" onClick={toMenu}>
          {t('score.toMenu')}
        </NeonButton>
      </div>
      <p className="mt-4 text-center text-xs text-ink-soft/70">
        {t('score.note')}
      </p>
    </div>
  )
}
