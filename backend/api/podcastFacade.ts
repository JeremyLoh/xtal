import { Podcast } from "../model/podcast.js"
import { PodcastEpisode } from "../model/podcastEpisode.js"
import { PodcastIndexAuthManager } from "./authManager.js"
import { PodcastApi, PodcastIndexApi } from "./podcastApi.js"
import DateUtil from "./dateUtil.js"

interface PodcastFacade {
  getTrendingPodcasts(limit: number, since: Date): Promise<Podcast[]>
  getPodcastEpisodes(
    podcastId: string,
    limit: number
  ): Promise<PodcastEpisode[]>
}

export class PodcastIndexFacade implements PodcastFacade {
  private authManager: PodcastIndexAuthManager
  private podcastApi: PodcastApi

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

  async getPodcastEpisodes(podcastId: string, limit: number) {
    const authHeaders = this.authManager.getAuthTokenHeaders()
    const searchParams = new URLSearchParams(`id=${podcastId}&max=${limit}`)
    const episodes = await this.podcastApi.getPodcastEpisodes(
      authHeaders,
      searchParams
    )
    return episodes
  }
}
