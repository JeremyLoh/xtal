import { useCallback, useMemo } from "react"
import { toast } from "sonner"
import { Station } from "../api/radiobrowser/types.ts"
import { Podcast, PodcastEpisode } from "../api/podcast/model/podcast.ts"
import {
  podcastDetailPage,
  podcastEpisodeDetailPage,
  radioStationPage,
} from "../paths.ts"

function useClipboard() {
  const copyRadioStationShareUrl = useCallback((station: Station) => {
    const origin = new URL(window.location.href).origin
    const stationPage = radioStationPage(station.stationuuid)
    navigator.clipboard
      .writeText(`${origin}${stationPage}`)
      .then(() => toast.success("Link Copied"))
      .catch(() =>
        toast.error("Could not copy radio station share url to clipboard")
      )
  }, [])

  const copyPodcastShareUrl = useCallback((podcast: Podcast) => {
    const origin = new URL(window.location.href).origin
    const detailPage = podcastDetailPage({
      podcastTitle: podcast.title,
      podcastId: `${podcast.id}`,
    })
    navigator.clipboard
      .writeText(`${origin}${detailPage}`)
      .then(() => toast.success("Link Copied"))
      .catch(() => toast.error("Could not copy podcast share url to clipboard"))
  }, [])

  const copyPodcastEpisodeShareUrl = useCallback(
    (episode: PodcastEpisode, startDurationInSeconds: number) => {
      const origin = new URL(window.location.href).origin
      const episodeDetailPage = podcastEpisodeDetailPage({
        podcastTitle: episode.feedTitle || "",
        podcastId: `${episode.feedId}`,
        episodeId: `${episode.id}`,
      })
      navigator.clipboard
        .writeText(
          `${origin}${episodeDetailPage}${
            startDurationInSeconds && startDurationInSeconds > 0
              ? `?t=${startDurationInSeconds}`
              : ""
          }`
        )
        .then(() => toast.success("Link Copied"))
        .catch(() =>
          toast.error("Could not copy podcast episode share url to clipboard")
        )
    },
    []
  )

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
