import "./PodcastDetailPage.css"
import { useContext, useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router"
import { toast } from "sonner"
import { IoArrowBackSharp } from "react-icons/io5"
import { Podcast, PodcastEpisode } from "../../../api/podcast/model/podcast"
import { getPodcastEpisodes } from "../../../api/podcast/podcastEpisode"
import PodcastEpisodeCard from "../../../components/PodcastEpisodeCard/PodcastEpisodeCard"
import PodcastCard from "../../../components/PodcastCard/PodcastCard"
import { PodcastEpisodeContext } from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider"

export default function PodcastDetailPage() {
  const { podcastId, podcastTitle } = useParams()
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [podcast, setPodcast] = useState<Podcast | null>(null)
  const [podcastEpisodes, setPodcastEpisodes] = useState<
    PodcastEpisode[] | null
  >(null)

  useEffect(() => {
    async function fetchPodcastEpisodes(podcastId: string) {
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
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message)
      }
    }

    if (podcastTitle) {
      document.title = `${decodeURIComponent(podcastTitle)} - xtal - podcasts`
    }
    if (podcastId) {
      fetchPodcastEpisodes(podcastId)
    }
  }, [podcastTitle, podcastId])

  return (
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
        {podcastEpisodes &&
          podcastEpisodes.map((episode) => {
            function handlePlayClick(podcastEpisode: PodcastEpisode) {
              if (podcastEpisodeContext) {
                podcastEpisodeContext.setEpisode(podcastEpisode)
              }
            }
            return (
              <PodcastEpisodeCard key={episode.id} episode={episode}>
                <PodcastEpisodeCard.Title />
                <PodcastEpisodeCard.PlayButton
                  handlePlayClick={handlePlayClick}
                />
                <PodcastEpisodeCard.Description />
              </PodcastEpisodeCard>
            )
          })}
      </div>
    </div>
  )
}
