import { Request, Response, Router } from "express"

const router = Router()

router.get("/status", (request: Request, response: Response) => {
  response.sendStatus(200)
})

export default router
