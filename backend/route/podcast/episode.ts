import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import rateLimiter from "../../middleware/rateLimiter.js"
import { getPodcastEpisodes } from "../../service/podcastEpisodeService.js"
import { getPodcastEpisodeValidationSchema } from "../../validation/podcastEpisodeValidation.js"

const router = Router()

router.get(
  "/api/podcast/episodes",
  checkSchema(getPodcastEpisodeValidationSchema),
  rateLimiter.getPodcastEpisodesLimiter,
  async (request: Request, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const data = matchedData(request)
    const podcastId = data.id as string
    const limit = Number(data.limit) || 10

    const episodes = await getPodcastEpisodes(podcastId, limit)
    response.status(200).send({
      count: episodes.length,
      data: episodes,
    })
  }
)

export default router
