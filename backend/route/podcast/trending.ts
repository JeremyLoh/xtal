import { Router, Request, Response } from "express"

const router = Router()

router.get("/podcast/trending", (request: Request, response: Response) => {
  response.status(200)
  response.type("application/json")
  response.send(JSON.stringify({}))
})

export default router
