import { StationSearchStrategy } from "./StationSearchStrategy"
import { CountryStation } from "../../location/countryStation"
import { Station } from "../types"
import { getRandomServer } from "../servers"
import { getStation } from "../station"

export class CountryStationSearchStrategy implements StationSearchStrategy {
  private searchParams: URLSearchParams

  constructor(country: CountryStation) {
    const countryCode = country.countryCode
    const offset = this.getRandomInt(country.stationCount)
    const limit = 3
    this.searchParams = new URLSearchParams(
      `?countrycode=${countryCode}&order=random&limit=${limit}&offset=${offset}`
    )
  }

  async findStation(abortController: AbortController): Promise<Station | null> {
    const server = await getRandomServer()
    const url = `${server}/json/stations/search`
    console.log(this.searchParams.toString())
    return await getStation(abortController, url, this.searchParams)
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }
}
