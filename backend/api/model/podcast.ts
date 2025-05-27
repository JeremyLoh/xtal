import { Language } from "../../model/podcast.js"

type PodcastIndexCategory = {
  [categoryId: string]: string
}

export type PodcastIndexFeed = {
  id: number
  url: string
  link?: string
  title: string
  description: string
  author: string
  image: string
  artwork: string
  newestItemPublishTime?: number
  newestItemPubdate?: number
  lastUpdateTime?: number
  itunesId: number | null
  trendScore?: number
  episodeCount?: number
  explicit?: boolean
  language: Language
  categories: PodcastIndexCategory | null /* could have null value */
}

export type RecentPodcastIndexFeed = {
  id: number
  url: string
  title: string
  description: string
  image: string
  newestItemPublishTime: number
  oldestItemPublishTime: number
  itunesId: number | null
  language: Language
  categories: PodcastIndexCategory | null /* could have null value */
}
