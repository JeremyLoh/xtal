import "./PodcastDetailPage.css"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams } from "react-router"
import { IoReload } from "react-icons/io5"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import PodcastEpisodeList from "../../../features/podcast/episode/PodcastEpisodeList/PodcastEpisodeList.tsx"
import PodcastCard from "../../../components/PodcastCard/index.tsx"
import usePodcastEpisodes from "../../../hooks/podcast/usePodcastEpisodes.ts"
import Pagination from "../../../components/Pagination/Pagination.tsx"
import PodcastDetailPageNavigation from "../../../features/podcast/navigation/PodcastDetailPageNavigation/PodcastDetailPageNavigation.tsx"

const LIMIT = 10
const IMAGE_LAZY_LOAD_START_INDEX = 2 // zero based index

export default function PodcastDetailPage() {
  const { podcastId, podcastTitle } = useParams()
  const [searchParams] = useSearchParams()
  const pageParam = searchParams.get("page")
  const [page, setPage] = useState<number>(parseToPageInt(pageParam))
  const podcastEpisodeSearchOptions = useMemo(() => {
    return { podcastId, page, limit: LIMIT }
  }, [podcastId, page])
  const { loading, podcast, podcastEpisodes, fetchPodcastEpisodes } =
    usePodcastEpisodes(podcastEpisodeSearchOptions)

  const handleRefreshPodcastEpisodes = useCallback(async () => {
    if (podcastId) {
      await fetchPodcastEpisodes(podcastId)
    }
  }, [fetchPodcastEpisodes, podcastId])

  const handlePreviousPageClick = useCallback((currentPage: number) => {
    setPage(currentPage - 1)
  }, [])

  const handleNextPageClick = useCallback((currentPage: number) => {
    setPage(currentPage + 1)
  }, [])

  const handlePageClick = useCallback((pageNumber: number) => {
    setPage(pageNumber)
  }, [])

  useEffect(() => {
    if (podcastTitle) {
      document.title = `${podcastTitle} - xtal - podcasts`
    }
  }, [podcastTitle])

  useEffect(() => {
    if (podcastId) {
      fetchPodcastEpisodes(podcastId)
    }
  }, [fetchPodcastEpisodes, podcastId])

  return (
    <div className="podcast-detail-container">
      <PodcastDetailPageNavigation
        podcast={podcast}
        podcastTitle={podcastTitle}
      />
      <LoadingDisplay loading={loading}>
        {podcast && (
          <div className="podcast-info-container">
            <PodcastCard podcast={podcast} customClassName="podcast-info-card">
              <PodcastCard.Artwork size={144} />
              <div>
                <PodcastCard.TitleAndAuthor variant="large" />
                <div className="podcast-info-card-pill-container">
                  <PodcastCard.EpisodeCount />
                  <PodcastCard.Language />
                </div>
                <div className="podcast-info-card-pill-container">
                  <PodcastCard.Categories />
                </div>
              </div>
            </PodcastCard>
          </div>
        )}
        <Pagination
          className="podcast-episode-pagination"
          currentPage={page}
          totalPages={
            podcast ? Math.ceil((podcast.episodeCount || 0) / LIMIT) : 0
          }
          onPreviousPageClick={handlePreviousPageClick}
          onNextPageClick={handleNextPageClick}
          onPageClick={handlePageClick}
        />
        <h2 className="podcast-episode-section-title">Episodes</h2>
        <div className="podcast-episode-container">
          {podcastEpisodes ? (
            <PodcastEpisodeList
              IMAGE_LAZY_LOAD_START_INDEX={IMAGE_LAZY_LOAD_START_INDEX}
              episodes={podcastEpisodes}
              podcastTitle={podcastTitle}
              podcastId={podcastId}
            />
          ) : (
            <div className="podcast-episode-placeholder-section">
              <p className="podcast-episode-error-text">
                Could not get podcast episodes. Please try again later
              </p>
              <button
                className="refresh-podcast-episode-button"
                disabled={loading}
                onClick={handleRefreshPodcastEpisodes}
                aria-label="refresh podcast episodes"
                title="refresh podcast episodes"
              >
                <IoReload size={20} /> Refresh
              </button>
            </div>
          )}
        </div>
      </LoadingDisplay>
    </div>
  )
}

function parseToPageInt(value: string | null) {
  // default to page one if page value is invalid
  if (value == null) {
    return 1
  }
  try {
    const pageNumber = Number.parseInt(value)
    return pageNumber >= 1 ? pageNumber : 1
  } catch {
    return 1
  }
}
