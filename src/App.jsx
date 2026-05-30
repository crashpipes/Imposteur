import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from './store/gameStore.jsx'
import { SoundProvider } from './hooks/soundContext.jsx'
import Background from './components/ui/Background.jsx'
import QuickControls from './components/QuickControls.jsx'

import HomeScreen from './screens/HomeScreen.jsx'
import SetupScreen from './screens/SetupScreen.jsx'
import RevealScreen from './screens/RevealScreen.jsx'
import DiscussionScreen from './screens/DiscussionScreen.jsx'
import VoteScreen from './screens/VoteScreen.jsx'
import ResultScreen from './screens/ResultScreen.jsx'

const SCREENS = {
  home: HomeScreen,
  setup: SetupScreen,
  reveal: RevealScreen,
  discussion: DiscussionScreen,
  vote: VoteScreen,
  result: ResultScreen,
}

// Transition de page commune : fondu + léger glissement vertical.
// (Pas de scale sur toute la page -> évite le flicker et les sauts de scrollbar.)
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export default function App() {
  const { state } = useGame()
  const { settings, phase } = state
  const Screen = SCREENS[phase] ?? HomeScreen

  return (
    <SoundProvider enabled={settings.sound} music={settings.music}>
      <Background animations={settings.animations} />
      <QuickControls />

      <main className="relative min-h-screen w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            variants={settings.animations ? pageVariants : undefined}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen w-full transform-gpu will-change-[opacity,transform]"
          >
            <Screen />
          </motion.div>
        </AnimatePresence>
      </main>
    </SoundProvider>
  )
}
