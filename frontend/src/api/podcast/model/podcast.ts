type Podcast = {
  // representation of a podcast for PodcastCard
  id: number
  url: string
  title: string
  description: string // could contain html elements
  author: string
  image: string
  language: string
  categories: string[]
  episodeCount?: number
}

type TrendingPodcast = {
  id: number
  url: string
  title: string
  description: string // could contain html elements
  author: string
  image: string
  latestPublishTime: number | undefined // unix timestamp in seconds
  itunesId: number | null
  trendScore: number
  language: string
  categories: string[]
}

export type { Podcast, TrendingPodcast }
