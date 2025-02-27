import logger from "../logger.js"
import { cleanupPodcastImagesJob } from "./cleanupPodcastImages.js"

function startCronJobs() {
  logger.info("startCronJobs(): Starting cron jobs")
  // keepServerAliveJob.start() // NOTE: Replaced with 10 minute calls to /status using https://cron-job.org/en/
  cleanupPodcastImagesJob.start()
  logger.info("startCronJobs(): Finished cron jobs")
}

export default startCronJobs
