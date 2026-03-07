import { PodcastIndexFeed } from "../../../api/model/podcast.js"
import { PodcastIndexTrendingPodcastResponse } from "../../../api/responseType/podcastIndexPodcastTypes.js"

export const defaultPodcastFeed: PodcastIndexFeed = {
  id: 171183,
  url: "http://voicesofvr.com/?feed=podcast",
  title: "Voices of VR",
  description:
    "Since May 2014, Kent Bye has published over 1000 Voices of VR podcast interviews featuring the pioneering artists, storytellers, and technologists driving the resurgence of virtual & augmented reality. He's an oral historian, experiential journalist, & aspiring philosopher, helping to define the patterns of immersive storytelling, experiential design, ethical frameworks, & the ultimate potential of XR.",
  author: "Kent Bye",
  image: "http://voicesofvr.com/wp-content/uploads/2022/08/Voices-of-VR.jpg",
  artwork: "http://voicesofvr.com/wp-content/uploads/2022/08/Voices-of-VR.jpg",
  newestItemPublishTime: 1737835575,
  itunesId: 874947046,
  trendScore: 9,
  language: "en-US",
  categories: {
    "1": "Arts",
    "3": "Design",
    "102": "Technology",
    "77": "Society",
    "78": "Culture",
    "82": "Philosophy",
  },
}

export function createPodcastFeed(
  overrides: Partial<PodcastIndexFeed> = {}
): PodcastIndexFeed {
  return {
    id: 171183,
    url: "http://voicesofvr.com/?feed=podcast",
    title: "Voices of VR",
    description:
      "Since May 2014, Kent Bye has published over 1000 Voices of VR podcast interviews featuring the pioneering artists, storytellers, and technologists driving the resurgence of virtual & augmented reality. He's an oral historian, experiential journalist, & aspiring philosopher, helping to define the patterns of immersive storytelling, experiential design, ethical frameworks, & the ultimate potential of XR.",
    author: "Kent Bye",
    image: "http://voicesofvr.com/wp-content/uploads/2022/08/Voices-of-VR.jpg",
    artwork:
      "http://voicesofvr.com/wp-content/uploads/2022/08/Voices-of-VR.jpg",
    newestItemPublishTime: 1737835575,
    itunesId: 874947046,
    trendScore: 9,
    language: "en-US",
    categories: {
      "1": "Arts",
      "3": "Design",
      "102": "Technology",
      "77": "Society",
      "78": "Culture",
      "82": "Philosophy",
    },
    ...overrides,
  }
}

export function createTrendingPodcastResponse({
  feeds,
}: {
  feeds: PodcastIndexFeed[]
}): PodcastIndexTrendingPodcastResponse {
  return {
    status: "true",
    count: feeds.length,
    max: feeds.length,
    since: "1613805249",
    description: "Found trending feeds.",
    feeds,
  }
}
