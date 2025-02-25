import { Request, Response, Router } from "express"
import rateLimiter from "../middleware/rateLimiter.js"

const router = Router()

router.get(
  "/status",
  rateLimiter.getStatusLimiter,
  (request: Request, response: Response) => {
    console.log(`/status called from IP Address ${request.ip}`)
    response.sendStatus(200)
  }
)

export default router
