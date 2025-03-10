import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"
import Pill from "../Pill/Pill.tsx"

const EpisodeNumber = function PodcastEpisodeCardEpisodeNumber() {
  const { episode } = usePodcastEpisodeCardContext()
  if (episode.episodeNumber == null) {
    return null
  }
  const text = `Episode ${episode.episodeNumber}`
  return <Pill className="podcast-episode-card-episode-number">{text}</Pill>
}

export default EpisodeNumber
