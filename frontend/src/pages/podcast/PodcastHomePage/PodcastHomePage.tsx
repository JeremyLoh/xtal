import "./PodcastHomePage.css"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import dayjs from "dayjs"
import TrendingPodcastSection from "../../../features/podcast/trending/components/TrendingPodcastSection/TrendingPodcastSection"
import PodcastCategorySection from "../../../features/podcast/category/components/PodcastCategorySection/PodcastCategorySection"
import {
  PodcastCategory,
  TrendingPodcast,
} from "../../../api/podcast/model/podcast"
import { getAllPodcastCategories } from "../../../api/podcast/podcastCategory"
import Spinner from "../../../components/Spinner/Spinner"
import { getTrendingPodcasts } from "../../../api/podcast/trendingPodcast"

const DEFAULT_SINCE_DAYS = 3

function convertToDate(daysBefore: number): Date {
  return dayjs().startOf("day").subtract(daysBefore, "days").toDate()
}

export default function PodcastHomePage() {
  const abortControllerCategory = useRef<AbortController | null>(null)
  const abortControllerTrending = useRef<AbortController | null>(null)
  const [sinceDaysBefore, setSinceDaysBefore] =
    useState<number>(DEFAULT_SINCE_DAYS)
  const [loading, setLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<PodcastCategory[] | null>(null)
  const [trendingPodcasts, setTrendingPodcasts] = useState<
    TrendingPodcast[] | null
  >(null)

  async function handlePodcastRefresh(
    filters: {
      since: number
      category?: string
    } | null
  ) {
    if (filters == null) {
      await getPodcasts(convertToDate(DEFAULT_SINCE_DAYS))
    } else {
      const { since } = filters
      setSinceDaysBefore(since)
      await getPodcasts(convertToDate(since))
    }
  }

  const getPodcastCategories = useCallback(async () => {
    setLoading(true)
    abortControllerCategory.current?.abort()
    abortControllerCategory.current = new AbortController()
    try {
      const categories = await getAllPodcastCategories(
        abortControllerCategory.current
      )
      if (categories) {
        setCategories(categories)
      } else {
        setCategories(null)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const getPodcasts = useCallback(async (since: Date) => {
    setLoading(true)
    abortControllerTrending.current?.abort()
    abortControllerTrending.current = new AbortController()
    try {
      const params = {
        limit: 10,
        since: since,
      }
      const podcasts = await getTrendingPodcasts(
        abortControllerTrending.current,
        params
      )
      if (podcasts && podcasts.data) {
        setTrendingPodcasts(podcasts.data)
      } else {
        setTrendingPodcasts(null)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    document.title = "xtal - podcasts"
    Promise.allSettled([
      getPodcastCategories(),
      getPodcasts(convertToDate(sinceDaysBefore)),
    ])
    return () => {
      abortControllerCategory.current?.abort()
      abortControllerTrending.current?.abort()
    }
  }, [getPodcastCategories, getPodcasts, sinceDaysBefore])

  return (
    <div id="podcast-home-page-container">
      <Spinner isLoading={loading} />
      <PodcastCategorySection
        loading={loading}
        categories={categories}
        onRefresh={getPodcastCategories}
      />
      <TrendingPodcastSection
        loading={loading}
        trendingPodcasts={trendingPodcasts}
        onRefresh={handlePodcastRefresh}
      />
    </div>
  )
}
