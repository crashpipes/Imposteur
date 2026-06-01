import { motion } from 'framer-motion'

/**
 * Bouton réutilisable — version DOUCE.
 * Dégradés feutrés, ombres ambiantes (plus de halo néon), survol calme.
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * size:    'sm' | 'md' | 'lg' | 'xl'
 */
const VARIANTS = {
  primary:
    'bg-gradient-to-r from-neon-primary/90 to-neon-secondary/90 text-surface shadow-glow-soft border-transparent hover:shadow-glow',
  secondary:
    'bg-surface-soft/70 text-ink border-white/10 hover:border-neon-primary/40 hover:bg-surface-soft',
  ghost:
    'bg-transparent text-ink-soft border-transparent hover:text-ink hover:bg-white/[0.04]',
  danger:
    'bg-neon-accent/85 text-surface border-transparent hover:bg-neon-accent',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm rounded-2xl',
  md: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-3xl',
  xl: 'px-10 py-5 text-xl rounded-[1.75rem]',
}

export default function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      disabled={disabled}
      className={`font-display font-semibold border tracking-wide select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-[background,box-shadow,border-color,color] duration-300 ease-out
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
