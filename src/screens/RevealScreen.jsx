import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'qrcode'
import { useGame, useT } from '../store/gameStore.jsx'
import { usePlay } from '../hooks/soundContext.jsx'
import { useKeyboard } from '../hooks/useKeyboard.js'
import { CATEGORIES } from '../data/wordPairs.js'
import { cardUrl } from '../lib/cardLink.js'
import { localizeWord, localizeFrom } from '../data/wordPairsEn.js'
import NeonButton from '../components/ui/NeonButton.jsx'

export default function RevealScreen() {
  const { state, dispatch } = useGame()
  const { t, tCat, lang } = useT()
  const play = usePlay()
  const { round, revealed } = state
  const qrMode = state.config.qrMode

  // État du modal lifté ici pour pouvoir le piloter aussi au clavier.
  const [active, setActive] = useState(null) // index du joueur dont la carte est ouverte
  const [stage, setStage] = useState('back') // back | front

  if (!round) return null

  const allRevealed = revealed.length === round.roles.length
  const category = CATEGORIES[round.category]
  const firstUnrevealed = () => round.roles.findIndex((_, i) => !revealed.includes(i))

  // Ouverture "souris" : carte face cachée, puis on la retourne.
  const openCard = (i) => {
    play('flip')
    setActive(i)
    setStage('back')
  }

  // Retourne la carte face cachée -> face visible.
  const doReveal = () => {
    play('flip')
    setStage('front')
    play('normal') // son NEUTRE, identique pour tous les rôles
  }

  // Masque la carte et marque le joueur comme vu.
  const closeActive = () => {
    if (active === null) return
    dispatch({ type: 'MARK_REVEALED', index: active })
    setActive(null)
    setStage('back')
  }

  // Chemin clavier rapide : ouvre le prochain joueur et montre directement le mot.
  const showNext = () => {
    const next = firstUnrevealed()
    if (next === -1) return
    setActive(next)
    setStage('front')
    play('normal')
  }

  // Relance une nouvelle manche (nouveau duo) sans changer les joueurs/réglages.
  // Pratique si le duo tiré a déjà été joué. Remet la distribution à zéro.
  const regenerate = () => {
    play('flip')
    setActive(null)
    setStage('back')
    dispatch({ type: 'START_ROUND' })
  }

  const goDiscussion = () => {
    play('reveal')
    dispatch({ type: 'GOTO', phase: 'discussion' })
  }

  // ESPACE = montrer / masquer. (ENTRÉE lance la discussion quand tout est vu.)
  const onSpace = () => {
    if (active !== null) {
      if (stage === 'front') closeActive() // masquer
      else doReveal() // montrer
      return
    }
    if (firstUnrevealed() !== -1) showNext() // montrer le suivant
    else if (allRevealed) goDiscussion() // plus personne -> on enchaîne
  }

  useKeyboard(
    {
      ' ': onSpace,
      Enter: () => {
        if (active === null && allRevealed) goDiscussion()
      },
    },
    [active, stage, revealed],
  )

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Barre du haut : changer de carte si le duo a déjà été joué */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => { play('click'); dispatch({ type: 'NEW_GAME' }) }}
          className="text-sm text-ink-soft transition hover:text-ink"
        >
          {t('reveal.back')}
        </button>
        <NeonButton size="sm" variant="secondary" onClick={regenerate}>
          {t('reveal.otherCard')}
        </NeonButton>
      </div>

      <div className="mb-2 text-center text-sm uppercase tracking-[0.4em] text-ink-soft">
        {t('reveal.eyebrow')}
      </div>
      <h2 className="mb-1 text-center font-display text-3xl font-bold neon-text">
        {t('reveal.title')}
      </h2>
      <p className="mx-auto mb-6 max-w-lg text-center text-ink-soft">
        {qrMode ? t('reveal.introQr') : t('reveal.intro')}
      </p>

      {/* Aide clavier */}
      <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-2 text-xs text-ink-soft/80">
        <kbd className="rounded bg-white/10 px-2 py-0.5">{t('reveal.space')}</kbd>
        <span>{qrMode ? t('reveal.spaceHintQr') : t('reveal.spaceHint')}</span>
      </div>

      {/* Progression */}
      <div className="mx-auto mb-8 flex max-w-md items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-neon-primary to-neon-secondary"
            animate={{ width: `${(revealed.length / round.roles.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <span className="text-sm tabular-nums text-ink-soft">
          {revealed.length}/{round.roles.length}
        </span>
      </div>

      {/* Liste des joueurs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {round.roles.map((role, i) => {
          const seen = revealed.includes(i)
          const isNext = !seen && firstUnrevealed() === i
          return (
            <motion.button
              key={i}
              whileHover={{ scale: seen ? 1 : 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => !seen && openCard(i)}
              disabled={seen}
              className={`relative flex h-28 flex-col items-center justify-center rounded-2xl border text-center transition ${
                seen
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : isNext
                    ? 'border-neon-primary bg-surface-soft/60 text-ink shadow-glow'
                    : 'border-white/10 bg-surface-soft/60 text-ink shadow-glow-soft hover:border-neon-primary'
              }`}
            >
              {isNext && (
                <span className="absolute right-2 top-2 rounded-full bg-neon-primary/20 px-2 py-0.5 text-[10px] font-semibold text-neon-primary">
                  {t('reveal.space')} ⎵
                </span>
              )}
              <span className="font-display text-lg font-semibold">{role.name}</span>
              <span className="mt-1 text-xs text-ink-soft">
                {seen ? t('reveal.cardSeen') : qrMode ? t('reveal.tapQr') : t('reveal.tapSee')}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <NeonButton size="xl" disabled={!allRevealed} onClick={goDiscussion}>
          {allRevealed ? t('reveal.startDiscussion') : t('reveal.remaining', { n: round.roles.length - revealed.length })}
        </NeonButton>
      </div>

      <p className="mt-4 text-center text-xs text-ink-soft">
        {t('reveal.category')} {category?.icon} {tCat(round.category)}
      </p>

      {/* Carte plein écran */}
      <AnimatePresence>
        {active !== null && (
          <RoleModal
            role={round.roles[active]}
            stage={stage}
            qrMode={qrMode}
            onReveal={doReveal}
            onClose={closeActive}
            t={t}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* --------------------------------------------------------------------------
 * Carte de rôle plein écran (présentation pure, pilotée par `stage`).
 *
 * Mode normal : la carte montre le mot + son univers (identique pour tous).
 * Mode QR      : la carte montre un QR code à scanner ; le mot s'affiche sur
 *                le téléphone du joueur (page CardView), jamais sur l'écran.
 *
 * Étapes : 'back' (carte face cachée) -> 'front' (mot/œuvre OU QR).
 * ------------------------------------------------------------------------ */
function RoleModal({ role, stage, qrMode, onReveal, onClose, t, lang }) {
  const isMrWhite = !role.word
  const [qr, setQr] = useState('')
  const [copied, setCopied] = useState(false)

  // Génère le QR (data URL) quand la carte est révélée en mode QR.
  useEffect(() => {
    if (stage !== 'front' || !qrMode) {
      setQr('')
      return
    }
    let alive = true
    const url = cardUrl({ name: role.name, word: role.word, origin: role.origin, mrWhite: isMrWhite }, lang)
    QRCode.toDataURL(url, {
      width: 240,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#141226', light: '#ffffff' },
    })
      .then((d) => alive && setQr(d))
      .catch(() => alive && setQr(''))
    return () => {
      alive = false
    }
  }, [stage, qrMode, role, isMrWhite])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        cardUrl({ name: role.name, word: role.word, origin: role.origin, mrWhite: isMrWhite }, lang),
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard indisponible */
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
      style={{ perspective: 1400 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {/* Carte face cachée */}
        {stage === 'back' && (
          <motion.button
            key="back"
            onClick={onReveal}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
            className="flex h-[26rem] w-80 transform-gpu flex-col items-center justify-center rounded-[2rem] border border-neon-primary/40 bg-gradient-to-br from-surface-soft to-surface shadow-glow [backface-visibility:hidden]"
          >
            <div className="text-sm uppercase tracking-[0.4em] text-ink-soft">{t('reveal.cardOf')}</div>
            <div className="mt-2 mb-8 font-display text-4xl font-bold">{role.name}</div>
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="text-7xl"
            >
              {qrMode ? '📱' : '🎴'}
            </motion.div>
            <div className="mt-8 text-ink-soft">{t('reveal.tapToReveal')}</div>
          </motion.button>
        )}

        {/* Face révélée */}
        {stage === 'front' && (
          <motion.div
            key="front"
            initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex min-h-[28rem] w-80 transform-gpu flex-col items-center justify-center rounded-[2rem] border border-neon-primary/50 bg-gradient-to-br from-surface-soft to-surface p-8 text-center shadow-glow [backface-visibility:hidden]"
          >
            <div className="text-sm uppercase tracking-[0.3em] text-ink-soft">{role.name}</div>

            {qrMode ? (
              /* ---- Mode QR : on montre un code à scanner (jamais le mot) ---- */
              <>
                <p className="mb-3 mt-4 text-sm text-ink-soft">{t('reveal.scanToSee')}</p>
                {qr ? (
                  <img
                    src={qr}
                    alt="QR code"
                    className="h-52 w-52 rounded-2xl bg-white p-2"
                  />
                ) : (
                  <div className="grid h-52 w-52 place-items-center rounded-2xl bg-white/10 text-sm text-ink-soft">
                    {t('reveal.generating')}
                  </div>
                )}
                <button
                  onClick={copyLink}
                  className="mt-4 text-xs text-ink-soft underline-offset-4 transition hover:text-ink hover:underline"
                >
                  {copied ? t('reveal.linkCopied') : t('reveal.copyLink')}
                </button>
                <p className="mt-2 max-w-[15rem] text-xs text-ink-soft/70">
                  {t('reveal.qrWarning')}
                </p>
              </>
            ) : isMrWhite ? (
              /* ---- Carte Mr. White : aucun mot ---- */
              <>
                <div className="my-5 text-6xl">🕵️</div>
                <div className="mb-2 font-display text-4xl font-bold text-rose-400">{t('reveal.mrWhite')}</div>
                <p className="text-sm text-ink-soft">{t('reveal.noWord')}</p>
                <p className="mt-3 max-w-[15rem] text-xs text-ink-soft/80">
                  {t('reveal.mrWhiteHint')}
                </p>
              </>
            ) : (
              /* ---- Carte joueur : mot + univers ---- */
              <>
                <div className="my-5 text-6xl">🃏</div>
                <p className="mb-1 text-sm text-ink-soft">{t('reveal.yourWord')}</p>
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
                  className="font-display text-4xl font-bold neon-text"
                >
                  {localizeWord(role.word, lang)}
                </motion.div>

                {role.origin && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-ink-soft"
                  >
                    <span className="opacity-70">{t('reveal.universe')}</span>
                    <span className="font-medium text-ink">{localizeFrom(role.origin, lang)}</span>
                  </motion.div>
                )}

                <p className="mt-5 max-w-[15rem] text-xs text-ink-soft/80">
                  {t('reveal.playerHint')}
                </p>
              </>
            )}

            <NeonButton size="lg" variant="secondary" className="mt-6 w-full" onClick={onClose}>
              {t('reveal.hide')}
            </NeonButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
