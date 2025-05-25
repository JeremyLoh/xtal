import { http, HttpHandler, HttpResponse } from "msw"

export const CURRENT_PODCAST_STATISTICS = {
  status: "true",
  stats: {
    feedCountTotal: 4257865,
    episodeCountTotal: 143953477,
    feedsWithNewEpisodes3days: 97522,
    feedsWithNewEpisodes10days: 212322,
    feedsWithNewEpisodes30days: 306748,
    feedsWithNewEpisodes90days: 436933,
    feedsWithValueBlocks: 21916,
  },
  description: "Found matching feed",
}

export const podcastStatsHandlers: HttpHandler[] = [
  http.get("https://api.podcastindex.org/api/1.0/stats/current", () => {
    // https://podcastindex-org.github.io/docs-api/#get-/stats/current
    return HttpResponse.json(CURRENT_PODCAST_STATISTICS)
  }),
]
