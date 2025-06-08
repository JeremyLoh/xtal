import { http, HttpHandler, HttpResponse } from "msw"
import { ALL_PODCAST_CATEGORIES } from "../data/podcastCategory.js"

export const podcastCategoryHandler: HttpHandler[] = [
  http.get("https://api.podcastindex.org/api/1.0/categories/list", () => {
    // https://podcastindex-org.github.io/docs-api/#tag--Categories
    return HttpResponse.json(ALL_PODCAST_CATEGORIES)
  }),
]
