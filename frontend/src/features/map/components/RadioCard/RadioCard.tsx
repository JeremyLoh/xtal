import "./RadioCard.css"
import { useState } from "react"
import { toast } from "sonner"
import RadioPlayer from "../../../player/components/RadioPlayer/RadioPlayer"
import { Station } from "../../../../api/radiobrowser/types"
import { FaMapMarkerAlt } from "react-icons/fa"

type RadioCardProps = {
  station: Station
}

// Display radio player on map as a popup
function RadioCard(props: RadioCardProps) {
  const { station } = props
  const [error, setError] = useState<string | null>(null)
  // https://videojs.com/guides/options/
  const options = {
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
        liveDisplay: true,
        volumePanel: true,
        audioTrackButton: true,
      },
    },
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
      {station.favicon && (
        <img src={station.favicon} height={128} width={128} />
      )}
      <h2>{station.name}</h2>
      {station.tags && (
        <div className="station-tag-container">
          {station.tags.split(",").map((tag, index) => (
            <span className="station-tag" key={`${tag}-${index}`}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <a href={station.homepage} rel="noopener noreferrer" target="_blank">
        {station.homepage}
      </a>
      {station.country && (
        <p>
          <FaMapMarkerAlt size={16} /> {station.country}
        </p>
      )}
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
