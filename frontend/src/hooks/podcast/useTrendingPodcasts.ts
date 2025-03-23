import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import dayjs from "dayjs"
import {
  TrendingPodcast,
  TrendingPodcastFiltersType,
} from "../../api/podcast/model/podcast.ts"
import { getTrendingPodcasts } from "../../api/podcast/trendingPodcast.ts"

type UseTrendingPodcastsProps = {
  limit: number
  category?: string
}

function convertToDate(daysBefore: number): Date {
  return dayjs().startOf("day").subtract(daysBefore, "days").toDate()
}

const DEFAULT_SINCE_DAYS = 3

function useTrendingPodcasts({ limit, category }: UseTrendingPodcastsProps) {
  const abortController = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [trendingPodcasts, setTrendingPodcasts] = useState<
    TrendingPodcast[] | null
  >(null)

  const getPodcasts = useCallback(
    async ({ since, offset }: { since: Date; offset: number }) => {
      setLoading(true)
      abortController.current?.abort()
      abortController.current = new AbortController()
      try {
        const params = {
          limit: limit,
          offset: offset,
          since: since,
          category: category,
        }
        const podcasts = await getTrendingPodcasts(
          abortController.current,
          params
        )
        if (podcasts && podcasts.data) {
          setTrendingPodcasts(podcasts.data)
        } else {
          setTrendingPodcasts(null)
          setLoading(false) // prevent infinite load on no data
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message)
        setLoading(false) // prevent infinite load on error
      }
    },
    [category, limit]
  )

  const handlePodcastRefresh = useCallback(
    async (filters: TrendingPodcastFiltersType) => {
      if (filters == null) {
        await getPodcasts({
          since: convertToDate(DEFAULT_SINCE_DAYS),
          offset: 0,
        })
      } else {
        const { since, offset } = filters
        await getPodcasts({
          since: convertToDate(since),
          offset: offset != null ? offset : 0,
        })
      }
    },
    [getPodcasts]
  )

  useEffect(() => {
    // update loading state to false after set state has been run on the trending podcasts
    // prevents display of "no podcasts available" element due to trendingPodcasts = null, and loading = false
    if (trendingPodcasts) {
      setLoading(false)
    }
  }, [trendingPodcasts])

  return {
    DEFAULT_SINCE_DAYS,
    loading,
    trendingPodcasts,
    onRefresh: handlePodcastRefresh,
  }
}

export default useTrendingPodcasts
