import ky from "ky"
import { Language, Podcast } from "../model/podcast.js"
import { getSanitizedHtmlText } from "./dom/htmlSanitize.js"
import { PodcastEpisode } from "../model/podcastEpisode.js"
import { PodcastCategory } from "../model/podcastCategory.js"
import {
  PodcastIndexPodcastByFeedIdResponse,
  PodcastIndexPodcastBySearchTermResponse,
  PodcastIndexRecentPodcastResponse,
  PodcastIndexTrendingPodcastResponse,
} from "./responseType/podcastIndexPodcastTypes.js"
import {
  PodcastIndexEpisodeByFeedIdResponse,
  PodcastIndexEpisodeByIdResponse,
} from "./responseType/podcastIndexEpisodeTypes.js"
import { PodcastIndexCategoryResponse } from "./responseType/podcastIndexCategoryTypes.js"
import { PodcastCountStats } from "../model/podcastStats.js"
import { PodcastIndexCurrentStatsResponse } from "./responseType/podcastIndexStatsTypes.js"

type PodcastApi = {
  getTrendingPodcasts(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<Podcast[]>
  getPodcastBySearchTerm(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<Podcast[]>
  getPodcastEpisodes(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<PodcastEpisode[]>
  getPodcastEpisodeById(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<PodcastEpisode | null>
  getPodcastByFeedId(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<Podcast>
  getPodcastCategories(authHeaders: Headers): Promise<PodcastCategory[]>
  getCurrentPodcastApiCountStats(
    authHeaders: Headers
  ): Promise<PodcastCountStats>
  getRecentPodcasts(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<Podcast[]>
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
        image: feed.image || feed.artwork || "",
        latestPublishTime: feed.newestItemPublishTime || feed.newestItemPubdate,
        language: Language[language as keyof typeof Language],
        categories: feed.categories
          ? Object.values<string>(feed.categories)
          : [],
      }
    })
    return podcasts
  }

  private parsePodcastBySearchTerm(
    response: PodcastIndexPodcastBySearchTermResponse
  ): Podcast[] {
    const podcasts = response.feeds.map((feed) => {
      const language = feed.language.toLowerCase()
      return {
        id: feed.id,
        url: feed.url || "",
        title: feed.title || "",
        description: getSanitizedHtmlText(feed.description || ""),
        author: feed.author || "",
        image: feed.image || feed.artwork || "",
        latestPublishTime: feed.newestItemPubdate,
        language: Language[language as keyof typeof Language],
        categories: feed.categories
          ? Object.values<string>(feed.categories)
          : [],
        episodeCount: feed.episodeCount,
        isExplicit: feed.explicit,
      }
    })
    return podcasts
  }

  private parsePodcastEpisodes(
    response: PodcastIndexEpisodeByFeedIdResponse
  ): PodcastEpisode[] {
    const episodes = response.items.map((episode) => {
      const language = episode.feedLanguage.toLowerCase()
      return {
        id: episode.id,
        feedId: episode.feedId,
        feedUrl: episode.feedUrl,
        title: episode.title,
        description: getSanitizedHtmlText(episode.description || ""),
        contentUrl: episode.enclosureUrl, // url link to episode file
        contentType: episode.enclosureType, // Content-Type of the episode file (e.g. mp3 => "audio\/mpeg")
        durationInSeconds: episode.duration,
        datePublished: episode.datePublished, // unix epoch time in seconds
        isExplicit: episode.explicit === 1, // Not explicit = 0. Explicit = 1
        episodeNumber: episode.episode,
        seasonNumber: episode.season,
        image: episode.image || episode.feedImage,
        language: Language[language as keyof typeof Language],
        people: episode.persons || null,
        externalWebsiteUrl: episode.link,
        transcripts: episode.transcripts || null,
      }
    })
    return episodes
  }

  private parsePodcastEpisode(
    response: PodcastIndexEpisodeByIdResponse
  ): PodcastEpisode {
    const episode = response.episode
    const language = episode.feedLanguage.toLowerCase()
    // feedUrl and isActiveFeed is not available from the API response
    return {
      id: episode.id,
      feedId: episode.feedId,
      feedTitle: episode.feedTitle,
      title: episode.title,
      description: getSanitizedHtmlText(episode.description || ""),
      contentUrl: episode.enclosureUrl, // url link to episode file
      contentType: episode.enclosureType, // Content-Type of the episode file (e.g. mp3 => "audio\/mpeg")
      durationInSeconds: episode.duration,
      datePublished: episode.datePublished, // unix epoch time in seconds
      isExplicit: episode.explicit === 1, // Not explicit = 0. Explicit = 1
      episodeNumber: episode.episode,
      seasonNumber: episode.season,
      image: episode.image || episode.feedImage,
      language: Language[language as keyof typeof Language],
      people: episode.persons || null,
      externalWebsiteUrl: episode.link,
      transcripts: episode.transcripts || null,
    }
  }

  private parsePodcastFeed(
    response: PodcastIndexPodcastByFeedIdResponse
  ): Podcast {
    const language = response.feed.language.toLowerCase()
    return {
      id: response.feed.id,
      url: response.feed.link || "",
      title: response.feed.title,
      description: getSanitizedHtmlText(response.feed.description || ""),
      author: response.feed.author,
      image: response.feed.image || response.feed.artwork,
      language: Language[language as keyof typeof Language],
      latestPublishTime: response.feed.lastUpdateTime,
      categories: response.feed.categories
        ? Object.values<string>(response.feed.categories)
        : [],
      episodeCount: response.feed.episodeCount,
      isExplicit: response.feed.explicit,
    }
  }

  private parseRecentPodcasts(
    response: PodcastIndexRecentPodcastResponse
  ): Podcast[] {
    const podcasts = response.feeds.map((feed) => {
      const language = feed.language.toLowerCase()
      return {
        id: feed.id,
        url: feed.url || "",
        title: feed.title || "",
        description: getSanitizedHtmlText(feed.description || ""),
        author: "", // author info is not available
        image: feed.image || "",
        latestPublishTime: feed.newestItemPublishTime,
        language: Language[language as keyof typeof Language],
        categories: feed.categories
          ? Object.values<string>(feed.categories)
          : [],
      }
    })
    return podcasts
  }

  async getTrendingPodcasts(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<Podcast[]> {
    // https://podcastindex-org.github.io/docs-api/#get-/podcasts/trending
    const response = await ky.get(this.url + "/podcasts/trending", {
      searchParams: searchParams,
      headers: authHeaders,
      retry: 0,
    })
    const json: PodcastIndexTrendingPodcastResponse = await response.json()
    return this.parseTrendingPodcasts(json)
  }

  async getPodcastBySearchTerm(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<Podcast[]> {
    // https://podcastindex-org.github.io/docs-api/#get-/search/byterm
    const response = await ky.get(this.url + "/search/byterm", {
      searchParams: searchParams,
      headers: authHeaders,
      retry: 0,
    })
    const json: PodcastIndexPodcastBySearchTermResponse = await response.json()
    return this.parsePodcastBySearchTerm(json)
  }

  async getPodcastEpisodes(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<PodcastEpisode[]> {
    // https://podcastindex-org.github.io/docs-api/#get-/episodes/byfeedid
    const response = await ky.get(this.url + "/episodes/byfeedid", {
      searchParams: searchParams,
      headers: authHeaders,
      retry: 0,
    })
    const json: PodcastIndexEpisodeByFeedIdResponse = await response.json()
    return this.parsePodcastEpisodes(json)
  }

  async getPodcastEpisodeById(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<PodcastEpisode | null> {
    // https://podcastindex-org.github.io/docs-api/#get-/episodes/byid
    const response = await ky.get(this.url + "/episodes/byid", {
      searchParams: searchParams,
      headers: authHeaders,
      retry: 0,
    })
    const json: PodcastIndexEpisodeByIdResponse = await response.json()
    if (json && json.count === 0) {
      return null
    }
    return this.parsePodcastEpisode(json)
  }

  async getPodcastByFeedId(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<Podcast> {
    // https://podcastindex-org.github.io/docs-api/#get-/podcasts/byfeedid
    const response = await ky.get(this.url + "/podcasts/byfeedid", {
      searchParams: searchParams,
      headers: authHeaders,
      retry: 0,
    })
    const json: PodcastIndexPodcastByFeedIdResponse = await response.json()
    return this.parsePodcastFeed(json)
  }

  async getPodcastCategories(authHeaders: Headers): Promise<PodcastCategory[]> {
    // https://podcastindex-org.github.io/docs-api/#get-/categories/list
    const response = await ky.get(this.url + "/categories/list", {
      headers: authHeaders,
      retry: 0,
    })
    const json: PodcastIndexCategoryResponse = await response.json()
    return json.feeds.map((entry) => {
      return {
        id: entry.id,
        name: entry.name,
      }
    })
  }

  async getCurrentPodcastApiCountStats(
    authHeaders: Headers
  ): Promise<PodcastCountStats> {
    // https://podcastindex-org.github.io/docs-api/#tag--Stats
    const response = await ky.get(this.url + "/stats/current", {
      headers: authHeaders,
      retry: 0,
    })
    const json: PodcastIndexCurrentStatsResponse = await response.json()
    return {
      totalPodcasts: json.stats.feedCountTotal,
      totalPodcastEpisodes: json.stats.episodeCountTotal,
      episodesPublishedInLastThirtyDays: json.stats.feedsWithNewEpisodes30days,
    }
  }

  async getRecentPodcasts(
    authHeaders: Headers,
    searchParams: URLSearchParams
  ): Promise<Podcast[]> {
    // https://podcastindex-org.github.io/docs-api/#get-/recent/feeds
    const response = await ky.get(this.url + "/recent/feeds", {
      searchParams: searchParams,
      headers: authHeaders,
      retry: 0,
    })
    const json: PodcastIndexRecentPodcastResponse = await response.json()
    return this.parseRecentPodcasts(json)
  }
}

export { PodcastApi, PodcastIndexApi }
