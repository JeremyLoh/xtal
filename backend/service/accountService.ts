import AccountClient from "../api/supabase/account/accountClient.js"
import logger from "../logger.js"
import { PodcastEpisode } from "../model/podcastEpisode.js"

export async function getAccountPodcastEpisodePlayCount(userId: string) {
  const accountClient = AccountClient.getInstance()
  try {
    const count = await accountClient.getPodcastEpisodePlayCount(userId)
    return count
  } catch (error: any) {
    logger.error(error.message)
    throw new Error(
      `getAccountPodcastEpisodePlayCount(): Could not get account podcast episode play count. userId ${userId}`
    )
  }
}

export async function getAccountPodcastEpisodeLastPlayTimestamp(
  userId: string,
  episodeId: string
) {
  const accountClient = AccountClient.getInstance()
  try {
    const lastPlayedTimestamp =
      await accountClient.getPodcastEpisodeLastPlayTimestamp(userId, episodeId)
    return lastPlayedTimestamp
  } catch (error: any) {
    logger.error(error.message)
    throw new Error(
      `getAccountPodcastEpisodeLastPlayTimestamp(): Could not get account podcast episode last played timestamp. userId ${userId}. episodeId: ${episodeId}`
    )
  }
}

export async function getAccountPodcastEpisodePlayHistory(
  userId: string,
  limit: number,
  offset?: number
) {
  const accountClient = AccountClient.getInstance()
  try {
    const data = await accountClient.getPodcastEpisodePlayHistory(
      userId,
      limit,
      offset
    )
    return data
  } catch (error: any) {
    logger.error(error.message)
    throw new Error(
      `getAccountPodcastEpisodePlayHistory(): Could not get account podcast episode play history. Limit ${limit}. Offset: ${offset}`
    )
  }
}

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

export async function deleteAccountPodcastEpisodePlayHistory(
  userId: string,
  episodeId: string
) {
  const accountClient = AccountClient.getInstance()
  try {
    await accountClient.deletePodcastEpisodePlayHistory(userId, episodeId)
  } catch (error: any) {
    logger.error(error.message)
    throw new Error(
      `deleteAccountPodcastEpisodePlayHistory(): Could not delete account podcast episode. userId ${userId}. Episode Id ${episodeId}`
    )
  }
}

export async function getAccountFollowPodcastById(
  userId: string,
  podcastId: string
) {
  const accountClient = AccountClient.getInstance()
  try {
    const isFollowing = await accountClient.getPodcastFollowHistoryById(
      userId,
      podcastId
    )
    return isFollowing
  } catch (error: any) {
    logger.error(error.message)
    throw new Error(
      `getAccountFollowPodcast(): Could not find account podcast follow history. userId ${userId}. podcastId ${podcastId}`
    )
  }
}

export async function addAccountPodcastFollow(
  userId: string,
  podcastData: {
    podcastId: string
    externalWebsiteUrl: string
    title: string | null
    author: string
    image: string
    language: string
    publishDateUnixTimestamp: string
    episodeCount: number | null
  }
) {
  const accountClient = AccountClient.getInstance()
  try {
    await accountClient.addPodcastFollow(userId, podcastData)
  } catch (error: any) {
    logger.error(error.message)
    throw new Error(
      `addAccountPodcastFollow(): Could not add account podcast follow. userId ${userId}. Podcast data ${JSON.stringify(
        podcastData
      )}`
    )
  }
}
