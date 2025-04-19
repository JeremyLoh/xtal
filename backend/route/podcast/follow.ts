import { decodeHTML } from "entities"
import { Response, Router } from "express"
import { verifySession } from "supertokens-node/recipe/session/framework/express"
import { SessionRequest } from "supertokens-node/framework/express"
import { getSession } from "supertokens-node/recipe/session"
import { checkSchema, matchedData, validationResult } from "express-validator"
import rateLimiter from "../../middleware/rateLimiter.js"
import logger from "../../logger.js"
import {
  getAccountFollowPodcastValidationSchema,
  getAddAccountFollowPodcastValidationSchema,
} from "../../validation/podcastFollowValidation.js"
import {
  addAccountPodcastFollow,
  getAccountFollowPodcastById,
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
  "/api/podcast/follow",
  rateLimiter.addAccountFollowPodcastLimiter,
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
    const session = await getSession(request, response)
    const userId = session.getUserId()
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
