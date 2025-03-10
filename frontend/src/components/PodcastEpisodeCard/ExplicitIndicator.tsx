import { TbExplicit, TbExplicitOff } from "react-icons/tb"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"

const ExplicitIndicator = function PodcastEpisodeCardExplicitIndicator() {
  const { episode } = usePodcastEpisodeCardContext()
  if (episode.isExplicit) {
    return (
      <p className="podcast-episode-card-explicit-indicator">
        <TbExplicit size={24} /> Explicit
      </p>
    )
  } else {
    return (
      <p className="podcast-episode-card-explicit-indicator">
        <TbExplicitOff size={24} /> Not Explicit
      </p>
    )
  }
}

export default ExplicitIndicator
