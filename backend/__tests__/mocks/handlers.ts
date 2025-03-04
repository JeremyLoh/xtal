import { http, HttpResponse } from "msw"
import {
  PODCAST_BY_FEED_ID_75075,
  PODCAST_EPISODES_BY_FEED_ID_75075,
  PODCAST_TRENDING_DEFAULT_TEN_ENTRIES,
  PODCAST_TRENDING_TEN_ARTS_PODCASTS,
} from "./podcast.js"
import { ALL_PODCAST_CATEGORIES } from "./podcastCategory.js"
import { PODCAST_EPISODE_ID_16795090 } from "./podcastEpisode.js"
import {
  PODCAST_SEARCH_SIMILAR_TERM_SYNTAX_LIMIT_10,
  PODCAST_SEARCH_SIMILAR_TERM_SYNTAX_LIMIT_12,
} from "./podcastSearch.js"

export const handlers = [
  http.get("https://api.podcastindex.org/api/1.0/categories/list", () => {
    // https://podcastindex-org.github.io/docs-api/#tag--Categories
    return HttpResponse.json(ALL_PODCAST_CATEGORIES)
  }),
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
      } else {
        return HttpResponse.error()
      }
    }
  ),
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
  http.get(
    "https://api.podcastindex.org/api/1.0/search/byterm",
    ({ request }) => {
      // https://podcastindex-org.github.io/docs-api/#get-/search/byterm
      const url = new URL(request.url)
      const query = url.searchParams.get("q")
      const similar = url.searchParams.get("similar")
      const fulltext = url.searchParams.get("fulltext")
      const max = url.searchParams.get("max")
      if (
        query === "syntax" &&
        similar === "true" &&
        fulltext === "description" &&
        max === "10"
      ) {
        return HttpResponse.json(PODCAST_SEARCH_SIMILAR_TERM_SYNTAX_LIMIT_10)
      } else if (
        query === "syntax" &&
        similar === "true" &&
        fulltext === "description" &&
        max === "12"
      ) {
        return HttpResponse.json(PODCAST_SEARCH_SIMILAR_TERM_SYNTAX_LIMIT_12)
      }

      return HttpResponse.error()
    }
  ),
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
