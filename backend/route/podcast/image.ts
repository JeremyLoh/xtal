import { decodeHTML } from "entities"
import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { getPodcastImageValidationSchema } from "../../validation/podcastImageValidation.js"
import { getImage } from "../../service/podcastImageService.js"
import rateLimiter from "../../middleware/rateLimiter.js"
import { isValidUrl } from "../../middleware/cors.js"
import logger from "../../logger.js"

const router = Router()

/**
 * @openapi
 * /api/podcast/image:
 *   get:
 *     tags:
 *       - Podcast Image
 *     description: Retrieve and optimize webp image from provided image url. Return "Cache-Control" header of 604800 seconds
 *     parameters:
 *       - in: query
 *         name: url
 *         description: Podcast image url
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 2048
 *       - in: query
 *         name: width
 *         description: Podcast image width to resize in returned result
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 16
 *           maximum: 500
 *       - in: query
 *         name: height
 *         description: Podcast image height to resize in returned result
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 16
 *           maximum: 500
 *     responses:
 *       200:
 *         description: Successfully retrieved podcast image in webp format from provided image url
 *         headers:
 *           Cache-Control:
 *             type: string
 *             description: Duration to cache the given image in seconds (public, max-age=604800)
 *         content:
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Validation error in provided endpoint parameters
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Error in processing request
 */
router.get(
  "/api/podcast/image",
  rateLimiter.getPodcastImageConversionLimiter,
  checkSchema(getPodcastImageValidationSchema, ["query"]),
  async (request: Request, response: Response) => {
    const result = validationResult(request)
    const data = matchedData(request)
    const isInvalidUrl = data?.url ? !isValidUrl(decodeHTML(data.url)) : true
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
