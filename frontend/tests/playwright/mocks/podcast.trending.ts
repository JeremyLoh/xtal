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
      language: "English", // "en"
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
      language: "English (United States)", // "en-US"
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
      language: "Spanish", // "es"
      categories: ["Science"],
    },
  ],
}

export const tenArtTrendingPodcasts = {
  // backend endpoint => /api/podcast/trending?limit=10&since=1739624661&category=Arts
  count: 10,
  data: [
    {
      id: 2234623,
      url: "https://www.ximalaya.com/album/43044571.xml",
      title: "嘻谈录",
      description:
        "嘻谈录是最正能量的喜剧播客之一，喜剧演员的搞笑分贝制造机，专注嘻谈录。不定期邀请不同的单口喜剧演员和观众，基于各类话题聊天，旨在传播积极阳光的乐观主义精神，为人民群众的奋斗生活提供一种轻松的正能量解压方式，促进广大青年面向进步。\n每一期我们都会邀请听众来现场录制，如果你想当面和主播聊天并录入节目，欢迎关注微信听友群或者公众号【嘻谈录】。",
      author: "嘻谈录",
      image:
        "https://fdfs.xmcdn.com/storages/2d4e-audiofreehighqps/A3/6F/CMCoOSIEFUiuAAhFeQCOIsiD.jpeg",
      latestPublishTime: 1739684931,
      language: "Chinese (Simplified)",
      categories: ["Arts", "Performing", "Comedy", "Interviews"],
    },
    {
      id: 854189,
      url: "https://fapi-top.prisasd.com/podcast/playser/un_libro_una_hora/itunestfp/podcast.xml",
      title: "Un Libro Una Hora",
      description:
        "Aprende a leer, aprende de literatura escuchando. Un programa para contar un libro en una hora. Grandes clásicos de la literatura que te entran por el oído. Dirigido por Antonio Martínez Asensio, crítico literario, productor, escritor y guionista. En directo los domingos a las 05:00 y a cualquier hora si te suscribes. En Podimo, ¿Y ahora qué leo? nuestro spin off con los imprescindibles de la temporada https://go.podimo.com/es/ahoraqueleo",
      author: "SER Podcast",
      image:
        "https://sdmedia.playser.cadenaser.com/playser/image/20244/10/1712744718917_318.jpeg",
      latestPublishTime: 1739685600,
      language: "Spanish (Spain)",
      categories: ["Arts"],
    },
    {
      id: 1320027,
      url: "https://feeds.buzzsprout.com/1429228.rss",
      title: "Celebrate Poe",
      description:
        'This podcast is a deep dive into the life, times. works. and influences of Edgar Allan Poe - "America\'s Shakespeare."   Mr. Poe comes to life in this weekly podcast!',
      author: "George Bartley",
      image: "https://storage.buzzsprout.com/0py7ywli6pabgw17u8lxygq47qqz?.jpg",
      latestPublishTime: 1739685600,
      language: "English (United States)",
      categories: ["Arts", "Books", "Education", "History"],
    },
    {
      id: 6269103,
      url: "https://feeds.buzzsprout.com/2164615.rss",
      title: "The Bible Breakdown",
      description:
        "<div>Welcome to \"The Bible Breakdown,\" where we break down God’s Word so we can know God better. I'm your host, Brandon Cannon, and I'm here to guide you through the pages of the Bible, one day at a time.</div><div><br><br></div><div>Each day, we'll read through a section of the Bible and explore key themes, motifs, and teachings. Whether you're new to the Bible or a seasoned veteran, I guarantee you'll find something insightful or inspiring. My hope is to encourage you to dive deeper and deeper.&nbsp;</div><div><br></div><div>So grab your Bible, your journal, your coffee, and join me on this journey of faith and discovery. And don't forget to hit that subscribe button to stay up-to-date with our daily readings and breakdowns.</div><div><br></div><div>Remember, as we journey through the pages of the Bible together, we're not just reading a book, we're unlocking the secrets to eternal life. The more we dig, the more we find! Let's get started!<br><br>Bible reading plan and SOAP guide: www.experiencerlc.com/the-bible&nbsp;<br><br>Subscribe to&nbsp; my weekly newsletter: www.brandoncannon.com</div>",
      author: "Brandon Cannon",
      image: "https://storage.buzzsprout.com/qu7qz0fhvf5520cfh3hjys97985q?.jpg",
      latestPublishTime: 1739685600,
      language: "English (United States)",
      categories: [
        "Arts",
        "Performing",
        "Education",
        "Christianity",
        "Religion",
        "Spirituality",
      ],
    },
    {
      id: 6720001,
      url: "https://feeds.buzzsprout.com/2280335.rss",
      title: "Small Ways To Live Well from The Simple Things",
      description:
        '<p>Small Ways to Live Well is a podcast from <a href="http://thesimplethings.com/">The Simple Things</a>, a monthly magazine about slowing down, remembering what’s important and making the most of where you live.&nbsp;</p><p><br></p><p>Hosted by the Editor, <a href="https://www.instagram.com/lisasthinks/">Lisa Sykes</a>, in Season 5: Return of the light, she’ll be seeking out glimpses of spring, shrugging off winter and embracing some self-care, alongside wellbeing editor <a href="https://www.instagram.com/becsfrank/?hl=en-gb">Becs Frank</a> and regular contributor <a href="https://www.instagram.com/slowjotinsley/">Jo Tinsley</a>.&nbsp;</p><p>&nbsp;</p><p>The beginning of February marks the half-way point between the winter solstice and the spring equinox, from here on in there are increasing glimpses of spring right through to the clocks going forward in late March when hopefully the proverbial lion turns into a lamb. This is an optimistic, forward-looking time, when we’re more than ready to come out of hibernation to take on new projects. And there are festivals and feasts to brighten the still grey days. February is the chilliest month but it’s all about cold hands and warm hearts.</p><p><br>Let our podcast be your soothing companion to see out winter and welcome in spring.&nbsp; Six episodes released weekly from 9 February. Plus don’t miss our Easter Special on Good Friday. Season 5: Return of the Light is supported by <a href="https://www.blackdownshepherdhuts.co.uk/">Blackdown Shepherd Huts</a></p><p>&nbsp;</p><p>To subscribe or order a copy of The Simple Things visit <a href="http://thesimplethings.com/">thesimplethings.com</a></p>',
      author: "The Simple Things",
      image: "https://storage.buzzsprout.com/pew3t9f93cc2n5uj1uu1g408ccso?.jpg",
      latestPublishTime: 1739685600,
      language: "English (United Kingdom)",
      categories: ["Arts", "Books", "Food", "Leisure", "Home", "Garden"],
    },
    {
      id: 1244547,
      url: "http://www.ximalaya.com/album/4346420.xml",
      title: "九霄",
      description: "我们是你的海盗电台",
      author: "九霄",
      image:
        "https://fdfs.xmcdn.com/storages/28de-audiofreehighqps/CC/69/CMCoOSMEw_42AAoLtADHtlJE.jpeg",
      latestPublishTime: 1739686229,
      language: "Chinese (Simplified)",
      categories: [
        "Arts",
        "Performing",
        "Leisure",
        "Society",
        "Culture",
        "Personal",
        "Journals",
      ],
    },
    {
      id: 326131,
      url: "https://feeds.megaphone.fm/MJS8122694951",
      title: "Italian Wine Podcast",
      description:
        "<p>The Italian Wine Podcast is a storytelling project dedicated to the fascinating world of Italian wine. New episodes are published every day – so stay tuned! With more grape varieties and more diverse grape growing regions than any other country in the world, the story of Italian wine is a rich and captivating one.&nbsp;While the popularity of Italian wine continues to grow in every corner of the globe, inspired by a deep affection for the Italian way of life, the Italian Wine Podcast seeks to entertain, educate and inform. Embracing Italian food, travel, lifestyle and culture, IWP has something for every taste!</p>",
      author: "Italian Wine Podcast",
      image:
        "https://megaphone.imgix.net/podcasts/574248e4-87b2-11ee-ac3b-b71ab9b899c4/image/Italian_Wine_Podcast_Logo.png?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
      latestPublishTime: 1739689200,
      language: "English",
      categories: ["Arts", "Food", "Education", "Society", "Culture"],
    },
    {
      id: 7047251,
      url: "https://feeds.simplecast.com/0KaqgeVz",
      title: "مُلخص كتاب",
      description:
        '"استمع إلى عالم المعرفة في دقائق معدودة! بودكاستنا يقدم لك ملخصات شاملة لأفضل الكتب الصوتية في مختلف المجالات. سواء كنت مهتمًا بالتنمية الذاتية، التاريخ، الروايات، أو العلوم، ستجد هنا ما يناسبك. اكتشف أفكارًا جديدة وتعلم مهارات جديدة بسهولة وسرعة."',
      author: "Podcast Record",
      image:
        "https://image.simplecastcdn.com/images/544c1a06-61e0-4953-a93b-b6db1f762553/7d771380-c071-4a0e-8e6f-e8a2e48442c5/3000x3000/brofyl-bodkst-15.jpg?aid=rss_feed",
      latestPublishTime: 1739689200,
      language: "Arabic",
      categories: [
        "Arts",
        "Books",
        "Business",
        "Management",
        "Education",
        "Self Improvement",
      ],
    },
    {
      id: 9027,
      url: "https://feeds.podetize.com/rss/NVHM9NnC7k",
      title: "Going North Podcast",
      description:
        '<p><span style="color: rgb(34, 34, 34);">Calling all aspiring authors and seasoned wordsmiths alike! This is your official invitation to live your best life and write the book that\'s burning inside you.</span></p><p><br></p><p><span style="color: rgb(34, 34, 34);">The Going North Podcast is your one-stop shop for inspiration, information, and motivation on your author journey. Every Monday, Thursday,&nbsp;and Saturday, host Dom Brightmon, the positive thought catalyst, bestselling author, and certified trainer with the Maxwell Leadership Team chats with incredible authors from around the world.</span></p><p><span style="color: rgb(34, 34, 34);"> </span></p><p><br></p><p><span style="color: rgb(34, 34, 34);">These inspiring guests share their unique stories, writing tips, and the power they\'ve found in the written word. With each episode, you\'ll discover a treasure trove of wisdom, actionable advice, and heartfelt stories that will ignite your creativity and fuel your journey to get your own manuscript moving!</span></p><p><span style="color: rgb(34, 34, 34);"> </span></p><p><br></p><p><span style="color: rgb(34, 34, 34);">But Going North isn\'t just about the craft – it\'s about you. Dom believes in the magic of "Advancing others to advance yourself," and this podcast is all about helping you become the best author and person you can be.</span></p><p><span style="color: rgb(34, 34, 34);"> </span></p><p><br></p><p><span style="color: rgb(34, 34, 34);">So, grab your notebook, unleash your creativity, and get ready to be a part of something special. With Going North as your guide, you\'ll be well on your way to living your best life and sharing your story with the world.</span></p><p><span style="color: rgb(34, 34, 34);"> </span></p><p><br></p><p><span style="color: rgb(34, 34, 34);">Ready to Go North? Subscribe today!</span></p>',
      author: "Dom Brightmon",
      image: "https://feeds.podetize.com/NqUc4INr4.jpg",
      latestPublishTime: 1739689740,
      language: "English (United States)",
      categories: ["Arts", "Books", "Education", "Self Improvement"],
    },
    {
      id: 4382154,
      url: "https://media.rss.com/tajrobati/feed.xml",
      title: "Ne7ki shway",
      description:
        "<p>ان كل ما أبحث عنه هو العدل و ما الحرية الا جزء من العدل , ولا أبحث عن هذا لذاتي بل لكل من يتنفس على هذه الأرض </p><p>أتعلمُ أنّ جِراحَ <strong>الشهيد</strong> تظَلُّ عن الثأر <strong>تستفهِم</strong></p>",
      author: "تجربتي",
      image:
        "https://media.rss.com/tajrobati/20220129_110132_f8f584d54507f90e4f8424d73c2106bc.jpg",
      latestPublishTime: 1739690300,
      language: "Arabic",
      categories: ["Arts", "Books", "Education", "Self Improvement"],
    },
  ],
}

export const tenArtTrendingPodcastsOffsetTen = {
  // backend endpoint => api/podcast/trending?limit=10&offset=10&since=1739624661&category=Arts
  count: 10,
  data: [
    {
      id: 867992,
      url: "https://www.spreaker.com/show/2575654/episodes/feed",
      title: "Moments with Marianne",
      description:
        "In a single moment your life can change!  “Moments with Marianne” is a transformative hour that covers an endless array of topics with the ‘best of the best.’ Her guest are leaders in their fields, ranging from inspirational, mindful, spirituality & consciousness authors, top industry leaders, business and spiritual entrepreneurs.  Each guest is gifted, and a true visionary!  A recognized leader in her own work, and while teaching others to develop, refocus, and grow; Marianne will bring the best guest, and sometimes a special surprise.  Don’t miss this – you never know just which ‘moment’ will change your life forever. https://www.mariannepestana.com",
      author: "Marianne Pestana",
      image:
        "https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/d8de50c9bf1ff3b5025e87c76ad9d2ed.jpg",
      latestPublishTime: 1742681016,
      language: "English",
      categories: [
        "Arts",
        "Books",
        "Education",
        "Self Improvement",
        "Religion",
        "Spirituality",
      ],
    },
    {
      id: 1088107,
      url: "https://aezfm.meldingcloud.com/rss/program/4",
      title: "美文阅读 More to Read",
      description: "中英双语美文欣赏，感受聆听文学之美，享受学习语言之乐。",
      author: "China Plus",
      image: "https://radio-res.cgtn.com/image/2112/1640525235977.jpg",
      latestPublishTime: 1742682600,
      language: "English",
      categories: ["Arts"],
    },
    {
      id: 1364644,
      url: "https://feeds.buzzsprout.com/1574779.rss",
      title: "Mana pro tento den",
      description:
        "Krátká biblická zamyšlení a příběhy autorů z různých křesťanských církví. Více informací o projektu i autorech najdete na https://mana.su-czech.org/",
      author: "Scripture Union ČR",
      image: "https://storage.buzzsprout.com/vpcl6my3kurv2jp0ket3ap9b8ysj?.jpg",
      latestPublishTime: 1742684400,
      language: "Czech",
      categories: [
        "Arts",
        "Books",
        "Education",
        "Self Improvement",
        "Christianity",
        "Religion",
        "Spirituality",
      ],
    },
    {
      id: 3747175,
      url: "https://schreibzeug.podigee.io/feed/mp3",
      title: "Schreibzeug",
      description:
        "Die eine schreibt, der andere nicht. \nDiana Hillebrand (Schriftstellerin) und Wolfgang Tischer (Literaturkritiker) reden über das Schreiben. \nEs geht um Schreibtechniken, Bücher, Veröffentlichungen und über das Reichsein. \nDiana und Wolfgang verbindet eine langjährige Freundschaft und gemeinsame Auftritte auf Buchmessen und in Schreib-Workshops. \nEs gibt viel zu erzählen aus der schreibenden Welt.",
      author: "Diana Hillebrand und Wolfgang Tischer",
      image:
        "https://images.podigee-cdn.net/0x,soeoDk_tQ3dqP8oFL7B_WpVsMt8UPmKLtTrr4DL4ALkQ=/https://main.podigee-cdn.net/uploads/u27814/b790b9eb-bf99-4593-bfc9-3acab18ed32b.jpg",
      latestPublishTime: 1742684400,
      language: "German",
      categories: ["Arts", "Books", "Education", "Courses", "How To"],
    },
    {
      id: 5595138,
      url: "https://feed.podbean.com/mmremaster/feed.xml",
      title: "Mission To The Moon #สรุปหนังสือ",
      description:
        "รายการที่ถอดบทเรียนจากหนังสือชั้นนำจากทั่วโลกแบบเข้มขน สรุปครบจบทั้งเล่มตั้งแต่หน้าแรกถึงหน้าสุดท้าย",
      author: "Mission To The Moon Media",
      image:
        "https://pbcdn1.podbean.com/imglogo/image-logo/14387039/Logo-_-3000x3000_1__uz7rm7.jpg",
      latestPublishTime: 1742684400,
      language: "Thai",
      categories: ["Arts", "Books", "Education"],
    },
    {
      id: 5831397,
      url: "https://www.spreaker.com/show/5453350/episodes/feed",
      title: "Kitap Okumaları",
      description:
        "Herkese merhabalar. Kitap ruhumuzun inceliklerini hitap eder. Ruhlarımızın manevi gıdaya ihtiyacı vardır. Her gün güncellenen yeni kitaplarla hizmetinizdeyiz.",
      author: "Kitap Okumaları",
      image:
        "https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/4d317083931c243908eb5ddb96c9042e.jpg",
      latestPublishTime: 1742685306,
      language: "Turkish",
      categories: ["Arts", "Books"],
    },
    {
      id: 1055001,
      url: "https://feeds.simplecast.com/OVap9of7",
      title: "We Got This with Mark and Hal",
      description:
        "Each week, actors Mark Gagliardi and Hal Lublin (Drunk History, The Thrilling Adventure Hour, Welcome to Night Vale) sit down to settle all the small debates that are a big deal to YOU - once and for all. No subject is too small for Mark and Hal to tackle! Even though you may think it's an impossible puzzle to solve, don't worry... We Got This",
      author: "Hal Lublin and Mark Gagliardi",
      image:
        "https://image.simplecastcdn.com/images/6c243aa3-b094-46c3-9925-11b6e6ac4b76/dea0c567-33dc-4156-84fd-c166888c24f4/3000x3000/wegotthis-cover-new.jpg?aid=rss_feed",
      latestPublishTime: 1742686491,
      language: "English",
      categories: ["Arts", "Comedy", "Interviews", "Society", "Culture"],
    },
    {
      id: 6347377,
      url: "https://feeds.buzzsprout.com/2164385.rss",
      title: "Better call BRiNA",
      description:
        '<p>Hallo, mein Name ist BRiNA!&nbsp;<br><br>Ich bin Tänzerin und Coach. Im Jahr 2021 hatte ich einen Unfall. Ich musste mein Tanzlabel "NYDS - New York Dance Studio " vorübergehend aufgeben: Ich habe mein Herz, meine Liebe, meine Zeit, meinen Schweiss und meine Tränen darin investiert und stand nun erneut in meinem Leben vor einem Scherbenhaufen.<br><br>Aber wenn es eine Sache gibt, für die ich bekannt bin, dann ist es: Never give up (zu Deutsch: Niemals aufgeben). Dieser Podcast ist für dich, wenn auch du lernen möchtest auf den Wellen des Lebens zu surfen. Die Höhen und Tiefen zu meistern. Dieser Podcast steht für holistische Persönlichkeitsentwicklung in den 3 Bereichen: Body, Mind &amp; Soul (zu Deutsch: Körper, Geist und Seele). Hier erwartet dich:&nbsp;<br><br>- Mehr zu meinen bisherigen Lebensweg, meiner Reise &amp; meine Erfahrungen im Bereich Persönlichkeitsentwicklung. Ich teile mit dir, welche Hilfsmittel mir geholfen haben, durchzuhalten, und welche Lektionen ich auf dem Weg gelernt habe.&nbsp; Natürlich spielt hier der Tanz eine grosse Rolle!<br>- Wenn ich es schaffe, dann kannst du das auch! Dieser Podcast soll dir zeigen, dass es trotz&nbsp; widriger Umstände im Leben, immer eine Lösung gibt und du immer entscheiden darfst, wie du damit umgehen möchtest: Never give up!<br><br>In diesem Podcast werden wir zusammen lachen und weinen. Gemeinsam werden wir die Achterbahn "Leben" entdecken: Auf eine authentische, echte und einzigartige Weise. Bist du dabei?&nbsp; &nbsp;<br><br>Lass uns gemeinsam wachsen!&nbsp;<br><br>Fühl dich umarmt<br>Deine BRiNA&nbsp;</p><p><br></p>',
      author: "Sabrina Reyes - BRiNA",
      image: "https://storage.buzzsprout.com/i1xddfmxgr7yud5xc8endpvavzwp?.jpg",
      latestPublishTime: 1742688000,
      language: "German",
      categories: [
        "Arts",
        "Performing",
        "Education",
        "Self Improvement",
        "Health",
        "Fitness",
      ],
    },
    {
      id: 1112700,
      url: "https://libertarianinstitute.org/podcast/",
      title: "The Libertarian Institute - All Podcasts",
      description:
        "Whatever it is, we're against it. Listen to the full collection of podcasts hosted on The Libertarian Institute.",
      author: "The Libertarian Institute - All Podcasts",
      image:
        "https://libertarianinstitute.org/wp-content/uploads/2024/11/inst-square-large.png",
      latestPublishTime: 1742688493,
      language: "English (United States)",
      categories: ["Arts", "Books", "News", "Politics"],
    },
    {
      id: 2481405,
      url: "https://libertarianinstitute.org/feed/",
      title: "The Libertarian Institute",
      description:
        "Whatever it is, we're against it. Listen to the full collection of podcasts hosted on The Libertarian Institute.",
      author: "The Libertarian Institute",
      image:
        "https://libertarianinstitute.org/wp-content/uploads/2024/11/inst-square-large.png",
      latestPublishTime: 1742688493,
      language: "English (United States)",
      categories: ["Arts", "Books", "News", "Politics"],
    },
  ],
}
