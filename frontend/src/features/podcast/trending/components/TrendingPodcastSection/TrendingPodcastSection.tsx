import "./TrendingPodcastSection.css"
import { memo, useCallback, useState } from "react"
import { Link } from "react-router"
import { IoChevronForward, IoReload } from "react-icons/io5"
import {
  TrendingPodcast,
  TrendingPodcastFiltersType,
} from "../../../../../api/podcast/model/podcast.ts"
import PodcastCard from "../../../../../components/PodcastCard/index.tsx"
import useScreenDimensions from "../../../../../hooks/useScreenDimensions.ts"
import TrendingPodcastFilters from "../TrendingPodcastFilters/TrendingPodcastFilters.tsx"
import Button from "../../../../../components/ui/button/Button.tsx"
import Pagination from "../../../../../components/Pagination/Pagination.tsx"
import LoadingDisplay from "../../../../../components/LoadingDisplay/LoadingDisplay.tsx"

const IMAGE_LAZY_LOAD_START_INDEX = 2 // zero based index
const MAX_TRENDING_PODCAST_PAGINATION_PAGES = 5
const LIMIT_PER_PAGE = 10

type TrendingPodcastSectionProps = {
  loading: boolean
  trendingPodcasts: TrendingPodcast[] | null
  filters: TrendingPodcastFiltersType
  onRefresh: (filters: TrendingPodcastFiltersType) => Promise<void>
}

export default memo(function TrendingPodcastSection({
  loading,
  trendingPodcasts,
  filters,
  onRefresh,
}: TrendingPodcastSectionProps) {
  const { isMobile } = useScreenDimensions()
  const [page, setPage] = useState<number>(1)
  const [podcastFilters, setPodcastFilters] =
    useState<TrendingPodcastFiltersType>(filters)

  const handleRefreshTrendingPodcasts = useCallback(async () => {
    await onRefresh(null)
  }, [onRefresh])

  const handleFilterChange = useCallback(
    async (filters: { since: number }) => {
      const { since } = filters
      setPodcastFilters({ ...podcastFilters, ...filters, offset: undefined })
      setPage(1)
      await onRefresh({ since })
    },
    [onRefresh, podcastFilters]
  )

  const getPodcastDetailPath = useCallback((podcast: TrendingPodcast) => {
    return `/podcasts/${encodeURIComponent(podcast.title)}/${podcast.id}`
  }, [])

  const handlePreviousPageClick = useCallback(
    async (currentPage: number) => {
      if (podcastFilters == null || currentPage === 1) {
        return
      }
      const previousOffset =
        podcastFilters.offset != null
          ? podcastFilters.offset - LIMIT_PER_PAGE
          : 0
      const nextFilter = {
        ...podcastFilters,
        offset: previousOffset,
      }
      setPodcastFilters(nextFilter)
      setPage(currentPage - 1)
      await onRefresh(nextFilter)
    },
    [onRefresh, podcastFilters]
  )

  const handleNextPageClick = useCallback(
    async (currentPage: number) => {
      if (podcastFilters == null) {
        return
      }
      const nextOffset =
        podcastFilters.offset != null
          ? podcastFilters.offset + LIMIT_PER_PAGE
          : 0 + LIMIT_PER_PAGE
      const nextFilter = {
        ...podcastFilters,
        offset: nextOffset,
      }
      setPodcastFilters(nextFilter)
      setPage(currentPage + 1)
      await onRefresh(nextFilter)
    },
    [onRefresh, podcastFilters]
  )

  const handlePageClick = useCallback(
    async (pageNumber: number) => {
      if (pageNumber === page || podcastFilters == null) {
        return
      }
      const nextOffset = (pageNumber - 1) * LIMIT_PER_PAGE
      const nextFilter = {
        ...podcastFilters,
        offset: nextOffset,
      }
      setPodcastFilters(nextFilter)
      setPage(pageNumber)
      await onRefresh(nextFilter)
    },
    [onRefresh, podcastFilters, page]
  )

  const renderTrendingPodcastPagination = useCallback(() => {
    return (
      <Pagination
        className="trending-podcast-pagination"
        currentPage={page}
        totalPages={MAX_TRENDING_PODCAST_PAGINATION_PAGES}
        onPreviousPageClick={handlePreviousPageClick}
        onNextPageClick={handleNextPageClick}
        onPageClick={handlePageClick}
      />
    )
  }, [page, handlePreviousPageClick, handleNextPageClick, handlePageClick])

  const renderTrendingPodcasts = useCallback(() => {
    if (trendingPodcasts == null || trendingPodcasts.length === 0) {
      return (
        <div>
          <p>Zero podcasts found. Please try again later</p>
          <Button
            onClick={handleRefreshTrendingPodcasts}
            variant="primary"
            className="refresh-trending-podcasts-button"
            aria-label="refresh trending podcasts"
            title="refresh trending podcasts"
          >
            <IoReload size={20} /> Refresh
          </Button>
        </div>
      )
    }
    return trendingPodcasts.map((podcast, index) => (
      <PodcastCard
        key={podcast.id}
        customClassName="podcast-trending-card"
        podcast={podcast}
      >
        {!isMobile || index < IMAGE_LAZY_LOAD_START_INDEX ? (
          <PodcastCard.Artwork size={isMobile ? 144 : 200} />
        ) : (
          <PodcastCard.Artwork size={isMobile ? 144 : 200} lazyLoad={true} />
        )}
        <Link
          to={getPodcastDetailPath(podcast)}
          className="podcast-trending-card-detail-link"
        >
          <PodcastCard.TitleAndAuthor />
        </Link>
      </PodcastCard>
    ))
  }, [
    trendingPodcasts,
    isMobile,
    getPodcastDetailPath,
    handleRefreshTrendingPodcasts,
  ])

  return (
    <div className="podcast-trending-container">
      <h2 className="podcast-trending-title">
        Trending
        <IoChevronForward size={20} />
        <TrendingPodcastFilters onChange={handleFilterChange} />
      </h2>
      {renderTrendingPodcastPagination()}
      <div className="podcast-trending-card-container">
        <LoadingDisplay loading={loading}>
          {renderTrendingPodcasts()}
        </LoadingDisplay>
      </div>
    </div>
  )
})
