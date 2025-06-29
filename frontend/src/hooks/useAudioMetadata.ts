import { RefObject, useEffect } from "react"

function useAudioMetadata(
  mediaRef: RefObject<HTMLMediaElement | null>,
  init: MediaMetadataInit
) {
  useEffect(() => {
    if (
      mediaRef == null ||
      mediaRef.current == null ||
      !("mediaSession" in navigator)
    ) {
      return
    }
    const media = mediaRef.current
    const handlePlay = () => {
      navigator.mediaSession.metadata = new MediaMetadata(init)
    }

    if (!media.paused) {
      handlePlay() // apply immediately only if the element is already playing
    }
    // reapply on every play / playing
    media.addEventListener("play", handlePlay, { once: true })
    media.addEventListener("playing", handlePlay)

    return () => {
      media.removeEventListener("play", handlePlay)
      media.removeEventListener("playing", handlePlay)
    }
  }, [mediaRef, init])
}

export default useAudioMetadata
