import "dotenv/config"
import express from "express"
import cors from "cors"
import router from "./route/index.js"
import {
  getCorsOptions,
  getProxyTroubleshootingRouter,
} from "./middleware/cors.js"
import startCronJobs from "./cron/index.js"

const PORT = process.env.PORT

function setupApp() {
  const app = express()
  // https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
  app.set("trust proxy", 3) // Trust three proxy (reverse proxy)
  if (process.env.ENABLE_PROXY_TROUBLESHOOTING === "true") {
    // place before CORS for troubleshooting (won't apply CORS to the troubleshooting routes)
    app.use(getProxyTroubleshootingRouter())
  }
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
  if (process.env.ENABLE_CRON_JOBS === "true") {
    startCronJobs()
  }
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
