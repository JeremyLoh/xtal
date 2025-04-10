import AccountClient from "../api/supabase/account/accountClient.js"
import logger from "../logger.js"
import { PodcastEpisode } from "../model/podcastEpisode.js"

export async function updateAccountPodcastEpisodePlayHistory(
  userId: string,
  resumePlayTimeInSeconds: number,
  episode: PodcastEpisode
) {
  // episode's "language" attribute is the full version e.g. "English" instead of "en" (frontend passes full text version to backend)
  const accountClient = AccountClient.getInstance()
  try {
    await accountClient.updatePodcastEpisodePlayHistory(
      userId,
      episode,
      resumePlayTimeInSeconds
    )
  } catch (error: any) {
    logger.error(error.message)
    throw new Error(
      "updateAccountPodcastEpisodePlayHistory(): Could not update account podcast episode play history"
    )
  }
}
