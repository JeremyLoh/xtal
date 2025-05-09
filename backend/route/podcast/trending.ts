import dayjs from "dayjs"
import { Router, Request, Response } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { getTrendingPodcasts } from "../../service/podcastTrendingService.js"
import { InvalidApiKeyError } from "../../error/invalidApiKeyError.js"
import { getPodcastTrendingValidationSchema } from "../../validation/podcastTrendingValidation.js"
import rateLimiter from "../../middleware/rateLimiter.js"
import logger from "../../logger.js"

const router = Router()

router.get(
  "/api/podcast/trending",
  rateLimiter.getTrendingPodcastLimiter,
  checkSchema(getPodcastTrendingValidationSchema, ["query"]),
  async (request: Request, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const data = matchedData(request)
    const threeDaysAgo = dayjs().subtract(3, "days").toDate()
    const limit: number = Number(data.limit) || 10
    const since: Date = data.since
      ? new Date(Number(data.since) * 1000) // convert unix timestamp to milliseconds
      : threeDaysAgo
    const category: string | null = data?.category || null
    const offset = Number(data.offset) || 0

    try {
      const podcasts = await getTrendingPodcasts({
        limit: limit + offset,
        since,
        category,
      })
      response.status(200)
      response.type("application/json")
      if (offset === 0) {
        response.send({
          count: podcasts.length,
          data: podcasts,
        })
      } else {
        const offsetPodcasts = podcasts.slice(offset, offset + limit)
        response.send({
          count: offsetPodcasts.length,
          data: offsetPodcasts,
        })
      }
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
