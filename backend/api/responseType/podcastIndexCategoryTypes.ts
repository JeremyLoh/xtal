import { PodcastIndexCategoryInfo } from "../model/podcastCategory.js"

export type PodcastIndexCategoryResponse = {
  // https://podcastindex-org.github.io/docs-api/#tag--Categories
  status: "true" | "false"
  feeds: PodcastIndexCategoryInfo[]
  count: number
  description: string // response description
}
