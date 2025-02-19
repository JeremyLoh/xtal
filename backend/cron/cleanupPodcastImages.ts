import { CronJob } from "cron"
import dayjs from "dayjs"
import StorageClient from "../api/storage/storageClient.js"

const cleanupPodcastImagesJob = CronJob.from({
  cronTime: "*/14 * * * *", // run every 14 minutes, to prevent backend service from sleeping
  onTick: async () => {
    const deleteBeforeDate = dayjs().subtract(7, "day").toDate()
    const limit = 1000
    console.log(
      `Cron job triggered at ${new Date().toString()} to remove podcast image storage older than ${deleteBeforeDate.toDateString()}`
    )
    try {
      StorageClient.deleteStorageFilesBefore(deleteBeforeDate, limit)
    } catch (error: any) {
      console.error(`cleanupPodcastImages(): Cron job error ${error.message}`)
    }
  },
  start: false,
  timeZone: "utc",
})

export { cleanupPodcastImagesJob }
