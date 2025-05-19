import dayjs from "dayjs"
import { Router, Request, Response } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { getTrendingPodcasts } from "../../service/podcastTrendingService.js"
import { InvalidApiKeyError } from "../../error/invalidApiKeyError.js"
import { getPodcastTrendingValidationSchema } from "../../validation/podcastTrendingValidation.js"
import rateLimiter from "../../middleware/rateLimiter.js"
import logger from "../../logger.js"

const router = Router()

/**
 * @openapi
 * /api/podcast/trending:
 *   get:
 *     tags:
 *       - Podcast Trending
 *     description: Retrieve trending podcasts
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Limit result count returned
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: offset
 *         description: Offset returned result
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 1000
 *           default: 0
 *       - in: query
 *         name: since
 *         description: Search podcasts that are trending from given "since" unix timestamp (in seconds)
 *         required: false
 *         schema:
 *           type: string
 *           format: unix timestamp
 *           default: three days ago unix timestamp (in seconds)
 *       - in: query
 *         name: category
 *         description: Return podcasts that match category
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 1000
 *     responses:
 *       200:
 *         description: Successfully retrieved trending podcasts
 *       400:
 *         description: Validation error in provided endpoint parameters
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Error in processing request
 */
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
