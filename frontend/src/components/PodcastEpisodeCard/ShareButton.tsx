import { useCallback, useState } from "react"
import { IoShareSocialSharp } from "react-icons/io5"
import Button from "../ui/button/Button.tsx"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"
import Dialog, {
  DialogContent,
  DialogDimBackground,
} from "../Dialog/Dialog.tsx"
import useClickOutside from "../../hooks/useClickOutside.ts"

type PodcastEpisodeCardShareButtonProps = {
  onClick: (episode: PodcastEpisode) => void
}

const ShareButton = function PodcastEpisodeCardShareButton({
  onClick,
}: PodcastEpisodeCardShareButtonProps) {
  const { episode } = usePodcastEpisodeCardContext()
  const [open, setOpen] = useState<boolean>(false)
  const clickOutsideRef = useClickOutside<HTMLDivElement>({
    onClickOutside: () => {
      if (open) {
        setOpen(false)
      }
    },
  })
  const handleClick = useCallback(() => {
    setOpen(!open)
  }, [open])
  const handleCopy = useCallback(() => {
    onClick(episode)
  }, [episode, onClick])

  return (
    <>
      {open && <DialogDimBackground />}
      <div ref={clickOutsideRef}>
        <Button
          keyProp={`podcast-episode-share-button-${episode.id}`}
          data-testid="podcast-episode-share-button"
          variant="icon"
          title="Open Share Podcast Episode Dialog"
          onClick={handleClick}
        >
          <IoShareSocialSharp size={20} />
        </Button>
        <Dialog
          open={open}
          onClose={handleClick}
          title="Share this podcast episode"
          className="podcast-episode-share-dialog"
        >
          <DialogContent data-testid="podcast-episode-share-dialog-content">
            <Button
              keyProp={`podcast-episode-copy-link-button-${episode.id}`}
              data-testid="podcast-episode-copy-link-button"
              variant="primary"
              title="Copy Share Podcast Episode Link"
              onClick={handleCopy}
            >
              Copy
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default ShareButton
export type { PodcastEpisodeCardShareButtonProps }
