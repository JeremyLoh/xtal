import { Router } from "express"
import podcastTrendingRouter from "./podcast/trending.js"

const router = Router()

router.use(podcastTrendingRouter)

export default router
