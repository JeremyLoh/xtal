import {
  PodcastIndexEpisode,
  PodcastIndexEpisodeById,
  PodcastIndexLiveEpisode,
} from "../model/podcastEpisode.js"

export type PodcastIndexEpisodeByIdResponse = {
  // https://podcastindex-org.github.io/docs-api/#get-/episodes/byid
  status: "true" | "false"
  episode: PodcastIndexEpisodeById
  description: string // response description
  count?: number
}

export type PodcastIndexEpisodeByFeedIdResponse = {
  // https://podcastindex-org.github.io/docs-api/#get-/episodes/byfeedid
  status: "true" | "false"
  liveItems: PodcastIndexLiveEpisode[]
  items: PodcastIndexEpisode[]
  count: number
  query: string | string[] // single id passed to request (feed id), or multiple feed id (string[])
  description: string // response description
}
