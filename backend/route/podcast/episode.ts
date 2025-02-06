import { Request, Response, Router } from "express"
import { getPodcastEpisodes } from "../../service/podcastEpisodeService.js"
import rateLimiter from "../../middleware/rateLimiter.js"

const router = Router()

router.get(
  "/api/podcast/episodes",
  rateLimiter.getPodcastEpisodesLimiter,
  async (request: Request, response: Response) => {
    const podcastId = request.query.id as string
    const limit = Number(request.query.limit)

    const episodes = await getPodcastEpisodes(podcastId, limit)
    response.status(200).send({
      count: episodes.length,
      data: episodes,
    })
  }
)

export default router
