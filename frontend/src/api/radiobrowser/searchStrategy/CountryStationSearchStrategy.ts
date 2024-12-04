import { StationSearchStrategy } from "./StationSearchStrategy"
import { CountryStation } from "../../location/countryStation"
import { Station } from "../types"
import { getRandomServer } from "../servers"
import { getStation } from "../station"

export class CountryStationSearchStrategy implements StationSearchStrategy {
  private country: CountryStation

  constructor(country: CountryStation) {
    this.country = country
  }

  async findStation(abortController: AbortController): Promise<Station | null> {
    // offset needs to be different for each call of findStation
    const offset = this.getRandomInt(this.country.stationCount)
    const countryCode = this.country.countryCode
    const limit = 3
    const searchParams = new URLSearchParams(
      `countrycode=${countryCode}&order=random&limit=${limit}&offset=${offset}`
    )
    const server = await getRandomServer()
    const url = `${server}/json/stations/search`
    return await getStation(abortController, url, searchParams)
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }
}
