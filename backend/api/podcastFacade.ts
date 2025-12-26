import DateUtil from "./dateUtil.js"
import { Language, Podcast } from "../model/podcast.js"
import { PodcastEpisode } from "../model/podcastEpisode.js"
import { PodcastCategory } from "../model/podcastCategory.js"
import { PodcastIndexAuthManager } from "./authManager.js"
import { PodcastApi, PodcastIndexApi } from "./podcastApi.js"
import { PodcastCountStats } from "../model/podcastStats.js"

interface PodcastFacade {
  getTrendingPodcasts(limit: number, since: Date): Promise<Podcast[]>
  getTrendingPodcastsByCategory(
    limit: number,
    since: Date,
    category: string
  ): Promise<Podcast[]>
  getPodcastBySearchTerm(
    query: string,
    limit: number,
    offset: number
  ): Promise<Podcast[]>
  getPodcastEpisodes(
    podcastId: string,
    limit: number
  ): Promise<PodcastEpisode[]>
  getPodcastEpisodeById(episodeId: string): Promise<PodcastEpisode | null>
  getPodcastInfo(podcastId: string): Promise<Podcast>
  getPodcastCategories(): Promise<PodcastCategory[]>
  getCurrentPodcastApiCountStats(): Promise<PodcastCountStats>
  getRecentPodcasts({
    limit,
    offset,
    lang,
  }: {
    limit: number
    offset: number
    lang?: Language
  }): Promise<Podcast[]>
}

export class PodcastIndexFacade implements PodcastFacade {
  private readonly authManager: PodcastIndexAuthManager
  private readonly podcastApi: PodcastApi

  constructor(authManager: PodcastIndexAuthManager) {
    this.authManager = authManager
    this.podcastApi = new PodcastIndexApi()
  }

  async getTrendingPodcasts(limit: number, since: Date) {
    const authHeaders = this.authManager.getAuthTokenHeaders()
    const searchParams = new URLSearchParams(
      `max=${limit}&since=${DateUtil.getUnixTimestamp(since)}`
    )
    const podcasts = await this.podcastApi.getTrendingPodcasts(
      authHeaders,
      searchParams
    )
    return podcasts
  }

  async getTrendingPodcastsByCategory(
    limit: number,
    since: Date,
    category: string
  ) {
    const authHeaders = this.authManager.getAuthTokenHeaders()
    const searchParams = new URLSearchParams(
      `max=${limit}&since=${DateUtil.getUnixTimestamp(since)}&cat=${category}`
    )
    const podcasts = await this.podcastApi.getTrendingPodcasts(
      authHeaders,
      searchParams
    )
    return podcasts
  }

  async getPodcastBySearchTerm(query: string, limit: number, offset: number) {
    const authHeaders = this.authManager.getAuthTokenHeaders()
    const searchParams = new URLSearchParams(
      `q=${query}&fulltext=description&similar=true&max=${limit + offset}`
    )
    const podcasts = await this.podcastApi.getPodcastBySearchTerm(
      authHeaders,
      searchParams
    )
    if (offset > 0) {
      return podcasts.slice(offset, offset + limit)
    }
    return podcasts
  }

  async getPodcastEpisodes(podcastId: string, limit: number) {
    const authHeaders = this.authManager.getAuthTokenHeaders()
    const searchParams = new URLSearchParams(`id=${podcastId}&max=${limit}`)
    const episodes = await this.podcastApi.getPodcastEpisodes(
      authHeaders,
      searchParams
    )
    return episodes
  }

  async getPodcastEpisodeById(episodeId: string) {
    const authHeaders = this.authManager.getAuthTokenHeaders()
    const searchParams = new URLSearchParams(
      `id=${episodeId}&fulltext=description`
    )
    const episode = await this.podcastApi.getPodcastEpisodeById(
      authHeaders,
      searchParams
    )
    return episode
  }

  async getPodcastInfo(podcastId: string) {
    const authHeaders = this.authManager.getAuthTokenHeaders()
    const searchParams = new URLSearchParams(`id=${podcastId}`)
    const podcast = await this.podcastApi.getPodcastByFeedId(
      authHeaders,
      searchParams
    )
    return podcast
  }

  async getPodcastCategories() {
    const authHeaders = this.authManager.getAuthTokenHeaders()
    const podcastCategories = await this.podcastApi.getPodcastCategories(
      authHeaders
    )
    return podcastCategories
  }

  async getCurrentPodcastApiCountStats() {
    const authHeaders = this.authManager.getAuthTokenHeaders()
    return await this.podcastApi.getCurrentPodcastApiCountStats(authHeaders)
  }

  async getRecentPodcasts({
    limit,
    offset,
    lang,
  }: {
    limit: number
    offset: number
    lang?: Language
  }) {
    const authHeaders = this.authManager.getAuthTokenHeaders()
    const searchParams = new URLSearchParams(`max=${limit + offset}`)
    if (lang) {
      searchParams.set("lang", lang)
    }
    const recentPodcasts = await this.podcastApi.getRecentPodcasts(
      authHeaders,
      searchParams
    )
    if (offset > 0) {
      return recentPodcasts.slice(offset, offset + limit)
    }
    return recentPodcasts
  }
}
