import { Router } from "express"
import podcastTrendingRouter from "./podcast/trending.js"
import podcastEpisodeRouter from "./podcast/episode.js"

const router = Router()

router.use(podcastTrendingRouter)
router.use(podcastEpisodeRouter)

export default router
