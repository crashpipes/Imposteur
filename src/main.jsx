import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CardView from './CardView.jsx'
import { GameProvider } from './store/gameStore.jsx'
import './index.css'

// Mode QR : si l'URL contient ?card=..., on affiche UNIQUEMENT la carte du
// joueur (vue telephone apres scan), sans charger tout le jeu.
const params = new URLSearchParams(window.location.search)
const cardParam = params.get('card')
const cardLang = params.get('lang') === 'en' ? 'en' : 'fr'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {cardParam ? (
      <CardView param={cardParam} lang={cardLang} />
    ) : (
      <GameProvider>
        <App />
      </GameProvider>
    )}
  </React.StrictMode>,
)
