import { Link } from "react-router"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"

const EpisodeWebsiteLink = function PodcastEpisodeCardExternalWebsiteLink() {
  const { episode } = usePodcastEpisodeCardContext()
  if (episode.externalWebsiteUrl == null) {
    return null
  }
  return (
    <Link
      className="podcast-episode-card-external-website-link"
      to={episode.externalWebsiteUrl}
    >
      {episode.externalWebsiteUrl}
    </Link>
  )
}

export default EpisodeWebsiteLink
