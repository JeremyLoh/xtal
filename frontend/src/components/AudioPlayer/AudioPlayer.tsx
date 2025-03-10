import "./AudioPlayer.css"
import { memo, PropsWithChildren, useCallback, useRef, useState } from "react"
import {
  MediaControlBar,
  MediaController,
  MediaErrorDialog,
  MediaMuteButton,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react"

type AudioPlayerProps = PropsWithChildren & {
  source: string
}

function AudioPlayer({ source, children }: AudioPlayerProps) {
  const [error, setError] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleError = useCallback(() => {
    setError(source !== "")
  }, [source])

  const handlePlay = useCallback(() => {
    setError(false)
    if (audioRef.current) {
      audioRef.current.play()
    }
  }, [])

  return (
    <div className="audio-player">
      {children}
      <MediaController audio>
        {source && (
          <audio
            ref={audioRef}
            slot="media"
            src={source}
            onError={handleError}
            onCanPlay={handlePlay}
          ></audio>
        )}
        {error ? (
          <MediaErrorDialog />
        ) : (
          <MediaControlBar style={{ padding: "0 0.5rem", width: "100%" }}>
            <div className="mobile">
              <MediaPlayButton data-testid="audio-player-mobile-play-button" />
              <MediaSeekBackwardButton
                seekOffset={15}
                data-testid="audio-player-mobile-seek-backward-button"
              />
              <MediaPlaybackRateButton data-testid="audio-player-mobile-playback-rate-button" />
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
              <MediaSeekForwardButton
                seekOffset={15}
                data-testid="audio-player-desktop-seek-forward-button"
              />
              <MediaTimeRange data-testid="audio-player-desktop-time-range-button" />
              <MediaTimeDisplay
                showDuration
                data-testid="audio-player-desktop-time-display-button"
              />
              <MediaPlaybackRateButton data-testid="audio-player-desktop-playback-rate-button" />
              <MediaMuteButton data-testid="audio-player-desktop-mute-button" />
              <MediaVolumeRange data-testid="audio-player-desktop-volume-range-button" />
            </div>
          </MediaControlBar>
        )}
      </MediaController>
    </div>
  )
}

export default memo(AudioPlayer)
