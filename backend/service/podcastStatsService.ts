import { getPodcastIndexAuthManager } from "../api/authManager.js"
import { PodcastIndexFacade } from "../api/podcastFacade.js"

export async function getCurrentPodcastApiCountStats() {
  const podcastAuthManager = getPodcastIndexAuthManager()
  const podcastFacade: PodcastIndexFacade = new PodcastIndexFacade(
    podcastAuthManager
  )
  return await podcastFacade.getCurrentPodcastApiCountStats()
}
