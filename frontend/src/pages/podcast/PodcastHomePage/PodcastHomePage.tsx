import "./PodcastHomePage.css"
import { useCallback, useEffect, useMemo, useState } from "react"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import TrendingPodcastSection from "../../../features/podcast/trending/components/TrendingPodcastSection/TrendingPodcastSection.tsx"
import PodcastCategorySection from "../../../features/podcast/category/components/PodcastCategorySection/PodcastCategorySection.tsx"
import useTrendingPodcasts from "../../../hooks/podcast/useTrendingPodcasts.ts"
import usePodcastCategory from "../../../hooks/podcast/usePodcastCategory.ts"
import SearchBar from "../../../components/SearchBar/SearchBar.tsx"
import usePodcastSearch from "../../../hooks/podcast/usePodcastSearch.ts"
import PodcastSearchResultList from "../../../components/PodcastSearchResultList/PodcastSearchResultList.tsx"
import { TrendingPodcastFiltersType } from "../../../api/podcast/model/podcast.ts"

const LIMIT = 10

export default function PodcastHomePage() {
  const options = useMemo(() => {
    return {
      limit: LIMIT,
    }
  }, [])
  const {
    loading: loadingSearchPodcasts,
    podcasts: searchPodcasts,
    fetchPodcastsBySearchQuery,
  } = usePodcastSearch()
  const {
    DEFAULT_SINCE_DAYS,
    trendingPodcasts,
    loading: loadingTrendingPodcasts,
    onRefresh: handleTrendingPodcastRefresh,
  } = useTrendingPodcasts(options)
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

  const handlePodcastSearch = useCallback(
    async (query: string) => {
      const podcastSearchLimit = 10
      fetchPodcastsBySearchQuery(query, podcastSearchLimit)
    },
    [fetchPodcastsBySearchQuery]
  )

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
      <SearchBar
        className="podcast-search-bar"
        placeholder="Search Podcasts..."
        onChange={handlePodcastSearch}
      />
      <LoadingDisplay loading={loadingSearchPodcasts}>
        <PodcastSearchResultList results={searchPodcasts} />
      </LoadingDisplay>
      <LoadingDisplay loading={loadingCategories}>
        <PodcastCategorySection
          categories={categories}
          onRefresh={handlePodcastCategoryRefresh}
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
