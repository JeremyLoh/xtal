import { PodcastEpisode } from "./podcast.ts"

type AccountPodcastEpisodePlayHistory = {
  // response from backend endpoint GET "/api/account/podcast-play-history"
  // retrieve the sorted descending order of user podcast episode listen history
  lastPlayedTimestamp: string // ISO8601 timestamp (e.g. "2025-04-11T06:56:26.08+00:00")
  resumePlayTimeInSeconds: number
  podcastEpisode: PodcastEpisode
}

export type { AccountPodcastEpisodePlayHistory }
