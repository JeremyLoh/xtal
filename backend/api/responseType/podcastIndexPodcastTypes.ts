import { PodcastIndexFeed, RecentPodcastIndexFeed } from "../model/podcast.js"

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

export type PodcastIndexPodcastBySearchTermResponse = {
  // https://podcastindex-org.github.io/docs-api/#get-/search/byterm
  status: "true" | "false"
  count: number
  description: string // response description
  feeds: PodcastIndexFeed[]
}

export type PodcastIndexRecentPodcastResponse = {
  // https://podcastindex-org.github.io/docs-api/#get-/recent/feeds
  status: "true" | "false"
  feeds: RecentPodcastIndexFeed[]
  count: number
  max: number | null // value of max parameter passed to request
  since: number | null // value of since parameter passed to request
  description: string // response description
}
