import { StationSearchStrategy } from "./StationSearchStrategy.ts"
import { CountryStation } from "../../location/countryStation.ts"
import { Station } from "../types.ts"
import { getRandomServer } from "../servers.ts"
import { getAllStations } from "../station.ts"

export class CountryStationSearchStrategy implements StationSearchStrategy {
  private country: CountryStation

  constructor(country: CountryStation) {
    this.country = country
  }

  async findStations(
    abortController: AbortController
  ): Promise<Station[] | null> {
    // offset needs to be different for each call of findStation
    const offset = this.getRandomInt(this.country.stationCount)
    const countryCode = this.country.countryCode
    const limit = 3
    const searchParams = new URLSearchParams(
      `countrycode=${countryCode}&order=random&limit=${limit}&offset=${offset}`
    )
    const server = await getRandomServer()
    const url = `${server}/json/stations/search`
    return await getAllStations(abortController, url, searchParams)
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }
}
