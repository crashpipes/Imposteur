/**
 * DetectiveLogo — emblème « détective » dessiné en SVG.
 * ----------------------------------------------------------------------------
 * Toutes les couleurs vives utilisent les variables de thème
 * (rgb(var(--neon-primary)) / --surface / --surface-soft…), donc l'emblème
 * SE RECOLORE AUTOMATIQUEMENT quand on change de thème.
 *
 * Le liseré lumineux (rim light) est obtenu en superposant deux fois la même
 * silhouette : une version « néon » dessous, et une version sombre légèrement
 * décalée par-dessus — il ne reste du néon que sur le bord haut/gauche.
 * ----------------------------------------------------------------------------
 */
export default function DetectiveLogo({ className = '' }) {
  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label="Imposteur — détective">
      <defs>
        {/* Fond du cercle : halo de thème en haut, sombre ailleurs */}
        <radialGradient id="imp-bg" cx="60%" cy="30%" r="85%">
          <stop offset="0%" style={{ stopColor: 'rgb(var(--neon-primary) / 0.38)' }} />
          <stop offset="45%" style={{ stopColor: 'rgb(var(--surface-soft))' }} />
          <stop offset="100%" style={{ stopColor: 'rgb(var(--surface))' }} />
        </radialGradient>

        <clipPath id="imp-clip">
          <circle cx="120" cy="120" r="106" />
        </clipPath>

        <filter id="imp-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>

        {/* Silhouette du détective (chapeau + tête + épaules), sans couleur */}
        <g id="imp-bust">
          <ellipse cx="120" cy="97" rx="58" ry="15" />
          <path d="M92 94 C92 70 104 57 120 57 C136 57 148 70 148 94 Z" />
          <ellipse cx="120" cy="128" rx="30" ry="34" />
          <path d="M50 242 C50 182 80 156 120 156 C160 156 190 182 190 242 Z" />
        </g>
      </defs>

      {/* Halo extérieur diffus */}
      <circle
        cx="120"
        cy="120"
        r="104"
        fill="none"
        strokeWidth="5"
        filter="url(#imp-glow)"
        style={{ stroke: 'rgb(var(--neon-primary) / 0.45)' }}
      />

      {/* Contenu du cercle */}
      <g clipPath="url(#imp-clip)">
        <circle cx="120" cy="120" r="106" fill="url(#imp-bg)" />

        {/* Ville en arrière-plan */}
        <g style={{ fill: 'rgb(0 0 0 / 0.32)' }}>
          <rect x="10" y="150" width="28" height="92" />
          <rect x="42" y="126" width="22" height="116" />
          <rect x="188" y="136" width="24" height="106" />
          <rect x="214" y="158" width="22" height="84" />
        </g>
        {/* Fenêtres allumées */}
        <g style={{ fill: 'rgb(var(--neon-primary) / 0.55)' }}>
          <rect x="17" y="160" width="4" height="6" />
          <rect x="28" y="160" width="4" height="6" />
          <rect x="17" y="176" width="4" height="6" />
          <rect x="49" y="138" width="4" height="6" />
          <rect x="49" y="156" width="4" height="6" />
          <rect x="195" y="150" width="4" height="6" />
          <rect x="195" y="168" width="4" height="6" />
          <rect x="221" y="170" width="4" height="6" />
        </g>

        {/* Lampadaire */}
        <rect x="205" y="118" width="3" height="80" style={{ fill: 'rgb(0 0 0 / 0.5)' }} />
        <circle cx="206.5" cy="114" r="9" filter="url(#imp-glow)" style={{ fill: 'rgb(var(--neon-primary) / 0.85)' }} />
        <circle cx="206.5" cy="114" r="3.5" style={{ fill: 'rgb(var(--neon-primary))' }} />

        {/* Détective : liseré néon dessous + silhouette sombre décalée dessus */}
        <use href="#imp-bust" style={{ fill: 'rgb(var(--neon-primary))' }} />
        <use href="#imp-bust" x="4" y="5" style={{ fill: 'rgb(0 0 0 / 0.66)' }} />
      </g>

      {/* Anneau */}
      <circle
        cx="120"
        cy="120"
        r="106"
        fill="none"
        strokeWidth="2.5"
        style={{ stroke: 'rgb(var(--neon-primary) / 0.55)' }}
      />
    </svg>
  )
}
