type PodcastIndexCategory = {
  [categoryId: string]: string
}

export type PodcastIndexFeedBase = {
  id: number
  url?: string
  link?: string
  title: string
  description?: string
  author?: string
  image: string
  artwork?: string
  newestItemPublishTime?: number
  newestItemPubdate?: number
  lastUpdateTime?: number
  episodeCount?: number
  explicit?: boolean
  language: string
  categories?: PodcastIndexCategory | null
}

export type PodcastIndexFeed = PodcastIndexFeedBase & {
  trendScore?: number
  itunesId: number | null
}

export type RecentPodcastIndexFeed = PodcastIndexFeedBase & {
  oldestItemPublishTime: number
  itunesId: number | null
}
