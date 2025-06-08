import { http, HttpHandler, HttpResponse } from "msw"
import { CURRENT_PODCAST_STATISTICS } from "../data/podcastStatistic.js"

export const podcastStatsHandlers: HttpHandler[] = [
  http.get("https://api.podcastindex.org/api/1.0/stats/current", () => {
    // https://podcastindex-org.github.io/docs-api/#get-/stats/current
    return HttpResponse.json(CURRENT_PODCAST_STATISTICS)
  }),
]
