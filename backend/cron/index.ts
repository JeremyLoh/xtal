import { cleanupPodcastImagesJob } from "./cleanupPodcastImages.js"

function startCronJobs() {
  console.log("startCronJobs(): Starting cron jobs")
  cleanupPodcastImagesJob.start()
  console.log("startCronJobs(): Finished cron jobs")
}

export default startCronJobs
