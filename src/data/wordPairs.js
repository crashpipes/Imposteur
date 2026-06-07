/**
 * BASE DE DONNÉES DE MOTS LIÉS
 * ----------------------------------------------------------------------------
 * Concept : chaque entrée est une PAIRE de mots « proches » mais distincts.
 * Le lien peut être de plusieurs natures (pas seulement « même univers ») :
 *   - même univers / licence            (Naruto / Sasuke)
 *   - rivaux, duo, famille              (Luffy / Shanks)
 *   - RESSEMBLANCE PHYSIQUE             (Gojo / Kakashi)
 *   - MÊME COMPORTEMENT / archétype     (Naruto / Luffy)
 *   - objets/animaux/pays qui se ressemblent (Léopard / Guépard)
 *
 * Au moment de générer une manche, on tire une paire puis on décide
 * aléatoirement lequel des deux est le « mot principal » (joueurs normaux)
 * et lequel est le « faux mot » (imposteur). Les deux sens fonctionnent.
 *
 * Champs d'une paire :
 *   a, b        -> les deux mots confusables (obligatoire)
 *   aFrom,bFrom -> l'ŒUVRE / l'univers d'origine de a et de b. Affiché sous le
 *                  mot lors de la distribution (optionnel, surtout fiction).
 *   link        -> nature du lien, affichée dans la BIBLIOTHÈQUE uniquement
 *                  (jamais pendant la partie). Optionnel.
 *   hardcore    -> true si la différence est très subtile (indicateur biblio).
 *
 * Un même personnage peut apparaître dans PLUSIEURS paires (ex. Luffy / Zoro,
 * Luffy / Shanks, Naruto / Luffy...). C'est voulu : plus de variété.
 *
 * POUR ÉTENDRE : ajoutez un objet { a, b, ... } dans la bonne catégorie.
 * (On peut aussi créer des cartes depuis la bibliothèque dans l'app : elles
 *  sont stockées dans le navigateur et fusionnées automatiquement ici.)
 * ----------------------------------------------------------------------------
 */

import { loadCustomPairs } from '../lib/storage.js'

export const CATEGORIES = {
  films: { id: 'films', label: 'Films', icon: '🎬' },
  series: { id: 'series', label: 'Séries', icon: '📺' },
  anime: { id: 'anime', label: 'Anime', icon: '🍥' },
  jeux: { id: 'jeux', label: 'Jeux vidéo', icon: '🎮' },
  personnages: { id: 'personnages', label: 'Personnages fictifs', icon: '🦸' },
  personnalites: { id: 'personnalites', label: 'Personnalités publiques', icon: '🌟' },
  pokemon: { id: 'pokemon', label: 'Pokémon', icon: '⚡' },
  lol: { id: 'lol', label: 'League of Legends', icon: '⚔️' },
  pays: { id: 'pays', label: 'Pays', icon: '🌍' },
  objets: { id: 'objets', label: 'Objets', icon: '🧰' },
  nourriture: { id: 'nourriture', label: 'Nourriture', icon: '🍔' },
  animaux: { id: 'animaux', label: 'Animaux', icon: '🐾' },
  mix: { id: 'mix', label: 'Mélange aléatoire', icon: '🎲' },
}

export const WORD_DATA = {
  anime: [
    // --- Ajouts : ressemblances variées (cross-univers) ---
    { a: 'Saitama', aFrom: 'One Punch Man', b: 'All Might', bFrom: 'My Hero Academia', link: 'Héros au grand sourire qui écrasent tout' },
    { a: 'Vegeta', aFrom: 'Dragon Ball', b: 'Bakugo', bFrom: 'My Hero Academia', link: 'Rivaux explosifs et orgueilleux' },
    { a: 'Sukuna', aFrom: 'Jujutsu Kaisen', b: 'Hisoka', bFrom: 'Hunter x Hunter', link: 'Antagonistes accros au combat' },
    { a: 'Muzan', aFrom: 'Demon Slayer', b: 'Dio', bFrom: "JoJo's Bizarre Adventure", link: 'Vampires élégants et tyranniques' },
    { a: 'Frieza', aFrom: 'Dragon Ball', b: 'Meruem', bFrom: 'Hunter x Hunter', link: 'Tyrans hautains au sommet de leur espèce' },
    { a: 'Gintoki', aFrom: 'Gintama', b: 'Ichigo', bFrom: 'Bleach', link: 'Bretteurs nonchalants aux cheveux clairs' },
    { a: 'Escanor', aFrom: 'Seven Deadly Sins', b: 'Saitama', bFrom: 'One Punch Man', link: 'Un seul coup leur suffit' },
    { a: 'Meliodas', aFrom: 'Seven Deadly Sins', b: 'Asta', bFrom: 'Black Clover', link: 'Petits gabarits aux pouvoirs sombres' },
    { a: 'Sung Jin-Woo', aFrom: 'Solo Leveling', b: 'Sasuke', bFrom: 'Naruto', link: 'Bruns ténébreux devenus surpuissants' },
    { a: 'All Might', aFrom: 'My Hero Academia', b: 'Superman', bFrom: 'DC Comics', link: 'Symboles de justice rassurants' },
    { a: 'Tanjiro', aFrom: 'Demon Slayer', b: 'Deku', bFrom: 'My Hero Academia', link: 'Héros gentils et acharnés' },
    { a: 'Zoro', aFrom: 'One Piece', b: 'Mihawk', bFrom: 'One Piece', link: 'Sabreurs : élève et maître ultime' },

    // --- Mêmes univers ---
    { a: 'Naruto', aFrom: 'Naruto', b: 'Sasuke', bFrom: 'Naruto', hardcore: true },
    { a: 'Luffy', aFrom: 'One Piece', b: 'Zoro', bFrom: 'One Piece' },
    { a: 'Luffy', aFrom: 'One Piece', b: 'Shanks', bFrom: 'One Piece', link: 'Idole et disciple' },
    { a: 'Barbe noire', aFrom: 'One Piece', b: 'Barbe blanche', bFrom: 'One Piece', link: 'Opposés' },
    { a: 'Luffy', aFrom: 'One Piece', b: 'Ace', bFrom: 'One Piece', link: 'Frères' },
    { a: 'Goku', aFrom: 'Dragon Ball', b: 'Vegeta', bFrom: 'Dragon Ball', hardcore: true },
    { a: 'Goku', aFrom: 'Dragon Ball', b: 'Gohan', bFrom: 'Dragon Ball', link: 'Père et fils' },
    { a: 'Itachi', aFrom: 'Naruto', b: 'Shisui', bFrom: 'Naruto', hardcore: true },
    { a: 'Itachi', aFrom: 'Naruto', b: 'Sasuke', bFrom: 'Naruto', link: 'Frères Uchiha' },
    { a: 'Naruto', aFrom: 'Naruto', b: 'Jiraiya', bFrom: 'Naruto', link: 'Élève et maître' },
    { a: 'Obito', aFrom: 'Naruto', b: 'Tobi', bFrom: 'Naruto', link: 'Le même' },
    { a: 'Ichigo', aFrom: 'Bleach', b: 'Renji', bFrom: 'Bleach' },
    { a: 'Eren', aFrom: "L'Attaque des Titans", b: 'Armin', bFrom: "L'Attaque des Titans" },
    { a: 'Levi', aFrom: "L'Attaque des Titans", b: 'Mikasa', bFrom: "L'Attaque des Titans" },
    { a: 'Tanjiro', aFrom: 'Demon Slayer', b: 'Zenitsu', bFrom: 'Demon Slayer' },
    { a: 'Gojo', aFrom: 'Jujutsu Kaisen', b: 'Geto', bFrom: 'Jujutsu Kaisen', hardcore: true },
    { a: 'Yuji', aFrom: 'Jujutsu Kaisen', b: 'Megumi', bFrom: 'Jujutsu Kaisen' },
    { a: 'Light', aFrom: 'Death Note', b: 'L', bFrom: 'Death Note' },
    { a: 'Edward Elric', aFrom: 'Fullmetal Alchemist', b: 'Alphonse Elric', bFrom: 'Fullmetal Alchemist', hardcore: true },
    { a: 'Saitama', aFrom: 'One Punch Man', b: 'Genos', bFrom: 'One Punch Man' },
    { a: 'Deku', aFrom: 'My Hero Academia', b: 'Bakugo', bFrom: 'My Hero Academia' },
    { a: 'Killua', aFrom: 'Hunter x Hunter', b: 'Gon', bFrom: 'Hunter x Hunter' },
    { a: 'Sailor Moon', aFrom: 'Sailor Moon', b: 'Sailor Mars', bFrom: 'Sailor Moon', hardcore: true },
    { a: 'Inuyasha', aFrom: 'Inuyasha', b: 'Sesshomaru', bFrom: 'Inuyasha', hardcore: true },
    { a: 'Asuka', aFrom: 'Evangelion', b: 'Rei', bFrom: 'Evangelion' },
    { a: 'Spike Spiegel', aFrom: 'Cowboy Bebop', b: 'Jet Black', bFrom: 'Cowboy Bebop' },
    { a: 'Guts', aFrom: 'Berserk', b: 'Griffith', bFrom: 'Berserk', hardcore: true },
    { a: 'Thorfinn', aFrom: 'Vinland Saga', b: 'Askeladd', bFrom: 'Vinland Saga' },
    { a: 'Senku', aFrom: 'Dr. Stone', b: 'Chrome', bFrom: 'Dr. Stone' },

    // --- Cross-univers : MÊME COMPORTEMENT / archétype ---
    { a: 'Naruto', aFrom: 'Naruto', b: 'Luffy', bFrom: 'One Piece', link: 'Héros idiots et déterminés' },
    { a: 'Goku', aFrom: 'Dragon Ball', b: 'Luffy', bFrom: 'One Piece', link: 'Insouciants et gloutons' },
    { a: 'Naruto', aFrom: 'Naruto', b: 'Asta', bFrom: 'Black Clover', link: 'Underdogs qui crient fort' },
    { a: 'Deku', aFrom: 'My Hero Academia', b: 'Naruto', bFrom: 'Naruto', link: 'Underdogs rêvant de reconnaissance' },
    { a: 'Sasuke', aFrom: 'Naruto', b: 'Vegeta', bFrom: 'Dragon Ball', link: 'Rivaux ténébreux et orgueilleux' },
    { a: 'Light', aFrom: 'Death Note', b: 'Lelouch', bFrom: 'Code Geass', link: 'Génies manipulateurs' },
    { a: 'Saitama', aFrom: 'One Punch Man', b: 'Mob', bFrom: 'Mob Psycho 100', link: 'Surpuissants blasés' },
    { a: 'Tanjiro', aFrom: 'Demon Slayer', b: 'Yuji', bFrom: 'Jujutsu Kaisen', link: 'Héros au grand cœur' },
    { a: 'Gon', aFrom: 'Hunter x Hunter', b: 'Luffy', bFrom: 'One Piece', link: 'Aventuriers naïfs et joyeux' },
    { a: 'Eren', aFrom: "L'Attaque des Titans", b: 'Light', bFrom: 'Death Note', link: 'Descente vers les ténèbres' },
    { a: 'Imu', aFrom: 'One Piece', b: 'Le diable', bFrom: 'Ténèbres', link: 'Deux diables' },

    // --- Cross-univers : RESSEMBLANCE PHYSIQUE ---
    { a: 'Gojo', aFrom: 'Jujutsu Kaisen', b: 'Kakashi', bFrom: 'Naruto', link: 'Sensei aux cheveux clairs et œil spécial' },
    { a: 'Killua', aFrom: 'Hunter x Hunter', b: 'Sasuke', bFrom: 'Naruto', link: 'Bruns cools et ténébreux' },
    { a: 'Zoro', aFrom: 'One Piece', b: 'Levi', bFrom: "L'Attaque des Titans", link: 'Bretteurs stoïques et froids' },
    { a: 'Lelouch', aFrom: 'Code Geass', b: 'Light', bFrom: 'Death Note', link: 'Se ressemblent physiquement', hardcore: true },
    { a: 'Sakura', aFrom: 'Naruto', b: 'Asuna', bFrom: 'Sword Art Online', link: 'Héroïnes au sale caractère' },
    { a: 'Jinbe', aFrom: 'One Piece', b: 'Kisame', bFrom: 'Naruto', link: 'Ressemblance physique' },
    { a: 'Orochimaru', aFrom: 'Naruto', b: 'Voldemort', bFrom: 'Harry Potter', link: 'Antagonistes ressemblants' },
  ],

  films: [
    { a: 'Iron Man', aFrom: 'Marvel (MCU)', b: 'Batman', bFrom: 'DC Comics', link: 'Héros milliardaires en armure' },
    { a: 'Dark Vador', aFrom: 'Star Wars', b: 'Kylo Ren', bFrom: 'Star Wars', hardcore: true },
    { a: 'Le Parrain', aFrom: 'Film de F. F. Coppola', b: 'Les Affranchis', bFrom: 'Film de M. Scorsese', link: 'Films de mafia' },
    { a: 'Jurassic Park', aFrom: 'Film de S. Spielberg', b: 'King Kong', bFrom: 'Film de monstre', link: 'Créatures géantes' },
    { a: 'Titanic', aFrom: 'Film de James Cameron', b: 'Avatar', bFrom: 'Film de James Cameron' },
    { a: 'Joker', aFrom: 'DC / Batman', b: 'Bane', bFrom: 'DC / Batman' },
    { a: 'Indiana Jones', aFrom: 'Indiana Jones', b: 'Lara Croft', bFrom: 'Tomb Raider', link: 'Aventuriers pilleurs de tombes' },
    { a: 'Terminator', aFrom: 'Terminator', b: 'RoboCop', bFrom: 'RoboCop', link: 'Cyborgs des années 80' },
    { a: 'Rocky', aFrom: 'Saga Rocky', b: 'Creed', bFrom: 'Saga Rocky / Creed', hardcore: true },
    { a: 'Le Seigneur des Anneaux', aFrom: 'Terre du Milieu (Tolkien)', b: 'Le Hobbit', bFrom: 'Terre du Milieu (Tolkien)', hardcore: true },
    { a: 'Gandalf', aFrom: 'Le Seigneur des Anneaux', b: 'Dumbledore', bFrom: 'Harry Potter', link: 'Vieux mages sages et barbus' },
    { a: 'Neo', aFrom: 'Matrix', b: 'John Wick', bFrom: 'John Wick', link: 'Rôles de Keanu Reeves' },
    { a: 'Alien', aFrom: 'Alien', b: 'Predator', bFrom: 'Predator', link: 'Créatures de SF chasseuses' },
    { a: "Buzz l'Éclair", aFrom: 'Toy Story (Pixar)', b: 'Woody', bFrom: 'Toy Story (Pixar)' },
    { a: 'Spider-Man', aFrom: 'Marvel', b: 'Deadpool', bFrom: 'Marvel', link: 'Marvel agiles et bavards' },
    { a: 'Mad Max', aFrom: 'Mad Max', b: 'Fury Road', bFrom: 'Mad Max', hardcore: true },
    { a: 'James Bond', aFrom: '007', b: 'Jason Bourne', bFrom: 'Jason Bourne', link: 'Agents secrets' },
    { a: 'Gladiator', aFrom: 'Film de Ridley Scott', b: 'Spartacus', bFrom: 'Péplum', link: 'Gladiateurs antiques' },
    { a: 'E.T.', aFrom: 'Film de S. Spielberg', b: 'Wall-E', bFrom: 'Pixar', link: 'Petites créatures attachantes' },
    { a: 'Inception', aFrom: 'Film de C. Nolan', b: 'Interstellar', bFrom: 'Film de C. Nolan', hardcore: true },
    { a: 'Pirates des Caraïbes', aFrom: 'Disney', b: 'Peter Pan', bFrom: 'Conte / Disney', link: 'Histoires de pirates' },
  ],

  series: [
    { a: 'Breaking Bad', aFrom: 'Série AMC', b: 'Better Call Saul', bFrom: 'Spin-off de Breaking Bad', hardcore: true },
    { a: 'Walter White', aFrom: 'Breaking Bad', b: 'Saul Goodman', bFrom: 'Breaking Bad / Better Call Saul', hardcore: true },
    { a: 'Game of Thrones', aFrom: 'Westeros (HBO)', b: 'House of the Dragon', bFrom: 'Westeros (HBO)', hardcore: true },
    { a: 'Jon Snow', aFrom: 'Game of Thrones', b: 'Robb Stark', bFrom: 'Game of Thrones' },
    { a: 'Stranger Things', aFrom: 'Série Netflix', b: 'Dark', bFrom: 'Série Netflix (DE)', link: 'Mystère et enfants disparus' },
    { a: 'The Office', aFrom: 'Sitcom mockumentaire', b: 'Parks and Recreation', bFrom: 'Sitcom mockumentaire', hardcore: true },
    { a: 'Michael Scott', aFrom: 'The Office', b: 'Dwight Schrute', bFrom: 'The Office' },
    { a: 'Friends', aFrom: 'Sitcom (NBC)', b: 'How I Met Your Mother', bFrom: 'Sitcom (CBS)', link: "Bandes d'amis à New York" },
    { a: 'Sherlock', aFrom: 'Série BBC', b: 'House', bFrom: 'Dr House (Fox)', link: 'Génies déductifs asociaux' },
    { a: 'La Casa de Papel', aFrom: 'Série Netflix (ES)', b: 'Lupin', bFrom: 'Série Netflix (FR)', link: 'Casses stylés' },
    { a: 'Peaky Blinders', aFrom: 'Série BBC', b: 'Boardwalk Empire', bFrom: 'Série HBO', link: "Gangsters d'époque" },
    { a: 'The Mandalorian', aFrom: 'Star Wars (Disney+)', b: 'Boba Fett', bFrom: 'Star Wars (Disney+)', link: 'Chasseurs de primes casqués' },
    { a: 'Rick', aFrom: 'Rick et Morty', b: 'Morty', bFrom: 'Rick et Morty' },
    { a: 'Tony Soprano', aFrom: 'Les Soprano', b: 'Walter White', bFrom: 'Breaking Bad', link: 'Antihéros pères de famille' },
    { a: 'Homelander', aFrom: 'The Boys', b: 'Omni-Man', bFrom: 'Invincible', hardcore: true, link: 'Faux Superman maléfiques' },
    { a: 'Squid Game', aFrom: 'Série Netflix (KR)', b: 'Alice in Borderland', bFrom: 'Série Netflix (JP)', link: 'Jeux mortels' },
    { a: 'Arcane', aFrom: 'League of Legends (Netflix)', b: 'Cyberpunk Edgerunners', bFrom: 'Cyberpunk 2077 (Netflix)', link: 'Animation adulte tirée de jeux' },
    { a: 'Geralt', aFrom: 'The Witcher', b: 'Jaskier', bFrom: 'The Witcher' },
  ],

  jeux: [
    // --- Ajouts : personnages (ressemblances variées) ---
    { a: 'Lara Croft', aFrom: 'Tomb Raider', b: 'Nathan Drake', bFrom: 'Uncharted', link: 'Pilleurs de tombes acrobates' },
    { a: 'Bowser', aFrom: 'Super Mario', b: 'Ganondorf', bFrom: 'The Legend of Zelda', link: 'Méchants qui kidnappent la princesse' },
    { a: 'Peach', aFrom: 'Super Mario', b: 'Zelda', bFrom: 'The Legend of Zelda', link: 'Princesses à secourir' },
    { a: 'Pac-Man', aFrom: 'Arcade', b: 'Kirby', bFrom: 'Nintendo', link: 'Ronds tout mignons qui avalent tout' },
    { a: 'Kratos', aFrom: 'God of War', b: 'Geralt', bFrom: 'The Witcher', link: 'Pères bourrus et guerriers' },
    { a: '2B', aFrom: 'NieR Automata', b: 'Bayonetta', bFrom: 'Bayonetta', link: 'Combattantes élégantes en noir' },
    { a: 'Ezio', aFrom: "Assassin's Creed", b: 'Corvo', bFrom: 'Dishonored', link: 'Assassins encapuchonnés et agiles' },
    { a: 'Gordon Freeman', aFrom: 'Half-Life', b: 'Isaac Clarke', bFrom: 'Dead Space', link: 'Héros muets en combinaison' },
    // --- Ajouts : jeux (ressemblances variées) ---
    { a: 'Stardew Valley', b: 'Animal Crossing', link: 'Vie tranquille et farming relaxant' },
    { a: 'Terraria', b: 'Minecraft', link: "Bac à sable où l'on creuse et construit" },
    { a: 'Stumble Guys', b: 'Fall Guys', link: 'Battle royale de petits persos rigolos' },
    { a: 'Subway Surfers', b: 'Temple Run', link: 'Courses sans fin sur mobile' },
    { a: 'Among Us', b: 'Goose Goose Duck', link: "Trouver l'imposteur dans l'équipage" },
    { a: 'Skyrim', b: 'The Witcher 3', link: 'RPG médiévaux en monde ouvert' },
    { a: 'Hades', b: 'Dead Cells', link: 'Rogue-lites nerveux et stylés' },
    { a: 'Clash Royale', b: 'Clash of Clans', link: 'Univers Supercell' },
    { a: 'Mario', aFrom: 'Super Mario (Nintendo)', b: 'Luigi', bFrom: 'Super Mario (Nintendo)', hardcore: true },
    { a: 'Sonic', aFrom: 'Sonic (Sega)', b: 'Shadow', bFrom: 'Sonic (Sega)', hardcore: true },
    { a: 'Mario', aFrom: 'Super Mario (Nintendo)', b: 'Sonic', bFrom: 'Sonic (Sega)', link: 'Mascottes rivales du jeu vidéo' },
    { a: 'Link', aFrom: 'The Legend of Zelda', b: 'Zelda', bFrom: 'The Legend of Zelda' },
    { a: 'Kratos', aFrom: 'God of War', b: 'Atreus', bFrom: 'God of War' },
    { a: 'Master Chief', aFrom: 'Halo', b: 'Doom Slayer', bFrom: 'Doom', link: 'Super-soldats de FPS' },
    { a: 'Geralt', aFrom: 'The Witcher', b: 'Ciri', bFrom: 'The Witcher' },
    { a: 'Aloy', aFrom: 'Horizon', b: 'Lara Croft', bFrom: 'Tomb Raider', link: 'Aventurières archères' },
    { a: 'Cloud', aFrom: 'Final Fantasy VII', b: 'Sephiroth', bFrom: 'Final Fantasy VII', hardcore: true },
    { a: 'Ezio', aFrom: "Assassin's Creed", b: 'Altaïr', bFrom: "Assassin's Creed", hardcore: true },
    { a: 'Nathan Drake', aFrom: 'Uncharted', b: 'Sully', bFrom: 'Uncharted' },
    { a: 'Nathan Drake', aFrom: 'Uncharted', b: 'Indiana Jones', bFrom: 'Indiana Jones', link: 'Aventuriers à la chemise débraillée' },
    { a: 'Donkey Kong', aFrom: 'Donkey Kong (Nintendo)', b: 'Diddy Kong', bFrom: 'Donkey Kong (Nintendo)', hardcore: true },
    { a: 'Steve', aFrom: 'Minecraft', b: 'Alex', bFrom: 'Minecraft', hardcore: true },
    { a: 'Creeper', aFrom: 'Minecraft', b: 'Enderman', bFrom: 'Minecraft' },
    { a: 'Ryu', aFrom: 'Street Fighter', b: 'Ken', bFrom: 'Street Fighter', hardcore: true },
    { a: 'Scorpion', aFrom: 'Mortal Kombat', b: 'Sub-Zero', bFrom: 'Mortal Kombat' },
    { a: 'Solid Snake', aFrom: 'Metal Gear', b: 'Big Boss', bFrom: 'Metal Gear', hardcore: true },
    { a: 'Crash Bandicoot', aFrom: 'Crash Bandicoot', b: 'Spyro', bFrom: 'Spyro the Dragon', link: 'Mascottes PlayStation 90s' },
    { a: 'Joel', aFrom: 'The Last of Us', b: 'Ellie', bFrom: 'The Last of Us' },
    { a: 'Arthur Morgan', aFrom: 'Red Dead Redemption', b: 'John Marston', bFrom: 'Red Dead Redemption', hardcore: true },
    { a: 'Leon Kennedy', aFrom: 'Resident Evil', b: 'Chris Redfield', bFrom: 'Resident Evil' },
    { a: 'Steam', b: 'Epic games' },
    { a: 'Minecraft', b: 'Grand Theft Auto V' },
    { a: 'Fortnite', b: 'Apex Legends' },
    { a: 'Fortnite', b: 'PUBG' },
    { a: 'Apex Legends', b: 'H1Z1' },
    { a: 'Grand Theft Auto V', b: 'Red Dead Redemption' },
    { a: 'Elden Ring', b: 'Dark Souls III' },
    { a: 'Rocket League', b: 'FIFA' },
    { a: 'Valorant', b: 'CS2' },
    { a: 'Genshin Impact', b: 'Honkai Star Rail' },
    { a: 'League of Legends', b: 'Teamfight Tactics' },
    { a: 'Resident Evil', b: 'The Last of Us' },
    { a: 'Brawlhalla', b: 'Super Smash Bros' },
    { a: 'Overwatch', b: 'Marvel Rivals' },
    { a: 'Pokémon', b: 'Palworld' },
    { a: 'Rocket League', b: 'Forza Horizon' },
  ],

  personnages: [
    { a: 'Superman', aFrom: 'DC Comics', b: 'Goku', bFrom: 'Dragon Ball', link: 'Surpuissants au grand cœur' },
    { a: 'Superman', aFrom: 'DC Comics', b: 'Homelander', bFrom: 'The Boys', link: 'Surhomme en cape (un bon, un mauvais)' },
    { a: 'Sherlock Holmes', aFrom: 'A. Conan Doyle', b: 'Hercule Poirot', bFrom: 'Agatha Christie', link: 'Détectives à moustache grise' },
    { a: 'Sherlock Holmes', aFrom: 'A. Conan Doyle', b: 'Batman', bFrom: 'DC Comics', link: "Génies de la déduction" },
    { a: 'Dracula', aFrom: 'Bram Stoker', b: 'Frankenstein', bFrom: 'Mary Shelley', link: 'Monstres classiques' },
    { a: 'Gandalf', aFrom: 'Le Seigneur des Anneaux', b: 'Merlin', bFrom: 'Légende arthurienne', link: 'Magiciens légendaires barbus' },
    { a: 'Hulk', aFrom: 'Marvel', b: 'La Chose', bFrom: 'Marvel (4 Fantastiques)', hardcore: true, link: 'Colosses qui cognent' },
    { a: 'Wonder Woman', aFrom: 'DC Comics', b: 'Captain Marvel', bFrom: 'Marvel', link: 'Super-héroïnes surpuissantes' },
    { a: 'Wolverine', aFrom: 'Marvel (X-Men)', b: 'Sabretooth', bFrom: 'Marvel (X-Men)', hardcore: true },
    { a: 'Flash', aFrom: 'DC Comics', b: 'Quicksilver', bFrom: 'Marvel', hardcore: true, link: 'Héros à super-vitesse' },
    { a: 'Thor', aFrom: 'Mythologie nordique / Marvel', b: 'Hercule', bFrom: 'Mythologie grecque', link: 'Demi-dieux balèzes' },
    { a: 'Robin des Bois', aFrom: 'Légende anglaise', b: 'Zorro', bFrom: 'Pulp (J. McCulley)', link: 'Justiciers masqués' },
    { a: 'Catwoman', aFrom: 'DC Comics', b: 'Black Widow', bFrom: 'Marvel', link: 'Espionnes en combinaison' },
    { a: 'Deadpool', aFrom: 'Marvel', b: 'Deathstroke', bFrom: 'DC Comics', hardcore: true, link: 'Mercenaires masqués rouge/orange' },
    { a: 'Green Arrow', aFrom: 'DC Comics', b: 'Hawkeye', bFrom: 'Marvel', hardcore: true, link: 'Archers à capuche' },
    { a: 'Doctor Strange', aFrom: 'Marvel', b: 'Constantine', bFrom: 'DC (Vertigo)', link: 'Mages occultes' },
    { a: 'Loki', aFrom: 'Marvel', b: 'Mystique', bFrom: 'Marvel (X-Men)', link: 'Métamorphes malicieux' },
    { a: 'Aquaman', aFrom: 'DC Comics', b: 'Namor', bFrom: 'Marvel', hardcore: true, link: 'Rois des mers' },
    { a: 'Thanos', aFrom: 'Marvel', b: 'Darkseid', bFrom: 'DC Comics', hardcore: true, link: 'Tyrans cosmiques au menton ridé' },
    { a: 'Voldemort', aFrom: 'Harry Potter', b: 'Saroumane', bFrom: 'Le Seigneur des Anneaux', link: 'Mages maléfiques' },
    { a: 'Voldemort', aFrom: 'Harry Potter', b: 'Dark Vador', bFrom: 'Star Wars', link: 'Antagonistes iconiques' },
  ],

  // ------------------------------------------------------------------
  // PERSONNALITÉS PUBLIQUES : vraies célébrités (sport, musique, ciné,
  // tech...). On se base sur le métier, la ressemblance physique ou la
  // rivalité. Ton léger, aucune intention de moquerie.
  // ------------------------------------------------------------------
  personnalites: [
    // Sport
    { a: 'Messi', b: 'Cristiano Ronaldo', link: 'Rivaux légendaires du foot' },
    { a: 'Mbappé', b: 'Haaland', link: 'Jeunes stars du foot' },
    { a: 'Zidane', b: 'Ronaldinho', link: 'Légendes du foot des années 2000' },
    { a: 'Neymar', b: 'Mbappé', link: 'Attaquants stars du PSG' },
    { a: 'LeBron James', b: 'Michael Jordan', link: 'Légendes de la NBA' },
    { a: 'Federer', b: 'Nadal', link: 'Rivaux du tennis' },
    { a: 'Djokovic', b: 'Nadal', link: 'Rivaux du tennis' },
    { a: 'Usain Bolt', b: 'Carl Lewis', link: 'Rois du sprint' },
    { a: 'Mike Tyson', b: 'Mohamed Ali', link: 'Légendes de la boxe' },
    { a: 'Tony Parker', b: 'Boris Diaw', link: 'Basketteurs français' },

    // Musique
    { a: 'Beyoncé', b: 'Rihanna', link: 'Divas de la pop' },
    { a: 'Drake', b: 'The Weeknd', link: 'Stars canadiennes du R&B' },
    { a: 'Eminem', b: '50 Cent', link: 'Rappeurs américains' },
    { a: 'Michael Jackson', b: 'Prince', link: 'Icônes de la pop des années 80' },
    { a: 'Booba', b: 'Rohff', link: 'Rivaux du rap français' },
    { a: 'Jul', b: 'SCH', link: 'Rappeurs marseillais' },
    { a: 'Orelsan', b: 'Stromae', link: 'Artistes francophones à textes' },
    { a: 'Adele', b: 'Sia', link: 'Grandes voix de la pop' },
    { a: 'Taylor Swift', b: 'Katy Perry', link: 'Stars de la pop américaine' },

    // Cinéma — dont sosies souvent confondus
    { a: 'Leonardo DiCaprio', b: 'Brad Pitt', link: 'Stars de Hollywood' },
    { a: 'Robert De Niro', b: 'Al Pacino', link: 'Légendes du cinéma' },
    { a: 'Tom Cruise', b: 'Tom Hanks', link: 'Acteurs américains prénommés Tom' },
    { a: 'Natalie Portman', b: 'Keira Knightley', link: 'Actrices souvent confondues', hardcore: true },
    { a: 'Henry Cavill', b: 'Matt Bomer', link: 'Se ressemblent physiquement', hardcore: true },
    { a: 'Mark Wahlberg', b: 'Matt Damon', link: 'Souvent confondus', hardcore: true },
    { a: 'Amy Adams', b: 'Isla Fisher', link: 'Rousses souvent confondues', hardcore: true },
    { a: 'Will Ferrell', b: 'Chad Smith', link: 'Sosies célèbres' },

    // Tech & science
    { a: 'Elon Musk', b: 'Jeff Bezos', link: 'Milliardaires de la tech' },
    { a: 'Bill Gates', b: 'Steve Jobs', link: "Pionniers de l'informatique" },
    { a: 'Albert Einstein', b: 'Isaac Newton', link: 'Physiciens de génie' },

    // YouTube & streaming (France)
    { a: 'Squeezie', b: 'Cyprien', link: 'Pionniers de YouTube France' },
    { a: 'McFly', b: 'Carlito', link: 'Duo de youtubeurs' },
    { a: 'Inoxtag', b: 'Michou', link: 'Youtubeurs amis' },
    { a: 'Gotaga', b: 'Domingo', link: 'Stars du streaming français' },

    // Cuisine
    { a: 'Gordon Ramsay', b: 'Cyril Lignac', link: 'Chefs stars de la télé' },
  ],

  // ------------------------------------------------------------------
  // POKÉMON : évolutions, ressemblances et légendaires.
  // (Pas d'« univers » : tout vient de Pokémon. On se base sur la forme.)
  // ------------------------------------------------------------------
  pokemon: [
    // Évolutions (très proches)
    { a: 'Pichu', b: 'Pikachu', link: 'Bébé et évolution', hardcore: true },
    { a: 'Pikachu', b: 'Raichu', link: 'Évolution', hardcore: true },
    { a: 'Salamèche', b: 'Reptincel', link: 'Évolution', hardcore: true },
    { a: 'Reptincel', b: 'Dracaufeu', link: 'Évolution' },
    { a: 'Carapuce', b: 'Carabaffe', link: 'Évolution', hardcore: true },
    { a: 'Bulbizarre', b: 'Herbizarre', link: 'Évolution', hardcore: true },
    { a: 'Chenipan', b: 'Aspicot', link: 'Insectes du tout début', hardcore: true },
    { a: 'Roucool', b: 'Roucoups', link: 'Évolution', hardcore: true },
    { a: 'Rattata', b: 'Rattatac', link: 'Évolution', hardcore: true },
    { a: 'Abra', b: 'Kadabra', link: 'Évolution', hardcore: true },
    { a: 'Machoc', b: 'Machopeur', link: 'Évolution', hardcore: true },
    { a: 'Racaillou', b: 'Gravalanch', link: 'Évolution', hardcore: true },
    { a: 'Magnéti', b: 'Magnéton', link: 'Évolution', hardcore: true },
    { a: 'Osselait', b: 'Ossatueur', link: 'Évolution', hardcore: true },
    { a: 'Onix', b: 'Steelix', link: 'Évolution' },
    { a: 'Magicarpe', b: 'Léviator', link: 'Évolution spectaculaire' },
    { a: 'Minidraco', b: 'Draco', link: 'Évolution', hardcore: true },
    { a: 'Draco', b: 'Dracolosse', link: 'Évolution' },
    { a: 'Caninos', b: 'Arcanin', link: 'Évolution' },
    { a: 'Goupix', b: 'Feunard', link: 'Évolution' },
    { a: 'Sabelette', b: 'Sablaireau', link: 'Évolution', hardcore: true },
    { a: 'Tentacool', b: 'Tentacruel', link: 'Évolution', hardcore: true },
    { a: 'Stari', b: 'Staross', link: 'Évolution' },
    { a: 'Doduo', b: 'Dodrio', link: 'Évolution', hardcore: true },
    { a: 'Psykokwak', b: 'Akwakwak', link: 'Évolution', hardcore: true },
    { a: 'Miaouss', b: 'Persian', link: 'Évolution' },
    { a: 'Évoli', b: 'Aquali', link: 'Évolution' },
    { a: 'Léveinard', b: 'Leuphorie', link: 'Évolution' },

    // Ressemblances et légendaires
    { a: 'Pikachu', b: 'Évoli', link: 'Mascottes adorables' },
    { a: 'Nidoran mâle', b: 'Nidoran femelle', link: 'Mâle et femelle', hardcore: true },
    { a: 'Mélofée', b: 'Rondoudou', link: 'Roses et tout mignons' },
    { a: 'Mewtwo', b: 'Mew', link: 'Le clone et son original', hardcore: true },
    { a: 'Artikodin', b: 'Sulfura', link: 'Oiseaux légendaires de Kanto' },
    { a: 'Artikodin', b: 'Électhor', link: 'Oiseaux légendaires de Kanto' },
    { a: 'Insécateur', b: 'Cizayox', link: 'Mantes à lames tranchantes' },
    { a: 'Fantominus', b: 'Ectoplasma', link: 'Spectres violets' },
    { a: 'Dracaufeu', b: 'Tortank', link: 'Starters finaux rivaux' },
    { a: 'Otaria', b: 'Lamantine', link: 'Phoques' },
    { a: 'Kokiyas', b: 'Crustabri', link: 'Coquillages' },
  ],

  // ------------------------------------------------------------------
  // LEAGUE OF LEGENDS : champions (rôle, lore, ressemblance) + éléments
  // du jeu (régions, objectifs, sorts, rangs...).
  // ------------------------------------------------------------------
  lol: [
    // Champions
    { a: 'Garen', b: 'Darius', link: 'Bruisers top : Demacia contre Noxus' },
    { a: 'Yasuo', b: 'Yone', link: 'Frères bretteurs', hardcore: true },
    { a: 'Zed', b: 'Shen', link: 'Ninjas, anciens frères du Kinkou' },
    { a: 'Zed', b: 'Kayn', link: 'Maître et élève' },
    { a: 'Jinx', b: 'Vi', link: 'Sœurs (Arcane)' },
    { a: 'Caitlyn', b: 'Vi', link: 'Duo de la police de Piltover' },
    { a: 'Lux', b: 'Garen', link: 'Frère et sœur Crownguard' },
    { a: 'Darius', b: 'Draven', link: 'Frères de Noxus' },
    { a: 'Nasus', b: 'Renekton', link: 'Frères de Shurima', hardcore: true },
    { a: 'Xayah', b: 'Rakan', link: 'Couple Vastaya' },
    { a: 'Leona', b: 'Diana', link: 'Soleil contre Lune' },
    { a: 'Kayle', b: 'Morgana', link: 'Sœurs jumelles', hardcore: true },
    { a: 'Aatrox', b: 'Varus', link: 'Darkins' },
    { a: "Cho'Gath", b: "Kog'Maw", link: 'Créatures du Néant' },
    { a: "Kha'Zix", b: "Rek'Sai", link: 'Créatures du Néant', hardcore: true },
    { a: 'Teemo', b: 'Tristana', link: 'Yordles de Bandle' },
    { a: 'Veigar', b: 'Lulu', link: 'Yordles mages' },
    { a: 'Master Yi', b: 'Wukong', link: 'Maître et disciple' },
    { a: 'Pyke', b: 'Gangplank', link: 'Pirates de Bilgewater' },
    { a: 'Twisted Fate', b: 'Graves', link: 'Vieux duo de Bilgewater' },
    { a: 'Senna', b: 'Lucian', link: 'Couple de chasseurs' },
    { a: 'Ashe', b: 'Sejuani', link: 'Reines rivales du Freljord' },
    { a: 'Volibear', b: 'Ornn', link: 'Demi-dieux frères du Freljord' },
    { a: 'Viktor', b: 'Jayce', link: 'Rivaux de Piltover/Zaun (Arcane)' },
    { a: 'Heimerdinger', b: 'Ziggs', link: 'Yordles inventeurs explosifs' },
    { a: 'Ahri', b: 'Evelynn', link: 'Séductrices mortelles' },
    { a: 'Lee Sin', b: 'Udyr', link: 'Moines au corps-à-corps' },
    { a: 'Soraka', b: 'Sona', link: 'Supports soigneuses' },

    // Hors champions : régions, objectifs, sorts, rangs
    { a: 'Demacia', b: 'Noxus', link: 'Royaumes rivaux' },
    { a: 'Piltover', b: 'Zaun', link: 'Cités jumelles (haut et bas)' },
    { a: 'Baron Nashor', b: 'Dragon', link: 'Objectifs épiques' },
    { a: 'Dragon', b: 'Héraut de la Faille', link: 'Objectifs de la jungle' },
    { a: 'Nexus', b: 'Inhibiteur', link: 'Structures à détruire' },
    { a: 'Flash', b: 'Téléportation', link: "Sorts d'invocateur" },
    { a: 'Smite', b: 'Flash', link: "Sorts d'invocateur" },
    { a: 'Gromp', b: 'Krug', link: 'Camps de jungle' },
    { a: 'Fer', b: 'Bronze', link: 'Rangs les plus bas', hardcore: true },
    { a: 'Diamant', b: 'Maître', link: 'Hauts rangs' },
  ],

  // ------------------------------------------------------------------
  // CATÉGORIES DU MONDE RÉEL : on se base sur la RESSEMBLANCE.
  // (Pas d'« univers » : on s'appuie sur la forme, le nom, la proximité.)
  // ------------------------------------------------------------------
  pays: [
    { a: 'Slovénie', b: 'Slovaquie', link: 'Noms presque identiques', hardcore: true },
    { a: 'Autriche', b: 'Australie', link: 'Noms que tout le monde confond', hardcore: true },
    { a: 'Suède', b: 'Suisse', link: 'Noms proches', hardcore: true },
    { a: 'Iran', b: 'Irak', link: 'Voisins aux noms proches', hardcore: true },
    { a: 'Niger', b: 'Nigéria', link: 'Voisins aux noms proches', hardcore: true },
    { a: 'Monaco', b: 'Indonésie', link: 'Drapeaux rouge-blanc identiques' },
    { a: 'Tchad', b: 'Roumanie', link: 'Drapeaux quasi identiques', hardcore: true },
    { a: 'Pays-Bas', b: 'Luxembourg', link: 'Drapeaux bleu-blanc-rouge proches' },
    { a: 'Norvège', b: 'Islande', link: 'Drapeaux nordiques à croix' },
    { a: 'Corée du Nord', b: 'Corée du Sud', link: 'Pays divisé en deux' },
    { a: 'Espagne', b: 'Portugal', link: 'Voisins de la péninsule ibérique' },
    { a: 'Argentine', b: 'Uruguay', link: 'Voisins bleu et blanc' },
    { a: 'Mali', b: 'Sénégal', link: 'Drapeaux verts-jaunes-rouges' },
    { a: 'Belgique', b: 'Allemagne', link: 'Drapeaux à trois bandes' },
    { a: 'Émirats arabes unis', b: 'Qatar', link: 'Voisins riches du Golfe' },
    { a: 'République Tchèque', b: 'Slovaquie', link: 'Ex-Tchécoslovaquie' },
    { a: 'Suisse', b: 'Autriche', link: 'Voisins alpins germanophones' },
    { a: 'Maroc', b: 'Tunisie', link: "Pays du Maghreb" },
  ],

  objets: [
    // --- Ajouts : ressemblances de forme / fonction ---
    { a: 'Fourchette', b: 'Râteau', link: 'Des dents alignées' },
    { a: 'Brosse à dents', b: 'Pinceau', link: 'Un manche avec des poils au bout' },
    { a: 'Aimant', b: 'Fer à cheval', link: 'Forme en U' },
    { a: 'Bouée', b: 'Donut', link: 'Ronds avec un trou au milieu' },
    { a: 'CD', b: 'Vinyle', link: 'Disques de musique' },
    { a: 'Sablier', b: 'Horloge', link: 'Mesurent le temps' },
    { a: 'Échelle', b: 'Escalier', link: 'Pour monter' },
    { a: 'Clé', b: 'Tournevis', link: "Des objets qu'on tourne" },
    { a: 'Cadenas', b: 'Serrure', link: 'Se ferment à clé' },
    { a: 'Miroir', b: 'Fenêtre', link: 'Surfaces de verre encadrées' },
    { a: 'Ballon', b: 'Globe terrestre', link: 'Sphères' },
    { a: 'Pile', b: 'Batterie', link: "Stockent de l'énergie" },
    { a: 'Bouclier', b: 'Couvercle', link: "Un disque qu'on tient pour se protéger" },
    { a: 'Épée', b: 'Katana', link: 'Armes blanches' },
    { a: 'Guitare', b: 'Banjo', link: 'Instruments à cordes pincées' },
    { a: 'Violon', b: 'Alto', link: 'Instruments à cordes frottées', hardcore: true },
    { a: 'Vélo', b: 'Moto', link: 'Deux-roues' },
    { a: 'Téléphone', b: 'Tablette', link: 'Écrans tactiles' },
    { a: 'Lunettes', b: 'Jumelles', link: 'Optique pour les yeux' },
    { a: 'Bougie', b: 'Lampe', link: 'Sources de lumière' },
    { a: 'Parapluie', b: 'Parasol', link: 'Se déplient au-dessus de la tête', hardcore: true },
    { a: 'Marteau', b: 'Maillet', link: 'Outils de frappe', hardcore: true },
    { a: 'Tasse', b: 'Mug', link: 'Pour boire chaud', hardcore: true },
    { a: 'Couteau', b: 'Cutter', link: 'Lames coupantes' },
    { a: 'Crayon', b: 'Stylo', link: 'De quoi écrire' },
    { a: 'Casquette', b: 'Chapeau', link: 'Couvre-chefs' },
    { a: 'Canapé', b: 'Fauteuil', link: 'Sièges confortables' },
    { a: 'Montre', b: 'Bracelet', link: 'Au poignet' },
    { a: 'Balai', b: 'Serpillère', link: 'Pour le ménage' },
    { a: 'Pelle', b: 'Pioche', link: 'Outils de jardin' },
    { a: 'Valise', b: 'Sac à dos', link: 'Pour transporter ses affaires' },
    { a: 'Chaussure', b: 'Pantoufle' },
    { a: 'Voiture', b: 'Moto' },
    { a: "Ceinture", b: "Fouet", link: "Peuvent servir à la même chose" },
  ],

  nourriture: [
    { a: 'Frites', b: 'Chips', link: 'À base de pomme de terre' },
    { a: 'Crêpe', b: 'Pancake', link: 'Pâte cuite à la poêle', hardcore: true },
    { a: 'Gaufre', b: 'Crêpe', link: 'Pâte sucrée du goûter' },
    { a: 'Burger', b: 'Sandwich', link: 'Garni entre du pain' },
    { a: 'Pizza', b: 'Tarte', link: 'Ronds et garnis' },
    { a: 'Thé', b: 'Café', link: 'Boissons chaudes' },
    { a: 'Coca', b: 'Pepsi', link: 'Sodas bruns', hardcore: true },
    { a: 'Glace', b: 'Sorbet', link: 'Desserts glacés', hardcore: true },
    { a: 'Confiture', b: 'Miel', link: 'À tartiner sur le pain' },
    { a: 'Beurre', b: 'Margarine', link: 'À tartiner, jaune', hardcore: true },
    { a: 'Pâtes', b: 'Nouilles', link: 'Se ressemblent', hardcore: true },
    { a: 'Riz', b: 'Quinoa', link: 'Féculents en grains' },
    { a: 'Citron', b: 'Citron vert', link: 'Agrumes acides', hardcore: true },
    { a: 'Mandarine', b: 'Clémentine', link: 'Petits agrumes presque jumeaux', hardcore: true },
    { a: 'Chocolat', b: 'Caramel', link: 'Sucreries fondantes' },
    { a: 'Croissant', b: 'Pain au chocolat', link: 'Viennoiseries du matin' },
    { a: 'Ketchup', b: 'Sauce tomate', link: 'Rouges et tomatées' },
    { a: 'Macaron', b: 'Meringue', link: 'Petites douceurs aux blancs en neige' },
    { a: 'Eau', b: 'Glace', link: 'Les mêmes' },
  ],

  animaux: [
    { a: 'Léopard', b: 'Guépard', link: 'Félins tachetés rapides', hardcore: true },
    { a: 'Crocodile', b: 'Alligator', link: 'Grands reptiles à dents', hardcore: true },
    { a: 'Lapin', b: 'Lièvre', link: 'Se ressemblent, longues oreilles', hardcore: true },
    { a: 'Grenouille', b: 'Crapaud', link: 'Amphibiens sauteurs', hardcore: true },
    { a: 'Âne', b: 'Mulet', link: 'Équidés à grandes oreilles' },
    { a: 'Dauphin', b: 'Marsouin', link: 'Petits cétacés', hardcore: true },
    { a: 'Abeille', b: 'Guêpe', link: 'Insectes jaunes et noirs', hardcore: true },
    { a: 'Corbeau', b: 'Corneille', link: 'Oiseaux noirs', hardcore: true },
    { a: 'Loup', b: 'Chien', link: 'Canidés' },
    { a: 'Phoque', b: 'Otarie', link: 'Mammifères marins à moustaches', hardcore: true },
    { a: 'Singe', b: 'Chimpanzé', link: 'Primates' },
    { a: 'Souris', b: 'Rat', link: 'Rongeurs à longue queue' },
    { a: 'Aigle', b: 'Faucon', link: 'Rapaces' },
    { a: 'Mouton', b: 'Chèvre', link: 'Animaux de la ferme' },
    { a: 'Escargot', b: 'Limace', link: "L'un a une coquille, pas l'autre" },
    { a: 'Tortue', b: 'Tortue de mer', link: 'Carapaces' },
    { a: 'Papillon', b: 'Papillon de nuit', link: 'Lépidoptères', hardcore: true },
    { a: 'Cerf', b: 'Renne', link: 'Cervidés à bois' },
  ],
}

/**
 * Renvoie toutes les paires d'une liste de catégories (en aplatissant le mix).
 * Inclut aussi les CARTES PERSONNALISÉES (créées dans la bibliothèque, stockées
 * dans le navigateur) dont la catégorie correspond.
 */
export function poolForCategories(categoryIds) {
  const ids =
    !categoryIds || categoryIds.length === 0 || categoryIds.includes('mix')
      ? Object.keys(WORD_DATA)
      : categoryIds

  const pool = []
  ids.forEach((id) => {
    if (WORD_DATA[id]) {
      WORD_DATA[id].forEach((pair) => pool.push({ ...pair, category: id }))
    }
  })

  // Cartes perso (locales) : on les ajoute si leur catégorie est demandée.
  loadCustomPairs().forEach((p) => {
    if (p && p.a && p.b && ids.includes(p.category)) pool.push({ ...p })
  })

  return pool
}

/** Nombre total de paires (base + cartes perso) pour l'affichage. */
export function totalPairs() {
  const base = Object.values(WORD_DATA).reduce((sum, arr) => sum + arr.length, 0)
  return base + loadCustomPairs().length
}
