import { getRandomServer } from "../servers.ts"
import { getAllStations } from "../station.ts"
import { Station } from "../types.ts"
import { StationSearchStrategy } from "./StationSearchStrategy.ts"

const criteriaToSearchParam = new Map<string, (value: string) => string | null>(
  [
    ["name", (value: string) => `name=${value}`],
    [
      "language",
      (value: string) => (value !== "" ? `language=${value}` : null),
    ],
    [
      "sort",
      (value: string) => (value !== "" ? `order=${value}&reverse=true` : null),
    ],
    ["tag", (value: string) => (value !== "" ? `tag=${value}` : null)],
  ]
)

export type AdvancedStationSearchCriteria = {
  name: string
  language: string
  sort: string
  tag: string
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
