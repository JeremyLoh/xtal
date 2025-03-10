import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"
import Pill from "../Pill/Pill.tsx"

const SeasonNumber = function PodcastEpisodeCardSeasonNumber() {
  const { episode } = usePodcastEpisodeCardContext()
  if (episode.seasonNumber == null || episode.seasonNumber <= 0) {
    return null
  }
  const seasonNumberText = `Season ${episode.seasonNumber}`
  return (
    <Pill className="podcast-episode-card-season-number">
      {seasonNumberText}
    </Pill>
  )
}

export default SeasonNumber
