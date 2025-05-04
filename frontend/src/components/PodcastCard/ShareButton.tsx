import { memo, useCallback } from "react"
import { IoShareSocialSharp } from "react-icons/io5"
import { usePodcastCardContext } from "./PodcastCardContext.ts"
import { Podcast } from "../../api/podcast/model/podcast.ts"
import Button from "../ui/button/Button.tsx"

type PodcastCardShareButtonProps = {
  onClick: (podcast: Podcast) => void
}

const ShareButton = function PodcastCardShareButton({
  onClick,
}: PodcastCardShareButtonProps) {
  const { podcast } = usePodcastCardContext()
  const handleClick = useCallback(() => {
    onClick(podcast)
  }, [onClick, podcast])

  return (
    <Button
      keyProp={`podcast-share-button-${podcast.id}`}
      data-testid="podcast-share-button"
      variant="icon"
      onClick={handleClick}
      title="Copy Share Podcast Link"
    >
      <IoShareSocialSharp size={20} />
    </Button>
  )
}

export default memo(ShareButton)
export type { PodcastCardShareButtonProps }
