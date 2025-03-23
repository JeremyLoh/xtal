import { getPodcastIndexAuthManager } from "../api/authManager.js"
import { PodcastIndexFacade } from "../api/podcastFacade.js"

export async function getTrendingPodcasts({
  limit,
  since,
  category,
}: {
  limit: number
  since: Date
  category: string | null
}) {
  const podcastAuthManager = getPodcastIndexAuthManager()
  const podcastFacade: PodcastIndexFacade = new PodcastIndexFacade(
    podcastAuthManager
  )
  if (category) {
    return await podcastFacade.getTrendingPodcastsByCategory(
      limit,
      since,
      category
    )
  } else {
    return await podcastFacade.getTrendingPodcasts(limit, since)
  }
}
