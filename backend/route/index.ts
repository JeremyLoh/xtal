import { Router } from "express"
import accountRouter from "./auth/account.js"
import accountFollowingRouter from "./auth/accountFollowing.js"
import podcastAccountFollowRouter from "./podcast/follow.js"
import podcastTrendingRouter from "./podcast/trending.js"
import podcastEpisodeRouter from "./podcast/episode.js"
import podcastImageRouter from "./podcast/image.js"
import podcastCategoryRouter from "./podcast/category.js"
import podcastSearchRouter from "./podcast/search.js"
import podcastStatsRouter from "./podcast/stats.js"

const router = Router()

router.use(accountRouter)
router.use(accountFollowingRouter)
router.use(podcastAccountFollowRouter)
router.use(podcastTrendingRouter)
router.use(podcastEpisodeRouter)
router.use(podcastImageRouter)
router.use(podcastCategoryRouter)
router.use(podcastSearchRouter)
router.use(podcastStatsRouter)

export default router
