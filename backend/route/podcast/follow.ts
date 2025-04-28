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
