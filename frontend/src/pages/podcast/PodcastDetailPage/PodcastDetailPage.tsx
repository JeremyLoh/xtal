import "./PodcastDetailPage.css"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import { Podcast, PodcastEpisode } from "../../../api/podcast/model/podcast"
import { getPodcastEpisodes } from "../../../api/podcast/podcastEpisode"
import PodcastEpisodeCard from "../../../components/PodcastEpisodeCard/PodcastEpisodeCard"
import PodcastCard from "../../../components/PodcastCard/PodcastCard"

export default function PodcastDetailPage() {
  const { podcastId, podcastTitle } = useParams()
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
        // TODO show error toast
        console.error(error.message)
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
      <div className="podcast-info-container">
        {podcast && (
          <PodcastCard podcast={podcast} customClassName="podcast-info-card">
            <PodcastCard.Artwork size={144} />
            <div>
              <PodcastCard.TitleAndAuthor variant="large" />
              <PodcastCard.EpisodeCount />
            </div>
          </PodcastCard>
        )}
      </div>
      <h2>Episodes</h2>
      <div className="podcast-episode-container">
        {podcastEpisodes &&
          podcastEpisodes.map((episode) => {
            return (
              <PodcastEpisodeCard key={episode.id} episode={episode}>
                <PodcastEpisodeCard.Artwork size={144} />
                <PodcastEpisodeCard.Title />
                <PodcastEpisodeCard.Description />
              </PodcastEpisodeCard>
            )
          })}
      </div>
    </div>
  )
}
