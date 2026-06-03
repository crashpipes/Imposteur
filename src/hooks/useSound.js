/**
 * useSound — effets sonores légers générés par la Web Audio API.
 * ----------------------------------------------------------------------------
 * Aucun fichier audio à télécharger : tout est synthétisé à la volée.
 * On expose une fonction play(name) avec quelques sons typés party game.
 * ----------------------------------------------------------------------------
 */

import { useCallback, useRef } from 'react'

export function useSound(enabled) {
  const ctxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return null
      ctxRef.current = new AC()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  // Joue une enveloppe simple sur un oscillateur.
  const tone = useCallback(
    (freq, { type = 'sine', dur = 0.18, gain = 0.12, slideTo = null, delay = 0 } = {}) => {
      const ctx = getCtx()
      if (!ctx) return
      const t0 = ctx.currentTime + delay
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, t0)
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
      osc.connect(g).connect(ctx.destination)
      osc.start(t0)
      osc.stop(t0 + dur + 0.02)
    },
    [getCtx],
  )

  const play = useCallback(
    (name) => {
      if (!enabled) return
      switch (name) {
        case 'click':
          tone(420, { type: 'triangle', dur: 0.08, gain: 0.08 })
          break
        case 'hover':
          tone(620, { type: 'sine', dur: 0.05, gain: 0.04 })
          break
        case 'flip': // ouverture d'une carte de rôle
          tone(300, { type: 'sawtooth', dur: 0.22, gain: 0.08, slideTo: 720 })
          break
        case 'normal': // mot révélé (son NEUTRE, identique pour tous les rôles)
          tone(523, { type: 'sine', dur: 0.18, gain: 0.1 })
          tone(784, { type: 'sine', dur: 0.22, gain: 0.09, delay: 0.12 })
          break
        case 'suspense': // montée de tension
          tone(120, { type: 'sawtooth', dur: 1.4, gain: 0.06, slideTo: 480 })
          break
        case 'reveal': // révélation du vote
          tone(660, { type: 'triangle', dur: 0.5, gain: 0.12, slideTo: 990 })
          break
        case 'win':
          ;[523, 659, 784, 1047].forEach((f, i) =>
            tone(f, { type: 'triangle', dur: 0.25, gain: 0.11, delay: i * 0.11 }),
          )
          break
        case 'lose': // défaite : descente DOUCE mais bien audible (timbre chaud, pas de buzz)
          tone(440, { type: 'triangle', dur: 0.34, gain: 0.12 })
          tone(349, { type: 'triangle', dur: 0.4, gain: 0.12, delay: 0.16 })
          tone(262, { type: 'triangle', dur: 0.6, gain: 0.11, delay: 0.34 })
          break
        case 'tick':
          tone(880, { type: 'square', dur: 0.04, gain: 0.05 })
          break
        default:
          break
      }
    },
    [enabled, tone],
  )

  return { play }
}
