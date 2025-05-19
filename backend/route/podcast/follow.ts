import { decodeHTML } from "entities"
import { json, Response, Router } from "express"
import { verifySession } from "supertokens-node/recipe/session/framework/express"
import { SessionRequest } from "supertokens-node/framework/express"
import { getSession } from "supertokens-node/recipe/session"
import { checkSchema, matchedData, validationResult } from "express-validator"
import rateLimiter from "../../middleware/rateLimiter.js"
import logger from "../../logger.js"
import {
  getAccountFollowPodcastValidationSchema,
  getAccountUnfollowPodcastValidationSchema,
  getAddAccountFollowPodcastValidationSchema,
} from "../../validation/podcastFollowValidation.js"
import {
  addAccountPodcastFollow,
  getAccountFollowPodcastById,
  getAccountPodcastFollowingTotalCount,
  removeAccountPodcastFollow,
} from "../../service/accountService.js"

const router = Router()

/**
 * @openapi
 * /api/podcast/follow:
 *   get:
 *     tags:
 *       - Podcast Following
 *     description: Retrieve whether user follows a podcast based on podcast id (from Podcast Index API)
 *     parameters:
 *       - in: query
 *         name: podcastId
 *         description: Podcast id from Podcast Index API
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *     responses:
 *       200:
 *         description: Successfully retrieved whether user follows a given podcast
 *       400:
 *         description: Validation error in provided endpoint parameters
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Error in processing request
 */
router.get(
  "/api/podcast/follow",
  rateLimiter.getAccountFollowPodcastLimiter,
  checkSchema(getAccountFollowPodcastValidationSchema, ["query"]),
  verifySession({ sessionRequired: true }),
  async (request: SessionRequest, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const session = await getSession(request, response)
    const userId = session.getUserId()
    const data = matchedData(request)
    const podcastId = data.podcastId
    try {
      const isFollowing = await getAccountFollowPodcastById(userId, podcastId)
      response.status(200).send({ isFollowing })
    } catch (error: any) {
      logger.error(error.message)
      response.status(500).send("Internal Server Error")
      return
    }
  }
)

/**
 * @openapi
 * /api/podcast/unfollow:
 *   post:
 *     tags:
 *       - Podcast Following
 *     description: Unfollow user from podcast based on podcast id (from Podcast Index API)
 *     parameters:
 *       - in: body
 *         name: podcastId
 *         description: Podcast id from Podcast Index API
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *     responses:
 *       200:
 *         description: Successfully unfollow user from given podcast
 *       400:
 *         description: Validation error in provided endpoint parameters
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Error in processing request
 */
router.post(
  "/api/podcast/unfollow",
  rateLimiter.removeAccountFollowPodcastLimiter,
  json(),
  checkSchema(getAccountUnfollowPodcastValidationSchema, ["body"]),
  verifySession({ sessionRequired: true }),
  async (request: SessionRequest, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const session = await getSession(request, response)
    const userId = session.getUserId()
    const data = matchedData(request)
    const { podcastId } = data
    try {
      await removeAccountPodcastFollow(userId, podcastId)
      response.sendStatus(200)
    } catch (error: any) {
      logger.error(error.message)
      response.status(500).send("Internal Server Error")
      return
    }
  }
)

/**
 * @openapi
 * /api/podcast/follow:
 *   post:
 *     tags:
 *       - Podcast Following
 *     description: Add user podcast follow based on podcast id (from Podcast Index API). Max user podcast following count of 5000
 *     parameters:
 *       - in: body
 *         name: podcastId
 *         description: Podcast id from Podcast Index API
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *       - in: body
 *         name: externalWebsiteUrl
 *         description: Podcast official website url
 *         required: false
 *         schema:
 *           type: string
 *           format: url
 *           minLength: 7
 *           maxLength: 2048
 *       - in: body
 *         name: title
 *         description: Podcast title
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 500
 *       - in: body
 *         name: author
 *         description: Podcast author
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 500
 *       - in: body
 *         name: image
 *         description: Podcast image url
 *         required: true
 *         schema:
 *           type: string
 *           format: url
 *           minLength: 5
 *           maxLength: 2048
 *       - in: body
 *         name: language
 *         description: Podcast language
 *         required: false
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 64
 *       - in: body
 *         name: publishDateUnixTimestamp
 *         description: Podcast publish timestamp in unix timestamp format (ISO 8601)
 *         required: false
 *         schema:
 *           type: string
 *           format: unix timestamp
 *       - in: body
 *         name: episodeCount
 *         description: Podcast total episode count
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *       - in: body
 *         name: categories
 *         description: Podcast categories array
 *         required: false
 *         type: array
 *         minItems: 0
 *         items:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully add user podcast follow from given podcast
 *       400:
 *         description: Validation error in provided endpoint parameters or user has reached max podcast follow count of 5000
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Error in processing request
 */
router.post(
  "/api/podcast/follow",
  rateLimiter.addAccountFollowPodcastLimiter,
  json(),
  checkSchema(getAddAccountFollowPodcastValidationSchema, ["body"]),
  verifySession({ sessionRequired: true }),
  async (request: SessionRequest, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const MAX_PODCAST_FOLLOW_COUNT = 5000
    const session = await getSession(request, response)
    const userId = session.getUserId()
    try {
      const currentFollowCount = await getAccountPodcastFollowingTotalCount(
        userId
      )
      if (
        currentFollowCount == null ||
        currentFollowCount >= MAX_PODCAST_FOLLOW_COUNT
      ) {
        response
          .status(400)
          .send(
            `You cannot follow more than ${MAX_PODCAST_FOLLOW_COUNT} podcasts!`
          )
        return
      }
    } catch (error: any) {
      logger.error(error.message)
      response.status(500).send("Internal Server Error")
      return
    }
    const data = matchedData(request)
    const { podcastId, language, publishDateUnixTimestamp } = data
    const title = decodeHTML(data.title)
    const externalWebsiteUrl = decodeHTML(data.externalWebsiteUrl)
    const author = decodeHTML(data.author)
    const image = decodeHTML(data.image)
    const episodeCount = data.episodeCount ? Number(data.episodeCount) : null
    const categories = data.categories
      ? data.categories.map((d: string) => decodeHTML(d).trim())
      : []
    try {
      await addAccountPodcastFollow(userId, {
        podcastId,
        externalWebsiteUrl,
        title,
        author,
        image,
        language,
        publishDateUnixTimestamp,
        episodeCount,
        categories,
      })
      response.sendStatus(200)
    } catch (error: any) {
      logger.error(error.message)
      response.status(500).send("Internal Server Error")
      return
    }
  }
)

export default router
