import "./StationCard.css"
import { PropsWithChildren } from "react"
import { Station } from "../../api/radiobrowser/types.ts"
import { StationCardContext } from "./StationCardContext.ts"

export type StationCardProps = PropsWithChildren & {
  station: Station
}

export default function StationCard({ children, station }: StationCardProps) {
  return (
    <StationCardContext.Provider value={{ station }}>
      <div className="station-card">{children}</div>
    </StationCardContext.Provider>
  )
}
