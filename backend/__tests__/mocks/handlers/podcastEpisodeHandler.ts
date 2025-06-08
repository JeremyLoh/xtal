import { http, HttpHandler, HttpResponse } from "msw"
import { PODCAST_EPISODE_ID_16795090 } from "../data/podcastEpisode.js"
import { PODCAST_EPISODES_BY_FEED_ID_75075 } from "../data/podcast.js"

export const podcastEpisodeByEpisodeIdHandler: HttpHandler[] = [
  http.get(
    "https://api.podcastindex.org/api/1.0/episodes/byid",
    ({ request }) => {
      // https://podcastindex-org.github.io/docs-api/#get-/episodes/byid
      const url = new URL(request.url)
      const id = url.searchParams.get("id")
      const fulltext = url.searchParams.get("fulltext")
      if (id === "16795090" && fulltext === "description") {
        return HttpResponse.json(PODCAST_EPISODE_ID_16795090)
      } else {
        return HttpResponse.json({
          status: "true",
          episode: [],
          count: 0,
          id: id,
          description: "Episode not found.",
        })
      }
    }
  ),
]

export const podcastEpisodesByPodcastIdHandler: HttpHandler[] = [
  http.get(
    "https://api.podcastindex.org/api/1.0/episodes/byfeedid",
    ({ request }) => {
      // https://podcastindex-org.github.io/docs-api/#get-/episodes/byfeedid
      const url = new URL(request.url)
      const id = url.searchParams.get("id")
      const max = url.searchParams.get("max")
      if (max === "10" && id === "75075") {
        return HttpResponse.json({
          ...PODCAST_EPISODES_BY_FEED_ID_75075,
          count: 10,
          items: PODCAST_EPISODES_BY_FEED_ID_75075.items.slice(0, 10),
        })
      }
      if (max === "1" && id === "75075") {
        return HttpResponse.json({
          ...PODCAST_EPISODES_BY_FEED_ID_75075,
          count: 1,
          items: PODCAST_EPISODES_BY_FEED_ID_75075.items.slice(0, 1),
        })
      }
      if (max === "15" && id === "75075") {
        // "offset" parameter test for get podcast episodes (/api/podcast/episodes)
        return HttpResponse.json({
          ...PODCAST_EPISODES_BY_FEED_ID_75075,
          count: 15,
          items: PODCAST_EPISODES_BY_FEED_ID_75075.items.slice(0, 15),
        })
      }
      return HttpResponse.error()
    }
  ),
]
