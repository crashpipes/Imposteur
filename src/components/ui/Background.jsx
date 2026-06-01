/**
 * Arrière-plan : DÉSACTIVÉ.
 *
 * Les anciens nuages de couleur flous et animés provoquaient des
 * ralentissements / un effet de « glitch ». On ne rend plus aucun effet :
 * le fond dégradé doux défini dans `index.css` (sur le body) suffit.
 *
 * Le composant est conservé (et toujours importé par App.jsx) pour ne rien
 * casser ailleurs ; il ne produit simplement plus rien.
 */
export default function Background() {
  return null
}
