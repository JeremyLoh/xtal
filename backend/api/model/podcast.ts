import { Language } from "../../model/podcast.js"

type PodcastIndexCategory = {
  [categoryId: string]: string
}

export type PodcastIndexFeed = {
  id: number
  url: string
  title: string
  description: string
  author: string
  image: string
  artwork: string
  newestItemPublishTime?: number
  newestItemPubdate?: number
  itunesId: number | null
  trendScore: number
  language: Language
  categories: PodcastIndexCategory
}

export type PodcastIndexEpisode = {
  id: number // internal PodcastIndex.org episode id
  title: string
  link: string // url to episode website
  description: string
  guid: string // unique identifier for episode
  datePublished: number // date and time episode was published (unix epoch in seconds)
  datePublishedPretty: string // human readable string of date and time episode was published
  dateCrawled: number // unix epoch in seconds time the episode was found in the feed
  enclosureUrl: string // URL / link to the episode file
  enclosureType: string // Content-Type for the item specified in "enclosureUrl"
  enclosureLength: number // length of item "enclosureUrl" in bytes
  duration: number | null // estimated length of "enclosureUrl" in seconds. Will be null for "liveItem"
  explicit: 0 | 1 // Not explicit = 0. Explicit = 1
  episode: number | null // episode number
  episodeType: "full" | "trailer" | "bonus" | null // type of episode. May be null for "liveItem"
  season: number | null // season number. May be null for "liveItem"
  image: string // episode image
  feedItunesId: number | null // iTunes ID of feed if there is one and we know what it is
  feedUrl: string // current feed url
  feedImage: string // feed image url
  feedId: number // internal PodcastIndex.org feed id
  feedLanguage: Language // based on RSS Language Spec
  feedDead: number
  feedDuplicateOf: number | null // internal PodcastIndex.org feed id this feed duplicates. May be null except in "podcasts/dead"
  chaptersUrl: string | null // URL link to JSON file containing the episode chapters
  transcriptUrl: string | null // URL link to file containing the episode transcript. In most use cases, the "transcripts" value should be used instead
  transcripts: Transcript[]
  soundbite: SoundBite | null
  soundbites: SoundBite[] | null
  persons: Person[] | null
  socialInteract: SocialInteract[] | null
}

export type Transcript = {
  // https://github.com/Podcastindex-org/podcast-namespace/blob/main/transcripts/transcripts.md
  url: string
  type:
    | "application/json"
    | "application/srt"
    | "text/html"
    | "text/plain"
    | "text/srt"
    | "text/vtt"
}

type SoundBite = {
  startTime: number // time soundbite begins in the item specified in "enclosureUrl"
  duration: number // length to play the item specified in "enclosureUrl"
  title: string // name of soundbite
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

type SocialInteract = {
  url: string // uri/url of root post comment
  protocol: string // protocol in use for interacting with the comment root post - https://github.com/Podcastindex-org/podcast-namespace/blob/main/socialprotocols.txt
  accountId: string // account id on commenting platform of the account that created the root post
  accountUrl: string // public url on the commenting platform of the account that created the root post
  priority: number // when multiple SocialInteract tags are present, the integer gives order of priority. Lower number means higher priority
}
