import { MdOutlineImageNotSupported } from "react-icons/md"
import { useStationCardContext } from "./StationCardContext.ts"

const Icon = function StationCardIcon() {
  const { station } = useStationCardContext()
  return station.favicon ? (
    <img
      className="station-card-icon"
      src={station.favicon}
      height={64}
      width={64}
    />
  ) : (
    <MdOutlineImageNotSupported
      className="station-card-icon"
      size={64}
      title="Icon Not Available"
    />
  )
}

export default Icon
