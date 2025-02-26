import "./TrendingPodcastSection.css"
import { memo } from "react"
import { Link } from "react-router"
import { IoChevronForward, IoReload } from "react-icons/io5"
import { TrendingPodcast } from "../../../../../api/podcast/model/podcast.ts"
import PodcastCard from "../../../../../components/PodcastCard/PodcastCard.tsx"
import useScreenDimensions from "../../../../../hooks/useScreenDimensions.ts"
import TrendingPodcastFilters from "../TrendingPodcastFilters/TrendingPodcastFilters.tsx"

type TrendingPodcastSectionProps = {
  trendingPodcasts: TrendingPodcast[] | null
  onRefresh: (
    filters: {
      since: number
      category?: string
    } | null
  ) => Promise<void>
}

export default memo(function TrendingPodcastSection(
  props: TrendingPodcastSectionProps
) {
  const { isMobile } = useScreenDimensions()

  async function handleRefreshTrendingPodcasts() {
    await props.onRefresh(null)
  }

  async function handleFilterChange(filters: { since: number }) {
    const { since } = filters
    await props.onRefresh({ since })
  }

  function getPodcastDetailPath(podcast: TrendingPodcast) {
    return `/podcasts/${encodeURIComponent(podcast.title)}/${podcast.id}`
  }

  function renderTrendingPodcasts() {
    if (props.trendingPodcasts == null || props.trendingPodcasts.length === 0) {
      return (
        <div>
          <p>Zero podcasts found. Please try again later</p>
          <button
            onClick={handleRefreshTrendingPodcasts}
            className="refresh-trending-podcasts-btn"
            aria-label="refresh trending podcasts"
            title="refresh trending podcasts"
          >
            <IoReload size={20} /> Refresh
          </button>
        </div>
      )
    }
    return props.trendingPodcasts.map((podcast) => (
      <PodcastCard
        key={podcast.id}
        customClassName="podcast-trending-card"
        podcast={podcast}
      >
        <PodcastCard.Artwork size={isMobile ? 144 : 200} />
        <Link
          to={getPodcastDetailPath(podcast)}
          className="podcast-trending-card-detail-link"
        >
          <PodcastCard.TitleAndAuthor />
        </Link>
      </PodcastCard>
    ))
  }

  return (
    <div className="podcast-trending-container">
      <h2 className="podcast-trending-title">
        Trending
        <IoChevronForward size={20} />
        <TrendingPodcastFilters onChange={handleFilterChange} />
      </h2>
      <div className="podcast-trending-card-container">
        {renderTrendingPodcasts()}
      </div>
    </div>
  )
})
