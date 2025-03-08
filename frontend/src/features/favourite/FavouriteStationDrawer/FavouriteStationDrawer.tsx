import "./FavouriteStationDrawer.css"
import { lazy, useCallback, useContext, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { GoStarFill } from "react-icons/go"
import Drawer from "../../../components/Drawer/Drawer.tsx"
import { Station } from "../../../api/radiobrowser/types.ts"
import { MapContext } from "../../../context/MapProvider/MapProvider.tsx"
import { FavouriteStationsContext } from "../../../context/FavouriteStationsProvider/FavouriteStationsProvider.tsx"
const FavouriteStationFilters = lazy(
  () => import("../FavouriteStationFilters/FavouriteStationFilters.tsx")
)
const FavouriteStationCard = lazy(
  () => import("../FavouriteStationCard/FavouriteStationCard.tsx")
)

type FavouriteStationFilters = {
  name: string
  countryCode: string
}

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
  const location = useLocation()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FavouriteStationFilters | null>(null)

  function handleRemoveFavouriteStation(station: Station) {
    if (favouriteStationsContext == null) {
      return
    }
    favouriteStationsContext.setFavouriteStations(
      favouriteStationsContext
        .getFavouriteStations()
        .filter((s: Station) => s.stationuuid !== station.stationuuid)
    )
  }
  function handleLoadStation(station: Station) {
    if (location.pathname.startsWith("/podcasts")) {
      navigate("/")
    }
    setOpen(false)
    mapContext?.setStation(station)
  }
  const handleFilterChange = useCallback((filters: FavouriteStationFilters) => {
    setFilters(filters)
  }, [])
  const filterFavouriteStations = useCallback(
    (station: Station) => {
      let isStationShown = true
      if (filters && filters.name !== "") {
        isStationShown =
          isStationShown &&
          station.name.toLowerCase().includes(filters.name.toLowerCase())
      }
      if (filters && filters.countryCode !== "") {
        isStationShown =
          isStationShown && station.countrycode === filters.countryCode
      }
      return isStationShown
    },
    [filters]
  )

  return (
    <Drawer title="Favourite Stations" open={open} setOpen={setOpen}>
      {favouriteStationsContext?.getFavouriteStations() &&
        favouriteStationsContext.getFavouriteStations().length > 0 && (
          <>
            <FavouriteStationFilters
              onChange={handleFilterChange}
              countries={favouriteStationsContext
                .getFavouriteStations()
                .map((station: Station) => {
                  return {
                    name: station.country,
                    countryCode: station.countrycode,
                  }
                })}
            />
            <hr />
          </>
        )}
      {favouriteStationsContext?.getFavouriteStations() &&
      favouriteStationsContext.getFavouriteStations().length > 0 ? (
        <div className="favourite-stations">
          {favouriteStationsContext
            .getFavouriteStations()
            .filter(filterFavouriteStations)
            .map((station: Station, index: number) => (
              <FavouriteStationCard
                key={`favourite-station-card-${station.stationuuid}-${index}`}
                station={station}
                onRemoveFavouriteStation={handleRemoveFavouriteStation}
                onLoadStation={handleLoadStation}
              />
            ))}
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
