import { Router, Response } from "express"
import Session from "supertokens-node/recipe/session"
import { SessionRequest } from "supertokens-node/framework/express"
import { verifySession } from "supertokens-node/recipe/session/framework/express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { getAccountFollowingPodcastValidationSchema } from "../../validation/accountPodcastFollowingValidation.js"
import rateLimiter from "../../middleware/rateLimiter.js"
import logger from "../../logger.js"
import {
  getAccountPodcastFollowing,
  getAccountPodcastFollowingTotalCount,
} from "../../service/accountService.js"

const router = Router()

router.get(
  "/api/account/podcast/following/total",
  rateLimiter.getAccountTotalCountFollowingPodcastLimiter,
  verifySession({ sessionRequired: true }),
  async (request: SessionRequest, response: Response) => {
    const session = await Session.getSession(request, response)
    const userId = session.getUserId()
    try {
      const total = await getAccountPodcastFollowingTotalCount(userId)
      response.status(200).send({ total })
    } catch (error: any) {
      logger.error(error.message)
      response.status(500).send("Internal Server Error")
    }
  }
)

router.get(
  "/api/account/podcast/following",
  rateLimiter.getAccountFollowingPodcastLimiter,
  checkSchema(getAccountFollowingPodcastValidationSchema, ["query"]),
  verifySession({ sessionRequired: true }),
  async (request: SessionRequest, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const session = await Session.getSession(request, response)
    const userId = session.getUserId()
    const data = matchedData(request)
    const limit = data.limit ? Number(data.limit) : 10
    const offset = data.offset ? Number(data.offset) : 0
    try {
      const followingPodcasts = await getAccountPodcastFollowing(
        userId,
        limit,
        offset
      )
      response.status(200).send({
        count: followingPodcasts.length,
        data: followingPodcasts,
      })
    } catch (error: any) {
      logger.error(error.message)
      response.status(500).send("Internal Server Error")
    }
  }
)

export default router
