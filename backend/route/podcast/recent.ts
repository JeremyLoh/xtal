import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { getPodcastRecentValidationSchema } from "../../validation/podcastRecentValidation.js"
import { Language } from "../../model/podcast.js"
import rateLimiter from "../../middleware/rateLimiter.js"

const router = Router()

router.get(
  "/api/podcast/recent",
  rateLimiter.getPodcastRecentLimiter,
  checkSchema(getPodcastRecentValidationSchema, ["query"]),
  async (request: Request, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const data = matchedData(request)
    const limit = data.limit ? Number(data.limit) : 10
    const offset = data.offset ? Number(data.offset) : 0
    const lang: Language | null = data.lang ? data.lang : null
    response.sendStatus(200)
  }
)

export default router
