import { decodeHTML } from "entities"
import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { getPodcastImageValidationSchema } from "../../validation/podcastImageValidation.js"
import { getImage } from "../../service/podcastImageService.js"
import rateLimiter from "../../middleware/rateLimiter.js"
import { isValidUrl } from "../../middleware/cors.js"
import logger from "../../logger.js"

const router = Router()

router.get(
  "/api/podcast/image",
  rateLimiter.getPodcastImageConversionLimiter,
  checkSchema(getPodcastImageValidationSchema, ["query"]),
  async (request: Request, response: Response) => {
    const result = validationResult(request)
    const data = matchedData(request)
    const isInvalidUrl =
      data && data.url ? !isValidUrl(decodeHTML(data.url)) : true
    if (!result.isEmpty() || isInvalidUrl) {
      const validationErrors = result.array().map((error) => error.msg)
      response.status(400).send({
        errors: isInvalidUrl
          ? ["'url' should be a valid url"].concat(validationErrors)
          : validationErrors,
      })
      return
    }
    const { url, width, height } = matchedData(request)
    try {
      const imageBuffer = await getImage(
        decodeHTML(url),
        Number(width),
        Number(height)
      )
      const cacheTimeInSeconds = 604800
      response.contentType("image/webp")
      response.setHeader(
        "Cache-Control",
        `public, max-age=${cacheTimeInSeconds}`
      )
      response.status(200).send(imageBuffer)
    } catch (error: any) {
      logger.error("GET /api/podcast/image error: " + error.message)
      response.status(500).send("Internal Server Error")
    }
  }
)

export default router
