import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import rateLimiter from "../../middleware/rateLimiter.js"
import {
  getPodcastEpisodeById,
  getPodcastEpisodes,
} from "../../service/podcastEpisodeService.js"
import {
  getPodcastEpisodesValidationSchema,
  getSinglePodcastEpisodeValidationSchema,
} from "../../validation/podcastEpisodeValidation.js"
import { InvalidApiKeyError } from "../../error/invalidApiKeyError.js"
import { getPodcastInfo } from "../../service/podcastInfoService.js"
import logger from "../../logger.js"

const router = Router()

/**
 * @openapi
 * /api/podcast/episode:
 *   get:
 *     tags:
 *       - Podcast
 *     description: Retrieve podcast episode by id from Podcast Index API
 *     parameters:
 *       - in: query
 *         name: id
 *         description: Podcast episode id from Podcast Index API
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *     responses:
 *       200:
 *         description: Successfully retrieved podcast episode by id
 *       400:
 *         description: Validation error in provided endpoint parameters
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Error in processing request
 */
router.get(
  "/api/podcast/episode",
  rateLimiter.getPodcastEpisodeLimiter,
  checkSchema(getSinglePodcastEpisodeValidationSchema, ["query"]),
  async (request: Request, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const data = matchedData(request)
    const episodeId = data.id as string
    try {
      const episode = await getPodcastEpisodeById(episodeId)
      response
        .status(200)
        .send(episode ? { count: 1, data: episode } : { count: 0, data: null })
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

/**
 * @openapi
 * /api/podcast/episodes:
 *   get:
 *     tags:
 *       - Podcast
 *     description: Retrieve podcast episodes for a given podcast id (from Podcast Index API)
 *     parameters:
 *       - in: query
 *         name: id
 *         description: Podcast id (main podcast) from Podcast Index API
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *       - in: query
 *         name: limit
 *         description: Limit total returned podcast episodes (make value empty to use default value)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: offset
 *         description: Offset total returned podcast episodes (make value empty to use default value)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 0
 *     responses:
 *       200:
 *         description: Successfully retrieved podcast episodes by podcast id
 *       400:
 *         description: Validation error in provided endpoint parameters
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Error in processing request
 */
router.get(
  "/api/podcast/episodes",
  rateLimiter.getPodcastEpisodesLimiter,
  checkSchema(getPodcastEpisodesValidationSchema, ["query"]),
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
    const offset = Number(data.offset) || 0
    try {
      // choose to not use Promise.allSettled() to respect PodcastIndex API rate limit
      const podcast = await getPodcastInfo(podcastId)
      // there is no pagination based on offset available for PodcastIndex API endpoint
      const episodes = await getPodcastEpisodes(podcastId, limit + offset)
      response.status(200)
      response.type("application/json")
      if (offset === 0) {
        response.send({
          count: episodes.length,
          data: { podcast, episodes },
        })
      } else {
        const offsetEpisodes = episodes.slice(offset, offset + limit)
        response.send({
          count: offsetEpisodes.length,
          data: { podcast, episodes: offsetEpisodes },
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
