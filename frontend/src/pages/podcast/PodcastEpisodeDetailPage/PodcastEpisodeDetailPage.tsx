import "./PodcastEpisodeDetailPage.css"
import { useCallback, useContext, useEffect } from "react"
import { useParams } from "react-router"
import { PodcastEpisodeContext } from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import PodcastEpisodeCard from "../../../components/PodcastEpisodeCard/index.tsx"
import usePodcastEpisode from "../../../hooks/podcast/usePodcastEpisode.ts"
import PodcastEpisodeDetailPageNavigation from "../../../features/podcast/navigation/PodcastEpisodeDetailPageNavigation/PodcastEpisodeDetailPageNavigation.tsx"
import usePlayHistory from "../../../hooks/podcast/usePlayHistory.ts"

export default function PodcastEpisodeDetailPage() {
  const { podcastId, podcastTitle, podcastEpisodeId } = useParams()
  const { addPlayPodcastEpisode } = usePlayHistory()
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const { loading, error, episode, fetchPodcastEpisode } = usePodcastEpisode()

  useEffect(() => {
    if (episode) {
      return
    }
    if (podcastEpisodeId && fetchPodcastEpisode) {
      fetchPodcastEpisode(podcastEpisodeId)
    }
  }, [episode, podcastEpisodeId, fetchPodcastEpisode])

  const handlePlayClick = useCallback(async () => {
    if (podcastEpisodeContext && episode) {
      podcastEpisodeContext.setEpisode(episode)
      const resumePlayTimeInSeconds = 0
      await addPlayPodcastEpisode(episode, resumePlayTimeInSeconds)
    }
  }, [podcastEpisodeContext, episode, addPlayPodcastEpisode])

  return (
    <div className="podcast-episode-detail-container">
      <PodcastEpisodeDetailPageNavigation
        podcastId={podcastId}
        podcastTitle={podcastTitle}
      />
      <LoadingDisplay loading={loading}>
        {!episode && error && <p className="error-text">{error}</p>}
        {episode && (
          <PodcastEpisodeCard episode={episode}>
            <PodcastEpisodeCard.Artwork
              size={200}
              title={episode.title + " podcast image"}
            />
            <PodcastEpisodeCard.Title />
            <PodcastEpisodeCard.PublishDate />
            <PodcastEpisodeCard.Duration />
            <PodcastEpisodeCard.ExplicitIndicator />
            <PodcastEpisodeCard.EpisodeWebsiteLink />
            <PodcastEpisodeCard.PlayButton onPlayClick={handlePlayClick} />
            <PodcastEpisodeCard.Description className="podcast-episode-detail-description" />
          </PodcastEpisodeCard>
        )}
      </LoadingDisplay>
    </div>
  )
}
