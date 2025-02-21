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
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true)
  const [loadingPodcasts, setLoadingPodcasts] = useState<boolean>(true)
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
    setLoadingCategories(true)
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
        setLoadingCategories(false) // prevent infinite load on no data
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
      setLoadingCategories(false) // prevent infinite load on error
    }
  }, [])

  const getPodcasts = useCallback(async (since: Date) => {
    setLoadingPodcasts(true)
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
        setLoadingPodcasts(false) // prevent infinite load on no data
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
      setLoadingPodcasts(false) // prevent infinite load on error
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

  useEffect(() => {
    // update the loading state after the trending podcasts state has been set
    // prevents display of "no podcasts available" element due to trendingPodcasts = null, and loading = false
    if (trendingPodcasts) {
      setLoadingPodcasts(false)
    }
  }, [trendingPodcasts])

  useEffect(() => {
    // update the category loading state to false after the state has been updated
    // prevents display of "no categories available" element due to categories = null, and loading = false
    if (categories) {
      setLoadingCategories(false)
    }
  }, [categories])

  return (
    <div id="podcast-home-page-container">
      <Spinner isLoading={loadingCategories || loadingPodcasts} />
      <PodcastCategorySection
        loading={loadingCategories}
        categories={categories}
        onRefresh={getPodcastCategories}
      />
      <TrendingPodcastSection
        loading={loadingPodcasts}
        trendingPodcasts={trendingPodcasts}
        onRefresh={handlePodcastRefresh}
      />
    </div>
  )
}
