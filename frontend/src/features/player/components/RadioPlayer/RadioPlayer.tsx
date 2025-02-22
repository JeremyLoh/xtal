import "./RadioPlayer.css"
import "video.js/dist/video-js.min.css"
import { useEffect, useRef } from "react"
// @ts-expect-error import smaller version of videojs to reduce bundle size
import videojs from "video.js/dist/alt/video.core.js"
import Player, { PlayerReadyCallback } from "video.js/dist/types/player"

// https://github.com/videojs/video.js/issues/8646
type RadioPlayerProps = {
  options: typeof videojs.options
  onReady: PlayerReadyCallback
  handleError: (error: string) => void
}

function RadioPlayer(props: RadioPlayerProps) {
  const { options, onReady, handleError } = props
  const videoRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<Player | null>(null)
  useEffect(() => {
    if (!(playerRef.current == null && videoRef.current)) {
      return
    }
    // Video.js player needs to be inside the component el for React 18 Strict Mode
    const videoElement = document.createElement("video-js")
    videoElement.classList.add("vjs-big-play-centered")
    videoRef.current.appendChild(videoElement)

    playerRef.current = videojs(videoElement, options, onReady)
    if (playerRef.current) {
      playerRef.current.autoplay(options.autoplay)
      playerRef.current.src(options.sources)
      playerRef.current.on("error", () => {
        // https://stackoverflow.com/questions/30887908/how-to-write-error-message-object-of-videojs-on-server
        const errorMessage = playerRef.current?.error()?.message
        if (errorMessage) {
          handleError(errorMessage)
        }
      })
    }
  }, [options, onReady, handleError])
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
