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
  trendScore?: number
}

type FeedWith<T extends object> = PodcastIndexFeedBase & T

export type PodcastIndexFeed = FeedWith<{ itunesId: number | null }>

export type RecentPodcastIndexFeed = FeedWith<{
  oldestItemPublishTime: number
  itunesId: number | null
}>
