import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { PodcastEpisode } from "../../api/podcast/model/podcast"
import { toast } from "sonner"
import { getPodcastEpisode } from "../../api/podcast/podcastEpisode"

function usePodcastEpisode() {
  const abortController = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null)

  const fetchPodcastEpisode = useCallback(async (episodeId: string) => {
    setLoading(true)
    abortController.current?.abort()
    abortController.current = new AbortController()
    try {
      const params = { id: episodeId }
      const response = await getPodcastEpisode(abortController.current, params)
      if (response && response.data) {
        setEpisode(response.data)
        setLoading(false)
      } else {
        setLoading(false) // prevent infinite load on no data
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false) // prevent infinite loading on error
    }
    return () => {
      abortController.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (episode) {
      // prevent race condition between setLoading and set podcast episode, display of "no episode found" placeholder before podcast data set state
      setLoading(false)
    }
  }, [episode])

  const output = useMemo(() => {
    return {
      loading,
      episode,
      fetchPodcastEpisode,
    }
  }, [loading, episode, fetchPodcastEpisode])

  return output
}

export default usePodcastEpisode
