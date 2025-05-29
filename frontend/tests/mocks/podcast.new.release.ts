import { Podcast } from "../../src/api/podcast/model/podcast"

type NewReleasePodcastResponse = {
  count: number
  data: Partial<Podcast>[]
}

// backend endpoint /api/podcast/recent?limit=5&exclude=description
// "description" field in response is removed with query parameter (exclude=description)
export const fiveNewReleasePodcasts: NewReleasePodcastResponse = {
  count: 5,
  data: [
    {
      id: 5502846,
      url: "https://www.dhalgren.net/uk/p.artists?artist=1&locale=uk",
      title: "André Jolivet",
      author: "",
      image: "http://www.dhalgren.net/images/at2.JPG",
      latestPublishTime: 1748428451,
      language: "English (United States)",
      categories: ["Arts", "Visual"],
    },
    {
      id: 1991816,
      url: "https://radiofrance-podcast.net/podcast09/rss_13264.xml",
      title: "La philo de l'info",
      author: "",
      image: "",
      latestPublishTime: 1748428380,
      language: "French",
      categories: ["Society", "Culture"],
    },
    {
      id: 7231578,
      url: "https://overcomerswellnesshub.com/feed/podcast/podcast/",
      title: "FaithBeamsGPPodcast",
      author: "",
      image: "",
      latestPublishTime: 1748428330,
      language: "English (United States)",
      categories: [
        "Education",
        "Self Improvement",
        "Health",
        "Fitness",
        "Christianity",
        "Religion",
        "Spirituality",
      ],
    },
    {
      id: 1471618,
      url: "https://www.rtvfm.net/feed/podcast/rtv-fm-radio-territoire-ventoux/",
      title: "RTV FM (Radio Territoire Ventoux)",
      author: "",
      image:
        "https://www.rtvfm.net/wp-content/uploads/2020/06/Logo-redimensionne-rtvfm-1.png",
      latestPublishTime: 1748428330,
      language: "French (France)",
      categories: [
        "Interviews",
        "Music",
        "Commentary",
        "News",
        "Entertainment",
      ],
    },
    {
      id: 5875112,
      url: "https://feeds.simplecast.com/PZiJ2jpr",
      title: "Avec Vous",
      author: "",
      image:
        "https://image.simplecastcdn.com/images/52fb4b8b-4eeb-4026-a257-9c7f0bc5cf7b/68621b17-728b-438e-9749-48fdec507860/3000x3000/podcast-avec-vous.jpg?aid=rss_feed",
      latestPublishTime: 1748428307,
      language: "French",
      categories: ["Business"],
    },
  ],
}
