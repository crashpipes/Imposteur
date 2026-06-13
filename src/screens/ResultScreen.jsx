import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGame, useT } from '../store/gameStore.jsx'
import { usePlay } from '../hooks/soundContext.jsx'
import { localizeWord, localizeFrom } from '../data/wordPairsEn.js'
import { useKeyboard } from '../hooks/useKeyboard.js'
import NeonButton from '../components/ui/NeonButton.jsx'
import GlowCard from '../components/ui/GlowCard.jsx'

export default function ResultScreen() {
  const { state, dispatch } = useGame()
  const { t, lang } = useT()
  const play = usePlay()
  const { result, scores } = state

  const playersWin = result?.outcome === 'players'

  useEffect(() => {
    play(playersWin ? 'win' : 'lose')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const replay = () => {
    play('flip')
    dispatch({ type: 'START_ROUND' }) // nouvelle manche, score conservé
  }
  // « Nouvelle partie » -> lobby de config (joueurs/réglages + score conservés).
  const newGame = () => {
    play('click')
    dispatch({ type: 'REPLAY' })
  }
  // « Score final » -> écran de classement (fin de session).
  const showScore = () => {
    play('reveal')
    dispatch({ type: 'SET_PHASE', phase: 'scoreboard' })
  }

  useKeyboard({ Enter: replay, Escape: newGame })

  if (!result) return null

  const impostorCount = result.roles.filter((r) => r.isImpostor).length
  const pointsText = playersWin
    ? t('result.pointsPlayers')
    : impostorCount > 1
      ? t('result.pointsImpostors')
      : t('result.pointsImpostor')

  const ranking = Object.entries(scores || {})
    .map(([name, points]) => ({ name, points }))
    .sort((a, b) => b.points - a.points)
  const topScore = ranking.length ? ranking[0].points : 0

  return (
    <div className="relative mx-auto max-w-3xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="mb-6 text-center"
      >
        <div className="mb-3 text-7xl">{playersWin ? '🏆' : '🕵️'}</div>
        <h2
          className={`font-display text-5xl font-bold neon-text ${
            playersWin ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {playersWin ? t('result.playersWin') : t('result.impostorWin')}
        </h2>
        <p className="mt-3 text-ink-soft">
          {result.correctGuess === true &&
            t('result.correctGuess', { word: result.guessedWord })}
          {result.correctGuess === false &&
            t('result.wrongGuess', { word: result.guessedWord })}
          {result.reason && result.reason}
        </p>
        <div className="mt-3 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-ink">
          {pointsText}
        </div>
      </motion.div>

      {/* Mots de la manche */}
      <GlowCard className="mb-6 p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-2xl bg-emerald-500/10 p-4">
            <div className="text-xs uppercase tracking-widest text-ink-soft">{t('result.mainWord')}</div>
            <div className="mt-1 font-display text-2xl font-bold text-emerald-400">
              {localizeWord(result.mainWord, lang)}
            </div>
            {result.mainFrom && (
              <div className="mt-1 text-xs text-ink-soft">📚 {localizeFrom(result.mainFrom, lang)}</div>
            )}
          </div>
          <div className="rounded-2xl bg-rose-500/10 p-4">
            <div className="text-xs uppercase tracking-widest text-ink-soft">{t('result.impostorWord')}</div>
            <div className="mt-1 font-display text-2xl font-bold text-rose-400">
              {result.impostorWord ? localizeWord(result.impostorWord, lang) : t('result.mrWhiteWord')}
            </div>
            {result.impostorFrom ? (
              <div className="mt-1 text-xs text-ink-soft">📚 {localizeFrom(result.impostorFrom, lang)}</div>
            ) : !result.impostorWord ? (
              <div className="mt-1 text-xs text-ink-soft">{t('result.noWord')}</div>
            ) : null}
          </div>
        </div>
      </GlowCard>

      {/* Récap des rôles */}
      <GlowCard className="mb-6 p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">{t('result.rolesTitle')}</h3>
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
                {role.isImpostor ? t('result.roleImpostor') : t('result.rolePlayer')} · {role.word ? localizeWord(role.word, lang) : 'Mr. White'}
                {role.origin && (
                  <span className="block text-xs text-ink-soft">{localizeFrom(role.origin, lang)}</span>
                )}
              </span>
            </motion.li>
          ))}
        </ul>
      </GlowCard>

      {/* Score de la session (cumulé) */}
      {ranking.length > 0 && (
        <GlowCard className="mb-8 p-6">
          <h3 className="mb-3 font-display text-lg font-semibold">{t('result.sessionScore')}</h3>
          <ul className="space-y-1.5">
            {ranking.map((r) => {
              const leader = r.points === topScore && topScore > 0
              return (
                <li
                  key={r.name}
                  className="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm"
                >
                  <span className={`font-medium ${leader ? 'text-neon-primary' : 'text-ink'}`}>
                    {leader ? '👑 ' : ''}
                    {r.name}
                  </span>
                  <span className="font-display font-bold tabular-nums">{r.points} {t('result.pts')}</span>
                </li>
              )
            })}
          </ul>
        </GlowCard>
      )}

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
        <NeonButton size="lg" onClick={replay}>
          {t('result.replay')}
        </NeonButton>
        <NeonButton size="lg" variant="secondary" onClick={newGame}>
          {t('result.newGame')}
        </NeonButton>
        <NeonButton size="lg" variant="secondary" onClick={showScore}>
          {t('result.finalScore')}
        </NeonButton>
      </div>
      <p className="mt-4 text-center text-xs text-ink-soft/70">
        <kbd className="rounded bg-white/10 px-1.5 py-0.5">{t('result.kbdEnter')}</kbd> {t('result.kbdReplay')} ·{' '}
        <kbd className="rounded bg-white/10 px-1.5 py-0.5">{t('result.kbdEscape')}</kbd> {t('result.kbdNewGame')}
      </p>
    </div>
  )
}
