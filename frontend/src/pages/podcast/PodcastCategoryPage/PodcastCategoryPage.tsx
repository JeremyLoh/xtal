import "./PodcastCategoryPage.css"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import TrendingPodcastSection from "../../../features/podcast/trending/components/TrendingPodcastSection/TrendingPodcastSection.tsx"
import useTrendingPodcasts from "../../../hooks/podcast/useTrendingPodcasts.ts"
import Breadcrumb from "../../../components/ui/breadcrumb/index.tsx"

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
      navigate("/404")
      return
    }
    return (
      <>
        <Breadcrumb>
          <Breadcrumb.Link
            href="/podcasts"
            data-testid="podcast-category-page-podcasts-link"
          >
            Podcasts
          </Breadcrumb.Link>
          <Breadcrumb.Separator size={16} />
          <Breadcrumb.Item>Categories</Breadcrumb.Item>
          <Breadcrumb.Separator size={16} />
          <Breadcrumb.Item>{categoryName}</Breadcrumb.Item>
        </Breadcrumb>
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
