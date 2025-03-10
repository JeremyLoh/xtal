import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"

const Duration = function PodcastEpisodeCardDuration() {
  const { episode } = usePodcastEpisodeCardContext()
  if (episode.durationInSeconds == null) {
    return null
  }
  const hours = Math.floor(episode.durationInSeconds / 3600)
  const minutes =
    hours === 0
      ? Math.floor(episode.durationInSeconds / 60)
      : Math.floor((episode.durationInSeconds - hours * 3600) / 60)
  const durationInMinutes =
    hours === 0 ? `${minutes} min` : `${hours} hr ${minutes} min`
  return <p className="podcast-episode-card-duration">{durationInMinutes}</p>
}

export default Duration
