import "./PodcastDetailPage.css"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams } from "react-router"
import { IoReload } from "react-icons/io5"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import PodcastEpisodeList from "../../../features/podcast/episode/PodcastEpisodeList/PodcastEpisodeList.tsx"
import PodcastInfoCard from "../../../features/podcast/info/PodcastInfoCard/PodcastInfoCard.tsx"
import usePodcastEpisodes from "../../../hooks/podcast/usePodcastEpisodes.ts"
import Pagination from "../../../components/Pagination/Pagination.tsx"
import PodcastDetailPageNavigation from "../../../features/podcast/navigation/PodcastDetailPageNavigation/PodcastDetailPageNavigation.tsx"
import Button from "../../../components/ui/button/Button.tsx"
import PodcastEpisodeListFilters, {
  PodcastEpisodeListFiltersType,
} from "../../../features/podcast/episode/PodcastEpisodeListFilters/PodcastEpisodeListFilters.tsx"
import { PodcastEpisode } from "../../../api/podcast/model/podcast.ts"

const LIMIT = 10
const IMAGE_LAZY_LOAD_START_INDEX = 2 // zero based index

export default function PodcastDetailPage() {
  const { podcastId, podcastTitle } = useParams()
  const [searchParams] = useSearchParams()
  const pageParam = searchParams.get("page")
  const [page, setPage] = useState<number>(parseToPageInt(pageParam))
  const [episodeFilter, setEpisodeFilter] =
    useState<PodcastEpisodeListFiltersType>({})
  const podcastEpisodeSearchOptions = useMemo(() => {
    return { podcastId, page, limit: LIMIT }
  }, [podcastId, page])
  const { loading, podcast, podcastEpisodes, fetchPodcastEpisodes } =
    usePodcastEpisodes(podcastEpisodeSearchOptions)
  const [paginationDataLoading, setPaginationDataLoading] =
    useState<boolean>(false)

  const handleRefreshPodcastEpisodes = useCallback(async () => {
    if (podcastId) {
      await fetchPodcastEpisodes(podcastId, page)
    }
  }, [fetchPodcastEpisodes, podcastId, page])

  const handlePreviousPageClick = useCallback(
    async (currentPage: number) => {
      setPage(currentPage - 1)
      if (podcastId) {
        setPaginationDataLoading(true)
        await fetchPodcastEpisodes(podcastId, currentPage - 1)
        setPaginationDataLoading(false)
      }
    },
    [fetchPodcastEpisodes, podcastId]
  )

  const handleNextPageClick = useCallback(
    async (currentPage: number) => {
      setPage(currentPage + 1)
      if (podcastId) {
        setPaginationDataLoading(true)
        await fetchPodcastEpisodes(podcastId, currentPage + 1)
        setPaginationDataLoading(false)
      }
    },
    [fetchPodcastEpisodes, podcastId]
  )

  const handlePageClick = useCallback(
    async (pageNumber: number) => {
      setPage(pageNumber)
      if (podcastId) {
        setPaginationDataLoading(true)
        await fetchPodcastEpisodes(podcastId, pageNumber)
        setPaginationDataLoading(false)
      }
    },
    [fetchPodcastEpisodes, podcastId]
  )

  const handleEpisodeFilterChange = useCallback(
    ({ durationInMinutes }: PodcastEpisodeListFiltersType) => {
      setEpisodeFilter(
        durationInMinutes == null ? {} : { ...episodeFilter, durationInMinutes }
      )
    },
    [episodeFilter]
  )

  const applyEpisodeFilter = useCallback((): PodcastEpisode[] => {
    if (podcastEpisodes == null) {
      return []
    }
    let filteredEpisodes = podcastEpisodes
    if (
      episodeFilter.durationInMinutes != null &&
      episodeFilter.durationInMinutes > 0
    ) {
      filteredEpisodes = filteredEpisodes.filter((episode) => {
        if (episode.durationInSeconds == null) {
          return true
        }
        if (episodeFilter.durationInMinutes) {
          return (
            episode.durationInSeconds <= episodeFilter.durationInMinutes * 60
          )
        }
        return true
      })
    }
    return filteredEpisodes
  }, [podcastEpisodes, episodeFilter])

  useEffect(() => {
    if (podcastTitle) {
      document.title = `${podcastTitle} - xtal - podcasts`
    }
  }, [podcastTitle])

  useEffect(() => {
    if (!podcast && podcastId) {
      // for first page load
      fetchPodcastEpisodes(podcastId, page)
    }
  }, [fetchPodcastEpisodes, podcastId, podcast, page])

  return (
    <LoadingDisplay loading={loading || paginationDataLoading}>
      <div className="podcast-detail-container">
        <PodcastDetailPageNavigation
          podcast={podcast}
          podcastTitle={podcastTitle}
        />
        <PodcastInfoCard podcast={podcast} />
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
            <>
              <PodcastEpisodeListFilters
                filters={episodeFilter}
                onChange={handleEpisodeFilterChange}
              />
              <PodcastEpisodeList
                IMAGE_LAZY_LOAD_START_INDEX={IMAGE_LAZY_LOAD_START_INDEX}
                episodes={applyEpisodeFilter()}
                podcastTitle={podcastTitle}
                podcastId={podcastId}
              />
            </>
          ) : (
            <div className="podcast-episode-placeholder-section">
              <p className="podcast-episode-error-text">
                Could not get podcast episodes. Please try again later
              </p>
              <Button
                keyProp="refresh-podcast-episode-button"
                className="refresh-podcast-episode-button"
                disabled={loading}
                onClick={handleRefreshPodcastEpisodes}
                aria-label="refresh podcast episodes"
                title="refresh podcast episodes"
              >
                <IoReload size={20} /> Refresh
              </Button>
            </div>
          )}
        </div>
      </div>
    </LoadingDisplay>
  )
}

function parseToPageInt(value: string | null) {
  // default to page one if page value is invalid
  if (value == null) {
    return 1
  }
  try {
    const pageNumber = Number.parseInt(value)
    return Math.max(pageNumber, 1)
  } catch {
    return 1
  }
}
