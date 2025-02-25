import { cleanupPodcastImagesJob } from "./cleanupPodcastImages.js"

function startCronJobs() {
  console.log("startCronJobs(): Starting cron jobs")
  // keepServerAliveJob.start() // NOTE: Replaced with 10 minute calls to /status using https://cron-job.org/en/
  cleanupPodcastImagesJob.start()
  console.log("startCronJobs(): Finished cron jobs")
}

export default startCronJobs
