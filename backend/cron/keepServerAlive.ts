import { CronJob } from "cron"
import ky from "ky"

const keepServerAliveJob = CronJob.from({
  cronTime: "*/14 * * * *", // run every 14 minutes, to prevent backend service from sleeping
  onTick: async () => {
    console.log(
      `keepServerAliveJob: cron job triggered at ${new Date().toString()} to keep backend alive`
    )
    if (!process.env.BACKEND_ORIGIN) {
      console.error("keepServerAliveJob: process.env.BACKEND_ORIGIN is missing")
    }
    try {
      const url = process.env.BACKEND_ORIGIN + "/status"
      const response = await ky.get(url)
      if (response.status === 200) {
        console.log(`keepServerAliveJob: /status endpoint was available`)
      } else {
        console.error(
          `keepServerAliveJob: error with /status endpoint: ${response.statusText}`
        )
      }
    } catch (error: any) {
      console.error(`keepServerAliveJob: error ${error.message}`)
    }
  },
  start: false,
  timeZone: "utc",
})

export { keepServerAliveJob }
