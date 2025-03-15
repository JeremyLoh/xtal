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
  const handleClick = useCallback(() => onPlayClick(episode), [])
  return (
    <Button onClick={handleClick} className="podcast-episode-card-play-button">
      <IoPlaySharp size={16} />
      Play
    </Button>
  )
}

export default PlayButton
export type { PlayButtonProps }
