import "./PodcastDetailPage.css"
import { useContext, useEffect, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router"
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
  const [searchParams] = useSearchParams()
  const pageParam = searchParams.get("page")
  const [page] = useState<number>(parseToPageInt(pageParam))
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const { loading, podcast, podcastEpisodes, fetchPodcastEpisodes } =
    usePodcastEpisodes({ podcastId, page, limit: LIMIT })

  async function handleRefreshPodcastEpisodes() {
    if (podcastId) {
      await fetchPodcastEpisodes(podcastId)
    }
  }

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
        <Link
          to="/podcasts"
          style={{ textDecoration: "none", width: "fit-content" }}
        >
          <button className="podcast-detail-back-button">
            <IoArrowBackSharp size={16} />
            Back
          </button>
        </Link>
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
        <Pagination className="podcast-episode-pagination" currentPage={page} />
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
    return Number.parseInt(value)
  } catch {
    return 1
  }
}
