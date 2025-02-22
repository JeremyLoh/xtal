import "./FavouriteStationCard.css"
import { FaMapLocationDot } from "react-icons/fa6"
import { Station } from "../../../api/radiobrowser/types.ts"
import StationCard from "../../../components/StationCard/StationCard.tsx"
import useClipboard from "../../../hooks/useClipboard.ts"

type FavouriteStationCardProps = {
  station: Station
  handleRemoveFavouriteStation: (station: Station) => void
  handleLoadStation: (station: Station) => void
}

function FavouriteStationCard({
  station,
  handleRemoveFavouriteStation,
  handleLoadStation,
}: FavouriteStationCardProps) {
  const { copyRadioStationShareUrl } = useClipboard()

  function handleShareStation() {
    copyRadioStationShareUrl(station)
  }
  return (
    <div className="favourite-station">
      <StationCard station={station}>
        <StationCard.Icon />
        <StationCard.Title />
        <StationCard.Country />
        <StationCard.Tags />
        <div className="favourite-station-actions">
          <button
            className="remove-favourite-station-btn"
            title="Remove from favourites"
            onClick={() => handleRemoveFavouriteStation(station)}
          >
            <StationCard.FavouriteIconFilled />
          </button>
          <button
            className="favourite-station-share-button"
            title="Share Station"
            onClick={handleShareStation}
          >
            <StationCard.ShareIcon />
          </button>
          <button
            className="favourite-station-load-button"
            title="Load Station"
            onClick={() => handleLoadStation(station)}
          >
            <FaMapLocationDot size={20} />
          </button>
        </div>
      </StationCard>
    </div>
  )
}

export default FavouriteStationCard
