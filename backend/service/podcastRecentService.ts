import { getPodcastIndexAuthManager } from "../api/authManager.js"
import { PodcastIndexFacade } from "../api/podcastFacade.js"
import { Language, Podcast } from "../model/podcast.js"
import PodcastSerializerBuilder from "../serializer/PodcastSerializerBuilder.js"

export function excludePodcastFields(
  podcasts: Podcast[],
  fields: (keyof Podcast)[]
): Partial<Podcast>[] {
  return new PodcastSerializerBuilder()
    .setPodcasts(podcasts)
    .exclude(fields)
    .build()
}

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
