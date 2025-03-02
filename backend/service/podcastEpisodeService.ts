import { PodcastIndexAuthManager } from "../api/authManager.js"
import { PodcastIndexFacade } from "../api/podcastFacade.js"
import { InvalidApiKeyError } from "../error/invalidApiKeyError.js"

function getPodcastIndexAuthManager() {
  const apiKey = process.env.PODCAST_INDEX_API_KEY
  const apiSecret = process.env.PODCAST_INDEX_API_SECRET
  if (
    apiKey == null ||
    apiKey === "" ||
    apiSecret == null ||
    apiSecret === ""
  ) {
    throw new InvalidApiKeyError(
      "Server configuration error: Invalid Podcast API Key"
    )
  }
  const podcastAuthManager = new PodcastIndexAuthManager(apiKey, apiSecret)
  return podcastAuthManager
}

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
