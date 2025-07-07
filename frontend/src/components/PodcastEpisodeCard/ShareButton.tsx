import { toast } from "sonner"
import { ChangeEvent, useCallback, useState } from "react"
import { IoShareSocialSharp } from "react-icons/io5"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration.js"
import customParseFormat from "dayjs/plugin/customParseFormat.js"
import Button from "../ui/button/Button.tsx"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"
import Dialog, { DialogContent } from "../Dialog/Dialog.tsx"

dayjs.extend(duration)
dayjs.extend(customParseFormat)

type PodcastEpisodeCardShareButtonProps = {
  onClick: (episode: PodcastEpisode, startDurationInSeconds: number) => void
}

const ShareButton = function PodcastEpisodeCardShareButton({
  onClick,
}: PodcastEpisodeCardShareButtonProps) {
  const { episode } = usePodcastEpisodeCardContext()
  const [open, setOpen] = useState<boolean>(false)
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
    <div className="podcast-episode-card-share-button-container">
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
  const [startDurationInput, setStartDurationInput] = useState(() =>
    dayjs.duration(0, "seconds").format("HH:mm:ss")
  )

  function handleRangeDurationChange(event: ChangeEvent<HTMLInputElement>) {
    const seconds = Number(event.target.value)
    setStartDuration(seconds)
    setStartDurationInput(dayjs.duration(seconds, "seconds").format("HH:mm:ss"))
  }

  function handleInputDurationChange(event: ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value
    setStartDurationInput(inputValue)
    const parsedDuration = dayjs(inputValue, "HH:mm:ss", true)
    if (!parsedDuration.isValid()) {
      return
    }
    const updatedTimeInSeconds =
      parsedDuration.second() +
      parsedDuration.minute() * 60 +
      parsedDuration.hour() * 3600
    if (updatedTimeInSeconds === startDuration) {
      return
    }
    if (updatedTimeInSeconds > episodeDurationInSeconds) {
      toast.error("Time exceeds episode duration")
      return
    }
    setStartDuration(updatedTimeInSeconds)
  }

  function handleCopy() {
    onCopy(startDuration)
  }

  return (
    <>
      <label
        htmlFor="start-duration"
        className="podcast-episode-start-duration-container"
      >
        Start at
        <input
          className="podcast-episode-time-input"
          data-testid="podcast-episode-start-playback-edit-input"
          value={startDurationInput}
          onChange={handleInputDurationChange}
        />
      </label>
      <input
        className="podcast-episode-start-playback-time"
        id="start-duration"
        type="range"
        value={startDuration}
        min="0"
        max={episodeDurationInSeconds}
        step="1"
        onChange={handleRangeDurationChange}
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
