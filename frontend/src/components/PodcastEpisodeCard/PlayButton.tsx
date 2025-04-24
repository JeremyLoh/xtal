import { useCallback } from "react"
import { IoPlaySharp } from "react-icons/io5"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"
import Button from "../ui/button/Button.tsx"

type PlayButtonProps = {
  onPlayClick: (podcastEpisode: PodcastEpisode) => void
}

const PlayButton = function PodcastEpisodeCardPlayButton({
  onPlayClick,
}: PlayButtonProps) {
  const { episode } = usePodcastEpisodeCardContext()
  const handleClick = useCallback(
    () => onPlayClick(episode),
    [episode, onPlayClick]
  )
  return (
    <Button
      keyProp={`podcast-episode-card-play-button-${episode.id}`}
      variant="secondary"
      className="podcast-episode-card-play-button"
      onClick={handleClick}
    >
      <IoPlaySharp size={16} />
      Play
    </Button>
  )
}

export default PlayButton
export type { PlayButtonProps }
