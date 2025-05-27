import { http, HttpHandler, HttpResponse } from "msw"
import { PODCAST_RECENT_FIVE_ENTRIES } from "./podcastRecent.js"

export const podcastRecentHandlers: HttpHandler[] = [
  http.get(
    "https://api.podcastindex.org/api/1.0/recent/feeds",
    ({ request }) => {
      // https://podcastindex-org.github.io/docs-api/#get-/recent/feeds
      const url = new URL(request.url)
      const max = url.searchParams.get("max")
      const lang = url.searchParams.get("lang")
      if (max === "5" && lang == null) {
        return HttpResponse.json(PODCAST_RECENT_FIVE_ENTRIES)
      }
      return HttpResponse.error()
    }
  ),
]
