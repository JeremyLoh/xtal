import { IoPlaySharp } from "react-icons/io5"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"

type PlayButtonProps = {
  onPlayClick: (podcastEpisode: PodcastEpisode) => void
}

const PlayButton = function PodcastEpisodeCardPlayButton({
  onPlayClick,
}: PlayButtonProps) {
  const { episode } = usePodcastEpisodeCardContext()
  return (
    <button
      onClick={() => onPlayClick(episode)}
      className="podcast-episode-card-play-button"
    >
      <IoPlaySharp size={16} />
      Play
    </button>
  )
}

export default PlayButton
export type { PlayButtonProps }
