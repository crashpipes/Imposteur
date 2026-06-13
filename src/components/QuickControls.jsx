import { useGame, useT } from '../store/gameStore.jsx'
import { useKeyboard } from '../hooks/useKeyboard.js'

/**
 * Contrôles flottants : langue (FR/EN) + activation / coupure du son.
 * Discret, en haut à droite.
 * (Le sélecteur de thème a été retiré : le jeu n'utilise plus que le thème violet.)
 */
export default function QuickControls() {
  const { state, dispatch } = useGame()
  const { settings } = state
  const { t, lang, toggleLang } = useT()

  const toggleSound = () =>
    dispatch({ type: 'UPDATE_SETTINGS', patch: { sound: !settings.sound } })

  // Raccourcis clavier : M = son, L = langue.
  useKeyboard({ m: toggleSound, M: toggleSound, l: toggleLang, L: toggleLang })

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
      <button
        onClick={toggleLang}
        title={t('controls.lang')}
        className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-surface-soft/70 px-3 text-sm font-semibold backdrop-blur transition hover:scale-110"
      >
        <span aria-hidden>🌐</span>
        <span className="tabular-nums">{lang === 'fr' ? 'FR' : 'EN'}</span>
      </button>
      <button
        onClick={toggleSound}
        title={t('controls.sound')}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-soft/70 text-lg backdrop-blur transition hover:scale-110"
      >
        {settings.sound ? '🔊' : '🔇'}
      </button>
    </div>
  )
}
