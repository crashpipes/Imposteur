import { decodeCard } from './lib/cardLink.js'

/**
 * CardView — page « carte » autonome affichée sur le TÉLÉPHONE du joueur
 * après avoir scanné le QR (ou ouvert le lien). Elle décode l'URL et montre
 * le mot + l'univers (ou la carte Mr. White). Aucun état de jeu nécessaire.
 *
 * Réutilise les classes du design (glass, neon-text, ink…) pour rester cohérent.
 */
export default function CardView({ param }) {
  const data = decodeCard(param)

  if (!data || (!data.word && !data.mrWhite)) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="glass rounded-3xl p-8">
          <p className="text-ink-soft">Lien de carte invalide ou expiré.</p>
        </div>
      </div>
    )
  }

  const isMrWhite = data.mrWhite || !data.word

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="glass w-full max-w-sm rounded-[2rem] p-8 text-center shadow-glow">
        <div className="text-sm uppercase tracking-[0.3em] text-ink-soft">{data.name}</div>

        {isMrWhite ? (
          <>
            <div className="my-6 text-7xl">🕵️</div>
            <div className="mb-2 font-display text-4xl font-bold text-rose-400">Mr. White</div>
            <p className="text-sm text-ink-soft">Tu n'as aucun mot.</p>
            <p className="mt-3 text-xs text-ink-soft/80">
              Écoute les autres, devine le mot commun et fonds-toi dans la masse.
              Surtout, ne te fais pas griller !
            </p>
          </>
        ) : (
          <>
            <div className="my-6 text-7xl">🃏</div>
            <p className="mb-1 text-sm text-ink-soft">Ton mot est</p>
            <div className="font-display text-4xl font-bold neon-text">{data.word}</div>
            {data.origin && (
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-ink-soft">
                <span className="opacity-70">📚 Univers :</span>
                <span className="font-medium text-ink">{data.origin}</span>
              </div>
            )}
          </>
        )}

        <p className="mt-7 text-xs text-ink-soft/70">Garde-le pour toi 🤫</p>
      </div>
    </div>
  )
}
