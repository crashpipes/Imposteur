import { useGame } from '../store/gameStore.jsx'
import { useKeyboard } from '../hooks/useKeyboard.js'

/**
 * Contrôles flottants accessibles dans toutes les phases :
 * changement de thème, son, musique. Discret, en haut à droite.
 */
const THEMES = ['nebula', 'inferno', 'matrix', 'vapor']
const THEME_DOT = {
  nebula: 'bg-violet-500',
  inferno: 'bg-orange-500',
  matrix: 'bg-green-500',
  vapor: 'bg-pink-500',
}

export default function QuickControls() {
  const { state, dispatch } = useGame()
  const { settings } = state

  const cycleTheme = () => {
    const i = THEMES.indexOf(settings.theme)
    const next = THEMES[(i + 1) % THEMES.length]
    dispatch({ type: 'UPDATE_SETTINGS', patch: { theme: next } })
  }
  const toggle = (key) =>
    dispatch({ type: 'UPDATE_SETTINGS', patch: { [key]: !settings[key] } })

  // Raccourcis clavier globaux : T = thème, M = son.
  useKeyboard({
    t: cycleTheme,
    T: cycleTheme,
    m: () => toggle('sound'),
    M: () => toggle('sound'),
  })

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
      <button
        onClick={cycleTheme}
        title="Changer de thème (T)"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-soft/70 backdrop-blur transition hover:scale-110"
      >
        <span className={`h-4 w-4 rounded-full ${THEME_DOT[settings.theme]} shadow-glow-soft`} />
      </button>
      <button
        onClick={() => toggle('sound')}
        title="Sons (M)"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-soft/70 text-lg backdrop-blur transition hover:scale-110"
      >
        {settings.sound ? '🔊' : '🔇'}
      </button>
      <button
        onClick={() => toggle('music')}
        title="Musique d'ambiance"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-soft/70 text-lg backdrop-blur transition hover:scale-110"
      >
        {settings.music ? '🎵' : '🎶'}
      </button>
    </div>
  )
}
