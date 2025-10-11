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
  const [newReleaseLanguage, setNewReleaseLanguage] = useState<
    string | undefined
  >(undefined)

  const {
    loading: loadingNewReleasePodcasts,
    AVAILABLE_LANGUAGES,
    newReleasePodcasts,
    refetch: refetchNewReleasePodcasts,
  } = useNewReleasePodcasts({
    limit: NEW_RELEASE_PODCAST_LIMIT,
    language: newReleaseLanguage,
  })
  const {
    loading: loadingCategories,
    categories,
    refetch: handlePodcastCategoryRefresh,
  } = usePodcastCategory()
  const {
    DEFAULT_SINCE_DAYS,
    trendingPodcasts,
    loading: loadingTrendingPodcasts,
    onRefresh: handleTrendingPodcastRefresh,
  } = useTrendingPodcasts(TRENDING_PODCAST_OPTIONS)

  const [sinceDaysBefore, setSinceDaysBefore] =
    useState<number>(DEFAULT_SINCE_DAYS)
  const initialTrendingPodcastFilters: TrendingPodcastFiltersType =
    useMemo(() => {
      return { since: DEFAULT_SINCE_DAYS }
    }, [DEFAULT_SINCE_DAYS])

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

  const handleNewReleasePodcastsRefresh = async (filters?: {
    language: string
  }) => {
    setNewReleaseLanguage(filters?.language)
    refetchNewReleasePodcasts()
  }

  useEffect(() => {
    document.title = "xtal - podcasts"
    Promise.allSettled([
      handlePodcastCategoryRefresh(),
      handlePodcastRefresh({ since: sinceDaysBefore }),
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
      <NewReleasePodcastSection
        loading={loadingNewReleasePodcasts}
        newReleasePodcasts={newReleasePodcasts}
        onRefreshNewReleasePodcasts={handleNewReleasePodcastsRefresh}
        availableLanguages={AVAILABLE_LANGUAGES}
      />
      <TrendingPodcastSection
        trendingPodcasts={trendingPodcasts}
        onRefresh={handlePodcastRefresh}
        filters={initialTrendingPodcastFilters}
        loading={loadingTrendingPodcasts}
      />
    </div>
  )
}
