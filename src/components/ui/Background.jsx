/**
 * Fond immersif STATIQUE : grille rétro + orbes néon + vignette.
 * (Plus aucune animation : évite le scintillement et les artefacts visuels,
 *  en particulier lors d'un partage d'écran / capture de stream.)
 */
export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Grille */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Orbes lumineux (fixes) */}
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-neon-primary/30 blur-3xl" />
      <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-neon-secondary/25 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-neon-accent/20 blur-3xl" />

      {/* Vignette pour concentrer le regard au centre */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.55))]" />
    </div>
  )
}
