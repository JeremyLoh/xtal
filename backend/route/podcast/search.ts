import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { getPodcastSearchValidationSchema } from "../../validation/podcastSearchValidation.js"
import { getPodcastsBySearchTerm } from "../../service/podcastSearchService.js"
import { InvalidApiKeyError } from "../../error/invalidApiKeyError.js"
import rateLimiter from "../../middleware/rateLimiter.js"
import logger from "../../logger.js"

const router = Router()

/**
 * @openapi
 * /api/podcast/search:
 *   get:
 *     tags:
 *       - Podcast Search
 *     description: Retrieve similar podcasts based on given search term
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Search term
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *       - in: query
 *         name: limit
 *         description: Limit returned result count
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: offset
 *         description: Offset returned result
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 1000
 *     responses:
 *       200:
 *         description: Successfully retrieved similar podcasts based on search term
 *       400:
 *         description: Validation error in provided endpoint parameters
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Error in processing request
 */
router.get(
  "/api/podcast/search",
  rateLimiter.getPodcastSearchLimiter,
  checkSchema(getPodcastSearchValidationSchema, ["query"]),
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
