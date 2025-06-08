import { http, HttpHandler, HttpResponse } from "msw"
import {
  PODCAST_SEARCH_SIMILAR_TERM_SYNTAX_LIMIT_10,
  PODCAST_SEARCH_SIMILAR_TERM_SYNTAX_LIMIT_12,
} from "../data/podcastSearch.js"

export const podcastSearchHandler: HttpHandler[] = [
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
]
