import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../store/gameStore.jsx'
import { usePlay } from '../hooks/soundContext.jsx'
import { useKeyboard } from '../hooks/useKeyboard.js'
import { CATEGORIES } from '../data/wordPairs.js'
import NeonButton from '../components/ui/NeonButton.jsx'

export default function RevealScreen() {
  const { state, dispatch } = useGame()
  const play = usePlay()
  const { round, revealed, settings } = state

  // État du modal lifté ici pour pouvoir le piloter aussi au clavier.
  const [active, setActive] = useState(null) // index du joueur dont la carte est ouverte
  const [stage, setStage] = useState('back') // eyes | back | loading | front
  const loadingTimer = useRef(null)

  if (!round) return null

  const allRevealed = revealed.length === round.roles.length
  const category = CATEGORIES[round.category]
  const firstUnrevealed = () => round.roles.findIndex((_, i) => !revealed.includes(i))

  // Ouverture "souris" : on respecte le suspense (yeux fermés / face cachée).
  const openCard = (i) => {
    play('flip')
    setActive(i)
    setStage(settings.dramatic ? 'eyes' : 'back')
  }

  // Retourne la carte face cachée -> face visible (avec faux chargement si dramatique).
  const doReveal = () => {
    play('flip')
    if (settings.dramatic) {
      setStage('loading')
      loadingTimer.current = setTimeout(() => {
        setStage('front')
        play('normal') // son NEUTRE, identique pour tous les rôles
      }, 1400)
    } else {
      setStage('front')
      play('normal')
    }
  }

  // Masque la carte et marque le joueur comme vu.
  const closeActive = () => {
    if (active === null) return
    clearTimeout(loadingTimer.current)
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

  const goDiscussion = () => {
    play('reveal')
    dispatch({ type: 'GOTO', phase: 'discussion' })
  }

  // ESPACE = montrer / masquer. (ENTRÉE lance la discussion quand tout est vu.)
  const onSpace = () => {
    if (active !== null) {
      if (stage === 'front') closeActive() // masquer
      else if (stage === 'back' || stage === 'eyes') doReveal() // montrer
      // 'loading' : on ignore
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
      <div className="mb-2 text-center text-sm uppercase tracking-[0.4em] text-ink-soft">
        Distribution des rôles
      </div>
      <h2 className="mb-1 text-center font-display text-3xl font-bold neon-text">
        Chacun son tour 🤫
      </h2>
      <p className="mx-auto mb-6 max-w-lg text-center text-ink-soft">
        L'hôte tend l'écran à chaque joueur. Montrez la carte, puis masquez avant
        de passer au suivant.
      </p>

      {/* Aide clavier */}
      <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-2 text-xs text-ink-soft/80">
        <kbd className="rounded bg-white/10 px-2 py-0.5">Espace</kbd>
        <span>montrer la carte suivante, puis la masquer</span>
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
                  Espace ⎵
                </span>
              )}
              <span className="font-display text-lg font-semibold">{role.name}</span>
              <span className="mt-1 text-xs text-ink-soft">
                {seen ? '✓ Carte vue' : 'Toucher pour voir'}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <NeonButton size="xl" disabled={!allRevealed} onClick={goDiscussion}>
          {allRevealed ? '💬 Lancer la discussion' : `Encore ${round.roles.length - revealed.length} joueur(s)`}
        </NeonButton>
      </div>

      <p className="mt-4 text-center text-xs text-ink-soft">
        Catégorie : {category?.icon} {category?.label}
      </p>

      {/* Carte plein écran */}
      <AnimatePresence>
        {active !== null && (
          <RoleModal
            role={round.roles[active]}
            stage={stage}
            onReady={() => setStage('back')}
            onReveal={doReveal}
            onClose={closeActive}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* --------------------------------------------------------------------------
 * Carte de rôle plein écran (présentation pure, pilotée par `stage`).
 *
 * IMPORTANT : la carte est VOLONTAIREMENT identique pour l'imposteur et les
 * joueurs (même couleur, même icône, même son, aucun label de rôle). On ne
 * montre QUE le mot + son univers. L'imposteur ne sait pas qu'il l'est : il
 * doit le déduire en constatant que son mot diffère pendant la discussion.
 *
 * Étapes : 'eyes' (mode dramatique) -> 'back' (carte face cachée)
 *          -> 'loading' (faux chargement) -> 'front' (mot + œuvre)
 * ------------------------------------------------------------------------ */
function RoleModal({ role, stage, onReady, onReveal, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
      style={{ perspective: 1400 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {/* « Tout le monde ferme les yeux » */}
        {stage === 'eyes' && (
          <motion.div
            key="eyes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="mb-6 text-7xl">🙈</div>
            <h3 className="mb-2 font-display text-3xl font-bold neon-text">
              Tout le monde ferme les yeux
            </h3>
            <p className="mb-8 text-ink-soft">
              {role.name}, prépare-toi. Quand les autres ne regardent plus…
            </p>
            <NeonButton size="lg" onClick={onReady}>
              Je suis prêt
            </NeonButton>
          </motion.div>
        )}

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
            <div className="text-sm uppercase tracking-[0.4em] text-ink-soft">Carte de</div>
            <div className="mt-2 mb-8 font-display text-4xl font-bold">{role.name}</div>
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="text-7xl"
            >
              🎴
            </motion.div>
            <div className="mt-8 text-ink-soft">Toucher / Espace pour révéler</div>
          </motion.button>
        )}

        {/* Faux chargement dramatique */}
        {stage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-white/15 border-t-neon-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <p className="font-display text-xl text-ink-soft">Distribution du mot…</p>
          </motion.div>
        )}

        {/* Face révélée : UNIQUEMENT le mot + son œuvre (aucun indice de rôle) */}
        {stage === 'front' && (
          <motion.div
            key="front"
            initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex h-[28rem] w-80 transform-gpu flex-col items-center justify-center rounded-[2rem] border border-neon-primary/50 bg-gradient-to-br from-surface-soft to-surface p-8 text-center shadow-glow [backface-visibility:hidden]"
          >
            <div className="text-sm uppercase tracking-[0.3em] text-ink-soft">{role.name}</div>
            <div className="my-5 text-6xl">🃏</div>
            <p className="mb-1 text-sm text-ink-soft">Ton mot est</p>
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
              className="font-display text-4xl font-bold neon-text"
            >
              {role.word}
            </motion.div>

            {/* Œuvre d'origine : aide à lever l'ambiguïté entre homonymes */}
            {role.origin && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-ink-soft"
              >
                <span className="opacity-70">📚 Univers :</span>
                <span className="font-medium text-ink">{role.origin}</span>
              </motion.div>
            )}

            <p className="mt-5 max-w-[15rem] text-xs text-ink-soft/80">
              Mémorise ton mot. Reste discret : personne ne doit savoir si tu es
              l'imposteur.
            </p>

            <NeonButton size="lg" variant="secondary" className="mt-6 w-full" onClick={onClose}>
              🙈 Masquer (Espace)
            </NeonButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
