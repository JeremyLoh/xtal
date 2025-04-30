import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime.js"
import { usePodcastCardContext } from "./PodcastCardContext.ts"

dayjs.extend(relativeTime)

const LastActiveTime = function PodcastCardLastActiveTime() {
  const { podcast } = usePodcastCardContext()
  if (podcast.latestPublishTime == undefined) {
    return null
  }
  const timeFromNow = dayjs.unix(podcast.latestPublishTime).fromNow()
  return <div>Last Active {timeFromNow}</div>
}

export default LastActiveTime
