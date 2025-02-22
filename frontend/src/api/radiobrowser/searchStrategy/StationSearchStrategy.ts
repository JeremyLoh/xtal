import { Station } from "../types.ts"

export interface StationSearchStrategy {
  findStations: (abortController: AbortController) => Promise<Station[] | null>
}
