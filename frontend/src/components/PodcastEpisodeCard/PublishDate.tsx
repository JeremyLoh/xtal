import dayjs from "dayjs"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"

const PublishDate = function PodcastEpisodeCardPublishDate() {
  const { episode } = usePodcastEpisodeCardContext()
  const date = dayjs.unix(episode.datePublished).format("MMMM D, YYYY")
  return <p className="podcast-episode-card-publish-date">{date}</p>
}

export default PublishDate
