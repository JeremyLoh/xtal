import "./RadioCard.css"
import { lazy, useCallback, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { Station } from "../../../api/radiobrowser/types.ts"
import { FavouriteStationsContext } from "../../../context/FavouriteStationsProvider/FavouriteStationsProvider.tsx"
import useClipboard from "../../../hooks/useClipboard.ts"
import StationCard from "../../../components/StationCard/index.tsx"
import { getEnv } from "../../../api/env/environmentVariables.ts"
const RadioPlayer = lazy(() => import("../../radio/player/RadioPlayer.tsx"))

type RadioCardProps = {
  station: Station
}

// Display radio player on map as a popup
function RadioCard(props: RadioCardProps) {
  const { station } = props
  const { copyRadioStationShareUrl } = useClipboard()
  const favouriteStationsContext = useContext(FavouriteStationsContext)
  const [error, setError] = useState<string | null>(null)
  const [isFavourite, setFavourite] = useState<boolean>(
    favouriteStationsContext
      ?.getFavouriteStations()
      .some((s: Station) => s.stationuuid === station.stationuuid) || false
  )

  useEffect(() => {
    // handle favourite station change by other components
    setFavourite(
      favouriteStationsContext
        ?.getFavouriteStations()
        .some((s: Station) => s.stationuuid === station.stationuuid) || false
    )
  }, [favouriteStationsContext, station.stationuuid])

  function handleFavouriteToggle() {
    const isRemoveStationAction = isFavourite
    const previousStations =
      favouriteStationsContext?.getFavouriteStations() || []
    if (isRemoveStationAction) {
      favouriteStationsContext?.setFavouriteStations(
        previousStations.filter(
          (s: Station) => s.stationuuid !== station.stationuuid
        )
      )
      setFavourite(!isFavourite)
    } else {
      handleAddFavouriteStation(previousStations)
    }
  }

  function handleAddFavouriteStation(previousStations: Station[]) {
    const previousStationCount = previousStations.length
    const { MAX_FAVOURITE_STATIONS_ANONYMOUS } = getEnv()
    const isFavouriteStationLimitReached =
      MAX_FAVOURITE_STATIONS_ANONYMOUS != undefined &&
      previousStationCount + 1 === parseInt(MAX_FAVOURITE_STATIONS_ANONYMOUS)
    const isFavouriteStationBelowLimit =
      MAX_FAVOURITE_STATIONS_ANONYMOUS != undefined &&
      previousStationCount + 1 <= parseInt(MAX_FAVOURITE_STATIONS_ANONYMOUS)

    if (isFavouriteStationLimitReached) {
      toast.warning(
        `Favourite station limit of ${MAX_FAVOURITE_STATIONS_ANONYMOUS} reached`
      )
      setFavourite(!isFavourite)
    }
    if (isFavouriteStationBelowLimit) {
      favouriteStationsContext?.setFavouriteStations([
        station,
        ...previousStations,
      ])
      setFavourite(!isFavourite)
    } else {
      toast.error(
        `Could not add favourite station. Exceeded limit of ${MAX_FAVOURITE_STATIONS_ANONYMOUS}`
      )
    }
  }

  const handleShareStation = useCallback(() => {
    copyRadioStationShareUrl(station)
  }, [copyRadioStationShareUrl, station])

  const handleError = useCallback(() => {
    setError(
      "The media could not be loaded. Server failed or the playback format is not supported"
    )
    toast.error("Could not play radio station")
  }, [])

  return (
    <div className="radio-card">
      <StationCard station={station}>
        <div className="radio-card-actions">
          <span
            title={`${isFavourite ? "Remove" : "Add"} Station to Favourites`}
            onClick={handleFavouriteToggle}
            className="favourite-icon"
          >
            {isFavourite ? (
              <StationCard.FavouriteIconFilled />
            ) : (
              <StationCard.FavouriteIconOutline />
            )}
          </span>
          <span title="Share Station Link" onClick={handleShareStation}>
            <StationCard.ShareIcon />
          </span>
        </div>
        <StationCard.Icon />
        <StationCard.Title />
        <StationCard.Bitrate />
        <StationCard.Tags />
        <StationCard.Country />
        <StationCard.HomepageLink />
      </StationCard>
      {error ? (
        <p
          className="error-text radio-card-error-text"
          data-testid="radio-card-playback-error"
        >
          {error}
        </p>
      ) : (
        <RadioPlayer source={station.url_resolved} onError={handleError} />
      )}
    </div>
  )
}

export default RadioCard
