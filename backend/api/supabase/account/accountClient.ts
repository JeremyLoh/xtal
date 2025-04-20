import dayjs from "dayjs"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../../supabase/databaseTypes/supabase.js"
import { PodcastEpisode } from "../../../model/podcastEpisode.js"
import logger from "../../../logger.js"
import { Podcast } from "../../../model/podcast.js"

// Create singleton for the supabase client
let instance: AccountClient

class AccountClient {
  private supabase: SupabaseClient<Database, "public", any>

  constructor() {
    if (instance) {
      throw new Error("Unable to create multiple AccountClient instances")
    }
    if (process.env.SUPABASE_PROJECT_URL == null) {
      throw new Error(
        "Invalid null environment variable 'SUPABASE_PROJECT_URL'"
      )
    }
    if (process.env.SUPABASE_PROJECT_SERVICE_ROLE_API_KEY == null) {
      throw new Error(
        "Invalid null environment variable 'SUPABASE_PROJECT_SERVICE_ROLE_API_KEY'"
      )
    }
    const supabase = createClient<Database>(
      process.env.SUPABASE_PROJECT_URL,
      process.env.SUPABASE_PROJECT_SERVICE_ROLE_API_KEY
    )
    this.supabase = supabase
    instance = this
  }

  getInstance() {
    return this
  }

  private castToNonArrayType<T>(notAnArray: T[]): T {
    // cast from array to non array type - https://github.com/supabase/postgrest-js/issues/471
    return notAnArray as T
  }

  async getPodcastFollowHistoryById(userId: string, podcastId: string) {
    const { data, error } = await this.supabase
      .from("podcast_followers")
      .select("podcasts!inner(podcast_id)")
      .eq("user_id", userId)
      .eq("podcasts.podcast_id", podcastId)
      .limit(1)

    if (error) {
      throw new Error(
        `getPodcastFollowHistoryById(): Could not find podcast follow history for userId ${userId}, podcastId ${podcastId}. Error ${error.message}`
      )
    }
    if (!data || data.length == 0) {
      return false
    }
    const parsedData = this.castToNonArrayType(data[0].podcasts)
    if (parsedData.podcast_id != null) {
      return true
    }
    return false
  }

  async addPodcastFollow(
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
      categories: string[]
    }
  ) {
    const insertPodcastData = {
      podcast_id: podcastData.podcastId,
      external_website_url: podcastData.externalWebsiteUrl,
      title: podcastData.title ? podcastData.title.trim() : "",
      author: podcastData.author,
      image: podcastData.image,
      language: podcastData.language,
      publish_date_unix_timestamp: dayjs
        .unix(Number(podcastData.publishDateUnixTimestamp))
        .unix(),
      episode_count: podcastData.episodeCount,
    }
    const { data, error: podcastError } = await this.supabase
      .from("podcasts")
      .upsert(insertPodcastData, {
        onConflict: "podcast_id",
        ignoreDuplicates: false,
      })
      .select("id")
    if (podcastError) {
      throw new Error(
        `addPodcastFollow(): Could not add podcast data for userId ${userId}, podcastId ${podcastData.podcastId}. Error ${podcastError.message}`
      )
    }
    if (data == null || data.length === 0) {
      throw new Error(
        `addPodcastFollow(): Could not add podcast follow for userId ${userId}, podcastId ${podcastData.podcastId}. Could not get "id" from "podcasts" table for foreign key`
      )
    }
    const podcastIdKey = data[0].id
    await this.addPodcastCategories(podcastData.categories, podcastIdKey)

    const podcastFollowerData = {
      user_id: userId,
      podcast_id: podcastIdKey,
    }
    const { error } = await this.supabase
      .from("podcast_followers")
      .upsert(podcastFollowerData, {
        onConflict: "user_id,podcast_id",
        ignoreDuplicates: true,
      })
    if (error) {
      throw new Error(
        `addPodcastFollow(): Could not add podcast follow for userId ${userId}, podcastId ${podcastData.podcastId}. Error ${error.message}`
      )
    }
  }

  private async addPodcastCategories(
    categories: string[],
    podcastIdKey: string
  ) {
    if (categories.length === 0) {
      return
    }
    // podcastIdKey is the primary key of the "podcasts" table
    const { data: categoriesData, error: categoriesError } = await this.supabase
      .from("categories")
      .upsert(
        categories.map((c) => {
          return { category: c }
        }),
        {
          onConflict: "category",
          ignoreDuplicates: true,
        }
      )
      .select("id")
    if (categoriesError) {
      throw new Error(
        `addPodcastCategories(): Could not add podcast category entries. Error ${categoriesError.message}`
      )
    }
    if (categoriesData.length === 0) {
      return
    }
    const { error: podcastCategoriesError } = await this.supabase
      .from("podcast_categories")
      .upsert(
        categoriesData.map((d) => {
          return { category_id: d.id, podcast_id: podcastIdKey }
        }),
        { onConflict: "podcast_id,category_id", ignoreDuplicates: true }
      )
    if (podcastCategoriesError) {
      throw new Error(
        `addPodcastCategories(): Could not add podcast categories junction table. Error ${podcastCategoriesError.message}`
      )
    }
  }

  async unfollowPodcast(userId: string, podcastId: string) {
    // podcastId is the "podcast_id" of "podcasts" table. deletion is done using "id" from "podcasts" table
    const { data: podcastIdData, error: podcastIdError } = await this.supabase
      .from("podcasts")
      .select("id")
      .eq("podcast_id", podcastId)
      .limit(1)
    if (podcastIdError) {
      throw new Error(
        `unfollowPodcast(): Could not get "id" of podcast using given "podcast_id" ${podcastId}. Error ${podcastIdError.message}`
      )
    }
    if (podcastIdData == null || podcastIdData.length === 0) {
      logger.info(
        `unfollowPodcast(): Could not find "podcast_id" from "podcasts" table. userId ${userId}, podcastId ${podcastId}`
      )
      return
    }
    const podcastIdKey = podcastIdData[0].id
    const { error: deletePodcastFollowerError } = await this.supabase
      .from("podcast_followers")
      .delete()
      .eq("user_id", userId)
      .eq("podcast_id", podcastIdKey)
    if (deletePodcastFollowerError) {
      throw new Error(
        `unfollowPodcast(): Could not delete follower using user_id ${userId}, podcast_id ${podcastIdKey}. Given podcastId ${podcastId}. Error ${deletePodcastFollowerError.message}`
      )
    }
  }

  async getPodcastEpisodePlayCount(userId: string) {
    const { count, error } = await this.supabase
      .from("podcast_episode_play_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
    if (error) {
      throw new Error(
        `getPodcastEpisodePlayCount(): Could not get total count for userId ${userId}. Error ${error.message}`
      )
    }
    return count
  }

  async getPodcastEpisodeLastPlayTimestamp(userId: string, episodeId: string) {
    const { data, error } = await this.supabase
      .from("podcast_episodes")
      .select(`podcast_episode_play_history!inner(resume_play_time_in_seconds)`)
      .eq("podcast_episode_play_history.user_id", userId)
      .eq("episode_id", episodeId)
      .limit(1)

    if (error) {
      throw new Error(
        `getPodcastEpisodeLastPlayTimestamp(): Could not get data for userId ${userId}, episodeId ${episodeId}. Error ${error.message}`
      )
    }
    if (!data || data.length === 0) {
      return null
    }
    return data[0]["podcast_episode_play_history"][0][
      "resume_play_time_in_seconds"
    ]
  }

  async getPodcastEpisodePlayHistory(
    userId: string,
    limit: number,
    offset: number = 0
  ) {
    const { data, error } = await this.supabase
      .from("podcast_episode_play_history")
      .select(
        `
        last_played_timestamp,
        resume_play_time_in_seconds,
        podcast_episodes (episode_id, podcast_id, episode_title, podcast_title,
            content_url, duration_in_seconds, publish_date_unix_timestamp, is_explicit, episode_number,
            season_number, image, language, external_website_url
        )
        `
      )
      .eq("user_id", userId)
      .order("last_played_timestamp", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(
        `getPodcastEpisodePlayHistory(): Could not get data for userId ${userId}, limit ${limit}, offset ${offset}. Error ${error.message}`
      )
    }
    if (!data) {
      return null
    }
    return data.map((entry) => {
      // "podcast_episodes" should only have one entry (podcast episode data)
      const e = this.castToNonArrayType(entry.podcast_episodes)
      const episode: PodcastEpisode = {
        id: e.episode_id,
        feedId: e.podcast_id,
        title: e.episode_title,
        feedTitle: e.podcast_title,
        description: "", // not available/stored in database
        contentUrl: e.content_url,
        contentType: "", // not available/stored in database
        durationInSeconds: e.duration_in_seconds,
        datePublished: dayjs(e.publish_date_unix_timestamp).unix(),
        isExplicit: e.is_explicit,
        episodeNumber: e.episode_number,
        seasonNumber: e.season_number,
        image: e.image,
        language: e.language, // stored in database as long form ("English" instead of "en")
        externalWebsiteUrl: e.external_website_url,
        people: null, // not available/stored in database
        transcripts: null, // not available/stored in database
      }
      return {
        lastPlayedTimestamp: entry.last_played_timestamp,
        resumePlayTimeInSeconds: entry.resume_play_time_in_seconds,
        podcastEpisode: episode,
      }
    })
  }

  async deletePodcastEpisodePlayHistory(userId: string, episodeId: string) {
    const { data, error } = await this.supabase
      .from("podcast_episodes")
      .select("id")
      .eq("episode_id", episodeId)
    const hasIdData = data && data[0].id != null
    if (error || !hasIdData) {
      throw new Error(
        `deletePodcastEpisodePlayHistory(): could not delete based on episodeId ${episodeId} for userId ${userId}`
      )
    }
    const id = data[0].id
    const { error: secondError } = await this.supabase
      .from("podcast_episode_play_history")
      .delete()
      .eq("user_id", userId)
      .eq("podcast_episode_id", id)
    if (secondError) {
      throw new Error(
        `deletePodcastEpisodePlayHistory(): could not delete from table "podcast_episode_play_history" using user_id ${userId} and podcast_episode_id ${id}. Given episodeId ${episodeId}`
      )
    }
  }

  async updatePodcastEpisodePlayHistory(
    userId: string,
    episode: PodcastEpisode,
    resumePlayTimeInSeconds: number
  ) {
    const podcastEpisodeData = {
      episode_id: episode.id,
      podcast_id: episode.feedId,
      episode_title: episode.title,
      podcast_title: episode.feedTitle,
      content_url: episode.contentUrl,
      duration_in_seconds: episode.durationInSeconds,
      publish_date_unix_timestamp: dayjs
        .unix(episode.datePublished)
        .toISOString(),
      is_explicit: episode.isExplicit,
      episode_number: episode.episodeNumber,
      season_number: episode.seasonNumber,
      image: episode.image,
      language: episode.language,
      external_website_url: episode.externalWebsiteUrl,
    }
    const { data, error } = await this.supabase
      .from("podcast_episodes")
      .upsert(podcastEpisodeData, {
        onConflict: "episode_id",
        ignoreDuplicates: false, // needs to be "false" to return data
      })
      .select("id")

    if (error) {
      throw new Error(
        `updatePodcastEpisodePlayHistory(): could not insert into table "podcast_episodes" with user_id ${userId}. Error: ${error.message}`
      )
    }

    if (data && data[0].id) {
      const { error } = await this.supabase
        .from("podcast_episode_play_history")
        .upsert(
          {
            user_id: userId,
            podcast_episode_id: data[0].id,
            last_played_timestamp: dayjs().toISOString(),
            resume_play_time_in_seconds: resumePlayTimeInSeconds,
          },
          { onConflict: "user_id,podcast_episode_id", ignoreDuplicates: false }
        )
      if (error) {
        throw new Error(
          `updatePodcastEpisodePlayHistory(): could not insert into table "podcast_episode_play_history" with user_id ${userId} and podcast_episode_id ${data[0].id}`
        )
      }
    }
  }

  async getFollowingPodcasts(userId: string, limit: number, offset: number) {
    const { data: podcastFollowerData, error: podcastFollowerError } =
      await this.supabase
        .from("podcast_followers")
        .select(
          `podcasts!inner(id,podcast_id,external_website_url,title,author,image,language,publish_date_unix_timestamp,episode_count)`
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)
    if (podcastFollowerError) {
      throw new Error(
        `getFollowingPodcasts(): could not get podcast follower data for userId ${userId}, limit ${limit}, offset ${offset}. Error ${podcastFollowerError.message}`
      )
    }
    if (podcastFollowerData == null || podcastFollowerData.length === 0) {
      return []
    }
    const podcasts = podcastFollowerData.map((d) =>
      this.castToNonArrayType(d.podcasts)
    )
    const podcastIds = podcasts.map((p) => p.id)
    const { data: podcastCategoryData, error: podcastCategoryError } =
      await this.supabase
        .from("podcast_categories")
        .select("podcast_id,categories!inner(category)")
        .in("podcast_id", podcastIds)
        .order("podcast_id", { ascending: true })
    if (podcastCategoryError) {
      throw new Error(
        `getFollowingPodcasts(): could not get podcast categories for userId ${userId}, limit ${limit}, offset ${offset}. Error ${podcastCategoryError.message}`
      )
    }
    // merge podcast categories with the podcast data
    const podcastsWithCategories: Podcast[] = podcasts.map((podcast) => {
      const categories = podcastCategoryData
        .filter((c) => c.podcast_id === podcast.id)
        .map((c2) => this.castToNonArrayType(c2.categories).category)
      const output: Podcast = {
        id: podcast.podcast_id,
        url: podcast.external_website_url,
        title: podcast.title,
        description: "", // description is not stored in database
        author: podcast.author,
        image: podcast.image,
        language: podcast.language,
        latestPublishTime: dayjs(podcast.publish_date_unix_timestamp).unix(),
        categories: categories,
        episodeCount: podcast.episode_count,
        // isExplicit is not stored in database
      }
      return output
    })
    return podcastsWithCategories
  }

  async getTotalFollowingPodcasts(userId: string) {
    const { count, error } = await this.supabase
      .from("podcast_followers")
      .select("user_id", { count: "exact", head: true })
      .eq("user_id", userId)
    if (error) {
      throw new Error(
        `getTotalFollowingPodcasts(): could not get total podcast following count for userId ${userId}. Error ${error.message}`
      )
    }
    return count
  }
}

const singletonAccountClient = Object.freeze(new AccountClient())
export default singletonAccountClient
