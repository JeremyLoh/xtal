import { http, HttpResponse } from "msw"
import { PODCAST_TRENDING_DEFAULT_TEN_ENTRIES } from "./podcast.js"

export const handlers = [
  http.get(
    "https://api.podcastindex.org/api/1.0/podcasts/trending*",
    ({ request }) => {
      // https://podcastindex-org.github.io/docs-api/#get-/podcasts/trending
      const url = new URL(request.url)
      const max = url.searchParams.get("max")
      const since = url.searchParams.get("since")
      if (max === "10" && since != null) {
        return HttpResponse.json(PODCAST_TRENDING_DEFAULT_TEN_ENTRIES)
      } else {
        return HttpResponse.error()
      }
    }
  ),
]
