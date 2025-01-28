import { Router, Request, Response } from "express"
import dayjs from "dayjs"
import { getTrendingPodcasts } from "../../service/podcastTrendingService.js"
import { InvalidApiKeyError } from "../../error/invalidApiKeyError.js"

const router = Router()

router.get(
  "/podcast/trending",
  async (request: Request, response: Response) => {
    const threeDaysAgo = dayjs().subtract(3, "days").toDate()
    const max = Number(request.query.max) || 10
    const since: Date = request.query.since
      ? new Date(Number(request.query.since) * 1000) // convert unix timestamp to milliseconds
      : threeDaysAgo

    try {
      const podcasts = await getTrendingPodcasts(max, since)
      response.status(200)
      response.type("application/json")
      response.send({
        count: podcasts.length,
        data: podcasts,
      })
    } catch (error: any) {
      if (error instanceof InvalidApiKeyError) {
        response.status(500).send(error.message)
        return
      } else {
        console.error(error.message)
        response.status(500).send("Internal Server Error")
      }
    }
  }
)

export default router
