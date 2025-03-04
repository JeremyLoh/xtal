import { getPodcastIndexAuthManager } from "../api/authManager.js"
import { PodcastIndexFacade } from "../api/podcastFacade.js"

export async function getPodcastsBySearchTerm({
  query,
  limit,
  offset,
}: {
  query: string
  limit: number
  offset: number
}) {
  const podcastAuthManager = getPodcastIndexAuthManager()
  const podcastFacade: PodcastIndexFacade = new PodcastIndexFacade(
    podcastAuthManager
  )
  const podcasts = await podcastFacade.getPodcastBySearchTerm(
    query,
    limit,
    offset
  )
  return podcasts
}
