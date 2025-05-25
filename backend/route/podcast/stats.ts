import { Request, Response, Router } from "express"
import { getCurrentPodcastApiCountStats } from "../../service/podcastStatsService.js"
import rateLimiter from "../../middleware/rateLimiter.js"
import { InvalidApiKeyError } from "../../error/invalidApiKeyError.js"
import logger from "../../logger.js"

const router = Router()

/**
 * @openapi
 * /api/podcast/stats/current:
 *   get:
 *     tags:
 *       - Podcast Statistics
 *     description: Retrieve current total podcast statistics for available podcasts
 *     responses:
 *       200:
 *         description: Successfully retrieved current total podcast statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPodcasts:
 *                   type: integer
 *                   description: Total number of podcasts available
 *                   example: 4544812
 *                 totalPodcastEpisodes:
 *                   type: integer
 *                   description: Total number of podcast episodes available
 *                   example: 110958837
 *                 episodesPublishedInLastThirtyDays:
 *                   type: integer
 *                   description: Number of published podcast episodes in the last 30 days
 *                   example: 352956
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Error in processing request
 */
router.get(
  "/api/podcast/stats/current",
  rateLimiter.getPodcastStatsLimiter,
  async (_: Request, response: Response) => {
    try {
      const stats = await getCurrentPodcastApiCountStats()
      const cacheTimeInSeconds = 43200
      response.setHeader(
        "Cache-Control",
        `public, max-age=${cacheTimeInSeconds}`
      )
      response.status(200).send(stats)
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
