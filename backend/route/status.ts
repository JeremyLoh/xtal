import { Request, Response, Router } from "express"
import rateLimiter from "../middleware/rateLimiter.js"
import logger from "../logger.js"

const router = Router()

/**
 * @openapi
 * /status:
 *   get:
 *     tags:
 *       - Server Status
 *     description: Retrieve server status
 *     responses:
 *       200:
 *         description: Server is running
 *       429:
 *         description: Rate limit exceeded
 */
router.get(
  "/status",
  rateLimiter.getStatusLimiter,
  (request: Request, response: Response) => {
    logger.info(`/status called from IP Address ${request.ip}`)
    response.sendStatus(200)
  }
)

export default router
