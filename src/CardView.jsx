import { decodeCard } from './lib/cardLink.js'
import { translate } from './lib/i18n.js'

export default function CardView({ param, lang = 'fr' }) {
  const t = (key, vars) => translate(lang, key, vars)
  const data = decodeCard(param)

  if (!data || (!data.word && !data.mrWhite)) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="glass rounded-3xl p-8">
          <p className="text-ink-soft">{t('card.invalid')}</p>
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
            <div className="mb-2 font-display text-4xl font-bold text-rose-400">{t('card.mrWhite')}</div>
            <p className="text-sm text-ink-soft">{t('card.noWord')}</p>
            <p className="mt-3 text-xs text-ink-soft/80">{t('card.mrWhiteHint')}</p>
          </>
        ) : (
          <>
            <div className="my-6 text-7xl">🃏</div>
            <p className="mb-1 text-sm text-ink-soft">{t('card.yourWord')}</p>
            <div className="font-display text-4xl font-bold neon-text">{data.word}</div>
            {data.origin && (
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-ink-soft">
                <span className="opacity-70">{t('card.universe')}</span>
                <span className="font-medium text-ink">{data.origin}</span>
              </div>
            )}
          </>
        )}
        <p className="mt-7 text-xs text-ink-soft/70">{t('card.keepSecret')}</p>
      </div>
    </div>
  )
}
