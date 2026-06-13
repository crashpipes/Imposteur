import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame, useT } from '../store/gameStore.jsx'
import { usePlay } from '../hooks/soundContext.jsx'
import { CATEGORIES } from '../data/wordPairs.js'
import NeonButton from '../components/ui/NeonButton.jsx'
import GlowCard from '../components/ui/GlowCard.jsx'

export default function SetupScreen() {
  const { state, dispatch } = useGame()
  const { t, tCat } = useT()
  const play = usePlay()
  const { config, settings } = state
  const [error, setError] = useState('')

  const validPlayers = config.players.map((p) => p.trim()).filter(Boolean)
  const maxImpostors = Math.max(1, Math.floor((validPlayers.length - 1) / 2))

  const setPlayer = (i, value) => {
    const players = [...config.players]
    players[i] = value
    dispatch({ type: 'UPDATE_CONFIG', patch: { players } })
  }
  const addPlayer = () => {
    play('click')
    dispatch({ type: 'UPDATE_CONFIG', patch: { players: [...config.players, ''] } })
  }
  const removePlayer = (i) => {
    play('click')
    const players = config.players.filter((_, idx) => idx !== i)
    dispatch({ type: 'UPDATE_CONFIG', patch: { players } })
  }

  const toggleCategory = (id) => {
    play('click')
    let categories
    if (id === 'mix') {
      categories = ['mix']
    } else {
      const current = config.categories.filter((c) => c !== 'mix')
      categories = current.includes(id)
        ? current.filter((c) => c !== id)
        : [...current, id]
      if (categories.length === 0) categories = ['mix']
    }
    dispatch({ type: 'UPDATE_CONFIG', patch: { categories } })
  }

  const setImpostors = (n) => {
    play('click')
    dispatch({ type: 'UPDATE_CONFIG', patch: { impostorCount: n } })
  }

  const launch = () => {
    if (validPlayers.length < 3) {
      setError(t('setup.errorMinPlayers'))
      play('lose')
      return
    }
    const count = Math.min(config.impostorCount, maxImpostors)
    if (count !== config.impostorCount) {
      dispatch({ type: 'UPDATE_CONFIG', patch: { impostorCount: count } })
    }
    play('flip')
    dispatch({ type: 'START_ROUND' })
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => { play('click'); dispatch({ type: 'NEW_GAME' }) }}
          className="text-sm text-ink-soft transition hover:text-ink"
        >
          {t('setup.back')}
        </button>
        <h2 className="font-display text-2xl font-bold neon-text">{t('setup.title')}</h2>
        <div className="w-16" />
      </div>

      {/* JOUEURS */}
      <GlowCard className="mb-6 p-6">
        <SectionTitle icon="👥" title={t('setup.playersTitle')} hint={t('setup.playersHint', { n: validPlayers.length })} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AnimatePresence initial={false}>
            {config.players.map((p, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neon-primary/20 text-sm font-semibold text-neon-primary">
                  {i + 1}
                </span>
                <input
                  value={p}
                  onChange={(e) => setPlayer(i, e.target.value)}
                  placeholder={t('setup.playerPlaceholder', { n: i + 1 })}
                  maxLength={18}
                  className="w-full rounded-xl border border-white/10 bg-surface/60 px-4 py-2.5 text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-neon-primary focus:shadow-glow-soft"
                />
                {config.players.length > 3 && (
                  <button
                    onClick={() => removePlayer(i)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft transition hover:bg-rose-500/20 hover:text-rose-400"
                  >
                    ✕
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <button
          onClick={addPlayer}
          className="mt-4 w-full rounded-xl border border-dashed border-white/20 py-2.5 text-sm text-ink-soft transition hover:border-neon-primary hover:text-ink"
        >
          {t('setup.addPlayer')}
        </button>
      </GlowCard>

      {/* IMPOSTEURS */}
      <GlowCard className="mb-6 p-6">
        <SectionTitle icon="🕵️" title={t('setup.impostorsTitle')} hint={t('setup.impostorsHint', { n: maxImpostors })} />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: maxImpostors }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setImpostors(n)}
              className={`h-12 w-12 rounded-xl border font-display text-lg font-semibold transition ${
                config.impostorCount === n
                  ? 'border-neon-primary bg-neon-primary/20 text-neon-primary shadow-glow-soft'
                  : 'border-white/10 bg-surface/40 text-ink-soft hover:border-white/30'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </GlowCard>

      {/* NOMBRE DE TOURS */}
      <GlowCard className="mb-6 p-6">
        <SectionTitle icon="🔁" title={t('setup.toursTitle')} hint={t('setup.toursHint')} />
        <p className="mb-4 text-sm text-ink-soft">
          {t('setup.toursDesc')}
        </p>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => { play('click'); dispatch({ type: 'UPDATE_CONFIG', patch: { tours: n } }) }}
              className={`h-12 w-12 rounded-xl border font-display text-lg font-semibold transition ${
                config.tours === n
                  ? 'border-neon-primary bg-neon-primary/20 text-neon-primary shadow-glow-soft'
                  : 'border-white/10 bg-surface/40 text-ink-soft hover:border-white/30'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </GlowCard>

      {/* CATÉGORIES */}
      <GlowCard className="mb-6 p-6">
        <SectionTitle icon="🗂️" title={t('setup.categoriesTitle')} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.values(CATEGORIES).map((c) => {
            const active = config.categories.includes(c.id)
            return (
              <button
                key={c.id}
                onClick={() => toggleCategory(c.id)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? 'border-neon-secondary bg-neon-secondary/15 text-ink shadow-glow-soft'
                    : 'border-white/10 bg-surface/40 text-ink-soft hover:border-white/30'
                }`}
              >
                <span className="text-lg">{c.icon}</span> {tCat(c.id)}
              </button>
            )
          })}
        </div>
      </GlowCard>

      {/* OPTIONS */}
      <GlowCard className="mb-8 p-6">
        <SectionTitle icon="⚙️" title={t('setup.optionsTitle')} />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Toggle label={t('setup.timer')} desc={t('setup.timerDesc')} value={settings.timer} onChange={() => flip('timer')} />
          <Toggle label={t('setup.mrWhite')} desc={t('setup.mrWhiteDesc')} value={config.mrWhite} onChange={() => flipConfig('mrWhite')} />
          <Toggle label={t('setup.qr')} desc={t('setup.qrDesc')} value={config.qrMode} onChange={() => flipConfig('qrMode')} />
        </div>
      </GlowCard>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center text-rose-400"
        >
          {error}
        </motion.p>
      )}

      <div className="flex justify-center">
        <NeonButton size="xl" onClick={launch} disabled={validPlayers.length < 3}>
          {t('setup.launch')}
        </NeonButton>
      </div>
    </div>
  )

  function flip(key) {
    play('click')
    dispatch({ type: 'UPDATE_SETTINGS', patch: { [key]: !settings[key] } })
  }
  function flipConfig(key) {
    play('click')
    dispatch({ type: 'UPDATE_CONFIG', patch: { [key]: !config[key] } })
  }
}

function SectionTitle({ icon, title, hint }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-display text-lg font-semibold">
        <span className="mr-2">{icon}</span>
        {title}
      </h3>
      {hint && <span className="text-xs text-ink-soft">{hint}</span>}
    </div>
  )
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <button
      onClick={onChange}
      className="flex items-center justify-between rounded-xl border border-white/10 bg-surface/40 px-4 py-3 text-left transition hover:border-white/25"
    >
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-ink-soft">{desc}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          value ? 'bg-neon-primary shadow-glow-soft' : 'bg-white/15'
        }`}
      >
        <motion.span
          aria-hidden
          initial={false}
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 34 }}
          className="absolute top-0.5 left-0 h-5 w-5 rounded-full bg-white"
        />
      </span>
    </button>
  )
}
