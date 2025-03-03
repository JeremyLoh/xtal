import { PodcastIndexFeed } from "../model/podcast.js"

export type PodcastIndexTrendingPodcastResponse = {
  // "/podcasts/trending" - https://podcastindex-org.github.io/docs-api/#get-/podcasts/trending
  status: "true" | "false"
  feeds: PodcastIndexFeed[]
  count: number
  max: number | null
  since: string | null
  description: string // response description
}

export type PodcastIndexPodcastByFeedIdResponse = {
  // https://podcastindex-org.github.io/docs-api/#get-/podcasts/byfeedid
  status: "true" | "false"
  feed: PodcastIndexFeed
  description: string // response description
}
