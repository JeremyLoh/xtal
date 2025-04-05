import "./PodcastEpisodeDetailPage.css"
import { useCallback, useContext, useEffect } from "react"
import { useParams } from "react-router"
import { PodcastEpisodeContext } from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import PodcastEpisodeCard from "../../../components/PodcastEpisodeCard/index.tsx"
import usePodcastEpisode from "../../../hooks/podcast/usePodcastEpisode.ts"
import Breadcrumb from "../../../components/ui/breadcrumb/index.tsx"

export default function PodcastEpisodeDetailPage() {
  const { podcastId, podcastTitle, podcastEpisodeId } = useParams()
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

  return (
    <div className="podcast-episode-detail-container">
      <Breadcrumb>
        <Breadcrumb.Link
          href="/podcasts"
          data-testid="podcast-episode-detail-podcasts-link"
        >
          Podcasts
        </Breadcrumb.Link>
        <Breadcrumb.Separator size={16} />
        <Breadcrumb.Link
          href={`/podcasts/${podcastTitle}/${podcastId}`}
          data-testid="podcast-episode-detail-page-link"
        >
          {podcastTitle}
        </Breadcrumb.Link>
      </Breadcrumb>

      {!episode && error && <p className="error-text">{error}</p>}

      <LoadingDisplay loading={loading}>
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
