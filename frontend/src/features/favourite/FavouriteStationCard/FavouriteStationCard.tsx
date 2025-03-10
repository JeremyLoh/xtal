import "./FavouriteStationCard.css"
import { memo, useCallback } from "react"
import { FaMapLocationDot } from "react-icons/fa6"
import { Station } from "../../../api/radiobrowser/types.ts"
import StationCard from "../../../components/StationCard/index.tsx"
import useClipboard from "../../../hooks/useClipboard.ts"

type FavouriteStationCardProps = {
  station: Station
  onRemoveFavouriteStation: (station: Station) => void
  onLoadStation: (station: Station) => void
}

function FavouriteStationCard({
  station,
  onRemoveFavouriteStation,
  onLoadStation,
}: FavouriteStationCardProps) {
  const { copyRadioStationShareUrl } = useClipboard()

  const handleRemoveFavouriteStation = useCallback(() => {
    onRemoveFavouriteStation(station)
  }, [onRemoveFavouriteStation, station])

  const handleShareStation = useCallback(() => {
    copyRadioStationShareUrl(station)
  }, [copyRadioStationShareUrl, station])

  const handleLoadStation = useCallback(() => {
    onLoadStation(station)
  }, [onLoadStation, station])

  return (
    <div className="favourite-station">
      <StationCard station={station}>
        <StationCard.Icon />
        <StationCard.Title />
        <StationCard.Country />
        <StationCard.Tags />
        <div className="favourite-station-actions">
          <button
            className="remove-favourite-station-button"
            title="Remove from favourites"
            onClick={handleRemoveFavouriteStation}
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
            onClick={handleLoadStation}
          >
            <FaMapLocationDot size={20} />
          </button>
        </div>
      </StationCard>
    </div>
  )
}

export default memo(FavouriteStationCard)
