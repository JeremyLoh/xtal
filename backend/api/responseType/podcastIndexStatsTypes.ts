export type PodcastIndexCurrentStatsResponse = {
  // https://podcastindex-org.github.io/docs-api/#tag--Stats
  status: "true" | "false"
  stats: {
    feedCountTotal: number // Total podcast feeds in the index
    episodeCountTotal: number // Total individual podcast episodes in the index
    feedsWithNewEpisodes3days: number // Podcast feeds with a new episode released in the last 3 days
    feedsWithNewEpisodes10days: number // Podcast feeds with a new episode released in the last 10 days
    feedsWithNewEpisodes30days: number // Podcast feeds with a new episode released in the last 30 days
    feedsWithNewEpisodes90days: number // Podcast feeds with a new episode released in the last 90 days
    feedsWithValueBlocks: number // Podcast feeds with a podcast:value tag in at least 1 episode
  }
  description: string // response description
}
