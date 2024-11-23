import "./RadioCard.css"
import RadioPlayer from "../../../player/components/RadioPlayer/RadioPlayer"
import { Station } from "../../../../api/radiobrowser/types"

type RadioCardProps = {
  station: Station
}

// Display radio player on map as a popup
function RadioCard(props: RadioCardProps) {
  const { station } = props
  // https://videojs.com/guides/options/
  const options = {
    audioOnlyMode: true,
    autoplay: false,
    controls: true,
    fill: true,
    sources: [
      {
        src: station.url_resolved,
        type: "audio/mpeg",
      },
    ],
    controlBar: {
      // Define order of elements in the video-js control bar
      // https://docs.videojs.com/control-bar_control-bar.js
      children: {
        playToggle: true,
        volumePanel: true,
        liveDisplay: true,
        audioTrackButton: true,
      },
    },
  }
  function handleReady() {}
  return (
    <div className="radio-card">
      <img src={station.favicon} height={128} width={128} />
      <h2>{station.name}</h2>
      <a href={station.homepage} rel="noopener noreferrer" target="_blank">
        {station.homepage}
      </a>
      {station.tags && <p># {station.tags}</p>}
      <p>From {station.country}</p>
      <RadioPlayer options={options} onReady={handleReady} />
    </div>
  )
}

export default RadioCard
