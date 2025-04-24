import { useCallback } from "react"
import { IoShareSocialSharp } from "react-icons/io5"
import Button from "../ui/button/Button.tsx"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"

type PodcastEpisodeCardShareButtonProps = {
  onClick: (episode: PodcastEpisode) => void
}

const ShareButton = function PodcastEpisodeCardShareButton({
  onClick,
}: PodcastEpisodeCardShareButtonProps) {
  const { episode } = usePodcastEpisodeCardContext()
  const handleClick = useCallback(() => {
    onClick(episode)
  }, [episode, onClick])

  return (
    <Button
      keyProp={`podcast-episode-share-button-${episode.id}`}
      data-testid="podcast-episode-share-button"
      onClick={handleClick}
      title="Copy Share Podcast Episode Link"
    >
      <IoShareSocialSharp size={20} />
    </Button>
  )
}

export default ShareButton
export type { PodcastEpisodeCardShareButtonProps }
