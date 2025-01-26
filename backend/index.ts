import "dotenv/config"
import router from "./route/index.js"
import express from "express"

const PORT = process.env.PORT

function setupApp() {
  const app = express()
  app.use(router)
  return app
}

function startBackend() {
  if (PORT == null) {
    throw new Error("[server]: process.env.PORT should be defined")
  }
  const app = setupApp()
  app.listen(PORT, () => {
    console.log(`[server]: Server started on port ${PORT}`)
    app.emit("serverStarted")
  })
}

startBackend()

export { setupApp }
