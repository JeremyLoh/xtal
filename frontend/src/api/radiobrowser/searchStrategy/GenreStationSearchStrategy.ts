import { GenreInformation } from "../genreTags"
import { getRandomServer } from "../servers"
import { getStation } from "../station"
import { StationSearchStrategy } from "./StationSearchStrategy"

function getGenreStationSearchStrategy(
  genre: GenreInformation
): StationSearchStrategy {
  const tag = genre.searchTag
  const offset = getRandomInt(genre.approxStationCount)
  const limit = 3
  const searchParams = new URLSearchParams(
    `?order=random&limit=${limit}&hidebroken=true&is_https=true&offset=${offset}&tag=${tag}`
  )
  return {
    findStation: async (abortController: AbortController) => {
      const server = await getRandomServer()
      const url = `${server}/json/stations/search`
      return await getStation(abortController, url, searchParams)
    },
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export { getGenreStationSearchStrategy }
