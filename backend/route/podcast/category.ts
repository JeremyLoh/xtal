import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { getPodcastCategoryValidationSchema } from "../../validation/podcastCategoryValidation.js"
import { getPodcastCategories } from "../../service/podcastCategoryService.js"
import { InvalidApiKeyError } from "../../error/invalidApiKeyError.js"
import rateLimiter from "../../middleware/rateLimiter.js"
import logger from "../../logger.js"

const router = Router()

/**
 * @openapi
 * /api/podcast/category:
 *   get:
 *     tags:
 *       - Podcast
 *     description: Retrieve available podcast categories from Podcast Index API
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Limit count of categories result
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: offset
 *         description: Offset categories result
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *     responses:
 *       200:
 *         description: Successfully retrieved podcast categories
 *       400:
 *         description: Validation error in provided endpoint parameters
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Error in processing request
 */
router.get(
  "/api/podcast/category",
  rateLimiter.getPodcastCategoryLimiter,
  checkSchema(getPodcastCategoryValidationSchema, ["query"]),
  async (request: Request, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }
    const data = matchedData(request)
    const limit = data.limit ? Number(data.limit) : null
    const offset = data.offset ? Number(data.offset) : null
    try {
      let podcastCategories = await getPodcastCategories()
      if (offset) {
        podcastCategories = podcastCategories.slice(offset)
      }
      if (limit) {
        podcastCategories = podcastCategories.slice(0, limit)
      }
      response.status(200)
      response.type("application/json")
      response.send({
        count: podcastCategories.length,
        data: podcastCategories,
      })
    } catch (error: any) {
      if (error instanceof InvalidApiKeyError) {
        response.status(500).send(error.message)
        return
      } else {
        logger.error(error.message)
        response.status(500).send("Internal Server Error")
        return
      }
    }
  }
)

export default router
