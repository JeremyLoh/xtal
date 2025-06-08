import { http, HttpHandler, HttpResponse } from "msw"
import { PODCAST_BY_FEED_ID_75075 } from "../data/podcast.js"

export const podcastHandler: HttpHandler[] = [
  http.get(
    "https://api.podcastindex.org/api/1.0/podcasts/byfeedid",
    ({ request }) => {
      // https://podcastindex-org.github.io/docs-api/#get-/podcasts/byfeedid
      const url = new URL(request.url)
      const id = url.searchParams.get("id")
      if (id === "75075") {
        return HttpResponse.json(PODCAST_BY_FEED_ID_75075)
      }
      return HttpResponse.error()
    }
  ),
]
