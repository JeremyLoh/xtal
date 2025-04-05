import "./PodcastDetailPage.css"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams } from "react-router"
import { IoReload } from "react-icons/io5"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import { PodcastEpisode } from "../../../api/podcast/model/podcast.ts"
import PodcastEpisodeCard from "../../../components/PodcastEpisodeCard/index.tsx"
import PodcastCard from "../../../components/PodcastCard/index.tsx"
import { PodcastEpisodeContext } from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"
import usePodcastEpisodes from "../../../hooks/podcast/usePodcastEpisodes.ts"
import Pagination from "../../../components/Pagination/Pagination.tsx"
import Breadcrumb from "../../../components/ui/breadcrumb/index.tsx"

const LIMIT = 10
const IMAGE_LAZY_LOAD_START_INDEX = 2 // zero based index

export default function PodcastDetailPage() {
  const { podcastId, podcastTitle } = useParams()
  const [searchParams] = useSearchParams()
  const pageParam = searchParams.get("page")
  const [page, setPage] = useState<number>(parseToPageInt(pageParam))
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
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
      <Breadcrumb>
        <Breadcrumb.Link
          href="/podcasts"
          data-testid="podcast-detail-page-podcasts-link"
        >
          Podcasts
        </Breadcrumb.Link>
        <Breadcrumb.Separator size={16} />
        {podcast && podcast.categories && podcast.categories.length > 0 && (
          <>
            <Breadcrumb.Link
              href={`/podcasts/${podcast.categories[0]}`}
              data-testid="podcast-detail-page-category-link"
            >
              {podcast.categories[0]}
            </Breadcrumb.Link>
            <Breadcrumb.Separator size={16} />
          </>
        )}
        <Breadcrumb.Item>{podcastTitle}</Breadcrumb.Item>
      </Breadcrumb>
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
            podcastEpisodes.map((episode, index) => {
              function handlePlayClick(podcastEpisode: PodcastEpisode) {
                if (podcastEpisodeContext) {
                  podcastEpisodeContext.setEpisode(podcastEpisode)
                }
              }
              return (
                <PodcastEpisodeCard key={episode.id} episode={episode}>
                  {index < IMAGE_LAZY_LOAD_START_INDEX ? (
                    <PodcastEpisodeCard.Artwork
                      size={144}
                      title={`${episode.title} podcast image`}
                    />
                  ) : (
                    <PodcastEpisodeCard.Artwork
                      size={144}
                      title={`${episode.title} podcast image`}
                      lazyLoad={true}
                    />
                  )}
                  <PodcastEpisodeCard.Title
                    url={`/podcasts/${podcastTitle}/${podcastId}/${episode.id}`}
                  />
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
