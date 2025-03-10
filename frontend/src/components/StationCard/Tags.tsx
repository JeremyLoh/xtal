import { useStationCardContext } from "./StationCardContext.ts"
import Pill from "../Pill/Pill.tsx"

const Tags = function StationCardTags() {
  const { station } = useStationCardContext()
  return (
    station.tags != "" &&
    station.tags.split(",").length > 0 && (
      <div className="station-card-tag-container">
        {station.tags.split(",").map((tag, index) => (
          <Pill key={`${tag}-${index}`}>{tag}</Pill>
        ))}
      </div>
    )
  )
}

export default Tags
