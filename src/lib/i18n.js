/**
 * INTERNATIONALISATION (i18n)
 * ----------------------------------------------------------------------------
 * Dictionnaire FR / EN + helper `t(lang, key, vars)`.
 *
 * - La langue vit dans les réglages (state.settings.lang), persistée en local.
 * - Les écrans utilisent le hook `useT()` (voir bas de fichier) pour récupérer
 *   une fonction `t(key, vars)` déjà liée à la langue courante.
 * - Le contenu de jeu (mots des cartes, noms propres) n'est PAS traduit ; seuls
 *   les libellés d'interface et les libellés de catégories le sont.
 *
 * Interpolation : les placeholders s'écrivent {nom} dans la chaîne.
 *   t('reveal.remaining', { n: 3 })  ->  "3 player(s) left"
 * ----------------------------------------------------------------------------
 */

export const LANGS = ['fr', 'en']
export const DEFAULT_LANG = 'fr'

// Libellés des catégories par langue (clé = id de catégorie).
export const CATEGORY_LABELS = {
  fr: {
    films: 'Films',
    series: 'Séries',
    anime: 'Anime',
    jeux: 'Jeux vidéo',
    personnages: 'Personnages fictifs',
    personnalites: 'Personnalités publiques',
    pokemon: 'Pokémon',
    lol: 'League of Legends',
    pays: 'Pays',
    objets: 'Objets',
    nourriture: 'Nourriture',
    animaux: 'Animaux',
    mix: 'Mélange aléatoire',
  },
  en: {
    films: 'Movies',
    series: 'TV Shows',
    anime: 'Anime',
    jeux: 'Video Games',
    personnages: 'Fictional Characters',
    personnalites: 'Public Figures',
    pokemon: 'Pokémon',
    lol: 'League of Legends',
    pays: 'Countries',
    objets: 'Objects',
    nourriture: 'Food',
    animaux: 'Animals',
    mix: 'Random Mix',
  },
}

export const DICT = {
  fr: {
    // Contrôles flottants
    'controls.sound': 'Sons (M)',
    'controls.lang': 'Switch to English',

    // Accueil
    'home.tagline':
      "Tout le monde reçoit le même mot… sauf un. Démasquez l'imposteur avant qu'il ne devine le vôtre.",
    'home.create': '▶ Créer une partie',
    'home.library': '📚 Voir toutes les cartes',
    'home.hideHistory': "Masquer l'historique",
    'home.history': 'Historique ({n})',
    'home.lastGames': 'Dernières parties',
    'home.clearAll': 'Tout effacer',
    'home.noGames': "Aucune partie pour l'instant.",
    'home.players': '👥 Joueurs',
    'home.impostor': '🕵️ Imposteur',
    'home.tip': 'Astuce : appuyez sur',
    'home.tipEnter': 'Entrée',
    'home.tipEnd': 'pour commencer.',

    // Configuration
    'setup.back': '← Accueil',
    'setup.title': 'Configuration',
    'setup.playersTitle': 'Joueurs',
    'setup.playersHint': '{n} prêts',
    'setup.playerPlaceholder': 'Joueur {n}',
    'setup.addPlayer': '+ Ajouter un joueur',
    'setup.impostorsTitle': 'Imposteurs',
    'setup.impostorsHint': 'max {n}',
    'setup.toursTitle': 'Tours de parole',
    'setup.toursHint': 'avant le vote',
    'setup.toursDesc':
      'Chaque joueur parle chacun son tour. Choisis combien de fois on fait le tour de la table.',
    'setup.categoriesTitle': 'Catégories',
    'setup.optionsTitle': 'Options',
    'setup.timer': '⏱️ Timer',
    'setup.timerDesc': 'Minuteur de discussion',
    'setup.mrWhite': '🕵️ Mode Mr. White',
    'setup.mrWhiteDesc': "L'imposteur n'a aucun mot",
    'setup.qr': '📱 Mode QR code',
    'setup.qrDesc': 'Les joueurs scannent leur mot',
    'setup.errorMinPlayers': 'Il faut au moins 3 joueurs pour lancer une partie.',
    'setup.launch': '🎲 Lancer la partie',

    // Révélation
    'reveal.back': '← Accueil',
    'reveal.otherCard': '🔄 Autre carte',
    'reveal.eyebrow': 'Distribution des rôles',
    'reveal.title': 'Chacun son tour 🤫',
    'reveal.introQr':
      'Mode QR : chaque joueur scanne son code à son tour pour voir son mot sur son téléphone.',
    'reveal.intro':
      "L'hôte tend l'écran à chaque joueur. Montrez la carte, puis masquez avant de passer au suivant.",
    'reveal.space': 'Espace',
    'reveal.spaceHintQr': 'afficher le QR suivant, puis le masquer',
    'reveal.spaceHint': 'montrer la carte suivante, puis la masquer',
    'reveal.cardSeen': '✓ Carte vue',
    'reveal.tapQr': 'Toucher pour le QR',
    'reveal.tapSee': 'Toucher pour voir',
    'reveal.startDiscussion': '💬 Lancer la discussion',
    'reveal.remaining': 'Encore {n} joueur(s)',
    'reveal.category': 'Catégorie :',
    'reveal.cardOf': 'Carte de',
    'reveal.tapToReveal': 'Toucher / Espace pour révéler',
    'reveal.scanToSee': '📱 Scanne pour voir ton mot',
    'reveal.generating': 'Génération…',
    'reveal.linkCopied': '✓ Lien copié',
    'reveal.copyLink': '🔗 Copier le lien',
    'reveal.qrWarning':
      'Chaque joueur scanne SON QR à son tour — ne montre pas celui des autres.',
    'reveal.mrWhite': 'Mr. White',
    'reveal.noWord': "Tu n'as aucun mot.",
    'reveal.mrWhiteHint':
      'Écoute les autres, devine le mot commun et fonds-toi dans la masse. Surtout, ne te fais pas griller !',
    'reveal.yourWord': 'Ton mot est',
    'reveal.universe': '📚 Univers :',
    'reveal.playerHint':
      "Mémorise ton mot. Reste discret : personne ne doit savoir si tu es l'imposteur.",
    'reveal.hide': '🙈 Masquer (Espace)',

    // Discussion
    'disc.eyebrow': 'Phase de discussion',
    'disc.title': 'Chacun son tour 🎤',
    'disc.tour': 'Tour {n}',
    'disc.tourProgress': 'Tour {tour} / {tours} · {pos}/{count} à parler',
    'disc.turnOf': 'Au tour de',
    'disc.clue': 'Donne un indice sur ton mot, sans le révéler.',
    'disc.doneTitle': 'Tous les tours sont terminés',
    'disc.doneDesc': "Place au débat final, puis au vote pour démasquer l'imposteur.",
    'disc.lastPlayer': 'Dernier joueur ➜ Terminer',
    'disc.nextPlayer': 'Suivant ➜',
    'disc.toVote': '🗳️ Passer au vote',
    'disc.kbdEnter': 'Entrée',
    'disc.kbdSpace': 'Espace',
    'disc.kbdVote': 'voter',
    'disc.kbdNext': 'suivant',
    'disc.skipToVote': 'Passer directement au vote',

    // Vote
    'vote.eyebrow': 'Le vote',
    'vote.title': "Qui est l'imposteur ? 🗳️",
    'vote.instruction': "L'hôte sélectionne le joueur éliminé par le groupe.",
    'vote.notImpostor': "{name} n'était pas l'imposteur !",
    'vote.wordWas': 'Le mot de {name} était « {word} »{origin}.',
    'vote.wrongAccusation': "Mauvaise accusation : l'imposteur l'emporte.",
    'vote.seeResult': 'Voir le résultat',
    'vote.wasImpostor': "{name} était l'imposteur !",
    'vote.lastChance':
      'Dernière chance : devine le mot principal des autres joueurs pour renverser la partie.',
    'vote.lastChanceStrong': 'mot principal',
    'vote.guessPlaceholder': 'Tape ta réponse…',
    'vote.submitGuess': 'Valider ma réponse',
    'vote.drumroll': 'Roulement de tambour…',
    'vote.revealingRole': 'On révèle le rôle de {name}',
    'vote.reasonWrong': "Mauvaise accusation : l'imposteur n'a pas été trouvé.",

    // Résultat
    'result.playersWin': 'Les joueurs gagnent !',
    'result.impostorWin': "L'imposteur gagne !",
    'result.correctGuess': "L'imposteur a deviné le mot principal : « {word} ».",
    'result.wrongGuess': "Mauvaise réponse de l'imposteur (« {word} »). Démasqué !",
    'result.pointsPlayers': '+1 point pour chaque joueur innocent',
    'result.pointsImpostors': '+2 points pour les imposteurs',
    'result.pointsImpostor': "+2 points pour l'imposteur",
    'result.mainWord': 'Mot principal',
    'result.impostorWord': 'Mot imposteur',
    'result.mrWhiteWord': 'Mr. White 🕵️',
    'result.noWord': 'aucun mot',
    'result.rolesTitle': 'Les rôles',
    'result.roleImpostor': 'Imposteur',
    'result.rolePlayer': 'Joueur',
    'result.sessionScore': 'Score de la session',
    'result.pts': 'pts',
    'result.replay': '🔄 Rejouer',
    'result.newGame': '⚙️ Nouvelle partie',
    'result.finalScore': '🏁 Score final',
    'result.kbdEnter': 'Entrée',
    'result.kbdReplay': 'rejouer',
    'result.kbdEscape': 'Échap',
    'result.kbdNewGame': 'nouvelle partie',

    // Classement
    'score.eyebrow': 'Score de la session',
    'score.title': 'Classement 🏁',
    'score.leader': '🏆 En tête : ',
    'score.tied': '🏆 À égalité : ',
    'score.noRounds': "Aucune manche jouée pour l'instant.",
    'score.pts': 'pts',
    'score.keepPlaying': '🔄 Continuer à jouer',
    'score.toMenu': '🏠 Retour au menu',
    'score.note': 'Le retour au menu termine la session et remet le score à zéro.',

    // Bibliothèque
    'lib.back': '← Accueil',
    'lib.title': '📚 Bibliothèque',
    'lib.intro':
      'Toutes les cartes du jeu : {n} duos, classés par catégorie. Chaque paire indique pourquoi les deux mots sont liés.',
    'lib.searchPlaceholder': 'Rechercher un mot, un univers, un lien…',
    'lib.createCard': '➕ Créer une carte',
    'lib.locked': 'Création réservée. Entre le mot de passe pour débloquer.',
    'lib.passwordPlaceholder': 'Mot de passe',
    'lib.unlock': 'Déverrouiller',
    'lib.wrongPassword': 'Mot de passe incorrect.',
    'lib.newCard': '➕ Nouvelle carte',
    'lib.lock': '🔒 Verrouiller',
    'lib.category': 'Catégorie',
    'lib.link': 'Lien (optionnel)',
    'lib.linkPlaceholder': 'ex. Se ressemblent',
    'lib.wordA': 'Mot A *',
    'lib.wordAPlaceholder': 'ex. Pikachu',
    'lib.universeA': 'Univers A (optionnel)',
    'lib.universeAPlaceholder': 'ex. Pokémon',
    'lib.wordB': 'Mot B *',
    'lib.wordBPlaceholder': 'ex. Raichu',
    'lib.universeB': 'Univers B (optionnel)',
    'lib.errorTwoWords': 'Il faut au moins les deux mots (Mot A et Mot B).',
    'lib.cardAdded': '✓ Carte ajoutée : {x}',
    'lib.addCard': 'Ajouter la carte',
    'lib.createNote':
      'Les cartes créées sont enregistrées dans ce navigateur et entrent directement dans le jeu et la bibliothèque.',
    'lib.all': '🎲 Toutes',
    'lib.custom': '✏️ perso',
    'lib.hardcore': '🔥 très proche',
    'lib.deleteCard': 'Supprimer cette carte',
    'lib.noMatch': 'Aucune carte ne correspond à « {query} ».',
    'lib.sameUniverse': 'Même univers',
    'lib.closeWords': 'Mots proches',

    // Timer
    'timer.pause': '⏸ Pause',
    'timer.resume': '▶ Reprendre',
    'timer.reset': '↺ Reset',

    // Carte téléphone (QR)
    'card.invalid': 'Lien de carte invalide ou expiré.',
    'card.mrWhite': 'Mr. White',
    'card.noWord': "Tu n'as aucun mot.",
    'card.mrWhiteHint':
      'Écoute les autres, devine le mot commun et fonds-toi dans la masse. Surtout, ne te fais pas griller !',
    'card.yourWord': 'Ton mot est',
    'card.universe': '📚 Univers :',
    'card.keepSecret': 'Garde-le pour toi 🤫',
  },

  en: {
    // Floating controls
    'controls.sound': 'Sound (M)',
    'controls.lang': 'Passer en français',

    // Home
    'home.tagline':
      'Everyone gets the same word… except one. Unmask the impostor before they guess yours.',
    'home.create': '▶ Create a game',
    'home.library': '📚 Browse all cards',
    'home.hideHistory': 'Hide history',
    'home.history': 'History ({n})',
    'home.lastGames': 'Recent games',
    'home.clearAll': 'Clear all',
    'home.noGames': 'No games yet.',
    'home.players': '👥 Players',
    'home.impostor': '🕵️ Impostor',
    'home.tip': 'Tip: press',
    'home.tipEnter': 'Enter',
    'home.tipEnd': 'to begin.',

    // Setup
    'setup.back': '← Home',
    'setup.title': 'Setup',
    'setup.playersTitle': 'Players',
    'setup.playersHint': '{n} ready',
    'setup.playerPlaceholder': 'Player {n}',
    'setup.addPlayer': '+ Add a player',
    'setup.impostorsTitle': 'Impostors',
    'setup.impostorsHint': 'max {n}',
    'setup.toursTitle': 'Speaking rounds',
    'setup.toursHint': 'before the vote',
    'setup.toursDesc':
      'Each player speaks in turn. Choose how many times you go around the table.',
    'setup.categoriesTitle': 'Categories',
    'setup.optionsTitle': 'Options',
    'setup.timer': '⏱️ Timer',
    'setup.timerDesc': 'Discussion countdown',
    'setup.mrWhite': '🕵️ Mr. White mode',
    'setup.mrWhiteDesc': 'The impostor has no word',
    'setup.qr': '📱 QR code mode',
    'setup.qrDesc': 'Players scan to see their word',
    'setup.errorMinPlayers': 'You need at least 3 players to start a game.',
    'setup.launch': '🎲 Start the game',

    // Reveal
    'reveal.back': '← Home',
    'reveal.otherCard': '🔄 Another card',
    'reveal.eyebrow': 'Dealing the roles',
    'reveal.title': 'One at a time 🤫',
    'reveal.introQr':
      'QR mode: each player scans their code in turn to see their word on their phone.',
    'reveal.intro':
      'The host hands the screen to each player. Show the card, then hide it before passing to the next.',
    'reveal.space': 'Space',
    'reveal.spaceHintQr': 'show the next QR, then hide it',
    'reveal.spaceHint': 'show the next card, then hide it',
    'reveal.cardSeen': '✓ Card seen',
    'reveal.tapQr': 'Tap for the QR',
    'reveal.tapSee': 'Tap to see',
    'reveal.startDiscussion': '💬 Start the discussion',
    'reveal.remaining': '{n} player(s) left',
    'reveal.category': 'Category:',
    'reveal.cardOf': 'Card of',
    'reveal.tapToReveal': 'Tap / Space to reveal',
    'reveal.scanToSee': '📱 Scan to see your word',
    'reveal.generating': 'Generating…',
    'reveal.linkCopied': '✓ Link copied',
    'reveal.copyLink': '🔗 Copy link',
    'reveal.qrWarning': "Each player scans THEIR OWN QR in turn — don't show anyone else's.",
    'reveal.mrWhite': 'Mr. White',
    'reveal.noWord': 'You have no word.',
    'reveal.mrWhiteHint':
      "Listen to the others, guess the common word and blend in. Above all, don't get caught!",
    'reveal.yourWord': 'Your word is',
    'reveal.universe': '📚 Universe:',
    'reveal.playerHint':
      'Memorize your word. Stay discreet: no one should know whether you are the impostor.',
    'reveal.hide': '🙈 Hide (Space)',

    // Discussion
    'disc.eyebrow': 'Discussion phase',
    'disc.title': 'One at a time 🎤',
    'disc.tour': 'Round {n}',
    'disc.tourProgress': 'Round {tour} / {tours} · {pos}/{count} to speak',
    'disc.turnOf': "It's the turn of",
    'disc.clue': 'Give a clue about your word, without revealing it.',
    'disc.doneTitle': 'All rounds are over',
    'disc.doneDesc': 'Time for the final debate, then the vote to unmask the impostor.',
    'disc.lastPlayer': 'Last player ➜ Finish',
    'disc.nextPlayer': 'Next ➜',
    'disc.toVote': '🗳️ Go to the vote',
    'disc.kbdEnter': 'Enter',
    'disc.kbdSpace': 'Space',
    'disc.kbdVote': 'vote',
    'disc.kbdNext': 'next',
    'disc.skipToVote': 'Skip straight to the vote',

    // Vote
    'vote.eyebrow': 'The vote',
    'vote.title': 'Who is the impostor? 🗳️',
    'vote.instruction': 'The host selects the player eliminated by the group.',
    'vote.notImpostor': '{name} was not the impostor!',
    'vote.wordWas': "{name}'s word was “{word}”{origin}.",
    'vote.wrongAccusation': 'Wrong accusation: the impostor wins.',
    'vote.seeResult': 'See the result',
    'vote.wasImpostor': '{name} was the impostor!',
    'vote.lastChance':
      "Last chance: guess the other players' main word to turn the game around.",
    'vote.lastChanceStrong': 'main word',
    'vote.guessPlaceholder': 'Type your answer…',
    'vote.submitGuess': 'Submit my answer',
    'vote.drumroll': 'Drum roll…',
    'vote.revealingRole': "Revealing {name}'s role",
    'vote.reasonWrong': 'Wrong accusation: the impostor was not found.',

    // Result
    'result.playersWin': 'The players win!',
    'result.impostorWin': 'The impostor wins!',
    'result.correctGuess': 'The impostor guessed the main word: “{word}”.',
    'result.wrongGuess': 'Wrong answer from the impostor (“{word}”). Unmasked!',
    'result.pointsPlayers': '+1 point for each innocent player',
    'result.pointsImpostors': '+2 points for the impostors',
    'result.pointsImpostor': '+2 points for the impostor',
    'result.mainWord': 'Main word',
    'result.impostorWord': 'Impostor word',
    'result.mrWhiteWord': 'Mr. White 🕵️',
    'result.noWord': 'no word',
    'result.rolesTitle': 'The roles',
    'result.roleImpostor': 'Impostor',
    'result.rolePlayer': 'Player',
    'result.sessionScore': 'Session score',
    'result.pts': 'pts',
    'result.replay': '🔄 Replay',
    'result.newGame': '⚙️ New game',
    'result.finalScore': '🏁 Final score',
    'result.kbdEnter': 'Enter',
    'result.kbdReplay': 'replay',
    'result.kbdEscape': 'Esc',
    'result.kbdNewGame': 'new game',

    // Scoreboard
    'score.eyebrow': 'Session score',
    'score.title': 'Leaderboard 🏁',
    'score.leader': '🏆 In the lead: ',
    'score.tied': '🏆 Tied: ',
    'score.noRounds': 'No round played yet.',
    'score.pts': 'pts',
    'score.keepPlaying': '🔄 Keep playing',
    'score.toMenu': '🏠 Back to menu',
    'score.note': 'Returning to the menu ends the session and resets the score.',

    // Library
    'lib.back': '← Home',
    'lib.title': '📚 Library',
    'lib.intro':
      'All the cards in the game: {n} pairs, sorted by category. Each pair shows why the two words are linked.',
    'lib.searchPlaceholder': 'Search for a word, a universe, a link…',
    'lib.createCard': '➕ Create a card',
    'lib.locked': 'Creation restricted. Enter the password to unlock.',
    'lib.passwordPlaceholder': 'Password',
    'lib.unlock': 'Unlock',
    'lib.wrongPassword': 'Incorrect password.',
    'lib.newCard': '➕ New card',
    'lib.lock': '🔒 Lock',
    'lib.category': 'Category',
    'lib.link': 'Link (optional)',
    'lib.linkPlaceholder': 'e.g. They look alike',
    'lib.wordA': 'Word A *',
    'lib.wordAPlaceholder': 'e.g. Pikachu',
    'lib.universeA': 'Universe A (optional)',
    'lib.universeAPlaceholder': 'e.g. Pokémon',
    'lib.wordB': 'Word B *',
    'lib.wordBPlaceholder': 'e.g. Raichu',
    'lib.universeB': 'Universe B (optional)',
    'lib.errorTwoWords': 'You need at least both words (Word A and Word B).',
    'lib.cardAdded': '✓ Card added: {x}',
    'lib.addCard': 'Add the card',
    'lib.createNote':
      'Created cards are saved in this browser and feed directly into the game and the library.',
    'lib.all': '🎲 All',
    'lib.custom': '✏️ custom',
    'lib.hardcore': '🔥 very close',
    'lib.deleteCard': 'Delete this card',
    'lib.noMatch': 'No card matches “{query}”.',
    'lib.sameUniverse': 'Same universe',
    'lib.closeWords': 'Close words',

    // Timer
    'timer.pause': '⏸ Pause',
    'timer.resume': '▶ Resume',
    'timer.reset': '↺ Reset',

    // Phone card (QR)
    'card.invalid': 'Invalid or expired card link.',
    'card.mrWhite': 'Mr. White',
    'card.noWord': 'You have no word.',
    'card.mrWhiteHint':
      "Listen to the others, guess the common word and blend in. Above all, don't get caught!",
    'card.yourWord': 'Your word is',
    'card.universe': '📚 Universe:',
    'card.keepSecret': 'Keep it to yourself 🤫',
  },
}

// Remplace les placeholders {clé} par les valeurs fournies.
function interpolate(str, vars) {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
}

// Traduit une clé pour une langue donnée (avec interpolation optionnelle).
export function translate(lang, key, vars) {
  const table = DICT[lang] || DICT[DEFAULT_LANG]
  const str = table[key] ?? DICT[DEFAULT_LANG][key] ?? key
  return interpolate(str, vars)
}

// Libellé de catégorie traduit.
export function categoryLabel(lang, id) {
  const table = CATEGORY_LABELS[lang] || CATEGORY_LABELS[DEFAULT_LANG]
  return table[id] ?? CATEGORY_LABELS[DEFAULT_LANG][id] ?? id
}

// Locale pour le formatage des dates.
export function dateLocale(lang) {
  return lang === 'en' ? 'en-US' : 'fr-FR'
}
