import { motion } from 'framer-motion'

/**
 * Carte vitrée avec halo néon, utilisée un peu partout.
 * glow=false pour une carte plus sobre.
 */
export default function GlowCard({ children, className = '', glow = true, ...props }) {
  return (
    <motion.div
      className={`glass relative overflow-hidden ${glow ? 'shadow-glow-soft' : ''} ${className}`}
      {...props}
    >
      {/* Liseré lumineux en haut de la carte */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-primary/70 to-transparent" />
      {children}
    </motion.div>
  )
}
