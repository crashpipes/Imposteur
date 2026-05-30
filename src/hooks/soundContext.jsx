/**
 * Petit contexte pour exposer la fonction play() des effets sonores
 * à tous les écrans sans prop drilling.
 */
import { createContext, useContext } from 'react'
import { useSound } from './useSound.js'

const SoundContext = createContext({ play: () => {} })

export function SoundProvider({ enabled, music, children }) {
  const { play } = useSound(enabled, music)
  return <SoundContext.Provider value={{ play }}>{children}</SoundContext.Provider>
}

export function usePlay() {
  return useContext(SoundContext).play
}
