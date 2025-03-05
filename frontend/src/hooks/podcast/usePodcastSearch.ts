import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { getPodcastSearch } from "../../api/podcast/podcastSearch.ts"
import { Podcast } from "../../api/podcast/model/podcast.ts"

function usePodcastSearch() {
  // TODO add cache for search query
  const abortController = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [podcasts, setPodcasts] = useState<Podcast[] | null>(null)

  const fetchPodcastsBySearchQuery = useCallback(
    async (query: string, limit: number) => {
      if (query.trim() === "") {
        setPodcasts(null)
        return
      }
      setLoading(true)
      abortController.current?.abort()
      abortController.current = new AbortController()
      const params = { q: query.trim(), limit: limit }
      try {
        const response = await getPodcastSearch(abortController.current, params)
        if (response && response.data) {
          setPodcasts(response.data)
        } else {
          toast.info("No podcasts found for search term")
          setLoading(false) // prevent infinite load on no data
          setPodcasts(null)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message)
        setError(error.message)
        setLoading(false) // prevent infinite loading on error
      }
      return () => {
        abortController.current?.abort()
      }
    },
    []
  )

  useEffect(() => {
    if (podcasts) {
      // prevent race condition between setLoading and set podcasts, display of "no podcast found" placeholder before podcast data set state
      setLoading(false)
    }
  }, [podcasts])

  const output = useMemo(() => {
    return {
      loading,
      error,
      podcasts,
      fetchPodcastsBySearchQuery,
    }
  }, [loading, error, podcasts, fetchPodcastsBySearchQuery])

  return output
}

export default usePodcastSearch
