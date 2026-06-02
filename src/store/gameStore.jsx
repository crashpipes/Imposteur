/**
 * GAME STORE — état global du jeu (Context + useReducer)
 * ----------------------------------------------------------------------------
 * Source unique de vérité pour tout le flow. La logique de génération vit dans
 * lib/wordGenerator ; ici on orchestre seulement les phases et la persistance.
 *
 * Phases : home -> setup -> reveal -> discussion -> vote -> result -> scoreboard
 *
 * SCORE DE SESSION (en mémoire seulement) :
 *   - `scores` = { nomDuJoueur: points }
 *   - on attribue des points à chaque manche (dans SET_RESULT)
 *   - conservé quand on rejoue / fait une nouvelle partie (même session)
 *   - REMIS À ZÉRO uniquement au retour au menu (NEW_GAME)
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

// Points attribués à chaque manche.
const POINTS_PLAYERS = 1 // par joueur innocent quand les joueurs gagnent
const POINTS_IMPOSTOR = 2 // par imposteur quand l'imposteur gagne

const initialConfig = {
  players: ['', '', '', ''],
  impostorCount: 1,
  categories: ['mix'],
  tours: 2, // nombre de tours de parole avant le vote
  mrWhite: false, // mode Mr. White : l'imposteur n'a aucun mot
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
    scores: {}, // score de la session { nom: points }
    history: loadHistory(),
  }
}

// Calcule les nouveaux scores après une manche.
function applyScores(prev, result) {
  const scores = { ...prev }
  result.roles.forEach((r) => {
    if (scores[r.name] === undefined) scores[r.name] = 0
  })
  if (result.outcome === 'players') {
    result.roles.forEach((r) => {
      if (!r.isImpostor) scores[r.name] += POINTS_PLAYERS
    })
  } else {
    result.roles.forEach((r) => {
      if (r.isImpostor) scores[r.name] += POINTS_IMPOSTOR
    })
  }
  return scores
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
        mrWhite: state.config.mrWhite,
      })
      // On garde les scores (même session) ; on remet juste la manche à zéro.
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

    case 'SET_RESULT': {
      // On enregistre le résultat ET on met à jour le score de la session.
      const scores = applyScores(state.scores, action.result)
      return { ...state, result: action.result, scores }
    }

    case 'SAVE_HISTORY': {
      const history = addHistoryEntry(action.entry)
      return { ...state, history }
    }

    case 'CLEAR_HISTORY':
      return { ...state, history: clearHistory() }

    case 'REPLAY': // nouvelle partie / lobby de config -> on GARDE le score
      return { ...state, round: null, revealed: [], eliminated: [], result: null, phase: 'setup' }

    case 'NEW_GAME': // retour accueil -> on REMET LE SCORE À ZÉRO
      return {
        ...state,
        round: null,
        revealed: [],
        eliminated: [],
        result: null,
        scores: {},
        phase: 'home',
      }

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
