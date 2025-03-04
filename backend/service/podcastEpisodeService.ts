import { getPodcastIndexAuthManager } from "../api/authManager.js"
import { PodcastIndexFacade } from "../api/podcastFacade.js"

export async function getPodcastEpisodes(podcastId: string, limit: number) {
  const podcastAuthManager = getPodcastIndexAuthManager()
  const podcastFacade: PodcastIndexFacade = new PodcastIndexFacade(
    podcastAuthManager
  )
  const podcastEpisodes = await podcastFacade.getPodcastEpisodes(
    podcastId,
    limit
  )
  return podcastEpisodes
}

export async function getPodcastEpisodeById(episodeId: string) {
  const podcastAuthManager = getPodcastIndexAuthManager()
  const podcastFacade: PodcastIndexFacade = new PodcastIndexFacade(
    podcastAuthManager
  )
  const episode = await podcastFacade.getPodcastEpisodeById(episodeId)
  return episode
}
