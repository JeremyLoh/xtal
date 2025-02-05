import ky from "ky"
import { Language, Podcast } from "../model/podcast.js"
import { getSanitizedHtmlText } from "./dom/htmlSanitize.js"
import { PodcastEpisode } from "../model/podcastEpisode.js"
import { PodcastIndexEpisode, PodcastIndexFeed } from "./model/podcast.js"

type PodcastApi = {
  getTrendingPodcasts(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<Podcast[]>
  getPodcastEpisodes(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<PodcastEpisode[]>
}

type PodcastIndexTrendingPodcastResponse = {
  // "/podcasts/trending" - https://podcastindex-org.github.io/docs-api/#get-/podcasts/trending
  status: "true" | "false"
  feeds: PodcastIndexFeed[]
  count: number
  max: number | null
  since: string | null
  description: string
}

type PodcastIndexLiveEpisode = {
  // "liveItems" of https://podcastindex-org.github.io/docs-api/#get-/episodes/byfeedid
  id: number // internal PodcastIndex.org episode ID
  title: string // feed name
  link: string // channel-level link in the feed
  description: string
  guid: string // episode unique identifier
  datePublished: number // date and time episode was published (unix epoch in seconds)
  datePublishedPretty: string // human readable string of date and time episode was published
  dateCrawled: number // unix epoch in seconds time the episode was found in the feed
  enclosureUrl: string // URL / link to the episode file
  enclosureType: string // Content-Type for the item specified in "enclosureUrl"
  enclosureLength: number // length of item "enclosureUrl" in bytes
  startTime: number // time livestream started
  endTime: number // time livestream ended
  status: "ended" | "live" // status of livestream
  duration: number | null // estimated length of item "enclosureUrl" in seconds. Will be null for "liveItem"
  explicit: 0 | 1 // Not explicit = 0. Explicit = 1
  episode: number | null // episode number
  episodeType: "full" | "trailer" | "bonus" | null // type of episode. May be null for "liveItem"
  season: number | null // season number. May be null for "liveItem"
  image: string // episode image
  feedItunesId: number | null // iTunes ID of feed if there is one and we know what it is
  feedImage: string // channel level image element
  feedId: number // internal PodcastIndex.org feed id
  feedLanguage: Language // based on RSS Language Spec
  feedDead: number
  feedDuplicateOf: number | null // internal PodcastIndex.org feed id this feed duplicates. May be null except in "podcasts/dead"
  chaptersUrl: string | null // URL link to JSON file containing the episode chapters
  transcriptUrl: string | null // URL link to file containing the episode transcript. In most use cases, the "transcripts" value should be used instead
}

type PodcastIndexEpisodeByFeedIdResponse = {
  // https://podcastindex-org.github.io/docs-api/#get-/episodes/byfeedid
  status: "true" | "false"
  liveItems: PodcastIndexLiveEpisode[]
  items: PodcastIndexEpisode[]
  count: number
  query: string | string[] // single id passed to request (feed id), or multiple feed id (string[])
  description: string // response description
}

class PodcastIndexApi implements PodcastApi {
  private url: string = "https://api.podcastindex.org/api/1.0"

  private parseTrendingPodcasts(
    response: PodcastIndexTrendingPodcastResponse
  ): Podcast[] {
    const podcasts = response.feeds.map((feed) => {
      const language = feed.language.toLowerCase()
      return {
        id: feed.id,
        url: feed.url || "",
        title: feed.title || "",
        description: getSanitizedHtmlText(feed.description || ""),
        author: feed.author || "",
        image: feed.image || "",
        latestPublishTime: feed.newestItemPublishTime || feed.newestItemPubdate,
        itunesId: feed.itunesId,
        trendScore: feed.trendScore,
        language: Language[language as keyof typeof Language],
        categories: Object.values<string>(feed.categories),
      }
    })
    return podcasts
  }

  private parsePodcastEpisodes(
    response: PodcastIndexEpisodeByFeedIdResponse
  ): PodcastEpisode[] {
    const episodes = response.items.map((episode) => {
      return {
        id: episode.id,
        feedId: episode.feedId,
        feedUrl: episode.feedUrl,
        title: episode.title,
        description: getSanitizedHtmlText(episode.description || ""),
        contentUrl: episode.enclosureUrl, // url link to episode file
        contentType: episode.enclosureType, // Content-Type of the episode file (e.g. mp3 => "audio\/mpeg")
        contentSizeInBytes: episode.enclosureLength,
        durationInSeconds: episode.duration,
        datePublished: episode.datePublished, // unix epoch time in seconds
        isExplicit: episode.explicit === 1, // Not explicit = 0. Explicit = 1
        episodeType: episode.episodeType, // type of episode. May be null for "liveItem"
        episodeNumber: episode.episode,
        seasonNumber: episode.season,
        image: episode.image || episode.feedImage,
        language: episode.feedLanguage,
        people: episode.persons,
        externalWebsiteUrl: episode.link,
        transcripts: episode.transcripts,
        isActiveFeed: episode.feedDead !== 0,
      }
    })
    return episodes
  }

  async getTrendingPodcasts(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<Podcast[]> {
    const response = await ky.get(this.url + "/podcasts/trending", {
      searchParams: searchParams,
      headers: authHeaders,
      retry: 0,
    })
    const json: PodcastIndexTrendingPodcastResponse = await response.json()
    return this.parseTrendingPodcasts(json)
  }

  async getPodcastEpisodes(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<PodcastEpisode[]> {
    const response = await ky.get(this.url + "/episodes/byfeedid", {
      searchParams: searchParams,
      headers: authHeaders,
      retry: 0,
    })
    const json: PodcastIndexEpisodeByFeedIdResponse = await response.json()
    return this.parsePodcastEpisodes(json)
  }
}

export { PodcastApi, PodcastIndexApi }
