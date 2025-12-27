import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime.js"
import { usePodcastCardContext } from "./PodcastCardContext.ts"

dayjs.extend(relativeTime)

type PodcastCardLastActiveTimeProps = {
  className?: string
}

const LastActiveTime = function PodcastCardLastActiveTime({
  className,
}: PodcastCardLastActiveTimeProps) {
  const { podcast } = usePodcastCardContext()
  if (podcast.latestPublishTime == undefined) {
    return null
  }
  const timeFromNow = dayjs.unix(podcast.latestPublishTime).fromNow()
  return (
    <div className={`podcast-card-last-active ${className ?? ""}`}>
      Last Active {timeFromNow}
    </div>
  )
}

export default LastActiveTime
export type { PodcastCardLastActiveTimeProps }
