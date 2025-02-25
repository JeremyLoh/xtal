import "./PodcastHomePage.css"
import { useCallback, useEffect, useState } from "react"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import TrendingPodcastSection from "../../../features/podcast/trending/components/TrendingPodcastSection/TrendingPodcastSection.tsx"
import PodcastCategorySection from "../../../features/podcast/category/components/PodcastCategorySection/PodcastCategorySection.tsx"
import useTrendingPodcasts from "../../../hooks/podcast/useTrendingPodcasts.ts"
import usePodcastCategory from "../../../hooks/podcast/usePodcastCategory.ts"

export default function PodcastHomePage() {
  const limit = 10
  const {
    DEFAULT_SINCE_DAYS,
    loading: loadingPodcasts,
    trendingPodcasts,
    onRefresh: handleTrendingPodcastRefresh,
  } = useTrendingPodcasts({
    limit: limit,
  })
  const [sinceDaysBefore, setSinceDaysBefore] =
    useState<number>(DEFAULT_SINCE_DAYS)
  const {
    loading: loadingCategories,
    categories,
    onRefresh: handlePodcastCategoryRefresh,
  } = usePodcastCategory()

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
      await handleTrendingPodcastRefresh(filters)
    },
    [handleTrendingPodcastRefresh]
  )

  useEffect(() => {
    document.title = "xtal - podcasts"
    Promise.allSettled([
      handlePodcastCategoryRefresh(),
      handlePodcastRefresh({ since: sinceDaysBefore }),
    ])
  }, [handlePodcastCategoryRefresh, handlePodcastRefresh, sinceDaysBefore])

  return (
    <LoadingDisplay loading={loadingCategories || loadingPodcasts}>
      <div id="podcast-home-page-container">
        <PodcastCategorySection
          loading={loadingCategories}
          categories={categories}
          onRefresh={handlePodcastCategoryRefresh}
        />
        <TrendingPodcastSection
          loading={loadingPodcasts}
          trendingPodcasts={trendingPodcasts}
          onRefresh={handlePodcastRefresh}
        />
      </div>
    </LoadingDisplay>
  )
}
