import "./RadioPlayer.css"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
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
import HlsVideo from "hls-video-element/react"
import HlsVideoElement from "hls-video-element"
import useAudioMetadata from "../../../hooks/useAudioMetadata.ts"
import { Station } from "../../../api/radiobrowser/types.ts"

const controlBarStyle = { padding: "0 0.5rem", width: "100%" }

type RadioSource = {
  src: string
  type: "audio/aac" | "audio/mpeg" | "audio/ogg" | "hls" // handle .m3u8 streaming urls, need to display as hls video source
}

type RadioPlayerProps = {
  stationName: string
  source: RadioSource
  onError: () => void
  onReady?: () => void
}

function RadioPlayer({
  stationName,
  source,
  onError,
  onReady,
}: RadioPlayerProps) {
  const [error, setError] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hlsRef = useRef<HlsVideoElement | null>(null)
  const audioMetadata: MediaMetadataInit = useMemo(() => {
    if (stationName) {
      return {
        title: stationName,
        artist: "Xtal Radio",
        album: "Live Radio Stream",
      }
    }
    return {}
  }, [stationName])

  useAudioMetadata(source.type === "hls" ? hlsRef : audioRef, audioMetadata)

  const handleError = useCallback(() => {
    setError(source.src !== "")
    onError()
  }, [source, onError])

  const handlePlay = useCallback(() => {
    setError(false)
    if (audioRef.current && onReady) {
      onReady()
    } else if (hlsRef.current && onReady) {
      onReady()
    }
  }, [onReady])

  useEffect(() => {
    // Prevent stream from being loaded when player is closed - https://github.com/muxinc/media-elements/discussions/82
    let ref = null
    let audio = null
    if (hlsRef.current) {
      ref = hlsRef
    }
    if (audioRef.current) {
      audio = audioRef
    }
    return () => {
      if (ref && ref.current) {
        ref.current.src = ""
      }
      if (audio && audio.current) {
        audio.current.src = ""
      }
    }
  }, [])

  return (
    <div
      className="radio-player-container"
      data-testid="radio-player-container"
    >
      <div className="audio-player">
        <MediaController audio>
          {source && source.type !== "hls" ? (
            <audio
              ref={audioRef}
              slot="media"
              crossOrigin="anonymous"
              preload="auto"
              onError={handleError}
              onCanPlay={handlePlay}
            >
              <source src={source.src} type={source.type} />
            </audio>
          ) : (
            <HlsVideo
              ref={hlsRef}
              slot="media"
              crossOrigin="anonymous"
              preload="auto"
              src={source.src}
              onError={handleError}
              onCanPlay={handlePlay}
            />
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

function containsHlsAudio(url: string) {
  // need to check pathname, some urls might have query parameters
  try {
    const pathname = new URL(url).pathname
    return pathname.endsWith(".m3u8") || pathname.endsWith(".mp4")
  } catch {
    return false
  }
}

function getAudioSource(station: Station): RadioSource {
  if (containsHlsAudio(station.url_resolved)) {
    return { src: station.url_resolved, type: "hls" }
  }
  // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Containers
  const codecToType: Map<string, RadioSource["type"]> = new Map([
    ["AAC", "audio/aac"],
    ["AAC+", "audio/aac"],
    ["OGG", "audio/ogg"],
    ["MP3", "audio/mpeg"],
  ])
  const codec = station.codec ? station.codec.trim().toUpperCase() : ""
  if (codec != null && codec.includes(",")) {
    // handle multiple values in codec (e.g. "AAC,H.264"), find valid codec
    const codecs = codec.split(",").filter((c) => codecToType.has(c))
    const values = codecs.flatMap((c) => {
      if (codecToType == null || !codecToType.has(c)) {
        return []
      }
      return { src: station.url_resolved, type: codecToType.get(c) || "hls" }
    })
    return values[0]
  }
  if (codec != null && codecToType.has(codec)) {
    return {
      src: station.url_resolved,
      type: codecToType.get(codec) || "hls",
    }
  }
  return {
    src: station.url_resolved,
    type: "hls",
  }
}

export default memo(RadioPlayer)
// eslint-disable-next-line react-refresh/only-export-components
export { getAudioSource }
