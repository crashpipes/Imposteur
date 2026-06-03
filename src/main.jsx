import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CardView from './CardView.jsx'
import { GameProvider } from './store/gameStore.jsx'
import './index.css'

// Mode QR : si l'URL contient ?card=..., on affiche UNIQUEMENT la carte du
// joueur (vue telephone apres scan), sans charger tout le jeu.
const cardParam = new URLSearchParams(window.location.search).get('card')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {cardParam ? (
      <CardView param={cardParam} />
    ) : (
      <GameProvider>
        <App />
      </GameProvider>
    )}
  </React.StrictMode>,
)
