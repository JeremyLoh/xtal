import { CronJob } from "cron"
import dayjs from "dayjs"
import StorageClient from "../api/storage/storageClient.js"
import logger from "../logger.js"

const cleanupPodcastImagesJob = CronJob.from({
  cronTime: "1 0 * * *", // run every day at 12:01AM
  onTick: async () => {
    const deleteBeforeDate = dayjs().subtract(7, "day").toDate()
    const limit = 1000
    logger.info(
      `Cron job triggered at ${new Date().toString()} to remove podcast image storage older than ${deleteBeforeDate.toDateString()}`
    )
    try {
      await StorageClient.deleteStorageFilesBefore(deleteBeforeDate, limit)
    } catch (error: any) {
      logger.error(`cleanupPodcastImages(): Cron job error ${error.message}`)
    }
  },
  start: false,
  timeZone: "utc",
})

export { cleanupPodcastImagesJob }
