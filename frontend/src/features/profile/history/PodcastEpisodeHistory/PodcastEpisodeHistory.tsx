import "./PodcastEpisodeHistory.css"
import { memo } from "react"
import { motion } from "motion/react"
import { MdDelete } from "react-icons/md"
import { PlayHistoryPodcastEpisode } from "../../../../hooks/podcast/usePlayHistory.ts"
import Button from "../../../../components/ui/button/Button.tsx"
import PodcastEpisodeCard from "../../../../components/PodcastEpisodeCard/index.tsx"
import useScreenDimensions from "../../../../hooks/useScreenDimensions.ts"

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
  const { isMobile } = useScreenDimensions()

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
          <motion.div
            className="profile-history-podcast-listen-history-item"
            key={`${episode.id}-item`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0 }}
          >
            <span className="profile-history-podcast-listen-history-count">
              {episodeCountOffset + index + 1}
            </span>
            <PodcastEpisodeCard key={episode.id} episode={episode}>
              <PodcastEpisodeCard.Artwork
                size={isMobile ? 96 : 144}
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
                keyProp={`profile-history-delete-podcast-episode-button-${episode.id}`}
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
          </motion.div>
        )
      })}
    </div>
  )
}

export default memo(PodcastEpisodeHistory)
