import { Request, Response, Router } from "express"
import { checkSchema, validationResult } from "express-validator"
import { getPodcastCategoryValidationSchema } from "../../validation/podcastCategoryValidation.js"

const router = Router()

router.get(
  "/api/podcast/category",
  checkSchema(getPodcastCategoryValidationSchema),
  async (request: Request, response: Response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
      response.status(400).send({
        errors: result.array().map((error) => error.msg),
      })
      return
    }

    response.status(200).send({})
  }
)

export default router
