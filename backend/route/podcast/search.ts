import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { getPodcastSearchValidationSchema } from "../../validation/podcastSearchValidation.js"
import { getPodcastsBySearchTerm } from "../../service/podcastSearchService.js"
import { InvalidApiKeyError } from "../../error/invalidApiKeyError.js"
import rateLimiter from "../../middleware/rateLimiter.js"
import logger from "../../logger.js"

const router = Router()

router.get(
  "/api/podcast/search",
  checkSchema(getPodcastSearchValidationSchema),
  rateLimiter.getPodcastSearchLimiter,
  async (request: Request, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const data = matchedData(request)
    const query = data.q
    const limit: number = Number(data.limit)
    const offset: number = data.offset ? Number(data.offset) : 0
    try {
      const podcasts = await getPodcastsBySearchTerm({ query, limit, offset })
      response.status(200)
      response.type("application/json")
      response.send({
        count: podcasts.length,
        data: podcasts,
      })
    } catch (error: any) {
      if (error instanceof InvalidApiKeyError) {
        response.status(500).send(error.message)
        return
      } else {
        logger.error(error.message)
        response.status(500).send("Internal Server Error")
      }
    }
  }
)

export default router
