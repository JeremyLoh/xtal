import { ChangeEvent, useCallback, useState } from "react"
import { IoShareSocialSharp } from "react-icons/io5"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration.js"
import Button from "../ui/button/Button.tsx"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"
import Dialog, {
  DialogContent,
  DialogDimBackground,
} from "../Dialog/Dialog.tsx"
import useClickOutside from "../../hooks/useClickOutside.ts"

dayjs.extend(duration)

type PodcastEpisodeCardShareButtonProps = {
  onClick: (episode: PodcastEpisode, startDurationInSeconds: number) => void
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
  const handleCopy = useCallback(
    (startDurationInSeconds: number) => {
      onClick(episode, startDurationInSeconds)
    },
    [episode, onClick]
  )

  return (
    <div
      ref={clickOutsideRef}
      className="podcast-episode-card-share-button-container"
    >
      {open && <DialogDimBackground onClose={handleClick} />}
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
          <ShareButtonDialogContent
            episodeId={episode.id}
            episodeDurationInSeconds={episode.durationInSeconds || 0}
            onCopy={handleCopy}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ShareButtonDialogContent({
  episodeId,
  episodeDurationInSeconds,
  onCopy,
}: {
  episodeId: number
  episodeDurationInSeconds: number
  onCopy: (startDurationInSeconds: number) => void
}) {
  const [startDuration, setStartDuration] = useState<number>(0)
  function handleDurationChange(event: ChangeEvent<HTMLInputElement>) {
    setStartDuration(Number(event.target.value))
  }
  function handleCopy() {
    onCopy(startDuration)
  }
  return (
    <>
      <label htmlFor="start-duration">
        Start at {dayjs.duration(startDuration, "seconds").format("HH:mm:ss")}
      </label>
      <input
        className="podcast-episode-start-playback-time"
        id="start-duration"
        type="range"
        value={startDuration}
        min="0"
        max={episodeDurationInSeconds}
        step="1"
        onChange={handleDurationChange}
      />
      <Button
        keyProp={`podcast-episode-copy-link-button-${episodeId}`}
        data-testid="podcast-episode-copy-link-button"
        variant="primary"
        title="Copy Share Podcast Episode Link"
        onClick={handleCopy}
      >
        Copy
      </Button>
    </>
  )
}

export default ShareButton
export type { PodcastEpisodeCardShareButtonProps }
