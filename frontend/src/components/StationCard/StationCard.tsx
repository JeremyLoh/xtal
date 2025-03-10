import "./StationCard.css"
import { memo, PropsWithChildren, useMemo } from "react"
import { Station } from "../../api/radiobrowser/types.ts"
import { StationCardContext } from "./StationCardContext.ts"

export type StationCardProps = PropsWithChildren & {
  station: Station
}

export default memo(function StationCard({
  children,
  station,
}: StationCardProps) {
  const output = useMemo(() => {
    return { station }
  }, [station])

  return (
    <StationCardContext.Provider value={output}>
      <div className="station-card">{children}</div>
    </StationCardContext.Provider>
  )
})
