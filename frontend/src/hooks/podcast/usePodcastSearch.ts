import { useCallback, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { getPodcastSearch } from "../../api/podcast/podcastSearch.ts"
import { Podcast } from "../../api/podcast/model/podcast.ts"

function usePodcastSearch() {
  const abortController = useRef<AbortController | null>(null)
  const fetchMorePodcastsAbortController = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [podcasts, setPodcasts] = useState<Podcast[] | null>(null)

  const fetchMorePodcasts = useCallback(
    async ({ query, limit }: { query: string; limit: number }) => {
      setLoading(true)
      setError(null)
      fetchMorePodcastsAbortController.current?.abort()
      fetchMorePodcastsAbortController.current = new AbortController()
      const params = {
        q: query.trim(),
        limit: limit,
        offset: podcasts ? podcasts.length : 0,
      }
      try {
        const response = await getPodcastSearch(
          fetchMorePodcastsAbortController.current,
          params
        )
        if (response && response.data && response.count > 0) {
          const uniquePodcastIds = new Set(
            podcasts ? podcasts.map((p) => p.id) : []
          )
          setPodcasts(
            podcasts
              ? podcasts.concat(
                  response.data.filter((p) => !uniquePodcastIds.has(p.id))
                )
              : response.data
          )
        } else {
          toast.info("No additional podcasts available")
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    },
    [podcasts]
  )

  const fetchPodcastsBySearchQuery = useCallback(
    async ({ query, limit }: { query: string; limit: number }) => {
      if (query.trim() === "") {
        setPodcasts(null)
        return
      }
      setLoading(true)
      setError(null)
      abortController.current?.abort()
      abortController.current = new AbortController()
      const params = { q: query.trim(), limit: limit }
      try {
        const response = await getPodcastSearch(abortController.current, params)
        if (response && response.data && response.count > 0) {
          setPodcasts(response.data)
        } else {
          toast.info("No podcasts found for search term")
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const output = useMemo(() => {
    return {
      loading,
      error,
      podcasts,
      fetchPodcastsBySearchQuery,
      fetchMorePodcasts,
    }
  }, [loading, error, podcasts, fetchPodcastsBySearchQuery, fetchMorePodcasts])

  return output
}

export default usePodcastSearch
