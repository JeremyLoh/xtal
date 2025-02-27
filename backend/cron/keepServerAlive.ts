import { CronJob } from "cron"
import ky from "ky"
import logger from "../logger.js"

// NOTE: Replaced with 10 minute calls to /status using https://cron-job.org/en/
const keepServerAliveJob = CronJob.from({
  // https://stackoverflow.com/questions/20417600/quartz-cron-expression-to-run-job-at-every-14-minutes-from-now
  cronTime: "0/10 * * * *", // run every 10 minutes, to prevent backend service from sleeping after 15 minutes of inactivity
  onTick: async () => {
    logger.info(
      `keepServerAliveJob: cron job triggered at ${new Date().toString()} to keep backend alive`
    )
    if (!process.env.BACKEND_ORIGIN) {
      logger.error("keepServerAliveJob: process.env.BACKEND_ORIGIN is missing")
    }
    try {
      const url = process.env.BACKEND_ORIGIN + "/status"
      const response = await ky.get(url, { retry: 0 })
      if (response.status === 200) {
        logger.info(`keepServerAliveJob: /status endpoint is available`)
      } else {
        logger.error(
          `keepServerAliveJob: error with /status endpoint: ${response.statusText}`
        )
      }
    } catch (error: any) {
      logger.error(`keepServerAliveJob: error ${error.message}`)
    }
  },
  start: false,
  timeZone: "utc",
})

export { keepServerAliveJob }
