import { Station } from "../../../api/radiobrowser/types"
import StationCard from "../../../components/StationCard/StationCard"

type FavouriteStationCardProps = {
  station: Station
  handleRemoveFavouriteStation: (station: Station) => void
}

function FavouriteStationCard({
  station,
  handleRemoveFavouriteStation,
}: FavouriteStationCardProps) {
  return (
    <div
      key={`favourite-station-card-${station.stationuuid}`}
      className="favourite-station"
    >
      <StationCard station={station}>
        <StationCard.Icon />
        <StationCard.Title />
        <StationCard.Country />
        <StationCard.Tags />
        <button
          className="remove-favourite-station-btn"
          title="Remove from favourites"
          onClick={() => handleRemoveFavouriteStation(station)}
        >
          <StationCard.FavouriteIconFilled />
        </button>
      </StationCard>
    </div>
  )
}

export default FavouriteStationCard
