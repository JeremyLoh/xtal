import { Router } from "express"

const router = Router()

router.get("/", (request, response) => {
  res.send("Hello World")
})

export default router
