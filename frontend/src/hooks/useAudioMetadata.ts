import { useEffect } from "react"

function useAudioMetadata(init: MediaMetadataInit) {
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: init.title,
        artist: init.artist,
      })
    }
  }, [init])
}

export default useAudioMetadata
