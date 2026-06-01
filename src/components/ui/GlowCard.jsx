import { motion } from 'framer-motion'

/**
 * Carte vitrée — version DOUCE.
 * Liseré supérieur à peine perceptible et ombre ambiante diffuse
 * (plus de halo néon). glow=false pour une carte encore plus sobre.
 */
export default function GlowCard({ children, className = '', glow = true, ...props }) {
  return (
    <motion.div
      className={`glass relative overflow-hidden ${glow ? 'shadow-glow-soft' : ''} ${className}`}
      {...props}
    >
      {/* Liseré lumineux discret en haut de la carte */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-primary/30 to-transparent" />
      {children}
    </motion.div>
  )
}
