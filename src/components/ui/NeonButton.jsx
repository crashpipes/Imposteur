import { motion } from 'framer-motion'

/**
 * Bouton néon réutilisable.
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * size:    'sm' | 'md' | 'lg' | 'xl'
 */
const VARIANTS = {
  primary:
    'bg-gradient-to-r from-neon-primary to-neon-secondary text-white shadow-glow border-transparent',
  secondary:
    'bg-surface-soft/70 text-ink border-white/15 hover:border-neon-primary/60 hover:shadow-glow-soft',
  ghost: 'bg-transparent text-ink-soft border-transparent hover:text-ink hover:bg-white/5',
  danger:
    'bg-gradient-to-r from-rose-500 to-red-600 text-white border-transparent shadow-[0_0_24px_-4px_rgba(244,63,94,0.6)]',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
  xl: 'px-10 py-5 text-2xl rounded-3xl',
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
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      disabled={disabled}
      className={`font-display font-semibold border tracking-wide select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-colors duration-200 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
