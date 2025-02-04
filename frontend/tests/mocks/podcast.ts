export const zeroTrendingPodcasts = {
  // zero entries obtained from backend endpoint /api/podcast/trending
  count: 0,
  data: [],
}

export const defaultTenTrendingPodcasts = {
  // backend endpoint /api/podcast/trending?limit=10 (default backend endpoint value of "since" => 3 days from current timestamp)
  // contains a duplicate entry "Book Chat W/Author Vivian E. Moore" that should be removed from the frontend
  count: 10,
  data: [
    {
      id: 540295,
      url: "https://fapi-top.prisasd.com/podcast/wradiomexico/asi_las_cosas_con_carlos_loret_de_mola/itunestfp/podcast.xml",
      title: "As\u00ed las cosas con Carlos Loret de Mola",
      description: "Programa de tarde con Carlos Loret de Mola.",
      author: "WRadio",
      image:
        "https://wradio.com.mx/especiales/podcast/mx-wradio-alc-loret-040724.jpg",
      latestPublishTime: 1737835320,
      itunesId: 1488142226,
      trendScore: 9,
      language: "Spanish (Spain)", // "es-ES"
      categories: ["News", "Daily"],
    },
    {
      id: 171183,
      url: "http://voicesofvr.com/?feed=podcast",
      title: "Voices of VR",
      description:
        "Since May 2014, Kent Bye has published over 1000 Voices of VR podcast interviews featuring the pioneering artists, storytellers, and technologists driving the resurgence of virtual & augmented reality. He's an oral historian, experiential journalist, & aspiring philosopher, helping to define the patterns of immersive storytelling, experiential design, ethical frameworks, & the ultimate potential of XR.",
      author: "Kent Bye",
      image:
        "http://voicesofvr.com/wp-content/uploads/2022/08/Voices-of-VR.jpg",
      latestPublishTime: 1737835575,
      itunesId: 874947046,
      trendScore: 9,
      language: "English (United States)", // "en-US"
      categories: [
        "Arts",
        "Design",
        "Technology",
        "Society",
        "Culture",
        "Philosophy",
      ],
    },
    {
      id: 7031055,
      url: "https://media.rss.com/episode-1-stephen-brown/feed.xml",
      title: "Bank on it: Life in Sports with Noah Banks",
      description:
        '<p>Introducing <strong>Bank on it: A Life in Sports with Noah Banks</strong>, the networking podcast where Noah Banks connects with industry experts across the world of sports. Each episode dives deep into engaging conversations with athletes, executives, and innovators, providing listeners with insider insights and invaluable career advice. Whether you\'re looking to grow your network or just love hearing from the best in the business, this podcast gives you front-row access to the stories and strategies shaping the future of sports.</p><p>Follow Noah on <a href="https://twitter.com/Banx_Leaf" rel="noopener">Twitter @Banx_Leaf</a> and never miss an episode. Join the conversation and expand your network today!</p>',
      author: "Noah Banks",
      image:
        "https://media.rss.com/episode-1-stephen-brown/20241005_061038_717e6bec0151a051e602bf6f35e5f0b4.png",
      latestPublishTime: 1737835652,
      itunesId: 1771227892,
      trendScore: 9,
      language: "English", // "en"
      categories: ["Sports", "Business", "Entrepreneurship"],
    },
    {
      id: 5874430,
      url: "https://audioboom.com/channels/5135319.rss",
      title: "Stavvy's World",
      description:
        "A podcast where you can hang out with your pal Stav\nEvery week Stavros Halkias and his friends will help you solve all your problems. Wanna be a part of the show? Call 904-800-STAV, leave a voicemail and get some advice!",
      author: "Stavros Halkias",
      image: "https://audioboom.com/i/41822321.jpg",
      latestPublishTime: 1737835698,
      itunesId: 1657458632,
      trendScore: 9,
      language: "English", // "en"
      categories: ["Comedy", "Interviews", "Stand-up", "Improv"],
    },
    {
      id: 320763,
      url: "https://www.spreaker.com/show/3276901/episodes/feed",
      title: "Yaron Brook Show",
      description:
        'Yaron Brook discusses news, culture and politics from the principled perspective of Ayn Rand\'s philosophy, Objectivism. <br><br>Want more? Visit www.YaronBrookShow.com and become a Yaron Brook Show supporter to get exclusive content and support the creation of more content like this! https://www.patreon.com/YaronBrookShow.<br><br>Become a supporter of this podcast: <a href="https://www.spreaker.com/podcast/yaron-brook-show--3276901/support?utm_source=rss&amp;utm_medium=rss&amp;utm_campaign=rss">https://www.spreaker.com/podcast/yaron-brook-show--3276901/support</a>.',
      author: "Yaron Brook",
      image:
        "https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/05714427c5ec56fdeaef37ed2defdfdd.jpg",
      latestPublishTime: 1737835746,
      itunesId: 964330550,
      trendScore: 9,
      language: "English", // "en"
      categories: ["Religion", "Spirituality"],
    },
    {
      id: 437920,
      url: "http://www.spreaker.com/user/9154993/episodes/feed",
      title: "Book Chat W/Author Vivian E. Moore",
      description: "Pacing Your Creative Race",
      author: "Author Vivian E. Moore",
      image:
        "https://pbcdn1.podbean.com/imglogo/image-logo/15892259/e8c023c481d071de8827991bed3af7e8.jpg",
      latestPublishTime: 1737835800,
      itunesId: 1239048003,
      trendScore: 9,
      language: "English", // "en"
      categories: ["Arts", "Education", "How To"],
    },
    {
      id: 464425,
      url: "https://feed.podbean.com/bgtfn7n7gcm/feed.xml",
      title: "Book Chat W/Author Vivian E. Moore",
      description: "Pacing Your Creative Race",
      author: "Author Vivian E. Moore",
      image:
        "https://pbcdn1.podbean.com/imglogo/image-logo/15892259/e8c023c481d071de8827991bed3af7e8.jpg",
      latestPublishTime: 1737835800,
      itunesId: 1467520154,
      trendScore: 9,
      language: "English", // "en"
      categories: ["Arts", "Education", "How To"],
    },
    {
      id: 873817,
      url: "https://www.spreaker.com/show/2448531/episodes/feed",
      title: "The Travel Show",
      description:
        "The Travel Show with Larry Gelwix and Don Shafer on 105.9 KNRS and the Summit Radio Network in Salt Lake City.",
      author: "Talk Radio 105.9 - KNRS (KNRS-FM)",
      image:
        "https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/1177dcea21e81aea019d14a423e66544.jpg",
      latestPublishTime: 1737835832,
      itunesId: 1253130544,
      trendScore: 9,
      language: "English", // "en"
      categories: ["Society", "Culture", "Places", "Travel"],
    },
    {
      id: 1367573,
      url: "https://anesthesiaguidebook.com/feed/podcast/",
      title: "Anesthesia Guidebook",
      description:
        "Anesthesia Guidebook is the go-to guide for providers who want to master their craft.  We help anesthesia providers thrive in challenging, high-stakes careers through our relevant, compelling guides. You\u2019re on a path to becoming a master anesthesia provider. We\u2019re your go-to guide for deepening your anesthesia practice.",
      author: "Jon Lowrance",
      image:
        "https://anesthesiaguidebook.com/wp-content/uploads/powerpress/Anesthesia_Guidebook_subtitle_border_scaled-640.jpg",
      latestPublishTime: 1737836048,
      itunesId: 1528907211,
      trendScore: 9,
      language: "English", // "en"
      categories: [
        "Health",
        "Fitness",
        "Medicine",
        "Education",
        "Science",
        "Life",
      ],
    },
    {
      id: 5630444,
      url: "https://feed.podbean.com/TheSovereignSoul/feed.xml",
      title:
        "THE SOVEREIGN SOUL Show: Cutting Edge Topics, Guests & Awakened Truth Bombs with lotsa Love, Levity \u2019n Liberty.",
      description:
        "Listen in as two Reiki Masters and Entrepreneurs -- one with a background from the Canadian Infantry, the other a former Attorney from Chicago -- share how you can Tap Into Your Natural Born SUPER Powers, discuss why the Chakras are leaving our new earth, ancient healing arts of Jesus & Buddha, plus Quantum Entanglement, Telepathy, and StarSeeds arriving to help accelerate the Great Awakening of Humanity\u2019s Consciousness.",
      author: "The Sovereign Soul Show",
      image:
        "https://pbcdn1.podbean.com/imglogo/image-logo/14303876/The_Sovereign_Soul_show_host_The_Bling_d_Buddhapodcast_image_3k_x_3k6i3mg.jpeg",
      latestPublishTime: 1737836195,
      itunesId: 1625157350,
      trendScore: 9,
      language: "English", // "en"
      categories: ["Education", "Society", "Culture", "Self Improvement"],
    },
  ],
}

export const threeTrendingPodcasts = {
  // backend endpoint /api/podcast/trending
  count: 3,
  data: [
    {
      id: 3696245,
      url: "https://www.spreaker.com/show/5023627/episodes/feed",
      title: "Hack The Movies",
      description:
        "Join Tony and the Hack The Movies crew twice a week as they talk about tapes or discuss newer movies and film topics!",
      author: "Screenwave Media",
      image:
        "https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/0604a9b179d97957d1864e792e00e9db.jpg",
      latestPublishTime: 1738648807,
      itunesId: 1561818422,
      trendScore: 9,
      language: "English",
      categories: ["Tv", "Film", "Reviews"],
    },
    {
      id: 4768277,
      url: "https://fast.wistia.com/channels/k0okf4g9ht/rss",
      title: "Investing by the Books",
      description:
        "Investing by the Books is a podcast to educate sophisticated and aspiring investors. We believe books are an excellent source for timeless knowledge, enhanced through deep conversations with authors and other guests. Hosts: Eddie Palmgren and Niklas Sävås. Producer: Eddie S. Ahlgren Twitter: @IB_Redeye\n",
      author: "Redeye AB",
      image:
        "https://embed-ssl.wistia.com/deliveries/ecf5f469550ab420cdea2324d24adb6d.jpg?image_crop_resized=3000x3000",
      latestPublishTime: 1738648815,
      itunesId: 1577368197,
      trendScore: 9,
      language: "English (United States)",
      categories: ["Arts", "Books", "Business", "Investing"],
    },
    {
      id: 842886,
      url: "https://feeds.emilcar.fm/bacteriofagos",
      title: "Bacteriófagos",
      description:
        "<p>Bacteriófagos, un podcast quincenal de curiosidades biológicas y actualidad científica para todos los públicos. Presentado por Carmela García Doval.</p>",
      author: "Carmela García Doval",
      image: "https://media.rss.com/bacteriofagos/podcast_cover.jpg",
      latestPublishTime: 1738648830,
      itunesId: 1212473460,
      trendScore: 9,
      language: "Spanish",
      categories: ["Science"],
    },
  ],
}
