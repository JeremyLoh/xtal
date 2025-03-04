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

const LIMIT = 10

export default function PodcastHomePage() {
  const options = useMemo(() => {
    return {
      limit: LIMIT,
    }
  }, [])
  const { podcasts: searchPodcasts, fetchPodcastsBySearchQuery } =
    usePodcastSearch()
  const {
    DEFAULT_SINCE_DAYS,
    loading: loadingPodcasts,
    trendingPodcasts,
    onRefresh: handleTrendingPodcastRefresh,
  } = useTrendingPodcasts(options)
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
    <LoadingDisplay loading={loadingCategories || loadingPodcasts}>
      <div id="podcast-home-page-container">
        <SearchBar
          className="podcast-search-bar"
          placeholder="Search Podcasts..."
          onChange={handlePodcastSearch}
        />
        <PodcastSearchResultList results={searchPodcasts} />

        <PodcastCategorySection
          categories={categories}
          onRefresh={handlePodcastCategoryRefresh}
        />
        <TrendingPodcastSection
          trendingPodcasts={trendingPodcasts}
          onRefresh={handlePodcastRefresh}
        />
      </div>
    </LoadingDisplay>
  )
}
