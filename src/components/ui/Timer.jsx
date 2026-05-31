import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import NeonButton from './NeonButton.jsx'

/**
 * Minuteur circulaire pour la phase de discussion.
 * onTick(secondsLeft) permet de jouer un son par seconde dans les dernières.
 */
export default function Timer({ seconds = 180, onTick, onEnd }) {
  const [left, setLeft] = useState(seconds)
  const [running, setRunning] = useState(true)
  const ref = useRef(null)

  useEffect(() => setLeft(seconds), [seconds])

  useEffect(() => {
    if (!running) return
    ref.current = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(ref.current)
          onEnd?.()
          return 0
        }
        const next = s - 1
        if (next <= 5) onTick?.(next)
        return next
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [running, onTick, onEnd])

  const pct = seconds > 0 ? left / seconds : 0
  const R = 54
  const C = 2 * Math.PI * R
  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')
  const danger = left <= 10

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-40 w-40">
        {/*
          overflow-visible : indispensable pour que le halo (drop-shadow) du
          cercle ne soit pas découpé au carré par le SVG. Le viewBox est aussi
          élargi (-20 .. 140) pour laisser de la place au glow.
        */}
        <svg className="h-full w-full -rotate-90 overflow-visible" viewBox="-20 -20 160 160">
          <circle cx="60" cy="60" r={R} fill="none" stroke="rgb(var(--surface-ring) / 0.3)" strokeWidth="8" />
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={danger ? 'rgb(244 63 94)' : 'rgb(var(--neon-primary))'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct)}
            style={{ filter: 'drop-shadow(0 0 6px rgb(var(--neon-primary)/0.7))' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={danger}
            className={`font-display text-4xl font-bold tabular-nums ${
              danger ? 'text-rose-400' : 'text-ink'
            }`}
            animate={danger ? { scale: [1, 1.12, 1] } : {}}
            transition={{ duration: 1, repeat: danger ? Infinity : 0 }}
          >
            {mm}:{ss}
          </motion.span>
        </div>
      </div>

      <div className="flex gap-3">
        <NeonButton size="sm" variant="secondary" onClick={() => setRunning((r) => !r)}>
          {running ? '⏸ Pause' : '▶ Reprendre'}
        </NeonButton>
        <NeonButton size="sm" variant="ghost" onClick={() => { setLeft(seconds); setRunning(true) }}>
          ↺ Reset
        </NeonButton>
      </div>
    </div>
  )
}
