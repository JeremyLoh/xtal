import "./PodcastEpisodeDetailPage.css"
import { useEffect } from "react"
import { useParams } from "react-router"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import PodcastEpisodeCard from "../../../components/PodcastEpisodeCard/PodcastEpisodeCard.tsx"
import usePodcastEpisode from "../../../hooks/podcast/usePodcastEpisode.ts"

export default function PodcastEpisodeDetailPage() {
  const { podcastEpisodeId } = useParams()
  const { loading, episode, fetchPodcastEpisode } = usePodcastEpisode()

  useEffect(() => {
    if (podcastEpisodeId) {
      fetchPodcastEpisode(podcastEpisodeId)
    }
  }, [podcastEpisodeId, fetchPodcastEpisode])

  return (
    <LoadingDisplay loading={loading}>
      <div className="podcast-episode-detail-container">
        {episode && (
          <PodcastEpisodeCard episode={episode}>
            <PodcastEpisodeCard.Artwork
              size={200}
              title={episode.title + " podcast image"}
            />
            <PodcastEpisodeCard.Title />
            <PodcastEpisodeCard.Description />
          </PodcastEpisodeCard>
        )}
      </div>
    </LoadingDisplay>
  )
}
