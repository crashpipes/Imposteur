/**
 * useKeyboard — enregistre des raccourcis clavier globaux.
 * Passe un objet { 'Enter': fn, ' ': fn, 'Escape': fn, ... }.
 * Ignore les frappes quand on tape dans un champ texte.
 */
import { useEffect, useRef } from 'react'

export function useKeyboard(handlers, deps = []) {
  const ref = useRef(handlers)
  ref.current = handlers

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return
      const fn = ref.current[e.key]
      if (fn) {
        e.preventDefault()
        fn(e)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
