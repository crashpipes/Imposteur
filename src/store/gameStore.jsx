/**
 * GAME STORE — état global du jeu (Context + useReducer)
 * ----------------------------------------------------------------------------
 * Source unique de vérité pour tout le flow. La logique de génération vit dans
 * lib/wordGenerator ; ici on orchestre seulement les phases et la persistance.
 *
 * Phases : home -> setup -> reveal -> discussion -> vote -> result
 * ----------------------------------------------------------------------------
 */

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { generateRound } from '../lib/wordGenerator.js'
import {
  loadSettings,
  saveSettings,
  loadHistory,
  addHistoryEntry,
  clearHistory,
  defaultSettings,
} from '../lib/storage.js'

const GameContext = createContext(null)

const initialConfig = {
  players: ['', '', '', ''],
  impostorCount: 1,
  categories: ['mix'],
  hardcore: false,
  quick: false, // mode rapide : saute les écrans d'ambiance
  tours: 2, // nombre de tours de parole avant le vote
}

function init() {
  return {
    phase: 'home',
    settings: loadSettings(),
    config: initialConfig,
    round: null,
    revealed: [], // index des joueurs ayant déjà vu leur carte
    eliminated: [], // index éliminés au vote
    result: null,
    history: loadHistory(),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.phase }

    case 'UPDATE_SETTINGS': {
      const settings = { ...state.settings, ...action.patch }
      return { ...state, settings }
    }

    case 'UPDATE_CONFIG':
      return { ...state, config: { ...state.config, ...action.patch } }

    case 'START_ROUND': {
      const round = generateRound({
        players: state.config.players,
        impostorCount: state.config.impostorCount,
        categories: state.config.categories,
        hardcore: state.config.hardcore,
      })
      return { ...state, round, revealed: [], eliminated: [], result: null, phase: 'reveal' }
    }

    case 'MARK_REVEALED': {
      if (state.revealed.includes(action.index)) return state
      return { ...state, revealed: [...state.revealed, action.index] }
    }

    case 'GOTO':
      return { ...state, phase: action.phase }

    case 'ELIMINATE': {
      const eliminated = state.eliminated.includes(action.index)
        ? state.eliminated
        : [...state.eliminated, action.index]
      return { ...state, eliminated }
    }

    case 'SET_RESULT':
      return { ...state, result: action.result }

    case 'SAVE_HISTORY': {
      const history = addHistoryEntry(action.entry)
      return { ...state, history }
    }

    case 'CLEAR_HISTORY':
      return { ...state, history: clearHistory() }

    case 'REPLAY': // rejouer avec les mêmes joueurs/réglages
      return { ...state, round: null, revealed: [], eliminated: [], result: null, phase: 'setup' }

    case 'NEW_GAME': // retour accueil
      return { ...state, round: null, revealed: [], eliminated: [], result: null, phase: 'home' }

    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)

  // Persiste les réglages à chaque changement.
  useEffect(() => {
    saveSettings(state.settings)
  }, [state.settings])

  // Applique le thème au <html> (les variables CSS font le reste).
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.settings.theme)
  }, [state.settings.theme])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame doit etre utilise dans <GameProvider>')
  return ctx
}

export { defaultSettings }
