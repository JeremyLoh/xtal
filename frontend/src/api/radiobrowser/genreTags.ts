// List of tags - e.g. https://at1.api.radio-browser.info/json/tags?order=stationcount&reverse=true
export type GenreInformation = {
  genre: string
  searchTag: string
  approxStationCount: number
}

export const DEFAULT_GENRE_SEARCH: GenreInformation = {
  genre: "All",
  searchTag: "",
  approxStationCount: 28159,
}

// approximate station count is based on
// e.g https://at1.api.radio-browser.info/json/stations/search?&order=random&hidebroken=true&is_https=true&tag=ambient
export const genres: Array<GenreInformation> = [
  DEFAULT_GENRE_SEARCH,
  { genre: "Alternative", searchTag: "alternative", approxStationCount: 430 },
  { genre: "Ambient", searchTag: "ambient", approxStationCount: 198 },
  { genre: "Anime", searchTag: "anime", approxStationCount: 40 },
  { genre: "Acoustic", searchTag: "acoustic", approxStationCount: 14 },
  { genre: "Blues", searchTag: "blues", approxStationCount: 167 },
  { genre: "Breakcore", searchTag: "breakcore", approxStationCount: 1 },
  { genre: "Chill", searchTag: "chill", approxStationCount: 276 },
  { genre: "Classic Hits", searchTag: "classic hits", approxStationCount: 421 },
  { genre: "Classical", searchTag: "classical", approxStationCount: 901 },
  { genre: "Dance", searchTag: "dance", approxStationCount: 812 },
  { genre: "Folk", searchTag: "folk", approxStationCount: 380 },
  { genre: "Gaming", searchTag: "game", approxStationCount: 18 },
  { genre: "Hip Hop", searchTag: "hip-hop", approxStationCount: 112 },
  { genre: "Hits", searchTag: "hits", approxStationCount: 1433 },
  { genre: "Indie", searchTag: "indie", approxStationCount: 238 },
  { genre: "Instrumental", searchTag: "instrumental", approxStationCount: 63 },
  { genre: "Jazz", searchTag: "jazz", approxStationCount: 611 },
  { genre: "J-pop", searchTag: "jpop", approxStationCount: 21 },
  { genre: "Jungle", searchTag: "jungle", approxStationCount: 23 },
  { genre: "K-pop", searchTag: "k-pop", approxStationCount: 17 },
  { genre: "Latin", searchTag: "latin", approxStationCount: 1010 },
  { genre: "Lounge", searchTag: "lounge", approxStationCount: 197 },
  { genre: "Love", searchTag: "love", approxStationCount: 96 },
  { genre: "Metal", searchTag: "metal", approxStationCount: 204 },
  { genre: "Nature", searchTag: "nature", approxStationCount: 12 },
  { genre: "News", searchTag: "news", approxStationCount: 1816 },
  { genre: "Piano", searchTag: "piano", approxStationCount: 59 },
  { genre: "Pop", searchTag: "pop", approxStationCount: 3779 },
  { genre: "Punk", searchTag: "punk", approxStationCount: 109 },
  { genre: "R&B", searchTag: "rnb", approxStationCount: 110 },
  { genre: "Rock", searchTag: "rock", approxStationCount: 2313 },
  { genre: "Sleep", searchTag: "sleep", approxStationCount: 13 },
  { genre: "Soul", searchTag: "soul", approxStationCount: 236 },
  { genre: "1970s", searchTag: "70s", approxStationCount: 339 },
  { genre: "1980s", searchTag: "80s", approxStationCount: 663 },
  { genre: "1990s", searchTag: "90s", approxStationCount: 541 },
  { genre: "2000s", searchTag: "00s", approxStationCount: 234 },
  { genre: "2010s", searchTag: "2010s", approxStationCount: 63 },
]
