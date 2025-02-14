import { Router } from "express"
import podcastTrendingRouter from "./podcast/trending.js"
import podcastEpisodeRouter from "./podcast/episode.js"
import podcastImageRouter from "./podcast/image.js"
import podcastCategoryRouter from "./podcast/category.js"

const router = Router()

router.use(podcastTrendingRouter)
router.use(podcastEpisodeRouter)
router.use(podcastImageRouter)
router.use(podcastCategoryRouter)

export default router
