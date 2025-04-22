import { useCallback, useMemo } from "react"
import { toast } from "sonner"
import { Station } from "../api/radiobrowser/types.ts"
import { Podcast, PodcastEpisode } from "../api/podcast/model/podcast.ts"

function useClipboard() {
  const copyRadioStationShareUrl = useCallback((station: Station) => {
    const origin = new URL(window.location.href).origin
    navigator.clipboard
      .writeText(`${origin}/radio-station/${station.stationuuid}`)
      .then(() => toast.success("Link Copied"))
      .catch(() =>
        toast.error("Could not copy radio station share url to clipboard")
      )
  }, [])

  const copyPodcastShareUrl = useCallback((podcast: Podcast) => {
    const origin = new URL(window.location.href).origin
    const podcastTitle = encodeURIComponent(podcast.title)
    const podcastId = podcast.id
    navigator.clipboard
      .writeText(`${origin}/podcasts/${podcastTitle}/${podcastId}`)
      .then(() => toast.success("Link Copied"))
      .catch(() => toast.error("Could not copy podcast share url to clipboard"))
  }, [])

  const copyPodcastEpisodeShareUrl = useCallback((episode: PodcastEpisode) => {
    // `/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
    const origin = new URL(window.location.href).origin
    const podcastTitle = encodeURIComponent(episode.feedTitle || "")
    const podcastId = episode.feedId
    const podcastEpisodeId = episode.id
    navigator.clipboard
      .writeText(
        `${origin}/podcasts/${podcastTitle}/${podcastId}/${podcastEpisodeId}`
      )
      .then(() => toast.success("Link Copied"))
      .catch(() =>
        toast.error("Could not copy podcast episode share url to clipboard")
      )
  }, [])

  const output = useMemo(() => {
    return {
      copyRadioStationShareUrl,
      copyPodcastShareUrl,
      copyPodcastEpisodeShareUrl,
    }
  }, [
    copyRadioStationShareUrl,
    copyPodcastShareUrl,
    copyPodcastEpisodeShareUrl,
  ])
  return output
}

export default useClipboard
