/**
 * BASE DE DONNÉES DE MOTS LIÉS
 * ----------------------------------------------------------------------------
 * Concept : chaque entrée est une PAIRE de mots « proches » mais distincts.
 *   - même univers / licence
 *   - même rôle ou type de personnage
 *   - rivaux, équivalents, déclinaisons...
 *
 * Au moment de générer une manche, on tire une paire puis on décide
 * aléatoirement lequel des deux est le « mot principal » (joueurs normaux)
 * et lequel est le « faux mot » (imposteur). Les deux sens fonctionnent.
 *
 * Champs d'une paire :
 *   a, b        -> les deux mots confusables (obligatoire)
 *   aFrom,bFrom -> l'ŒUVRE / l'univers d'origine de a et de b. Affiché sous le
 *                  mot lors de la distribution pour lever l'ambiguïté entre
 *                  personnages homonymes (ex: deux « Mewtwo »). (recommandé)
 *   hardcore    -> true si la différence est très subtile (mode hardcore)
 *
 * POUR ÉTENDRE : ajoutez un objet { a, aFrom, b, bFrom } dans la bonne
 * catégorie. Aucune autre modification n'est nécessaire ailleurs.
 * ----------------------------------------------------------------------------
 */

export const CATEGORIES = {
  films: { id: 'films', label: 'Films', icon: '🎬' },
  series: { id: 'series', label: 'Séries', icon: '📺' },
  anime: { id: 'anime', label: 'Anime', icon: '🍥' },
  jeux: { id: 'jeux', label: 'Jeux vidéo', icon: '🎮' },
  personnages: { id: 'personnages', label: 'Personnages fictifs', icon: '🦸' },
  mix: { id: 'mix', label: 'Mélange aléatoire', icon: '🎲' },
}

export const WORD_DATA = {
  anime: [
    { a: 'Naruto', aFrom: 'Naruto', b: 'Sasuke', bFrom: 'Naruto', hardcore: true },
    { a: 'Luffy', aFrom: 'One Piece', b: 'Zoro', bFrom: 'One Piece' },
    { a: 'Goku', aFrom: 'Dragon Ball', b: 'Vegeta', bFrom: 'Dragon Ball', hardcore: true },
    { a: 'Pikachu', aFrom: 'Pokémon', b: 'Raichu', bFrom: 'Pokémon', hardcore: true },
    { a: 'Itachi', aFrom: 'Naruto', b: 'Shisui', bFrom: 'Naruto', hardcore: true },
    { a: 'Ichigo', aFrom: 'Bleach', b: 'Renji', bFrom: 'Bleach' },
    { a: 'Eren', aFrom: "L'Attaque des Titans", b: 'Armin', bFrom: "L'Attaque des Titans" },
    { a: 'Levi', aFrom: "L'Attaque des Titans", b: 'Mikasa', bFrom: "L'Attaque des Titans" },
    { a: 'Tanjiro', aFrom: 'Demon Slayer', b: 'Zenitsu', bFrom: 'Demon Slayer' },
    { a: 'Gojo', aFrom: 'Jujutsu Kaisen', b: 'Geto', bFrom: 'Jujutsu Kaisen', hardcore: true },
    { a: 'Light', aFrom: 'Death Note', b: 'L', bFrom: 'Death Note' },
    { a: 'Edward Elric', aFrom: 'Fullmetal Alchemist', b: 'Alphonse Elric', bFrom: 'Fullmetal Alchemist', hardcore: true },
    { a: 'Saitama', aFrom: 'One Punch Man', b: 'Genos', bFrom: 'One Punch Man' },
    { a: 'Deku', aFrom: 'My Hero Academia', b: 'Bakugo', bFrom: 'My Hero Academia' },
    { a: 'Killua', aFrom: 'Hunter x Hunter', b: 'Gon', bFrom: 'Hunter x Hunter' },
    { a: 'Sailor Moon', aFrom: 'Sailor Moon', b: 'Sailor Mars', bFrom: 'Sailor Moon', hardcore: true },
    { a: 'Inuyasha', aFrom: 'Inuyasha', b: 'Sesshomaru', bFrom: 'Inuyasha', hardcore: true },
    { a: 'Asuka', aFrom: 'Evangelion', b: 'Rei', bFrom: 'Evangelion' },
    { a: 'Spike Spiegel', aFrom: 'Cowboy Bebop', b: 'Jet Black', bFrom: 'Cowboy Bebop' },
    { a: 'Yusuke', aFrom: 'Yu Yu Hakusho', b: 'Hiei', bFrom: 'Yu Yu Hakusho' },
    { a: 'Vash', aFrom: 'Trigun', b: 'Wolfwood', bFrom: 'Trigun' },
    { a: 'Guts', aFrom: 'Berserk', b: 'Griffith', bFrom: 'Berserk', hardcore: true },
    { a: 'Kenshin', aFrom: 'Kenshin le Vagabond', b: 'Sanosuke', bFrom: 'Kenshin le Vagabond' },
    { a: 'Mob', aFrom: 'Mob Psycho 100', b: 'Reigen', bFrom: 'Mob Psycho 100' },
    { a: 'Thorfinn', aFrom: 'Vinland Saga', b: 'Askeladd', bFrom: 'Vinland Saga' },
    { a: 'Senku', aFrom: 'Dr. Stone', b: 'Chrome', bFrom: 'Dr. Stone' },
  ],

  films: [
    { a: 'Iron Man', aFrom: 'Marvel (MCU)', b: 'Batman', bFrom: 'DC Comics' },
    { a: 'Dark Vador', aFrom: 'Star Wars', b: 'Kylo Ren', bFrom: 'Star Wars', hardcore: true },
    { a: 'Le Parrain', aFrom: 'Film de F. F. Coppola', b: 'Les Affranchis', bFrom: 'Film de M. Scorsese' },
    { a: 'Jurassic Park', aFrom: 'Film de S. Spielberg', b: 'King Kong', bFrom: 'Film de monstre' },
    { a: 'Titanic', aFrom: 'Film de James Cameron', b: 'Avatar', bFrom: 'Film de James Cameron' },
    { a: 'Joker', aFrom: 'DC / Batman', b: 'Bane', bFrom: 'DC / Batman' },
    { a: 'Indiana Jones', aFrom: 'Indiana Jones', b: 'Lara Croft', bFrom: 'Tomb Raider' },
    { a: 'Terminator', aFrom: 'Terminator', b: 'RoboCop', bFrom: 'RoboCop' },
    { a: 'Rocky', aFrom: 'Saga Rocky', b: 'Creed', bFrom: 'Saga Rocky / Creed', hardcore: true },
    { a: 'Le Seigneur des Anneaux', aFrom: 'Terre du Milieu (Tolkien)', b: 'Le Hobbit', bFrom: 'Terre du Milieu (Tolkien)', hardcore: true },
    { a: 'Harry Potter', aFrom: 'Wizarding World', b: 'Les Animaux Fantastiques', bFrom: 'Wizarding World', hardcore: true },
    { a: 'Gandalf', aFrom: 'Le Seigneur des Anneaux', b: 'Dumbledore', bFrom: 'Harry Potter' },
    { a: 'Neo', aFrom: 'Matrix', b: 'John Wick', bFrom: 'John Wick' },
    { a: 'Forrest Gump', aFrom: 'Film avec Tom Hanks', b: 'Cast Away', bFrom: 'Film avec Tom Hanks' },
    { a: 'Alien', aFrom: 'Alien', b: 'Predator', bFrom: 'Predator' },
    { a: 'Shrek', aFrom: 'Shrek (DreamWorks)', b: 'Fiona', bFrom: 'Shrek (DreamWorks)' },
    { a: "Buzz l'Éclair", aFrom: 'Toy Story (Pixar)', b: 'Woody', bFrom: 'Toy Story (Pixar)' },
    { a: 'Le Roi Lion', aFrom: 'Disney', b: 'Le Livre de la Jungle', bFrom: 'Disney' },
    { a: 'Spider-Man', aFrom: 'Marvel', b: 'Deadpool', bFrom: 'Marvel' },
    { a: 'Thanos', aFrom: 'Marvel', b: 'Galactus', bFrom: 'Marvel' },
    { a: 'Mad Max', aFrom: 'Mad Max', b: 'Fury Road', bFrom: 'Mad Max', hardcore: true },
    { a: 'James Bond', aFrom: '007', b: 'Jason Bourne', bFrom: 'Jason Bourne' },
    { a: 'Gladiator', aFrom: 'Film de Ridley Scott', b: 'Spartacus', bFrom: 'Péplum' },
    { a: 'E.T.', aFrom: 'Film de S. Spielberg', b: 'Wall-E', bFrom: 'Pixar' },
    { a: 'Inception', aFrom: 'Film de C. Nolan', b: 'Interstellar', bFrom: 'Film de C. Nolan', hardcore: true },
    { a: 'Pirates des Caraïbes', aFrom: 'Disney', b: 'Peter Pan', bFrom: 'Conte / Disney' },
  ],

  series: [
    { a: 'Breaking Bad', aFrom: 'Série AMC', b: 'Better Call Saul', bFrom: 'Spin-off de Breaking Bad', hardcore: true },
    { a: 'Walter White', aFrom: 'Breaking Bad', b: 'Saul Goodman', bFrom: 'Breaking Bad / Better Call Saul', hardcore: true },
    { a: 'Game of Thrones', aFrom: 'Westeros (HBO)', b: 'House of the Dragon', bFrom: 'Westeros (HBO)', hardcore: true },
    { a: 'Jon Snow', aFrom: 'Game of Thrones', b: 'Robb Stark', bFrom: 'Game of Thrones' },
    { a: 'Stranger Things', aFrom: 'Série Netflix', b: 'Dark', bFrom: 'Série Netflix (DE)' },
    { a: 'The Office', aFrom: 'Sitcom mockumentaire', b: 'Parks and Recreation', bFrom: 'Sitcom mockumentaire', hardcore: true },
    { a: 'Michael Scott', aFrom: 'The Office', b: 'Dwight Schrute', bFrom: 'The Office' },
    { a: 'Friends', aFrom: 'Sitcom (NBC)', b: 'How I Met Your Mother', bFrom: 'Sitcom (CBS)' },
    { a: 'Sherlock', aFrom: 'Série BBC', b: 'House', bFrom: 'Dr House (Fox)' },
    { a: 'The Witcher', aFrom: 'Fantasy Netflix', b: 'Shadow and Bone', bFrom: 'Fantasy Netflix' },
    { a: 'La Casa de Papel', aFrom: 'Série Netflix (ES)', b: 'Lupin', bFrom: 'Série Netflix (FR)' },
    { a: 'Peaky Blinders', aFrom: 'Série BBC', b: 'Boardwalk Empire', bFrom: 'Série HBO' },
    { a: 'Tommy Shelby', aFrom: 'Peaky Blinders', b: 'Alfie Solomons', bFrom: 'Peaky Blinders' },
    { a: 'The Mandalorian', aFrom: 'Star Wars (Disney+)', b: 'Boba Fett', bFrom: 'Star Wars (Disney+)' },
    { a: 'Daredevil', aFrom: 'Marvel', b: 'Punisher', bFrom: 'Marvel' },
    { a: 'Rick', aFrom: 'Rick et Morty', b: 'Morty', bFrom: 'Rick et Morty' },
    { a: 'Eleven', aFrom: 'Stranger Things', b: 'Max', bFrom: 'Stranger Things' },
    { a: 'Tony Soprano', aFrom: 'Les Soprano', b: 'Walter White', bFrom: 'Breaking Bad' },
    { a: 'The Boys', aFrom: 'Série Prime Video', b: 'Invincible', bFrom: 'Série animée Prime Video' },
    { a: 'Homelander', aFrom: 'The Boys', b: 'Omni-Man', bFrom: 'Invincible', hardcore: true },
    { a: 'Vikings', aFrom: 'Série History', b: 'The Last Kingdom', bFrom: 'Série BBC / Netflix' },
    { a: 'Squid Game', aFrom: 'Série Netflix (KR)', b: 'Alice in Borderland', bFrom: 'Série Netflix (JP)' },
    { a: 'Lost', aFrom: 'Série ABC', b: 'Yellowjackets', bFrom: 'Série Showtime' },
    { a: 'Arcane', aFrom: 'League of Legends (Netflix)', b: 'Cyberpunk Edgerunners', bFrom: 'Cyberpunk 2077 (Netflix)' },
    { a: 'Geralt', aFrom: 'The Witcher', b: 'Jaskier', bFrom: 'The Witcher' },
  ],

  jeux: [
    { a: 'Mario', aFrom: 'Super Mario (Nintendo)', b: 'Luigi', bFrom: 'Super Mario (Nintendo)', hardcore: true },
    { a: 'Sonic', aFrom: 'Sonic (Sega)', b: 'Shadow', bFrom: 'Sonic (Sega)', hardcore: true },
    { a: 'Link', aFrom: 'The Legend of Zelda', b: 'Zelda', bFrom: 'The Legend of Zelda' },
    { a: 'Kratos', aFrom: 'God of War', b: 'Atreus', bFrom: 'God of War' },
    { a: 'Master Chief', aFrom: 'Halo', b: 'Doom Slayer', bFrom: 'Doom' },
    { a: 'Geralt', aFrom: 'The Witcher', b: 'Ciri', bFrom: 'The Witcher' },
    { a: 'Aloy', aFrom: 'Horizon', b: 'Lara Croft', bFrom: 'Tomb Raider' },
    { a: 'Cloud', aFrom: 'Final Fantasy VII', b: 'Sephiroth', bFrom: 'Final Fantasy VII', hardcore: true },
    { a: 'Ezio', aFrom: "Assassin's Creed", b: 'Altaïr', bFrom: "Assassin's Creed", hardcore: true },
    { a: 'Nathan Drake', aFrom: 'Uncharted', b: 'Sully', bFrom: 'Uncharted' },
    { a: 'Pac-Man', aFrom: 'Arcade (Namco)', b: 'Dig Dug', bFrom: 'Arcade (Namco)' },
    { a: 'Donkey Kong', aFrom: 'Donkey Kong (Nintendo)', b: 'Diddy Kong', bFrom: 'Donkey Kong (Nintendo)', hardcore: true },
    { a: 'Steve', aFrom: 'Minecraft', b: 'Alex', bFrom: 'Minecraft', hardcore: true },
    { a: 'Creeper', aFrom: 'Minecraft', b: 'Enderman', bFrom: 'Minecraft' },
    { a: 'Pikachu', aFrom: 'Pokémon', b: 'Évoli', bFrom: 'Pokémon' },
    { a: 'Mewtwo', aFrom: 'Pokémon', b: 'Mew', bFrom: 'Pokémon', hardcore: true },
    { a: 'Ryu', aFrom: 'Street Fighter', b: 'Ken', bFrom: 'Street Fighter', hardcore: true },
    { a: 'Scorpion', aFrom: 'Mortal Kombat', b: 'Sub-Zero', bFrom: 'Mortal Kombat' },
    { a: 'Solid Snake', aFrom: 'Metal Gear', b: 'Big Boss', bFrom: 'Metal Gear', hardcore: true },
    { a: 'Crash Bandicoot', aFrom: 'Crash Bandicoot', b: 'Spyro', bFrom: 'Spyro the Dragon' },
    { a: 'Joel', aFrom: 'The Last of Us', b: 'Ellie', bFrom: 'The Last of Us' },
    { a: 'Arthur Morgan', aFrom: 'Red Dead Redemption', b: 'John Marston', bFrom: 'Red Dead Redemption', hardcore: true },
    { a: 'Bowser', aFrom: 'Super Mario (Nintendo)', b: 'Wario', bFrom: 'Super Mario (Nintendo)' },
    { a: 'Tracer', aFrom: 'Overwatch', b: 'Widowmaker', bFrom: 'Overwatch' },
    { a: 'Leon Kennedy', aFrom: 'Resident Evil', b: 'Chris Redfield', bFrom: 'Resident Evil' },
    { a: 'Vault Boy', aFrom: 'Fallout', b: 'Pip-Boy', bFrom: 'Fallout' },
  ],

  personnages: [
    { a: 'Superman', aFrom: 'DC Comics', b: 'Goku', bFrom: 'Dragon Ball' },
    { a: 'Sherlock Holmes', aFrom: 'A. Conan Doyle', b: 'Hercule Poirot', bFrom: 'Agatha Christie' },
    { a: 'Dracula', aFrom: 'Bram Stoker', b: 'Frankenstein', bFrom: 'Mary Shelley' },
    { a: 'Gandalf', aFrom: 'Le Seigneur des Anneaux', b: 'Merlin', bFrom: 'Légende arthurienne' },
    { a: 'Hulk', aFrom: 'Marvel', b: 'La Chose', bFrom: 'Marvel (4 Fantastiques)', hardcore: true },
    { a: 'Wonder Woman', aFrom: 'DC Comics', b: 'Captain Marvel', bFrom: 'Marvel' },
    { a: 'Joker', aFrom: 'DC / Batman', b: 'Le Pingouin', bFrom: 'DC / Batman' },
    { a: 'Wolverine', aFrom: 'Marvel (X-Men)', b: 'Sabretooth', bFrom: 'Marvel (X-Men)', hardcore: true },
    { a: 'Flash', aFrom: 'DC Comics', b: 'Quicksilver', bFrom: 'Marvel', hardcore: true },
    { a: 'Captain America', aFrom: 'Marvel', b: 'US Agent', bFrom: 'Marvel', hardcore: true },
    { a: 'Thor', aFrom: 'Mythologie nordique / Marvel', b: 'Hercule', bFrom: 'Mythologie grecque' },
    { a: 'Robin des Bois', aFrom: 'Légende anglaise', b: 'Zorro', bFrom: 'Pulp (J. McCulley)' },
    { a: 'Pinocchio', aFrom: 'Pinocchio (Collodi)', b: 'Geppetto', bFrom: 'Pinocchio (Collodi)' },
    { a: 'Aladdin', aFrom: 'Les Mille et Une Nuits', b: 'Sinbad', bFrom: 'Les Mille et Une Nuits' },
    { a: 'Tarzan', aFrom: 'E. R. Burroughs', b: 'Mowgli', bFrom: 'Le Livre de la Jungle' },
    { a: 'Cendrillon', aFrom: 'Conte / Disney', b: 'Blanche-Neige', bFrom: 'Conte / Disney' },
    { a: 'Hermione', aFrom: 'Harry Potter', b: 'Luna', bFrom: 'Harry Potter' },
    { a: 'Voldemort', aFrom: 'Harry Potter', b: 'Saroumane', bFrom: 'Le Seigneur des Anneaux' },
    { a: 'Catwoman', aFrom: 'DC Comics', b: 'Black Widow', bFrom: 'Marvel' },
    { a: 'Deadpool', aFrom: 'Marvel', b: 'Deathstroke', bFrom: 'DC Comics', hardcore: true },
    { a: 'Green Arrow', aFrom: 'DC Comics', b: 'Hawkeye', bFrom: 'Marvel', hardcore: true },
    { a: 'Doctor Strange', aFrom: 'Marvel', b: 'Constantine', bFrom: 'DC (Vertigo)' },
    { a: 'Magneto', aFrom: 'Marvel (X-Men)', b: 'Docteur Fatalis', bFrom: 'Marvel (4 Fantastiques)' },
    { a: 'Loki', aFrom: 'Marvel', b: 'Mystique', bFrom: 'Marvel (X-Men)' },
    { a: 'Aquaman', aFrom: 'DC Comics', b: 'Namor', bFrom: 'Marvel', hardcore: true },
  ],
}

/** Renvoie toutes les paires d'une liste de catégories (en aplatissant le mix). */
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
  return pool
}
