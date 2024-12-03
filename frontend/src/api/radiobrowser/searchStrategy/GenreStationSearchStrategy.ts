import { GenreInformation } from "../genreTags"
import { getRandomServer } from "../servers"
import { getStation } from "../station"
import { Station } from "../types"
import { StationSearchStrategy } from "./StationSearchStrategy"

export class GenreStationSearchStrategy implements StationSearchStrategy {
  private searchParams: URLSearchParams

  constructor(genre: GenreInformation) {
    const tag = genre.searchTag
    const offset = this.getRandomInt(genre.approxStationCount)
    const limit = 3
    this.searchParams = new URLSearchParams(
      `?order=random&limit=${limit}&hidebroken=true&is_https=true&offset=${offset}&tag=${tag}`
    )
  }

  async findStation(abortController: AbortController): Promise<Station | null> {
    const server = await getRandomServer()
    const url = `${server}/json/stations/search`
    return await getStation(abortController, url, this.searchParams)
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }
}
