import "./PodcastEpisodeHistory.css"
import { memo } from "react"
import { MdDelete } from "react-icons/md"
import { PlayHistoryPodcastEpisode } from "../../../../hooks/podcast/usePlayHistory.ts"
import Button from "../../../../components/ui/button/Button.tsx"
import PodcastEpisodeCard from "../../../../components/PodcastEpisodeCard/index.tsx"

type PodcastEpisodeHistoryProps = {
  IMAGE_LAZY_LOAD_START_INDEX: number
  episodes: PlayHistoryPodcastEpisode[] | null
  episodeCountOffset: number
  onDelete: (episodeId: number) => Promise<void>
}

function PodcastEpisodeHistory({
  IMAGE_LAZY_LOAD_START_INDEX,
  episodes,
  episodeCountOffset,
  onDelete,
}: PodcastEpisodeHistoryProps) {
  if (episodes == null || episodes.length === 0) {
    return <p>Not available. Start listening to some podcasts!</p>
  }

  return (
    <div className="profile-history-podcast-episodes-container">
      {episodes.map((data, index) => {
        const episode = data.podcastEpisode
        const podcastTitle = episode.feedTitle
        const podcastId = episode.feedId
        return (
          <div
            className="profile-history-podcast-listen-history-item"
            key={`${episode.id}-item`}
          >
            <span className="profile-history-podcast-listen-history-count">
              {episodeCountOffset + index + 1}
            </span>
            <PodcastEpisodeCard key={episode.id} episode={episode}>
              <PodcastEpisodeCard.Artwork
                size={144}
                title={`${episode.title} podcast image`}
                lazyLoad={index >= IMAGE_LAZY_LOAD_START_INDEX}
              />
              <PodcastEpisodeCard.Title
                url={`/podcasts/${podcastTitle}/${podcastId}/${episode.id}`}
              />
              <PodcastEpisodeCard.PublishDate />
              <PodcastEpisodeCard.Duration />
              <PodcastEpisodeCard.ExplicitIndicator />
              <PodcastEpisodeCard.EpisodeWebsiteLink />
              <PodcastEpisodeCard.EpisodeNumber />
              <PodcastEpisodeCard.SeasonNumber />
            </PodcastEpisodeCard>
            <div className="profile-history-podcast-episode-actions">
              <span>
                Last Played on {data.lastPlayedTimestamp.toDateString()}
              </span>
              <Button
                onClick={() => onDelete(episode.id)}
                data-testid={`profile-history-delete-button-podcast-episode-${episode.id}`}
                className="profile-history-delete-podcast-episode-button"
                variant="danger"
                title="Delete podcast episode from listen history"
              >
                <MdDelete size={24} />
                Delete
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default memo(PodcastEpisodeHistory)
