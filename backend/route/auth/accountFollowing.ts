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

/**
 * @openapi
 * /api/account/podcast/following/total:
 *   get:
 *     tags:
 *       - Account Following
 *     description: Retrieve user podcast following total count based on session user id
 *     responses:
 *       200:
 *         description: Successfully retrieved total podcast following count
 *       500:
 *         description: Error in processing request
 */
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

/**
 * @openapi
 * /api/account/podcast/following:
 *   get:
 *     tags:
 *       - Account Following
 *     description: Retrieve user followed podcasts based on session user id
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Limit user followed podcast result count
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *       - in: query
 *         name: offset
 *         description: Offset user followed podcast results
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *           maximum: 5000
 *     responses:
 *       200:
 *         description: Successfully retrieved user followed podcasts
 *       500:
 *         description: Error in processing request
 */
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
