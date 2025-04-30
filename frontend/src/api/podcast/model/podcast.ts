type Podcast = {
  // representation of a podcast for PodcastCard
  id: number
  url: string
  title: string
  description: string // could contain html elements
  author: string
  image: string
  latestPublishTime?: number // unix timestamp in seconds
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
  language: string
  categories: string[]
}

type TrendingPodcastFiltersType = {
  since: number
  offset?: number
  category?: string
} | null

type Transcript = {
  url: string
  type:
    | "application/json"
    | "application/srt"
    | "text/html"
    | "text/plain"
    | "text/srt"
    | "text/vtt"
}

type Person = {
  // represent a person of interest (e.g. hosts, co-hosts, guests) - https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md#person
  id: number // internal PodcastIndex.org person id
  name: string
  role: string // value should be the "role" in https://github.com/Podcastindex-org/podcast-namespace/blob/main/taxonomy.json
  group: string // value should be the "group" in https://github.com/Podcastindex-org/podcast-namespace/blob/main/taxonomy.json
  href: string // URL related to information about the person (e.g. homepage)
  img: string // picture / avatar of person
}

type PodcastEpisode = {
  id: number
  feedId: number
  feedUrl?: string
  title: string
  feedTitle?: string
  description: string
  contentUrl: string // url link to episode file
  contentType: string // Content-Type of the episode file (e.g. mp3 => "audio\/mpeg")
  durationInSeconds: number | null
  datePublished: number // unix epoch time in seconds
  isExplicit: boolean
  episodeNumber: number | null
  seasonNumber: number | null
  image: string
  language: string
  people: Person[] | null
  externalWebsiteUrl: string
  transcripts: Transcript[] | null
}

type PodcastCategory = {
  id: number
  name: string
}

export type {
  Podcast,
  TrendingPodcast,
  TrendingPodcastFiltersType,
  PodcastEpisode,
  PodcastCategory,
}
