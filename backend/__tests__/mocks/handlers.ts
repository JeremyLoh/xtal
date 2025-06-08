import { HttpHandler } from "msw"
import { podcastStatsHandlers } from "./handlers/podcastStatHandler.js"
import { podcastRecentHandlers } from "./handlers/podcastRecentHandler.js"
import { podcastCategoryHandler } from "./handlers/podcastCategoryHandler.js"
import { podcastTrendingHandler } from "./handlers/podcastTrendingHandler.js"
import { podcastHandler } from "./handlers/podcastHandler.js"
import { podcastSearchHandler } from "./handlers/podcastSearchHandler.js"
import {
  podcastEpisodeByEpisodeIdHandler,
  podcastEpisodesByPodcastIdHandler,
} from "./handlers/podcastEpisodeHandler.js"

export const handlers: HttpHandler[] = [
  ...podcastStatsHandlers,
  ...podcastRecentHandlers,
  ...podcastCategoryHandler,
  ...podcastTrendingHandler,
  ...podcastHandler,
  ...podcastSearchHandler,
  ...podcastEpisodeByEpisodeIdHandler,
  ...podcastEpisodesByPodcastIdHandler,
]
