import "./RadioPlayer.css"
import "video.js/dist/video-js.css"
import { useEffect, useRef } from "react"
import videojs from "video.js"
import Player, { PlayerReadyCallback } from "video.js/dist/types/player"

// https://github.com/videojs/video.js/issues/8646
type RadioPlayerProps = {
  options: typeof videojs.options
  onReady: PlayerReadyCallback
}

function RadioPlayer(props: RadioPlayerProps) {
  const { options, onReady } = props
  const videoRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<Player | null>(null)
  useEffect(() => {
    if (playerRef.current == null && videoRef.current) {
      // Video.js player needs to be inside the component el for React 18 Strict Mode
      const videoElement = document.createElement("video-js")
      videoElement.classList.add("vjs-big-play-centered")
      videoRef.current.appendChild(videoElement)
      playerRef.current = videojs(videoElement, options, onReady)
    } else {
      const player = playerRef.current
      player?.autoplay(options.autoplay)
      player?.src(options.sources)
    }
  }, [options, onReady])
  // dispose Video.js player when component unmounts
  useEffect(() => {
    const player = playerRef.current
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])
  // Wrap the player in a `div` with `data-vjs-player` attribute, so Video.js won't create additional wrapper in the DOM
  // https://github.com/videojs/video.js/pull/3856
  return (
    <div data-vjs-player className="radio-player-container">
      <div ref={videoRef} />
    </div>
  )
}

export default RadioPlayer