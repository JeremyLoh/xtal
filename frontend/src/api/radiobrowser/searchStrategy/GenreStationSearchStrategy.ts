import { GenreInformation } from "../genreTags"
import { getRandomServer } from "../servers"
import { getAllStations } from "../station"
import { Station } from "../types"
import { StationSearchStrategy } from "./StationSearchStrategy"

export class GenreStationSearchStrategy implements StationSearchStrategy {
  private genre: GenreInformation

  constructor(genre: GenreInformation) {
    this.genre = genre
  }

  async findStations(
    abortController: AbortController
  ): Promise<Station[] | null> {
    // offset needs to be different for each call
    const offset = this.getRandomInt(this.genre.approxStationCount)
    const tag = this.genre.searchTag
    const limit = 3
    const searchParams = new URLSearchParams(
      tag !== ""
        ? `order=random&limit=${limit}&hidebroken=true&is_https=true&offset=${offset}&tag=${tag}`
        : `order=random&limit=${limit}&hidebroken=true&is_https=true&offset=${offset}`
    )
    const server = await getRandomServer()
    const url = `${server}/json/stations/search`
    return await getAllStations(abortController, url, searchParams)
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }
}
