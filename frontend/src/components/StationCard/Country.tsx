import { FaMapMarkerAlt } from "react-icons/fa"
import { useStationCardContext } from "./StationCardContext.ts"

const Country = function StationCardCountry() {
  const { station } = useStationCardContext()
  return (
    station.country && (
      <p className="station-card-country">
        <FaMapMarkerAlt size={16} />
        {station.country}
      </p>
    )
  )
}

export default Country
