import dayjs from "dayjs"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../../supabase/databaseTypes/supabase.js"
import { PodcastEpisode } from "../../../model/podcastEpisode.js"

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
}

const singletonAccountClient = Object.freeze(new AccountClient())
export default singletonAccountClient
