// List of tags - e.g. https://at1.api.radio-browser.info/json/tags?order=stationcount&reverse=true
export type GenreInformation = {
  genre: string
  searchTag: string
  approxStationCount: number
}

// total count from e.g. https://at1.api.radio-browser.info/json/stations/search?hidebroken=true&is_https=true
export const DEFAULT_GENRE_SEARCH: GenreInformation = {
  genre: "All",
  searchTag: "",
  approxStationCount: 30456,
}

// approximate station count is based on
// e.g https://at1.api.radio-browser.info/json/stations/search?&order=random&hidebroken=true&is_https=true&tag=ambient
export const genres: GenreInformation[] = [
  DEFAULT_GENRE_SEARCH,
  { genre: "Alternative", searchTag: "alternative", approxStationCount: 479 },
  { genre: "Ambient", searchTag: "ambient", approxStationCount: 218 },
  { genre: "Anime", searchTag: "anime", approxStationCount: 40 },
  { genre: "Acoustic", searchTag: "acoustic", approxStationCount: 18 },
  { genre: "Blues", searchTag: "blues", approxStationCount: 181 },
  { genre: "Breakcore", searchTag: "breakcore", approxStationCount: 3 },
  { genre: "Chill", searchTag: "chill", approxStationCount: 302 },
  { genre: "Classic Hits", searchTag: "classic hits", approxStationCount: 432 },
  { genre: "Classical", searchTag: "classical", approxStationCount: 879 },
  { genre: "Club", searchTag: "club", approxStationCount: 117 },
  { genre: "Dance", searchTag: "dance", approxStationCount: 905 },
  { genre: "Folk", searchTag: "folk", approxStationCount: 406 },
  { genre: "Gaming", searchTag: "game", approxStationCount: 25 },
  { genre: "Hip Hop", searchTag: "hip-hop", approxStationCount: 128 },
  { genre: "Hits", searchTag: "hits", approxStationCount: 1586 },
  { genre: "Indie", searchTag: "indie", approxStationCount: 254 },
  { genre: "Instrumental", searchTag: "instrumental", approxStationCount: 72 },
  { genre: "Jazz", searchTag: "jazz", approxStationCount: 639 },
  { genre: "J-pop", searchTag: "jpop", approxStationCount: 21 },
  { genre: "Jungle", searchTag: "jungle", approxStationCount: 26 },
  { genre: "Kids", searchTag: "kids", approxStationCount: 41 },
  { genre: "K-pop", searchTag: "k-pop", approxStationCount: 17 },
  { genre: "Latin", searchTag: "latin", approxStationCount: 1175 },
  { genre: "Lounge", searchTag: "lounge", approxStationCount: 208 },
  { genre: "Love", searchTag: "love", approxStationCount: 103 },
  { genre: "Metal", searchTag: "metal", approxStationCount: 226 },
  { genre: "Movie", searchTag: "movie", approxStationCount: 35 },
  { genre: "Nature", searchTag: "nature", approxStationCount: 13 },
  { genre: "News", searchTag: "news", approxStationCount: 1962 },
  { genre: "Piano", searchTag: "piano", approxStationCount: 55 },
  { genre: "Pop", searchTag: "pop", approxStationCount: 4221 },
  { genre: "Punk", searchTag: "punk", approxStationCount: 110 },
  { genre: "R&B", searchTag: "rnb", approxStationCount: 124 },
  { genre: "Rock", searchTag: "rock", approxStationCount: 2584 },
  { genre: "Shoegaze", searchTag: "shoegaze", approxStationCount: 7 },
  { genre: "Sleep", searchTag: "sleep", approxStationCount: 15 },
  { genre: "Soul", searchTag: "soul", approxStationCount: 262 },
  { genre: "Talk", searchTag: "talk", approxStationCount: 1164 },
  { genre: "1970s", searchTag: "70s", approxStationCount: 353 },
  { genre: "1980s", searchTag: "80s", approxStationCount: 711 },
  { genre: "1990s", searchTag: "90s", approxStationCount: 576 },
  { genre: "2000s", searchTag: "00s", approxStationCount: 269 },
  { genre: "2010s", searchTag: "2010s", approxStationCount: 91 },
]
