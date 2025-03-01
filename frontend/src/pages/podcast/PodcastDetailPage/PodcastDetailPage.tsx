import "./PodcastDetailPage.css"
import { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { IoArrowBackSharp, IoReload } from "react-icons/io5"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import { PodcastEpisode } from "../../../api/podcast/model/podcast.ts"
import PodcastEpisodeCard from "../../../components/PodcastEpisodeCard/PodcastEpisodeCard.tsx"
import PodcastCard from "../../../components/PodcastCard/PodcastCard.tsx"
import { PodcastEpisodeContext } from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"
import usePodcastEpisodes from "../../../hooks/podcast/usePodcastEpisodes.ts"
import Pagination from "../../../components/Pagination/Pagination.tsx"

const LIMIT = 10

export default function PodcastDetailPage() {
  const { podcastId, podcastTitle } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const pageParam = searchParams.get("page")
  const [page, setPage] = useState<number>(parseToPageInt(pageParam))
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const { loading, podcast, podcastEpisodes, fetchPodcastEpisodes } =
    usePodcastEpisodes({ podcastId, page, limit: LIMIT })

  async function handleRefreshPodcastEpisodes() {
    if (podcastId) {
      await fetchPodcastEpisodes(podcastId)
    }
  }

  const handlePreviousPageClick = useCallback(
    (currentPage: number) => {
      setSearchParams((previous) => {
        return {
          ...previous,
          page: currentPage - 1,
        }
      })
      setPage(currentPage - 1)
    },
    [setSearchParams]
  )

  const handleNextPageClick = useCallback(
    (currentPage: number) => {
      setSearchParams((previous) => {
        return {
          ...previous,
          page: currentPage + 1,
        }
      })
      setPage(currentPage + 1)
    },
    [setSearchParams]
  )

  const handlePageClick = useCallback(
    (pageNumber: number) => {
      setSearchParams((previous) => {
        return {
          ...previous,
          page: pageNumber,
        }
      })
      setPage(pageNumber)
    },
    [setSearchParams]
  )

  const handleBackButtonNavigation = useCallback(() => {
    // depends on how react router stores in window.history.state (we use index (idx) that is zero based to check)
    const hasPreviousHistoryRoute =
      window.history && window.history.state.idx >= 1
    if (hasPreviousHistoryRoute) {
      navigate(-1)
    } else {
      navigate("/podcasts")
    }
  }, [navigate])

  useEffect(() => {
    if (podcastTitle) {
      document.title = `${decodeURIComponent(podcastTitle)} - xtal - podcasts`
    }
  }, [podcastTitle])

  useEffect(() => {
    if (podcastId) {
      fetchPodcastEpisodes(podcastId)
    }
  }, [fetchPodcastEpisodes, podcastId])

  return (
    <LoadingDisplay loading={loading}>
      <div className="podcast-detail-container">
        <button
          className="podcast-detail-back-button"
          onClick={handleBackButtonNavigation}
        >
          <IoArrowBackSharp size={16} />
          Back
        </button>
        <div className="podcast-info-container">
          {podcast && (
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
          )}
        </div>

        <h2 className="podcast-episode-section-title">Episodes</h2>
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
        <div className="podcast-episode-container">
          {podcastEpisodes ? (
            podcastEpisodes.map((episode) => {
              function handlePlayClick(podcastEpisode: PodcastEpisode) {
                if (podcastEpisodeContext) {
                  podcastEpisodeContext.setEpisode(podcastEpisode)
                }
              }
              return (
                <PodcastEpisodeCard key={episode.id} episode={episode}>
                  <PodcastEpisodeCard.Artwork
                    size={144}
                    title={`${episode.title} podcast image`}
                  />
                  <PodcastEpisodeCard.Title />
                  <PodcastEpisodeCard.PublishDate />
                  <PodcastEpisodeCard.Duration />
                  <PodcastEpisodeCard.EpisodeNumber />
                  <PodcastEpisodeCard.SeasonNumber />
                  <PodcastEpisodeCard.PlayButton
                    onPlayClick={handlePlayClick}
                  />
                  <PodcastEpisodeCard.Description />
                </PodcastEpisodeCard>
              )
            })
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
    return pageNumber >= 1 ? pageNumber : 1
  } catch {
    return 1
  }
}
