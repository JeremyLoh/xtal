import { IoLanguageSharp } from "react-icons/io5"
import { useStationCardContext } from "./StationCardContext.ts"
import Pill from "../Pill/Pill.tsx"

const Language = function StationCardLanguage() {
  const { station } = useStationCardContext()
  return (
    station.language &&
    station.language !== "" && (
      <Pill className="station-card-language-pill" key="station-language">
        <IoLanguageSharp size={18} />
        {station.language}
      </Pill>
    )
  )
}

export default Language
