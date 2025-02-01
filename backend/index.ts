import "dotenv/config"
import express, { Router } from "express"
import cors from "cors"
import router from "./route/index.js"
import { getCorsOptions } from "./middleware/cors.js"

const PORT = process.env.PORT

function setupApp() {
  const app = express()
  // https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
  app.set("trust proxy", 3) // Trust three proxy (reverse proxy)

  //@ts-ignore
  const testRouter = new Router()
  //@ts-ignore
  testRouter.get("/ip", (request, response) => response.send(request.ip))
  //@ts-ignore
  testRouter.get("/x-forwarded-for", (request, response) => {
    console.log(request.headers)
    response.send(request.headers["x-forwarded-for"])
  })
  app.use(testRouter)

  app.use(cors(getCorsOptions()))
  app.use(express.json()) // middleware to parse json request body
  app.use(router)
  return app
}

function startBackend() {
  if (PORT == null) {
    throw new Error("[server]: process.env.PORT should be defined")
  }
  const app = setupApp()
  if (process.env.NODE_ENV !== "test") {
    // prevent test failure on parallel test runs on the same port. (supertest uses port 0 by default if no app.listen is executed)
    app.listen(PORT, () => {
      console.log(`[server]: Server started on port ${PORT}`)
      app.emit("serverStarted")
    })
  }
}

startBackend()

export { setupApp }
