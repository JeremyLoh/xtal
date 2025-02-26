import "./PodcastDetailPage.css"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router"
import { toast } from "sonner"
import { IoArrowBackSharp, IoReload } from "react-icons/io5"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import { Podcast, PodcastEpisode } from "../../../api/podcast/model/podcast.ts"
import { getPodcastEpisodes } from "../../../api/podcast/podcastEpisode.ts"
import PodcastEpisodeCard from "../../../components/PodcastEpisodeCard/PodcastEpisodeCard.tsx"
import PodcastCard from "../../../components/PodcastCard/PodcastCard.tsx"
import { PodcastEpisodeContext } from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"

export default function PodcastDetailPage() {
  const { podcastId, podcastTitle } = useParams()
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [podcast, setPodcast] = useState<Podcast | null>(null)
  const [podcastEpisodes, setPodcastEpisodes] = useState<
    PodcastEpisode[] | null
  >(null)

  const fetchPodcastEpisodes = useCallback(async (podcastId: string) => {
    setLoading(true)
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    try {
      const podcastEpisodes = await getPodcastEpisodes(
        abortControllerRef.current,
        {
          id: podcastId,
          limit: 10,
        }
      )
      if (podcastEpisodes && podcastEpisodes.data) {
        setPodcastEpisodes(podcastEpisodes.data.episodes)
        setPodcast(podcastEpisodes.data.podcast)
      } else {
        setLoading(false) // prevent infinite load on no data
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false) // prevent infinite loading on error
    }
  }, [])

  async function handleRefreshPodcastEpisodes() {
    if (podcastId) {
      await fetchPodcastEpisodes(podcastId)
    }
  }

  useEffect(() => {
    if (podcastTitle) {
      document.title = `${decodeURIComponent(podcastTitle)} - xtal - podcasts`
    }
    if (podcastId) {
      fetchPodcastEpisodes(podcastId)
    }
  }, [fetchPodcastEpisodes, podcastTitle, podcastId])

  useEffect(() => {
    // prevent race condition between setLoading and set podcast episodes, display of "no episode found" placeholder before podcast data set state
    if (podcast && podcastEpisodes) {
      setLoading(false)
    }
  }, [podcast, podcastEpisodes])

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

        <h2>Episodes</h2>
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
