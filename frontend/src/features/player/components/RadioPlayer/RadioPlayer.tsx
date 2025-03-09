import "./RadioPlayer.css"
import { memo, useRef, useState } from "react"
import {
  MediaControlBar,
  MediaController,
  MediaErrorDialog,
  MediaMuteButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaTimeDisplay,
  MediaVolumeRange,
} from "media-chrome/react"

type RadioPlayerProps = {
  source: string
  onError: () => void
  onReady: () => void
}

function RadioPlayer(props: RadioPlayerProps) {
  const [error, setError] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function handleError() {
    setError(props.source !== "")
    props.onError()
  }
  function handlePlay() {
    setError(false)
    if (audioRef.current) {
      props.onReady()
    }
  }

  return (
    <div className="radio-player-container">
      <div className="audio-player">
        <MediaController audio>
          {props.source && (
            <audio
              ref={audioRef}
              slot="media"
              src={props.source}
              onError={handleError}
              onCanPlay={handlePlay}
            ></audio>
          )}
          {error ? (
            <>
              <MediaErrorDialog />
            </>
          ) : (
            <MediaControlBar style={{ padding: "0 0.5rem", width: "100%" }}>
              <div className="mobile">
                <MediaPlayButton data-testid="audio-player-mobile-play-button" />
                <MediaSeekBackwardButton
                  seekOffset={15}
                  data-testid="audio-player-mobile-seek-backward-button"
                />
                <MediaTimeDisplay
                  showDuration
                  data-testid="audio-player-mobile-time-display-button"
                />
                <MediaMuteButton data-testid="audio-player-mobile-mute-button" />
              </div>

              <div className="desktop">
                <MediaPlayButton data-testid="audio-player-desktop-play-button" />
                <MediaSeekBackwardButton
                  seekOffset={15}
                  data-testid="audio-player-desktop-seek-backward-button"
                />
                <MediaTimeDisplay
                  showDuration
                  data-testid="audio-player-desktop-time-display-button"
                />
                <MediaMuteButton data-testid="audio-player-desktop-mute-button" />
                <MediaVolumeRange data-testid="audio-player-desktop-volume-range-button" />
              </div>
            </MediaControlBar>
          )}
        </MediaController>
      </div>
    </div>
  )
}

export default memo(RadioPlayer)
