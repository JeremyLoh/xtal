import { Router } from "express"
import podcastTrendingRouter from "./podcast/trending.js"
import podcastEpisodeRouter from "./podcast/episode.js"
import podcastImageRouter from "./podcast/image.js"

const router = Router()

router.use(podcastTrendingRouter)
router.use(podcastEpisodeRouter)
router.use(podcastImageRouter)

export default router
