import { Station } from "../types"

export interface StationSearchStrategy {
  findStation: (abortController: AbortController) => Promise<Station | null>
}
