import { useContext } from "react"
import { GoStarFill } from "react-icons/go"
import "./FavouriteStationDrawer.css"
import Drawer from "../../../components/Drawer/Drawer"
import { Station } from "../../../api/radiobrowser/types"
import { MapContext } from "../../../context/MapProvider/MapProvider"
import { FavouriteStationsContext } from "../../../context/FavouriteStationsProvider/FavouriteStationsProvider"
import FavouriteStationCard from "../FavouriteStationCard/FavouriteStationCard"

type FavouriteStationDrawerProps = {
  open: boolean
  setOpen: (isOpen: boolean) => void
}

function FavouriteStationDrawer({
  open,
  setOpen,
}: FavouriteStationDrawerProps) {
  const mapContext = useContext(MapContext)
  const favouriteStationsContext = useContext(FavouriteStationsContext)

  function handleRemoveFavouriteStation(station: Station) {
    favouriteStationsContext?.setFavouriteStations(
      favouriteStationsContext?.favouriteStations.filter(
        (s: Station) => s.stationuuid !== station.stationuuid
      )
    )
  }
  function handleLoadStation(station: Station) {
    setOpen(false)
    mapContext?.setStation(station)
  }
  return (
    <Drawer title="Favourite Stations" open={open} setOpen={setOpen}>
      {favouriteStationsContext?.favouriteStations &&
      favouriteStationsContext.favouriteStations.length > 0 ? (
        <div className="favourite-stations">
          {favouriteStationsContext.favouriteStations.map(
            (station: Station, index: number) => (
              <FavouriteStationCard
                key={`favourite-station-card-${station.stationuuid}-${index}`}
                station={station}
                handleRemoveFavouriteStation={handleRemoveFavouriteStation}
                handleLoadStation={handleLoadStation}
              />
            )
          )}
        </div>
      ) : (
        <p className="empty-favourites">
          <span className="no-favourite-text">No Favourites Yet</span>
          <br />
          <i className="add-favourite-station-info">
            Start by adding a new station using{" "}
            <GoStarFill size={24} color="#facc15" />
          </i>
        </p>
      )}
    </Drawer>
  )
}

export default FavouriteStationDrawer
