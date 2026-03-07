import { PodcastIndexFeed, RecentPodcastIndexFeed } from "../model/podcast.js"

export type PodcastIndexFeedResponse = {
  feeds: PodcastIndexFeed[] | RecentPodcastIndexFeed[]
}
