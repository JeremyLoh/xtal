import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { getPodcastEpisodes } from "../../api/podcast/podcastEpisode.ts"
import { Podcast, PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import useCache, { CacheType } from "../useCache.ts"

const CACHE_STALE_TIME_IN_MINUTES = 10

type CachePodcast = {
  podcast: Podcast | null
  episodes: PodcastEpisode[] | null
}

type FetchPodcastEpisodesParams = {
  id: string
  limit: number
  offset?: number
}

type UsePodcastEpisodesProps = {
  podcastId: string | undefined
  limit: number
  page: number
}

function usePodcastEpisodes({
  podcastId,
  page,
  limit,
}: UsePodcastEpisodesProps) {
  const offset = useMemo(() => Math.max(0, page - 1) * limit, [page, limit])
  const cacheKey = useMemo(
    () =>
      `usePodcastEpisodes-podcastId-${
        podcastId || ""
      }-offset-${offset}-limit-${limit}`,
    [podcastId, offset, limit]
  )
  const { setCacheItem, getCacheItem } = useCache<CachePodcast>(
    cacheKey,
    CACHE_STALE_TIME_IN_MINUTES
  )
  const [podcastCache, setPodcastCache] =
    useState<CacheType<CachePodcast> | null>(null)

  const abortController = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [podcast, setPodcast] = useState<Podcast | null>(
    podcastCache ? podcastCache.value.podcast : null
  )
  const [podcastEpisodes, setPodcastEpisodes] = useState<
    PodcastEpisode[] | null
  >(podcastCache ? podcastCache.value.episodes : null)

  const fetchPodcastEpisodes = useCallback(
    async (podcastId: string) => {
      setLoading(true)
      abortController.current?.abort()
      abortController.current = new AbortController()
      const params: FetchPodcastEpisodesParams = { id: podcastId, limit: limit }
      if (offset > 0) {
        // backend endpoint throws validation error for offset <= 0
        params.offset = offset
      }
      try {
        const podcastEpisodes = await getPodcastEpisodes(
          abortController.current,
          params
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
    },
    [limit, offset]
  )

  useEffect(() => {
    if (podcast && podcastEpisodes) {
      // prevent race condition between setLoading and set podcast episodes, display of "no episode found" placeholder before podcast data set state
      setLoading(false)
      // set cache when data is available
      setCacheItem({
        podcast,
        episodes: podcastEpisodes,
      })
    }
  }, [setCacheItem, podcast, podcastEpisodes])

  useEffect(() => {
    async function getCache() {
      const podcastCache = await getCacheItem()
      if (podcastCache) {
        setCacheItem(podcastCache.value)
        setPodcastCache(podcastCache)
        setPodcast(podcastCache.value.podcast)
        setPodcastEpisodes(podcastCache.value.episodes)
      }
    }
    getCache()
  }, [getCacheItem, setCacheItem])

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
