import { useStationCardContext } from "./StationCardContext.ts"

const Title = function StationCardTitle() {
  const { station } = useStationCardContext()
  return <h2 className="station-card-title">{station.name}</h2>
}

export default Title
