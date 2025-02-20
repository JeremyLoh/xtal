import { cleanupPodcastImagesJob } from "./cleanupPodcastImages.js"
import { keepServerAliveJob } from "./keepServerAlive.js"

function startCronJobs() {
  console.log("startCronJobs(): Starting cron jobs")
  keepServerAliveJob.start()
  cleanupPodcastImagesJob.start()
  console.log("startCronJobs(): Finished cron jobs")
}

export default startCronJobs
