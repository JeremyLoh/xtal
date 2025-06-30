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
    if (!init.title && !init.artist && !init.album) {
      return
    }
    const media = mediaRef.current
    const handlePlay = () => {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: init.title ?? "",
        artist: init.artist ?? "",
        album: init.album ?? "",
        artwork: init.artwork || [],
      })
    }

    if (!media.paused) {
      handlePlay() // apply immediately only if the element is already playing
    }
    // reapply on every play / playing
    media.addEventListener("play", handlePlay)
    media.addEventListener("playing", handlePlay)

    return () => {
      media.removeEventListener("play", handlePlay)
      media.removeEventListener("playing", handlePlay)
    }
  }, [mediaRef, init])
}

export default useAudioMetadata
