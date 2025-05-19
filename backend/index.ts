import "dotenv/config"
import express from "express"
import cors from "cors"
import compression from "compression"
import { middleware as superTokensMiddleware } from "supertokens-node/framework/express"
import { errorHandler } from "supertokens-node/framework/express"
import logger from "./logger.js"
import router from "./route/index.js"
import statusRouter from "./route/status.js"
import {
  allowAllCorsOptions,
  getCorsOptions,
  getProxyTroubleshootingRouter,
} from "./middleware/cors.js"
import startCronJobs from "./cron/index.js"
import { initializeSupertokensSdk } from "./api/auth/superTokens.js"
import { getContentSecurityPolicyMiddleware } from "./middleware/csp.js"
import { addApiDocumentationRoute } from "./middleware/swagger.js"

const PORT = process.env.PORT

function setupApp() {
  const app = express()
  initializeSupertokensSdk()
  // https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
  app.set("trust proxy", 3) // Trust three proxy (reverse proxy)
  app.use(statusRouter) // place before CORS to remove CORS for /status endpoint
  if (process.env.ENABLE_PROXY_TROUBLESHOOTING === "true") {
    // place before CORS for troubleshooting (won't apply CORS to the troubleshooting routes)
    app.use(getProxyTroubleshootingRouter())
  }
  if (
    process.env.ENABLE_API_DOCUMENTATION === "true" &&
    process.env.NODE_ENV !== "test"
  ) {
    app.use(cors(allowAllCorsOptions()))
    addApiDocumentationRoute(app)
  } else {
    app.use(cors(getCorsOptions()))
  }
  app.use(getContentSecurityPolicyMiddleware)
  app.use(superTokensMiddleware()) // supertokens CORS should be before the middleware
  app.use(compression())
  app.use(router)
  app.use(errorHandler()) // add this after all routes
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
      logger.info(`[server]: Server started on port ${PORT}`)
      app.emit("serverStarted")
    })
  }
}

startBackend()

export { setupApp }
