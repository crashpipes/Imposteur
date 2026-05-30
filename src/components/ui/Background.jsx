import { motion } from 'framer-motion'

/**
 * Fond animé immersif : grille rétro + orbes néon flottants.
 * animations=false coupe les mouvements (perf / préférence).
 */
export default function Background({ animations = true }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Grille */}
      <div
        className={`absolute inset-0 grid-bg opacity-60 ${
          animations ? 'animate-gridmove' : ''
        }`}
      />

      {/* Orbes lumineux */}
      <Orb className="bg-neon-primary/30 -top-32 -left-24 h-96 w-96" animate={animations} delay={0} />
      <Orb
        className="bg-neon-secondary/25 top-1/3 -right-24 h-[28rem] w-[28rem]"
        animate={animations}
        delay={1.5}
      />
      <Orb
        className="bg-neon-accent/20 -bottom-32 left-1/4 h-80 w-80"
        animate={animations}
        delay={0.8}
      />

      {/* Vignette pour concentrer le regard au centre */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.55))]" />
    </div>
  )
}

function Orb({ className, animate, delay }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={
        animate
          ? { y: [0, -30, 0], x: [0, 18, 0], scale: [1, 1.08, 1] }
          : undefined
      }
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}
