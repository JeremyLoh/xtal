import { BiSolidLike } from "react-icons/bi"
import Pill from "../Pill/Pill.tsx"
import { useStationCardContext } from "./StationCardContext.ts"

const Votes = function StationCardVotes() {
  const { station } = useStationCardContext()
  return (
    station.votes > 0 && (
      <Pill className="station-card-vote-pill" key="station-votes">
        <BiSolidLike size={18} aria-label="Station Vote Count" />{" "}
        {station.votes}
      </Pill>
    )
  )
}

export default Votes
