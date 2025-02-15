import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { getPodcastCategoryValidationSchema } from "../../validation/podcastCategoryValidation.js"
import { getPodcastCategories } from "../../service/podcastCategoryService.js"
import { InvalidApiKeyError } from "../../error/invalidApiKeyError.js"
import rateLimiter from "../../middleware/rateLimiter.js"

const router = Router()

router.get(
  "/api/podcast/category",
  checkSchema(getPodcastCategoryValidationSchema, ["query"]),
  rateLimiter.getPodcastCategoryLimiter,
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
        console.error(error.message)
        response.status(500).send("Internal Server Error")
        return
      }
    }
  }
)

export default router
