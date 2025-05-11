import { Link } from "react-router"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"

const linkStyle = { textDecoration: "none", width: "fit-content" }

const EpisodeWebsiteLink = function PodcastEpisodeCardExternalWebsiteLink() {
  const { episode } = usePodcastEpisodeCardContext()
  if (episode.externalWebsiteUrl == null) {
    return null
  }
  return (
    <Link to={episode.externalWebsiteUrl} style={linkStyle}>
      {episode.externalWebsiteUrl}
    </Link>
  )
}

export default EpisodeWebsiteLink
