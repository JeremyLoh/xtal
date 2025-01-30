import ky from "ky"
import { Language, Podcast } from "../model/podcast.js"
import { getSanitizedHtmlText } from "./dom/htmlSanitize.js"

type PodcastApi = {
  getTrendingPodcasts(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<Podcast[]>
}

type PodcastIndexCategory = {
  [categoryId: string]: string
}

type PodcastIndexFeed = {
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

type PodcastIndexTrendingPodcastResponse = {
  // "/podcasts/trending" - https://podcastindex-org.github.io/docs-api/#get-/podcasts/trending
  status: "true" | "false"
  feeds: PodcastIndexFeed[]
  count: number
  max: number | null
  since: string | null
  description: string
}

class PodcastIndexApi implements PodcastApi {
  private url: string = "https://api.podcastindex.org/api/1.0/podcasts"

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

  async getTrendingPodcasts(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<Podcast[]> {
    const response = await ky.get(this.url + "/trending", {
      searchParams: searchParams,
      headers: authHeaders,
      retry: 0,
    })
    const json: PodcastIndexTrendingPodcastResponse = await response.json()
    return this.parseTrendingPodcasts(json)
  }
}

export { PodcastApi, PodcastIndexApi }
