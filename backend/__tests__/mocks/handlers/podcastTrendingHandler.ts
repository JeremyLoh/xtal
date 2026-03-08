import { http, HttpHandler, HttpResponse } from "msw"
import { PodcastIndexTrendingPodcastResponse } from "../../../api/responseType/podcastIndexPodcastTypes.js"

type TrendingPodcastHandlerOptions = {
  feeds?: PodcastIndexTrendingPodcastResponse["feeds"]
  responses?: PodcastIndexTrendingPodcastResponse["feeds"][]
  status?: string
}

export function createTrendingPodcastHandler(
  options: TrendingPodcastHandlerOptions = {}
): HttpHandler {
  const { feeds = [], responses, status = "true" } = options

  let callCount = 0

  // https://podcastindex-org.github.io/docs-api/#get-/podcasts/trending
  return http.get(
    "https://api.podcastindex.org/api/1.0/podcasts/trending",
    () => {
      const resultFeeds = responses?.[callCount] ?? feeds

      callCount++

      return HttpResponse.json({
        status,
        feeds: resultFeeds,
        count: resultFeeds.length,
        max: resultFeeds.length,
        since: "1613805249",
        description: "Found trending feeds.",
      })
    }
  )
}
