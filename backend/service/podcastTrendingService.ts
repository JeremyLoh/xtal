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

  const OVERFETCH_FACTOR = 2
  const fetchSize = Math.min(limit * OVERFETCH_FACTOR, 100)

  const podcasts = category
    ? await podcastFacade.getTrendingPodcastsByCategory(
        fetchSize,
        since,
        category
      )
    : await podcastFacade.getTrendingPodcasts(fetchSize, since)

  const seen = new Set()
  const filtered = []

  for (const p of podcasts) {
    if (!seen.has(p.id)) {
      seen.add(p.id)
      filtered.push(p)
    }
  }

  return filtered.slice(0, limit)
}
