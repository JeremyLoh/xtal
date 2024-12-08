import { getRandomServer } from "../servers"
import { getAllStations } from "../station"
import { Station } from "../types"
import { StationSearchStrategy } from "./StationSearchStrategy"

const criteriaToSearchParam = new Map<string, (value: string) => string>([
  ["name", (value: string) => `name=${value}`],
])

export type AdvancedStationSearchCriteria = {
  name: string
}

export class AdvancedStationSearchStrategy implements StationSearchStrategy {
  public searchCriteria: AdvancedStationSearchCriteria
  public limit: number
  public offset: number

  constructor(
    searchCriteria: AdvancedStationSearchCriteria,
    limit: number,
    offset: number
  ) {
    this.searchCriteria = searchCriteria
    this.limit = limit
    this.offset = offset
  }

  async findStations(
    abortController: AbortController
  ): Promise<Station[] | null> {
    const params = Object.entries(this.searchCriteria)
      .map(([key, value]) => {
        if (criteriaToSearchParam.has(key)) {
          const converter = criteriaToSearchParam.get(key)
          if (converter != null) {
            return converter(value)
          }
        }
        return null
      })
      .filter((value) => value != null)
      .join("&")
    const limitAndOffsetParam = `limit=${this.limit}&offset=${this.offset}`
    const searchParams = new URLSearchParams(
      params === "" ? limitAndOffsetParam : params + "&" + limitAndOffsetParam
    )
    const server = await getRandomServer()
    const url = `${server}/json/stations/search`
    return await getAllStations(abortController, url, searchParams)
  }
}
