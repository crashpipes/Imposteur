import { motion } from 'framer-motion'
import { useGame } from './store/gameStore.jsx'
import { SoundProvider } from './hooks/soundContext.jsx'
import Background from './components/ui/Background.jsx'
import QuickControls from './components/QuickControls.jsx'

import HomeScreen from './screens/HomeScreen.jsx'
import LibraryScreen from './screens/LibraryScreen.jsx'
import SetupScreen from './screens/SetupScreen.jsx'
import RevealScreen from './screens/RevealScreen.jsx'
import DiscussionScreen from './screens/DiscussionScreen.jsx'
import VoteScreen from './screens/VoteScreen.jsx'
import ResultScreen from './screens/ResultScreen.jsx'
import ScoreboardScreen from './screens/ScoreboardScreen.jsx'

const SCREENS = {
  home: HomeScreen,
  library: LibraryScreen,
  setup: SetupScreen,
  reveal: RevealScreen,
  discussion: DiscussionScreen,
  vote: VoteScreen,
  result: ResultScreen,
  scoreboard: ScoreboardScreen,
}

export default function App() {
  const { state } = useGame()
  const { settings, phase } = state
  const Screen = SCREENS[phase] ?? HomeScreen

  return (
    <SoundProvider enabled={settings.sound}>
      <Background />
      <QuickControls />

      <main className="relative min-h-screen w-full">
        {/*
          Rendu DIRECT de l'écran courant, avec un simple fondu d'entrée.
          On n'utilise volontairement PAS <AnimatePresence mode="wait"> :
          son animation de sortie pouvait rester bloquée (surtout en quittant
          un écran qui contient lui-même des animations), laissant une page
          blanche jusqu'au rafraîchissement. Ici, changer de `phase` remonte
          un nouveau bloc (grâce à `key`) qui s'affiche immédiatement.
        */}
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen w-full"
        >
          <Screen />
        </motion.div>
      </main>
    </SoundProvider>
  )
}
