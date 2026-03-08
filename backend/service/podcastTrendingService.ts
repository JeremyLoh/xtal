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

  const results = []
  const batchSize = Math.min(limit, 20)

  const seen = new Set()
  let attempts = 0
  let maxAttempts = Math.ceil(limit / batchSize) * 3

  while (attempts < maxAttempts && results.length < limit) {
    attempts++

    const remaining = limit - results.length
    const fetchSize = Math.min(batchSize, remaining)

    const podcasts = category
      ? await podcastFacade.getTrendingPodcastsByCategory(
          fetchSize,
          since,
          category
        )
      : await podcastFacade.getTrendingPodcasts(fetchSize, since)

    if (podcasts.length === 0) {
      break
    }

    for (const p of podcasts) {
      if (!seen.has(p.id)) {
        seen.add(p.id)
        results.push(p)
      }
    }
  }

  return results.slice(0, limit)
}
