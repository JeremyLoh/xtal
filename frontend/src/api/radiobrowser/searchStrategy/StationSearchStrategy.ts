import { Station } from "../types"

export interface StationSearchStrategy {
  findStations: (abortController: AbortController) => Promise<Station[] | null>
}
