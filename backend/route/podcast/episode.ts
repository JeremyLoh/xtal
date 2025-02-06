import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import rateLimiter from "../../middleware/rateLimiter.js"
import { getPodcastEpisodes } from "../../service/podcastEpisodeService.js"
import { getPodcastEpisodeValidationSchema } from "../../validation/podcastEpisodeValidation.js"
import { InvalidApiKeyError } from "../../error/invalidApiKeyError.js"

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

    try {
      const episodes = await getPodcastEpisodes(podcastId, limit)
      response.status(200)
      response.type("application/json")
      response.send({
        count: episodes.length,
        data: episodes,
      })
    } catch (error: any) {
      if (error instanceof InvalidApiKeyError) {
        response.status(500).send(error.message)
        return
      } else {
        console.error(error.message)
        response.status(500).send("Internal Server Error")
      }
    }
  }
)

export default router
