import "./AudioPlayer.css"
import { PropsWithChildren } from "react"
import {
  MediaControlBar,
  MediaController,
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

function AudioPlayer(props: AudioPlayerProps) {
  return (
    <div className="audio-player">
      {props.children}
      <MediaController audio>
        <audio slot="media" src={props.source} autoPlay></audio>

        <MediaControlBar style={{ padding: "0 0.5rem" }}>
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
      </MediaController>
    </div>
  )
}

export default AudioPlayer
