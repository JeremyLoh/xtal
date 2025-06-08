import { http, HttpHandler, HttpResponse } from "msw"
import {
  JAPANESE_LANGUAGE_PODCAST_RECENT_TEN_ENTRIES,
  PODCAST_RECENT_FIVE_ENTRIES,
} from "./data/podcastRecent.js"

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
      if (max === "10" && lang === "ja") {
        return HttpResponse.json(JAPANESE_LANGUAGE_PODCAST_RECENT_TEN_ENTRIES)
      }
      return HttpResponse.error()
    }
  ),
]
