import "./PodcastEpisodeDetailPage.css"
import { useCallback, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { IoArrowBackSharp } from "react-icons/io5"
import { PodcastEpisodeContext } from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import PodcastEpisodeCard from "../../../components/PodcastEpisodeCard/index.tsx"
import usePodcastEpisode from "../../../hooks/podcast/usePodcastEpisode.ts"
import Button from "../../../components/ui/button/Button.tsx"

export default function PodcastEpisodeDetailPage() {
  const { podcastId, podcastTitle, podcastEpisodeId } = useParams()
  const navigate = useNavigate()
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const { loading, error, episode, fetchPodcastEpisode } = usePodcastEpisode()

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

  const handleBackButtonNavigation = useCallback(() => {
    if (podcastId && podcastTitle) {
      const podcastDetailPageUrl = `/podcasts/${podcastTitle}/${podcastId}`
      navigate(podcastDetailPageUrl)
    }
  }, [navigate, podcastTitle, podcastId])

  return (
    <LoadingDisplay loading={loading}>
      <div className="podcast-episode-detail-container">
        <Button
          className="podcast-episode-detail-back-button"
          variant="primary"
          onClick={handleBackButtonNavigation}
        >
          <IoArrowBackSharp size={16} />
          Back
        </Button>
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
      </div>
    </LoadingDisplay>
  )
}
