import { createContext, useContext } from "react"
import { Station } from "../../api/radiobrowser/types.ts"

type StationCardContext = {
  station: Station
}

export const StationCardContext = createContext<StationCardContext | null>(null)

export function useStationCardContext() {
  const context = useContext(StationCardContext)
  if (!context) {
    throw new Error("useStationCardContext must be used within a StationCard")
  }
  return context
}
