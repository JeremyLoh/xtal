import { PodcastIndexAuthManager } from "../api/authManager.js"
import { PodcastIndexFacade } from "../api/podcastFacade.js"
import { InvalidApiKeyError } from "../error/invalidApiKeyError.js"

export async function getPodcastCategories() {
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
  const podcastFacade: PodcastIndexFacade = new PodcastIndexFacade(
    podcastAuthManager
  )
  const podcastCategories = await podcastFacade.getPodcastCategories()
  return podcastCategories
}
