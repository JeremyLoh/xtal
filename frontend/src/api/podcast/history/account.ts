import ky from "ky"
import dayjs from "dayjs"
import { PodcastEpisode } from "../../podcast/model/podcast.ts"
import { getEnv } from "../../env/environmentVariables.ts"

export async function updateAccountPodcastEpisodePlayHistory(
  episode: PodcastEpisode,
  resumePlayTimeInSeconds: number
) {
  const { BACKEND_ORIGIN } = getEnv()
  const backendUrl = BACKEND_ORIGIN + "/api/account/podcast-play-history"
  const data = {
    episodeId: episode.id,
    podcastId: episode.feedId,
    episodeTitle: episode.title,
    podcastTitle: episode.feedTitle,
    contentUrl: episode.contentUrl,
    durationInSeconds: episode.durationInSeconds,
    publishDateUnixTimestamp: dayjs.unix(episode.datePublished).toISOString(),
    isExplicit: episode.isExplicit,
    ...(episode.episodeNumber && { episodeNumber: episode.episodeNumber }),
    ...(episode.seasonNumber && { seasonNumber: episode.seasonNumber }),
    image: episode.image,
    language: episode.language,
    externalWebsiteUrl: episode.externalWebsiteUrl,
    resumePlayTimeInSeconds: resumePlayTimeInSeconds,
  }

  try {
    await ky.post(backendUrl, { json: data, retry: 0 })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      `Could not update podcast episode play history. Please try again later. ${error.message}`
    )
  }
}
