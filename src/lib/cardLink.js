/**
 * LIEN DE CARTE — pour le MODE QR CODE.
 * ----------------------------------------------------------------------------
 * Le site est statique (pas de serveur), donc on encode le mot du joueur
 * DIRECTEMENT dans l'URL. Le joueur scanne le QR (ou ouvre le lien) -> son
 * téléphone affiche la page « carte » (CardView) qui décode l'URL.
 *
 * L'encodage base64 n'est PAS une sécurité : il évite juste d'afficher le mot
 * en clair dans l'URL. Chaque joueur ne doit scanner que SON propre QR.
 * ----------------------------------------------------------------------------
 */

// Encode { name, word, origin, mrWhite } en chaîne base64 URL-safe (UTF-8 ok).
export function encodeCard({ name, word, origin, mrWhite }) {
  const payload = { n: name || '', w: word || '', o: origin || '', m: mrWhite ? 1 : 0 }
  const json = JSON.stringify(payload)
  const b64 = btoa(unescape(encodeURIComponent(json)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Décode le paramètre ?card= en { name, word, origin, mrWhite } (ou null).
export function decodeCard(param) {
  try {
    let b64 = String(param).replace(/-/g, '+').replace(/_/g, '/')
    while (b64.length % 4) b64 += '='
    const json = decodeURIComponent(escape(atob(b64)))
    const p = JSON.parse(json)
    return { name: p.n || '', word: p.w || '', origin: p.o || '', mrWhite: !!p.m }
  } catch {
    return null
  }
}

// Construit l'URL complète de la carte (basée sur l'URL actuelle du site).
export function cardUrl(role) {
  const base = window.location.origin + window.location.pathname
  return `${base}?card=${encodeCard(role)}`
}
