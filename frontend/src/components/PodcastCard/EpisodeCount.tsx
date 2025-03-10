import { usePodcastCardContext } from "./PodcastCardContext.ts"
import Pill from "../Pill/Pill.tsx"

const EpisodeCount = function PodcastCardEpisodeCount() {
  const { podcast } = usePodcastCardContext()
  return (
    <Pill>
      {podcast.episodeCount ? `${podcast.episodeCount} episodes` : "0 episodes"}
    </Pill>
  )
}

export default EpisodeCount
