import "./PodcastCategoryPage.css"
import { useEffect, useMemo, useState } from "react"
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
  limit?: number
}

export default function PodcastCategoryPage() {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const options = useMemo(() => {
    return {
      limit: LIMIT,
      since: 3,
      category: categoryName,
    }
  }, [categoryName])
  const [podcastCategoryFilters, setPodcastCategoryFilters] = useState(options)

  const {
    trendingPodcasts,
    loading: loadingTrendingPodcasts,
    refetch,
  } = useTrendingPodcasts(podcastCategoryFilters)

  const handlePodcastRefresh = async (filters?: PodcastCategoryFilters) => {
    setPodcastCategoryFilters({ ...podcastCategoryFilters, ...filters })
    await refetch()
  }

  useEffect(() => {
    if (!categoryName) {
      return
    }
    document.title = `xtal - ${categoryName.toLowerCase()} podcasts`
  }, [categoryName])

  if (!categoryName) {
    navigate(notFoundPage())
    return
  }
  return (
    <div className="podcast-category-container">
      <PodcastCategoryPageNavigation categoryName={categoryName} />
      <h2 className="podcast-category-title">
        {decodeURIComponent(categoryName)}
      </h2>
      <TrendingPodcastSection
        trendingPodcasts={trendingPodcasts}
        onRefresh={handlePodcastRefresh}
        filters={podcastCategoryFilters}
        loading={loadingTrendingPodcasts}
      />
    </div>
  )
}
