import "dotenv/config"
import express from "express"
import cors from "cors"
import router from "./route/index.js"
import { getCorsOptions } from "./middleware/cors.js"

const PORT = process.env.PORT

function setupApp() {
  const app = express()
  // https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
  app.set("trust proxy", 1) // Trust first proxy (reverse proxy)
  app.use(cors(getCorsOptions()))
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
