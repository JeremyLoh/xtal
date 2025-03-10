import { Link } from "react-router"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"

type TitleProps = {
  url?: string
}

const Title = function PodcastEpisodeCardTitle({ url }: TitleProps) {
  const { episode } = usePodcastEpisodeCardContext()
  if (url) {
    return (
      <Link to={url} style={{ textDecoration: "none", width: "fit-content" }}>
        <p className="podcast-episode-card-title active-link">
          {episode.title}
        </p>
      </Link>
    )
  } else {
    return <p className="podcast-episode-card-title">{episode.title}</p>
  }
}

export default Title
export type { TitleProps }
