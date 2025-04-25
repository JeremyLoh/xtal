import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import { getPodcastEpisode } from "../../api/podcast/podcastEpisode.ts"

function usePodcastEpisode() {
  const abortController = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null)

  const fetchPodcastEpisode = useCallback(async (episodeId: string) => {
    setLoading(true)
    setError(null)
    abortController.current?.abort()
    abortController.current = new AbortController()
    try {
      const params = { id: episodeId }
      const response = await getPodcastEpisode(abortController.current, params)
      if (response && response.data) {
        setEpisode(response.data)
      } else {
        setError(
          "Could not retrieve podcast episode by episode id. Please try again later"
        )
        setLoading(false)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
      setError(error.message)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (episode) {
      // set loading state after episode has been set by setState, prevent initial flash of no episode found message
      setLoading(false)
      setError(null)
    }
  }, [episode])

  const output = useMemo(() => {
    return {
      loading,
      error,
      episode,
      fetchPodcastEpisode,
    }
  }, [loading, error, episode, fetchPodcastEpisode])

  return output
}

export default usePodcastEpisode
