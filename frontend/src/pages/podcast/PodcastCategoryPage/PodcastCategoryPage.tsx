import "./PodcastCategoryPage.css"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { IoArrowBackSharp } from "react-icons/io5"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import TrendingPodcastSection from "../../../features/podcast/trending/components/TrendingPodcastSection/TrendingPodcastSection.tsx"
import useTrendingPodcasts from "../../../hooks/podcast/useTrendingPodcasts.ts"

const LIMIT = 10

export default function PodcastCategoryPage() {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const options = useMemo(() => {
    return {
      limit: LIMIT,
      category: categoryName,
    }
  }, [categoryName])
  const { DEFAULT_SINCE_DAYS, loading, trendingPodcasts, onRefresh } =
    useTrendingPodcasts(options)
  const [sinceDaysBefore, setSinceDaysBefore] =
    useState<number>(DEFAULT_SINCE_DAYS)

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
      <LoadingDisplay loading={loading}>
        <Link
          to="/podcasts"
          style={{ textDecoration: "none", width: "fit-content" }}
        >
          <button className="podcast-category-back-button">
            <IoArrowBackSharp size={16} />
            Back
          </button>
        </Link>
        <h2 className="podcast-category-title">
          {decodeURIComponent(categoryName)}
        </h2>
        <TrendingPodcastSection
          trendingPodcasts={trendingPodcasts}
          onRefresh={handlePodcastRefresh}
        />
      </LoadingDisplay>
    )
  }

  return <div className="podcast-category-container">{renderPodcasts()}</div>
}
