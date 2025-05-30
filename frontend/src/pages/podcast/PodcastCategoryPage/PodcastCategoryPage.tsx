import "./PodcastCategoryPage.css"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import TrendingPodcastSection from "../../../features/podcast/trending/TrendingPodcastSection/TrendingPodcastSection.tsx"
import useTrendingPodcasts from "../../../hooks/podcast/useTrendingPodcasts.ts"
import PodcastCategoryPageNavigation from "../../../features/podcast/navigation/PodcastCategoryPageNavigation/PodcastCategoryPageNavigation.tsx"
import { notFoundPage } from "../../../paths.ts"

const LIMIT = 10

type PodcastCategoryFilters = {
  since: number
  offset?: number
  category?: string
} | null

export default function PodcastCategoryPage() {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const options = useMemo(() => {
    return {
      limit: LIMIT,
      category: categoryName,
    }
  }, [categoryName])
  const {
    DEFAULT_SINCE_DAYS,
    trendingPodcasts,
    loading: loadingTrendingPodcasts,
    onRefresh,
  } = useTrendingPodcasts(options)
  const [sinceDaysBefore, setSinceDaysBefore] =
    useState<number>(DEFAULT_SINCE_DAYS)
  const initialFilters: PodcastCategoryFilters = useMemo(() => {
    return { since: DEFAULT_SINCE_DAYS }
  }, [DEFAULT_SINCE_DAYS])

  const handlePodcastRefresh = useCallback(
    async (filters: PodcastCategoryFilters) => {
      if (filters != null) {
        const { since } = filters
        setSinceDaysBefore(since)
      }
      await onRefresh(filters)
    },
    [onRefresh]
  )

  useEffect(() => {
    if (!categoryName) {
      return
    }
    document.title = `xtal - ${categoryName.toLowerCase()} podcasts`
    onRefresh({ since: sinceDaysBefore, category: categoryName })
    // remove useEffect dependencies for initial page load run
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function renderPodcasts() {
    if (!categoryName) {
      navigate(notFoundPage())
      return
    }
    return (
      <>
        <PodcastCategoryPageNavigation categoryName={categoryName} />
        <h2 className="podcast-category-title">
          {decodeURIComponent(categoryName)}
        </h2>
        <TrendingPodcastSection
          trendingPodcasts={trendingPodcasts}
          onRefresh={handlePodcastRefresh}
          filters={initialFilters}
          loading={loadingTrendingPodcasts}
        />
      </>
    )
  }

  return <div className="podcast-category-container">{renderPodcasts()}</div>
}
