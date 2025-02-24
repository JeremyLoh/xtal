import "./PodcastHomePage.css"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import TrendingPodcastSection from "../../../features/podcast/trending/components/TrendingPodcastSection/TrendingPodcastSection.tsx"
import PodcastCategorySection from "../../../features/podcast/category/components/PodcastCategorySection/PodcastCategorySection.tsx"
import { PodcastCategory } from "../../../api/podcast/model/podcast.ts"
import { getAllPodcastCategories } from "../../../api/podcast/podcastCategory.ts"
import Spinner from "../../../components/Spinner/Spinner.tsx"
import useTrendingPodcasts from "../../../hooks/podcast/useTrendingPodcasts.ts"

export default function PodcastHomePage() {
  const limit = 10
  const {
    DEFAULT_SINCE_DAYS,
    loading: loadingPodcasts,
    trendingPodcasts,
    onRefresh,
  } = useTrendingPodcasts({
    limit: limit,
  })
  const abortControllerCategory = useRef<AbortController | null>(null)
  const [sinceDaysBefore, setSinceDaysBefore] =
    useState<number>(DEFAULT_SINCE_DAYS)
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true)
  const [categories, setCategories] = useState<PodcastCategory[] | null>(null)

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

  const handlePodcastRefresh = useCallback(
    async (
      filters: {
        since: number
        category?: string
      } | null
    ) => {
      if (filters != null) {
        const { since } = filters
        setSinceDaysBefore(since)
      }
      await onRefresh(filters)
    },
    [onRefresh]
  )

  useEffect(() => {
    document.title = "xtal - podcasts"
    Promise.allSettled([
      getPodcastCategories(),
      handlePodcastRefresh({ since: sinceDaysBefore }),
    ])
    return () => {
      abortControllerCategory.current?.abort()
    }
  }, [getPodcastCategories, handlePodcastRefresh, sinceDaysBefore])

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
