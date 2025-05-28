import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { getPodcastRecentValidationSchema } from "../../validation/podcastRecentValidation.js"
import { Language } from "../../model/podcast.js"
import rateLimiter from "../../middleware/rateLimiter.js"
import { getRecentPodcasts } from "../../service/podcastRecentService.js"
import logger from "../../logger.js"

const router = Router()

/**
 * @openapi
 * /api/podcast/recent:
 *   get:
 *     tags:
 *       - Podcast Recent Entries
 *     description: Retrieve recent podcasts
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
 *           maximum: 500
 *           default: 0
 *       - in: query
 *         name: lang
 *         description: Return podcasts in specified language (ISO 639 Language Code). Default of all languages if not given.
 *           https://www.rssboard.org/rss-language-codes - https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
 *         required: false
 *         schema:
 *           type: string
 *           format: ISO 639 Language Code
 *     responses:
 *       200:
 *         description: Successfully retrieved recent podcasts
 *       400:
 *         description: Validation error in provided endpoint parameters
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Error in processing request
 */
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
    const lang: Language | undefined = data.lang ? data.lang : undefined
    try {
      const recentPodcasts = await getRecentPodcasts({ limit, offset, lang })
      response.status(200).type("application/json").send({
        count: recentPodcasts.length,
        data: recentPodcasts,
      })
    } catch (error: any) {
      logger.error(error.message)
      response.status(500).send("Internal Server Error")
      return
    }
  }
)

export default router
