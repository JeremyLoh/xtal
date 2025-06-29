import "./AudioPlayer.css"
import {
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
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
import useAudioMetadata from "../../hooks/useAudioMetadata"

type AudioPlayerProps = PropsWithChildren & {
  source: string
  playFromTimestamp: number
  audioMetadata: MediaMetadataInit
  onPause: (currentTimeInSeconds: number) => void
  onEnded: (currentTimeInSeconds: number) => void
}

function AudioPlayer({
  source,
  playFromTimestamp,
  audioMetadata,
  onPause,
  onEnded,
  children,
}: AudioPlayerProps) {
  const [error, setError] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  useAudioMetadata(audioRef, audioMetadata)

  useEffect(() => {
    // Prevent stream from being loaded when player is closed - https://github.com/muxinc/media-elements/discussions/82
    let ref = null
    if (audioRef.current) {
      ref = audioRef
    }
    return () => {
      if (ref && ref.current) {
        ref.current.src = ""
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = playFromTimestamp
    }
  }, [playFromTimestamp])

  const controlBarStyle = useMemo(() => {
    return { padding: "0 0.5rem", width: "100%" }
  }, [])

  const handleError = useCallback(() => {
    setError(source !== "")
  }, [source])

  const handlePlay = useCallback(() => {
    setError(false)
    if (!audioRef.current) {
      return
    }
    audioRef.current
      .play()
      .then(() => {
        if (
          audioMetadata.title ||
          audioMetadata.artist ||
          audioMetadata.album
        ) {
          // write audio metadata for first play
          navigator.mediaSession.metadata = new MediaMetadata({
            title: audioMetadata.title ?? "",
            artist: audioMetadata.artist ?? "",
            album: audioMetadata.album ?? "",
          })
        }
      })
      .catch(() => {}) // ignore error from user autoplay blocked
  }, [audioMetadata.title, audioMetadata.artist, audioMetadata.album])

  const handlePause = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      if (disabled) {
        return
      }
      const target = e.target as HTMLAudioElement
      onPause(Math.floor(target.currentTime))

      setDisabled(true)
      setTimeout(() => {
        setDisabled(false)
      }, 5000) // rate limit calls to props.onPause()
    },
    [onPause, disabled]
  )

  const handleEnded = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      const target = e.target as HTMLAudioElement
      onEnded(Math.floor(target.duration))
    },
    [onEnded]
  )

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
            onPause={handlePause}
            onEnded={handleEnded}
          ></audio>
        )}
        {error ? (
          <MediaErrorDialog />
        ) : (
          <MediaControlBar style={controlBarStyle}>
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
