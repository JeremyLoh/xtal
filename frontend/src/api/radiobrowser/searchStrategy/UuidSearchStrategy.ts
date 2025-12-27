import { getRandomServer } from "../servers.ts"
import { getAllStations } from "../station.ts"
import { Station } from "../types.ts"
import { StationSearchStrategy } from "./StationSearchStrategy.ts"

export class UuidSearchStrategy implements StationSearchStrategy {
  private readonly stationuuid: string

  constructor(stationuuid: string) {
    this.stationuuid = stationuuid
  }

  async findStations(
    abortController: AbortController
  ): Promise<Station[] | null> {
    // API => https://at1.api.radio-browser.info/#Search_radio_stations_by_uuid
    const searchParams = new URLSearchParams(`uuids=${this.stationuuid}`)
    const server = await getRandomServer()
    const url = `${server}/json/stations/byuuid`
    return await getAllStations(abortController, url, searchParams)
  }
}
