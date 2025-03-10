import { useStationCardContext } from "./StationCardContext.ts"
import Pill from "../Pill/Pill.tsx"

const Bitrate = function StationCardBitrate() {
  const { station } = useStationCardContext()
  return station.bitrate > 0 ? (
    <Pill className="station-card-bitrate-pill" key="station-bitrate">
      {station.bitrate} kbps
    </Pill>
  ) : (
    <Pill className="station-card-bitrate-pill" key="station-bitrate">
      Unknown kbps
    </Pill>
  )
}

export default Bitrate
