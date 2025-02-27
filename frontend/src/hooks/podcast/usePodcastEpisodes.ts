import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { getPodcastEpisodes } from "../../api/podcast/podcastEpisode.ts"
import { Podcast, PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import useCache from "../useCache.ts"

const LIMIT = 10

type CachePodcast = {
  podcast: Podcast | null
  episodes: PodcastEpisode[] | null
}

function usePodcastEpisodes(podcastId: string | undefined) {
  const offset = 0
  const cacheKey = useMemo(
    () =>
      `usePodcastEpisodes-podcastId-${
        podcastId || ""
      }-offset-${offset}-limit-${LIMIT}`,
    [podcastId]
  )

  const { setCacheItem: setPodcastCache, getCacheItem: getPodcastCache } =
    useCache<CachePodcast>(cacheKey, 10)
  const podcastCache = getPodcastCache()

  const abortController = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [podcast, setPodcast] = useState<Podcast | null>(
    podcastCache ? podcastCache.value.podcast : null
  )
  const [podcastEpisodes, setPodcastEpisodes] = useState<
    PodcastEpisode[] | null
  >(podcastCache ? podcastCache.value.episodes : null)

  const fetchPodcastEpisodes = useCallback(async (podcastId: string) => {
    setLoading(true)
    abortController.current?.abort()
    abortController.current = new AbortController()
    try {
      const podcastEpisodes = await getPodcastEpisodes(
        abortController.current,
        {
          id: podcastId,
          limit: LIMIT,
        }
      )
      if (podcastEpisodes && podcastEpisodes.data) {
        setPodcastEpisodes(podcastEpisodes.data.episodes)
        setPodcast(podcastEpisodes.data.podcast)
      } else {
        setLoading(false) // prevent infinite load on no data
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false) // prevent infinite loading on error
    }
  }, [])

  useEffect(() => {
    if (podcast && podcastEpisodes) {
      // prevent race condition between setLoading and set podcast episodes, display of "no episode found" placeholder before podcast data set state
      setLoading(false)
      // set cache when data is available
      setPodcastCache({
        podcast,
        episodes: podcastEpisodes,
      })
    }
  }, [setPodcastCache, podcast, podcastEpisodes])

  const output = useMemo(() => {
    return {
      loading,
      podcast,
      podcastEpisodes,
      fetchPodcastEpisodes,
    }
  }, [loading, podcast, podcastEpisodes, fetchPodcastEpisodes])

  return output
}

export default usePodcastEpisodes
