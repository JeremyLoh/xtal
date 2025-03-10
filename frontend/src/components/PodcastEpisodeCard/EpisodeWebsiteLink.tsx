import { Link } from "react-router"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"

const EpisodeWebsiteLink = function PodcastEpisodeCardExternalWebsiteLink() {
  const { episode } = usePodcastEpisodeCardContext()
  if (episode.externalWebsiteUrl == null) {
    return null
  }
  return (
    <Link
      to={episode.externalWebsiteUrl}
      style={{ textDecoration: "none", width: "fit-content" }}
    >
      {episode.externalWebsiteUrl}
    </Link>
  )
}

export default EpisodeWebsiteLink
