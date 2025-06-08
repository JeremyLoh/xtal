import "./PodcastHomePage.css"
import { useCallback, useEffect, useMemo, useState } from "react"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import PodcastSearchSection from "../../../features/podcast/search/PodcastSearchSection/PodcastSearchSection.tsx"
import NewReleasePodcastSection from "../../../features/podcast/newRelease/NewReleasePodcastSection/NewReleasePodcastSection.tsx"
import TrendingPodcastSection from "../../../features/podcast/trending/TrendingPodcastSection/TrendingPodcastSection.tsx"
import PodcastCategorySection from "../../../features/podcast/category/PodcastCategorySection/PodcastCategorySection.tsx"
import useNewReleasePodcasts from "../../../hooks/podcast/useNewReleasePodcasts.ts"
import useTrendingPodcasts from "../../../hooks/podcast/useTrendingPodcasts.ts"
import usePodcastCategory from "../../../hooks/podcast/usePodcastCategory.ts"
import { TrendingPodcastFiltersType } from "../../../api/podcast/model/podcast.ts"

const NEW_RELEASE_PODCAST_LIMIT = 5
const TRENDING_PODCAST_OPTIONS = {
  limit: 10,
}

export default function PodcastHomePage() {
  const {
    loading: loadingNewReleasePodcasts,
    newReleasePodcasts,
    getNewReleases,
  } = useNewReleasePodcasts()
  const {
    DEFAULT_SINCE_DAYS,
    trendingPodcasts,
    loading: loadingTrendingPodcasts,
    onRefresh: handleTrendingPodcastRefresh,
  } = useTrendingPodcasts(TRENDING_PODCAST_OPTIONS)
  const [sinceDaysBefore, setSinceDaysBefore] =
    useState<number>(DEFAULT_SINCE_DAYS)
  const initialFilters: TrendingPodcastFiltersType = useMemo(() => {
    return { since: DEFAULT_SINCE_DAYS }
  }, [DEFAULT_SINCE_DAYS])
  const {
    loading: loadingCategories,
    categories,
    onRefresh: handlePodcastCategoryRefresh,
  } = usePodcastCategory()

  const handlePodcastRefresh = useCallback(
    async (filters: TrendingPodcastFiltersType) => {
      if (filters != null) {
        const { since } = filters
        setSinceDaysBefore(since)
      }
      await handleTrendingPodcastRefresh(filters)
    },
    [handleTrendingPodcastRefresh]
  )

  const handleNewReleasePodcastsRefresh = useCallback(async () => {
    await getNewReleases({ limit: NEW_RELEASE_PODCAST_LIMIT })
  }, [getNewReleases])

  useEffect(() => {
    document.title = "xtal - podcasts"
    Promise.allSettled([
      handlePodcastCategoryRefresh(),
      handlePodcastRefresh({ since: sinceDaysBefore }),
      getNewReleases({ limit: NEW_RELEASE_PODCAST_LIMIT }),
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id="podcast-home-page-container">
      <PodcastSearchSection />
      <LoadingDisplay loading={loadingCategories}>
        <PodcastCategorySection
          categories={categories}
          onRefresh={handlePodcastCategoryRefresh}
        />
      </LoadingDisplay>
      <LoadingDisplay loading={loadingNewReleasePodcasts}>
        <NewReleasePodcastSection
          loading={loadingNewReleasePodcasts}
          newReleasePodcasts={newReleasePodcasts}
          onRefreshNewReleasePodcasts={handleNewReleasePodcastsRefresh}
        />
      </LoadingDisplay>
      <TrendingPodcastSection
        trendingPodcasts={trendingPodcasts}
        onRefresh={handlePodcastRefresh}
        filters={initialFilters}
        loading={loadingTrendingPodcasts}
      />
    </div>
  )
}
