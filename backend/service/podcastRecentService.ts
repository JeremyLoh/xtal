import { getPodcastIndexAuthManager } from "../api/authManager.js"
import { PodcastIndexFacade } from "../api/podcastFacade.js"
import { Language } from "../model/podcast.js"

export async function getRecentPodcasts({
  limit,
  offset,
  lang,
}: {
  limit: number
  offset: number
  lang?: Language
}) {
  const podcastAuthManager = getPodcastIndexAuthManager()
  const podcastFacade: PodcastIndexFacade = new PodcastIndexFacade(
    podcastAuthManager
  )
  const recentPodcasts = await podcastFacade.getRecentPodcasts({
    limit,
    offset,
    lang,
  })
  return recentPodcasts
}
