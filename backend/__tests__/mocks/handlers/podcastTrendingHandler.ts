import { http, HttpHandler, HttpResponse } from "msw"
import {
  PODCAST_TRENDING_DEFAULT_TEN_ENTRIES,
  PODCAST_TRENDING_TEN_ARTS_PODCASTS,
} from "../data/podcast.js"

export const podcastTrendingHandler: HttpHandler[] = [
  http.get(
    "https://api.podcastindex.org/api/1.0/podcasts/trending",
    ({ request }) => {
      // https://podcastindex-org.github.io/docs-api/#get-/podcasts/trending
      const url = new URL(request.url)
      const max = url.searchParams.get("max")
      const since = url.searchParams.get("since")
      const category = url.searchParams.get("cat")
      if (max === "10" && since != null && category == null) {
        return HttpResponse.json(PODCAST_TRENDING_DEFAULT_TEN_ENTRIES)
      } else if (max === "10" && category?.toLowerCase() === "arts") {
        return HttpResponse.json(PODCAST_TRENDING_TEN_ARTS_PODCASTS)
      } else if (max === "15") {
        // backend ?offset=5&limit=10 trending podcast test. PodcastIndex API doesn't have offset
        return HttpResponse.json(PODCAST_TRENDING_DEFAULT_TEN_ENTRIES)
      } else {
        return HttpResponse.error()
      }
    }
  ),
]
