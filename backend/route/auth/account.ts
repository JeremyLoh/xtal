import dayjs from "dayjs"
import { decodeHTML } from "entities"
import { json, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { deleteUser } from "supertokens-node"
import Session from "supertokens-node/recipe/session"
import { SessionRequest } from "supertokens-node/framework/express"
import { verifySession } from "supertokens-node/recipe/session/framework/express"
import rateLimiter from "../../middleware/rateLimiter.js"
import {
  addAccountPodcastPlayHistoryValidationSchema,
  deleteAccountPodcastPlayHistoryValidationSchema,
  getAccountPodcastPlayHistoryTimestampValidationSchema,
  getAccountPodcastPlayHistoryValidationSchema,
} from "../../validation/accountPodcastPlayHistoryValidation.js"
import {
  deleteAccountPodcastEpisodePlayHistory,
  getAccountPodcastEpisodeLastPlayTimestamp,
  getAccountPodcastEpisodePlayCount,
  getAccountPodcastEpisodePlayHistory,
  updateAccountPodcastEpisodePlayHistory,
} from "../../service/accountService.js"
import { PodcastEpisode } from "../../model/podcastEpisode.js"
import { Language } from "../../model/podcast.js"
import logger from "../../logger.js"

const router = Router()

/**
 * @openapi
 * /api/account:
 *   delete:
 *     tags:
 *       - Account
 *     description: Delete an account and revoke session based on session user id
 *     responses:
 *       200:
 *         description: Successfully deleted account and revoked session
 *       500:
 *         description: Error in processing request
 */
router.delete(
  "/api/account",
  rateLimiter.deleteAccountLimiter,
  verifySession({ sessionRequired: true }),
  async (request: SessionRequest, response: Response) => {
    const session = await Session.getSession(request, response)
    const userId = session.getUserId()
    try {
      await deleteUser(userId)
      // delete session from db and frontend (cookies)
      await request.session!.revokeSession()
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
 * /api/account/podcast-play-history-count:
 *   get:
 *     tags:
 *       - Account
 *     description: Retrieve user podcast episode total play count from session user id
 *     responses:
 *       200:
 *         description: Successfully retrieved total podcast episode play count
 *       500:
 *         description: Error in processing request
 */
router.get(
  "/api/account/podcast-play-history-count",
  rateLimiter.getAccountPlayHistoryCountLimiter,
  verifySession({ sessionRequired: true }),
  async (request: SessionRequest, response: Response) => {
    const session = await Session.getSession(request, response)
    const userId = session.getUserId()
    try {
      const count = await getAccountPodcastEpisodePlayCount(userId)
      response.status(200).send({ count })
    } catch (error: any) {
      logger.error(error.message)
      response.status(500).send("Internal Server Error")
      return
    }
  }
)

/**
 * @openapi
 * /api/account/podcast-play-history-timestamp:
 *   get:
 *     tags:
 *       - Account - Podcast Episode
 *     description: Retrieve account podcast episode previously saved last played timestamp
 *     parameters:
 *       - in: query
 *         name: episodeId
 *         description: Podcast Episode Id from PodcastIndex API
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *     responses:
 *       200:
 *         description: Successfully retrieved total podcast episode play count
 *       400:
 *         description: Validation error in provided endpoint query parameters
 *       500:
 *         description: Error in processing request
 */
router.get(
  "/api/account/podcast-play-history-timestamp",
  rateLimiter.getAccountPlayHistoryTimestampLimiter,
  checkSchema(getAccountPodcastPlayHistoryTimestampValidationSchema, ["query"]),
  verifySession({ sessionRequired: true }),
  async (request: SessionRequest, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const data = matchedData(request)
    const episodeId = data.episodeId
    const session = await Session.getSession(request, response)
    const userId = session.getUserId()
    try {
      const lastPlayedTimestamp =
        await getAccountPodcastEpisodeLastPlayTimestamp(userId, episodeId)
      if (lastPlayedTimestamp) {
        response.status(200).send({
          lastPlayedTimestamp,
        })
      } else {
        response.status(200).send({
          lastPlayedTimestamp: 0,
        })
      }
    } catch (error: any) {
      logger.error(error.message)
      response.status(500).send("Internal Server Error")
      return
    }
  }
)

/**
 * @openapi
 * /api/account/podcast-play-history:
 *   get:
 *     tags:
 *       - Account - Podcast Episode
 *     description: Retrieve user podcast episode play history
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Limit returned results to a given maximum
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *       - in: query
 *         name: offset
 *         description: Offset search results by given item count
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 1000
 *           default: 0
 *     responses:
 *       200:
 *         description: Successfully retrieved podcast episodes play history in reverse chronological order (most recent to oldest order)
 *       400:
 *         description: Validation error in provided endpoint query parameters
 *       500:
 *         description: Error in processing request
 */
router.get(
  "/api/account/podcast-play-history",
  rateLimiter.getAccountPlayHistoryLimiter,
  checkSchema(getAccountPodcastPlayHistoryValidationSchema, ["query"]),
  verifySession({ sessionRequired: true }),
  async (request: SessionRequest, response: Response) => {
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

    const session = await Session.getSession(request, response)
    const userId = session.getUserId()
    try {
      const data = await getAccountPodcastEpisodePlayHistory(
        userId,
        limit,
        offset
      )
      if (data) {
        response.status(200).send({
          count: data.length,
          data,
        })
      } else {
        response.status(200).send({
          count: 0,
          data: null,
        })
      }
    } catch (error: any) {
      logger.error(error.message)
      response.status(500).send("Internal Server Error")
      return
    }
  }
)

/**
 * @openapi
 * /api/account/podcast-play-history:
 *   delete:
 *     tags:
 *       - Account - Podcast Episode
 *     description: Delete account podcast episode play history for provided episode id (from Podcast Index API)
 *     parameters:
 *       - in: body
 *         name: episodeId
 *         description: Episode id from Podcast Index API
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *     responses:
 *       200:
 *         description: Successfully deleted podcast episode play history
 *       400:
 *         description: Validation error in provided endpoint query parameters
 *       500:
 *         description: Error in processing request
 */
router.delete(
  "/api/account/podcast-play-history",
  rateLimiter.deleteAccountPlayHistoryLimiter,
  json(),
  checkSchema(deleteAccountPodcastPlayHistoryValidationSchema, ["body"]),
  verifySession({ sessionRequired: true }),
  async (request: SessionRequest, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const data = matchedData(request)
    const episodeId = data.episodeId
    const session = await Session.getSession(request, response)
    const userId = session.getUserId()
    try {
      await deleteAccountPodcastEpisodePlayHistory(userId, episodeId)
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
 * /api/account/podcast-play-history:
 *   post:
 *     tags:
 *       - Account - Podcast Episode
 *     description: Add account podcast episode play history for provided episode id (from Podcast Index API)
 *     parameters:
 *       - in: body
 *         name: episodeId
 *         description: Episode id from Podcast Index API
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *       - in: body
 *         name: podcastId
 *         description: Podcast id from Podcast Index API
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *       - in: body
 *         name: episodeTitle
 *         description: Episode Title
 *         required: true
 *         schema:
 *           type: string
 *           minimum: 1
 *           maximum: 500
 *       - in: body
 *         name: podcastTitle
 *         description: Podcast Title
 *         required: true
 *         schema:
 *           type: string
 *           minimum: 1
 *           maximum: 500
 *       - in: body
 *         name: contentUrl
 *         description: Content url of the podcast episode (link to resource playback file)
 *         required: true
 *         schema:
 *           type: string
 *           minimum: 1
 *           maximum: 2048
 *       - in: body
 *         name: durationInSeconds
 *         description: Duration of episode in seconds
 *         required: true
 *         schema:
 *           type: string
 *           minimum: 1
 *           maximum: 9999999
 *       - in: body
 *         name: publishDateUnixTimestamp
 *         description: Episode publish date in Unix Timestamp (ISO 8601 format)
 *         required: false
 *         schema:
 *           type: string
 *           format: unix timestamp
 *       - in: body
 *         name: isExplicit
 *         description: Indicate whether podcast episode contains explicit language
 *         required: true
 *         schema:
 *           type: string
 *           format: boolean
 *       - in: body
 *         name: episodeNumber
 *         description: Podcast episode number
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *       - in: body
 *         name: seasonNumber
 *         description: Podcast episode season number
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *       - in: body
 *         name: image
 *         description: Podcast episode image url (to fetch image)
 *         required: true
 *         schema:
 *           type: string
 *           format: url
 *           minimum: 5
 *           maximum: 2048
 *       - in: body
 *         name: language
 *         description: Podcast episode language
 *         required: false
 *         schema:
 *           type: string
 *           minimum: 2
 *           maximum: 64
 *       - in: body
 *         name: externalWebsiteUrl
 *         description: Podcast episode official website
 *         required: false
 *         schema:
 *           type: string
 *           format: url
 *           minimum: 7
 *           maximum: 2048
 *       - in: body
 *         name: resumePlayTimeInSeconds
 *         description: Account podcast episode last played time
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *     responses:
 *       200:
 *         description: Successfully added podcast episode play history
 *       400:
 *         description: Validation error in provided endpoint query parameters
 *       500:
 *         description: Error in processing request
 */
router.post(
  "/api/account/podcast-play-history",
  rateLimiter.updateAccountPlayHistoryLimiter,
  json(),
  checkSchema(addAccountPodcastPlayHistoryValidationSchema, ["body"]),
  verifySession({ sessionRequired: true }),
  async (request: SessionRequest, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const data = matchedData(request)
    const session = await Session.getSession(request, response)
    const userId = session.getUserId()
    const episode: PodcastEpisode = convertRequestToPodcastEpisode(data)
    const resumePlayTimeInSeconds = data.resumePlayTimeInSeconds
      ? Number(data.resumePlayTimeInSeconds)
      : 0
    try {
      await updateAccountPodcastEpisodePlayHistory(
        userId,
        resumePlayTimeInSeconds,
        episode
      )
      response.sendStatus(200)
    } catch (error: any) {
      logger.error(error.message)
      response.status(500).send("Internal Server Error")
      return
    }
  }
)

function convertRequestToPodcastEpisode(
  data: Record<string, any>
): PodcastEpisode {
  // any url passed needs to be decoded (&#x2F; => /) - https://www.npmjs.com/package/entities
  const {
    episodeTitle,
    podcastTitle,
    contentUrl,
    image,
    language,
    externalWebsiteUrl,
  } = data
  const episodeId = Number(data.episodeId)
  const podcastId = Number(data.podcastId)
  const durationInSeconds = data.durationInSeconds
    ? Number(data.durationInSeconds)
    : null
  const publishDateUnixTimestamp = data.publishDateUnixTimestamp
    ? data.publishDateUnixTimestamp
    : null
  const isExplicit = Boolean(data.isExplicit)
  const episodeNumber = data.episodeNumber ? Number(data.episodeNumber) : null
  const seasonNumber = data.seasonNumber ? Number(data.seasonNumber) : null

  return {
    id: episodeId,
    feedId: podcastId,
    title: decodeHTML(episodeTitle),
    feedTitle: decodeHTML(podcastTitle),
    description: "", // ignore the podcast episode description for saving a podcast episode
    contentUrl: decodeHTML(contentUrl),
    contentType: "", // ignore the podcast episode content type for saving a podcast episode
    durationInSeconds: durationInSeconds,
    datePublished: dayjs(publishDateUnixTimestamp).unix(),
    isExplicit: isExplicit,
    episodeNumber,
    seasonNumber,
    image: decodeHTML(image),
    language: language as Language, // frontend only has the full text version "English" instead of "en"
    externalWebsiteUrl: decodeHTML(externalWebsiteUrl),
    people: null,
    transcripts: null,
  }
}

export default router
