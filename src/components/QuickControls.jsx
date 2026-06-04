import { useGame } from '../store/gameStore.jsx'
import { useKeyboard } from '../hooks/useKeyboard.js'

/**
 * Contrôle flottant : activation / coupure du son. Discret, en haut à droite.
 * (Le sélecteur de thème a été retiré : le jeu n'utilise plus que le thème violet.)
 */
export default function QuickControls() {
  const { state, dispatch } = useGame()
  const { settings } = state

  const toggleSound = () =>
    dispatch({ type: 'UPDATE_SETTINGS', patch: { sound: !settings.sound } })

  // Raccourci clavier : M = son.
  useKeyboard({ m: toggleSound, M: toggleSound })

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
      <button
        onClick={toggleSound}
        title="Sons (M)"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-soft/70 text-lg backdrop-blur transition hover:scale-110"
      >
        {settings.sound ? '🔊' : '🔇'}
      </button>
    </div>
  )
}
