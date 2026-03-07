import { http, HttpHandler, HttpResponse } from "msw"
import { PodcastIndexTrendingPodcastResponse } from "../../../api/responseType/podcastIndexPodcastTypes.js"

type TrendingPodcastHandlerOptions = {
  feeds?: PodcastIndexTrendingPodcastResponse["feeds"]
  status?: string
}

export function createTrendingPodcastHandler(
  options: TrendingPodcastHandlerOptions = {}
): HttpHandler {
  const { feeds = [], status = "true" } = options

  // https://podcastindex-org.github.io/docs-api/#get-/podcasts/trending
  return http.get(
    "https://api.podcastindex.org/api/1.0/podcasts/trending",
    () => {
      return HttpResponse.json({
        status,
        feeds,
        count: feeds.length,
        max: feeds.length,
        since: "1613805249",
        description: "Found trending feeds.",
      })
    }
  )
}
