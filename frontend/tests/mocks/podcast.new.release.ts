import { Podcast } from "../../src/api/podcast/model/podcast"

type NewReleasePodcastResponse = {
  count: number
  data: Podcast[]
}

// backend endpoint /api/podcast/recent?limit=5
export const fiveNewReleasePodcasts: NewReleasePodcastResponse = {
  count: 5,
  data: [
    {
      id: 5502846,
      url: "https://www.dhalgren.net/uk/p.artists?artist=1&locale=uk",
      title: "André Jolivet",
      description: "André Jolivet, represented by the Dhalgren Gallery",
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
      description:
        "Alexandre Lacroix - Bernard thomasson Rendez-vous sur l'application Radio France pour découvrir tous les autres épisodes.",
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
      description:
        "faithBeamsGPPodcast is your source of faith, hope, and encouragement for every stage of life. Whether you’re a young adult searching for purpose, a retiree seeking peace, a family facing financial struggles, or someone navigating personal challenges, this podcast is here to uplift and inspire you.\n\nEach episode dives into real-life stories, biblical wisdom, and practical insights to help you strengthen your faith, overcome hardships, and embrace God’s plan for your life. We cover topics like trusting God in uncertainty, finding peace in difficult times, and walking in faith daily.\n\n📖 Primary Focus Areas:\n✅ Faith-based encouragement for all ages\n✅ Biblical insights to navigate everyday struggles\n✅ Overcoming financial, health, and personal challenges with faith\n✅ Strength, hope, and resilience through God’s promises\n\nNo matter where you are in life, God knows what’s next for you—and we’re here to walk that journey with you.\n\n🎧 Tune in to faithBeamsGPPodcast and let faith light your path!\n📺 Watch & Subscribe on YouTube: https://www.youtube.com/@FaithBeamsGPPodcast-s8l\n\n\n\n\n\n\nfaithBeamsGPPodcast is your source of faith, hope, and encouragement for every stage of life. Whether you’re a young adult searching for purpose, a retiree seeking peace, a family facing financial struggles, or someone navigating personal challenges, this podcast is here to uplift and inspire you.\n\nEach episode dives into real-life stories, biblical wisdom, and practical insights to help you strengthen your faith, overcome hardships, and embrace God’s plan for your life. We cover topics like trusting God in uncertainty, finding peace in difficult times, and walking in faith daily.\n\n📖 Primary Focus Areas:\n✅ Faith-based encouragement for all ages\n✅ Biblical insights to navigate everyday struggles\n✅ Overcoming financial, health, and personal challenges with faith\n✅ Strength, hope, and resilience through God’s promises\n\nNo matter where you are in life, God knows what’s next for you—and we’re here to walk that journey with you.\n\n🎧 Tune in to faithBeamsGPPodcast and let faith light your path!\n📺 Watch & Subscribe on YouTube: @FaithBeamsGPPodcast-s8l",
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
      description:
        "Une radio, Une identité, Un Territoire. Ecoutez nous en direct sur le 102.2 à Carpentras et en DAB+ du Grand Avignon au Mont-Ventoux.",
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
      description:
        "BFM Business répond à vos questions sur la vie en entreprise. Tous les jours de 12h à 13h, les experts de Sandra Gandoin et Sofiane Aklouf se mobilisent pour vous répondre. Chef d'entreprise, salarié, auto-entrepreneur... réagissez à l'adresse mail avecvous@bfmbusiness et sur les réseaux sociaux de l'émission.",
      author: "",
      image:
        "https://image.simplecastcdn.com/images/52fb4b8b-4eeb-4026-a257-9c7f0bc5cf7b/68621b17-728b-438e-9749-48fdec507860/3000x3000/podcast-avec-vous.jpg?aid=rss_feed",
      latestPublishTime: 1748428307,
      language: "French",
      categories: ["Business"],
    },
  ],
}
