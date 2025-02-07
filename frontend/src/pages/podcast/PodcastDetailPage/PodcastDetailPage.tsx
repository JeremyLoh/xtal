import "./PodcastDetailPage.css"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import { PodcastEpisode } from "../../../api/podcast/model/podcast"
import { getPodcastEpisodes } from "../../../api/podcast/podcastEpisode"
import PodcastEpisodeCard from "../../../components/PodcastEpisodeCard/PodcastEpisodeCard"

export default function PodcastDetailPage() {
  const { podcastId, podcastTitle } = useParams()
  const abortControllerRef = useRef<AbortController | null>(null)
  const [podcastEpisodes, setPodcastEpisodes] = useState<
    PodcastEpisode[] | null
  >(null)
  // const [podcast, setPodcast] = useState<Podcast | null>(null)

  useEffect(() => {
    async function fetchPodcastEpisodes(podcastId: string) {
      // TODO fetch data for the podcast based on podcast id. To get summary information
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
          // TODO update backend api for podcast episodes to return feed information as well
          // setPodcast({
          //   id: podcastEpisodes.data[0].feedId,
          //   url: podcastEpisodes.data[0].externalWebsiteUrl,
          //   title: "",
          //   description: "",
          //   author: "",
          //   image: "",
          //   language: podcastEpisodes.data[0].language,
          //   categories: [],
          // })
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
