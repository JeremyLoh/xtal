import "./RadioCard.css"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import RadioPlayer from "../../../player/components/RadioPlayer/RadioPlayer"
import { Station } from "../../../../api/radiobrowser/types"
import StationCard from "../../../../components/StationCard/StationCard"
import { FavouriteStationsContext } from "../../../../context/FavouriteStationsProvider/FavouriteStationsProvider"
import useClipboard from "../../../../hooks/useClipboard"

type RadioCardProps = {
  station: Station
}

// Display radio player on map as a popup
function RadioCard(props: RadioCardProps) {
  const { station } = props
  const { copyRadioStationShareUrl } = useClipboard()
  const options = getPlayerOptions(station)
  const favouriteStationsContext = useContext(FavouriteStationsContext)
  const [error, setError] = useState<string | null>(null)
  const [isFavourite, setFavourite] = useState<boolean>(
    favouriteStationsContext?.favouriteStations.some(
      (s: Station) => s.stationuuid === station.stationuuid
    ) || false
  )
  useEffect(() => {
    // handle favourite station change by other components
    setFavourite(
      favouriteStationsContext?.favouriteStations.some(
        (s: Station) => s.stationuuid === station.stationuuid
      ) || false
    )
  }, [favouriteStationsContext?.favouriteStations, station.stationuuid])

  function handleFavouriteToggle() {
    const isRemoveStationAction = isFavourite
    const previousStations = favouriteStationsContext?.favouriteStations || []
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
    const MAX_FAVOURITE_STATIONS_ANONYMOUS = import.meta.env
      .VITE_MAX_FAVOURITE_STATIONS_ANONYMOUS
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
  function handleShareStation() {
    copyRadioStationShareUrl(station)
  }
  function handleError(error: string) {
    setError(error)
    toast.error("Could not play radio station")
  }
  function handleReady() {
    toast.success("Found a new station!")
  }
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
        <p className="error-text" data-testid="radio-card-playback-error">
          {error}
        </p>
      ) : (
        <RadioPlayer
          options={options}
          onReady={handleReady}
          handleError={handleError}
        />
      )}
    </div>
  )
}

function getPlayerOptions(station: Station) {
  // https://videojs.com/guides/options/
  return {
    liveui: true,
    audioOnlyMode: true,
    errorDisplay: true,
    autoplay: false,
    controls: true,
    fill: true,
    sources: getAudioSources(station),
    controlBar: {
      // Define order of elements in the video-js control bar
      // https://docs.videojs.com/control-bar_control-bar.js
      children: {
        playToggle: true,
        currentTimeDisplay: true,
        volumePanel: true,
        fullscreenToggle: false,
      },
    },
  }
}

function getAudioSources(station: Station) {
  // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Containers
  const codecToType = new Map([
    ["AAC", ["audio/aac", "audio/x-mpegurl", "application/x-mpegURL"]],
    ["AAC+", ["audio/aac", "audio/x-mpegurl", "application/x-mpegURL"]],
    ["OGG", ["audio/ogg"]],
    ["MP3", ["audio/mpeg"]],
  ])
  const codec = station.codec ? station.codec.toUpperCase() : ""
  if (codecToType.has(codec)) {
    // @ts-expect-error codec has been checked to be in the map
    return codecToType.get(codec).map((codecTypes) => {
      return {
        src: station.url_resolved,
        type: codecTypes,
      }
    })
  }
  return [
    {
      src: station.url_resolved,
      type: "audio/aac",
    },
    {
      src: station.url_resolved,
      type: "audio/mpeg",
    },
    {
      src: station.url_resolved,
      type: "audio/ogg",
    },
    {
      src: station.url_resolved,
      type: "audio/x-mpegurl",
    },
    {
      src: station.url_resolved,
      type: "application/x-mpegURL",
    },
  ]
}

export default RadioCard
