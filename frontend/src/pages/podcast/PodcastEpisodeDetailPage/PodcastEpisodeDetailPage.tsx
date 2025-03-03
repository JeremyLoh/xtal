import "./PodcastEpisodeDetailPage.css"
import { useCallback, useContext, useEffect } from "react"
import { useParams } from "react-router"
import { PodcastEpisodeContext } from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import PodcastEpisodeCard from "../../../components/PodcastEpisodeCard/PodcastEpisodeCard.tsx"
import usePodcastEpisode from "../../../hooks/podcast/usePodcastEpisode.ts"

export default function PodcastEpisodeDetailPage() {
  const { podcastEpisodeId } = useParams()
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const { loading, episode, fetchPodcastEpisode } = usePodcastEpisode()

  useEffect(() => {
    if (podcastEpisodeId) {
      fetchPodcastEpisode(podcastEpisodeId)
    }
  }, [podcastEpisodeId, fetchPodcastEpisode])

  const handlePlayClick = useCallback(() => {
    if (podcastEpisodeContext) {
      podcastEpisodeContext.setEpisode(episode)
    }
  }, [podcastEpisodeContext, episode])

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
            <PodcastEpisodeCard.PublishDate />
            <PodcastEpisodeCard.Duration />
            <PodcastEpisodeCard.EpisodeWebsiteLink />
            <PodcastEpisodeCard.PlayButton onPlayClick={handlePlayClick} />
            <PodcastEpisodeCard.Description className="podcast-episode-detail-description" />
          </PodcastEpisodeCard>
        )}
      </div>
    </LoadingDisplay>
  )
}
