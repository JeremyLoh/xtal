import { Language } from "../../model/podcast.js"

type PodcastIndexCategory = {
  [categoryId: string]: string
}
export type RecentPodcastResponseType = {
  // https://podcastindex-org.github.io/docs-api/#get-/recent/feeds
  status: "true" | "false"
  feeds: {
    id: number
    url: string
    title: string
    description: string
    image: string
    newestItemPublishTime: number
    oldestItemPublishTime: number
    itunesId: number | null
    language: keyof typeof Language
    categories: PodcastIndexCategory | null
  }[]
  count: number
  max: string | null
  since: number | null
  description: string
}

// https://api.podcastindex.org/api/1.0/recent/feeds?max=5
export const PODCAST_RECENT_FIVE_ENTRIES: RecentPodcastResponseType = {
  status: "true",
  feeds: [
    {
      id: 3106347,
      url: "https://radiofrance-podcast.net/podcast09/rss_13819.xml",
      title: "Cartoon Story",
      newestItemPublishTime: 1748275133,
      oldestItemPublishTime: 1748275133,
      description:
        "Cartoon Story Rendez-vous sur l'application Radio France pour découvrir tous les autres épisodes.",
      image: "",
      itunesId: null,
      language: "fr",
      categories: {
        "77": "Society",
        "78": "Culture",
      },
    },
    {
      id: 7242286,
      url: "https://feeds.transistor.fm/pokemon-stats-facts",
      title: "Pokemon Stats & Facts",
      newestItemPublishTime: 1748275051,
      oldestItemPublishTime: 1741327778,
      description:
        "The show host, Angie will tell stats and facts for all 1025 Pokemon! From Bulbasaur to Pecharunt!",
      image:
        "https://img.transistor.fm/vIwcvBO6HJ7TfP9la4Us5yd3RojPY-JUoWS8lEH2sKg/rs:fill:3000:3000:1/q:60/aHR0cHM6Ly9pbWct/dXBsb2FkLXByb2R1/Y3Rpb24udHJhbnNp/c3Rvci5mbS84Yjcz/NzdkY2U3YzlmNzlj/OGI5ZjJmNzliN2Vi/NDg2Yi5wbmc.jpg",
      itunesId: 1815626496,
      language: "en",
      categories: {
        "36": "Kids",
        "37": "Family",
        "104": "Tv",
        "105": "Film",
      },
    },
    {
      id: 6816050,
      url: "https://feeds.simplecast.com/Xx6lTMni",
      title: "Le Paddock RMC",
      newestItemPublishTime: 1748275015,
      oldestItemPublishTime: 1709282042,
      description:
        "Le nouveau podcast de RMC Sport pour suivre toute l'actualité de la Formule1. Tous les lundis après chaque Grand Prix, retrouvez toute l'équipe de RMC Sport autour de Nicolas  Paolorsi et Jean-Luc Roy pour débriefer les résultats du week-end de course.",
      image:
        "https://image.simplecastcdn.com/images/ba089c7d-e47c-430d-9378-0afaf2013a53/7c330537-368b-4fba-b30f-58a950b3febd/3000x3000/1400-podcasts-lepaddock.jpg?aid=rss_feed",
      itunesId: 1733871991,
      language: "fr-fr",
      categories: {
        "86": "Sports",
      },
    },
    {
      id: 6789784,
      url: "https://gracelcms.com/feed/podcast/grace-lutheran-church/",
      title: "Grace Lutheran Church",
      newestItemPublishTime: 1748274978,
      oldestItemPublishTime: 1743356696,
      description: "",
      image: "",
      itunesId: null,
      // @ts-expect-error test if the mixed case value ("en-US") from API will be converted to Language correctly in code ("en-us")
      language: "en-US",
      categories: {
        "20": "Education",
        "25": "Self Improvement",
        "61": "Christianity",
        "65": "Religion",
        "66": "Spirituality",
      },
    },
    {
      id: 5812595,
      url: "https://feeds.simplecast.com/rZaJF7qD",
      title: "El Filip",
      newestItemPublishTime: 1748274939,
      oldestItemPublishTime: 1668146199,
      description:
        "El Filip, el exitosísimo programa de YouTube sobre historias de celebridades y el mundo del entretenimiento conducido por Felipe Cruz, ya está disponible en versión podcast. Acompaña al Filip de lunes a sábado con un episodio nuevo cada día y descubre los aspectos jamás contados de tus celebridades favoritas.",
      image:
        "https://image.simplecastcdn.com/images/c2cc1212-cfe7-4665-b83e-75e12263db62/808799af-ce54-4858-a554-d63b90e62704/3000x3000/elfilip-logo-newcover-3000x.jpg?aid=rss_feed",
      itunesId: 1654020969,
      language: "es",
      categories: {
        "55": "News",
        "57": "Entertainment",
      },
    },
  ],
  count: 5,
  max: "5",
  since: null,
  description: "Found matching feeds.",
}

// https://api.podcastindex.org/api/1.0/recent/feeds?max=10&lang=ja
export const JAPANESE_LANGUAGE_PODCAST_RECENT_TEN_ENTRIES: RecentPodcastResponseType =
  {
    status: "true",
    feeds: [
      {
        id: 7283085,
        url: "https://stand.fm/rss/63669e80b4418c968dbc6a47",
        title: "きつね日和の【狐の化かし合い】",
        newestItemPublishTime: 1748350808,
        oldestItemPublishTime: 1673010017,
        description:
          "毎週 火曜日 22時放送📻 \n結成7年目【きつね日和】のラジオ番組\n▼個人SNSこちら\n【黄】おいなり達也\nTwitter⬇️\nhttps://twitter.com/oinaritatuya\n【紺】松本 昌大\nTwitter⬇️\nhttps://twitter.com/sikimatsu\n▼各種情報\nきつね日和プロフィール\nhttps://lit.link/kitunebiyori\nYouTubeチャンネル\nhttps://www.youtube.com/channel/UCohmcZHF7ArQeII80FBvfNQ?sub_confirmation=1",
        image:
          "https://cdncf.stand.fm/cdn-cgi/image/fit=cover,width=1400,height=1400/watermarked/png/01JPJ278WY3T374XQS44N4AA4S.png",
        itunesId: 1806065162,
        language: "ja",
        categories: {
          "16": "Comedy",
          "17": "Interviews",
        },
      },
      {
        id: 72952,
        url: "https://feeds.simplecast.com/OgfQLeQa",
        title: "Sakura Radio",
        newestItemPublishTime: 1748350800,
        oldestItemPublishTime: 1708178400,
        description:
          "さくらラジオは米国内にのみ放送しているインターネットラジオです。ラジオは著作権等の法規の問題で地域をアメリカに限定しております。このポッドキャストは日本はもちろん、全世界の皆さんが聞けるようにオープンしました。\n\nSakura Radio is a new platform through internet radio to Japanese communities. Unlike localized newspapers and other media, Sakura Radio covers all of the U.S., giving our listeners access to lifestyles, local events, and customs specific to each American region.  While other Japanese internet radio stations in the US are just a little more than podcasts with many music playlists, more than 90% of Sakura Radio's airing time is packed with original programs. We are the first TRUE Japanese internet radio station in the US with 24/7 coverage throughout the United States.\n\n世界・日本・アメリカ各地のニュースはもちろん、実用的な生活情報、イベント、人材情報、緊急情報や、その他幅広い分野の番組を用意しました。ご家庭向けの健康レシピ、子育て相談、健康アワーから、ビジネス向けの法律相談やビジネス談話など、また娯楽面では文化・芸能・著名人の生インタビューや、日本やアメリカの音楽、クラシックなど、様々な音楽も取り入れております。日本人の皆さんだけでなく、日本語を第二外国語として、あるいは現在お勉強中の方にも楽しんでいただけたらと考えております。",
        image:
          "https://image.simplecastcdn.com/images/c64ea798-a8b2-4399-896c-f587194f1b80/137be2ab-78f3-48ae-9232-362161282d5b/3000x3000/1524871460-artwork.jpg?aid=rss_feed",
        itunesId: 1437190751,
        language: "ja",
        categories: {
          "53": "Music",
          "77": "Society",
          "78": "Culture",
        },
      },
      {
        id: 7283518,
        url: "https://feeds.megaphone.fm/TFM3396056243",
        title: "シャルム・ワンダー・スペース",
        newestItemPublishTime: 1748350500,
        oldestItemPublishTime: 1743512400,
        description:
          "バンドプロジェクト「shallm」のボーカル、liaによる初の地上波ラジオ番組。\nあなたをワンダー・スペースに誘います。",
        image:
          "https://megaphone.imgix.net/podcasts/0a317024-110a-11f0-a1a8-cb7b1be17fe8/image/10c25c33a39eff22a8db4214197522f6.jpg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
        itunesId: 1806557278,
        language: "ja",
        categories: {
          "53": "Music",
        },
      },
      {
        id: 6791375,
        url: "https://anchor.fm/s/f1f7fdb8/podcast/rss",
        title: "寝落ちの本ポッドキャスト",
        newestItemPublishTime: 1748349000,
        oldestItemPublishTime: 1707487561,
        description:
          "お便りはこちら\nhttps://forms.gle/EtYeqaKrbeVbem3v7\n毎週　火曜・木曜　22時ころ公開\nあなたの寝落ちのお手伝い。\n寝落ち用に聞いて欲しい本をナオタローが読みます。\n長いお話しは前後編など分けて配信します。\n時々噛みますがご容赦ください。\n気づいた時に眠りに落ちていますように。\n■LISTEN\nhttps://listen.style/p/neochi_hon?9zkRXTf7\n■X\nhttps://x.com/shinjuku_nohito\n※Amazonアソシエイトに参加しています",
        image:
          "https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/40495614/40495614-1707486742684-7b70ef58f30f.jpg",
        itunesId: 1730031581,
        language: "ja",
        categories: {
          "1": "Arts",
          "2": "Books",
        },
      },
      {
        id: 6208110,
        url: "https://www.spreaker.com/show/5747181/episodes/feed",
        title: "真夜中のこころカフェ、23時",
        newestItemPublishTime: 1748348186,
        oldestItemPublishTime: 1666924262,
        description:
          '23時。あなた今、何をしていらっしゃるのでしょう。<br /><br />周りはすっかり寝静まって、ご自分の時間を楽しんでいらっしゃるところでしょうか。楽な姿勢と、くつろいだこころで、これからちょっとの時間を、私と一緒にお過ごしください。<br /><br />私、タカマシノブ、臨床心理士、カウンセラーです。もつれた人間関係の糸をとくお手伝いをします。<br /><br />人間関係といってもほかの人との関係だけではなくて、自分の心の中にいる何人かの人間の葛藤もありますね。たとえば、頭ではわかっているけれども心がどうしても納得がいかないとか、自分の本当の気持ちがわからないとか、私はいったい誰なんだろうとか。こんな考えにくたびれてしまった方の相談相手です。<br /><br />女のこころ、男のこころについて、大人のあなたにお贈りする夜のサプリ。眠れないときなどに、ご自由にお使いください。（tribute to  FM25時　深澤道子）<br /><br />【ソレア質問箱】→ <a href="https://solea.me/questions/" rel="noopener">https://solea.me/questions/</a><br />【Twitter】→ <a href="https://twitter.com/soleapsy" rel="noopener">https://twitter.com/soleapsy</a><br />【BLOG】→ <a href="https://solea.me" rel="noopener">https://solea.me</a>/　（音声の補足もある記事を配信しています）<br />【note】→ <a href="https://note.com/soleapsy" rel="noopener">https://note.com/soleapsy</a>  （このラジオの台本を配信しています）<br />【YouTube】<a href="https://www.youtube.com/channel/UCmuQsLILcWAis2F0ezYAT-Q/" rel="noopener">https://www.youtube.com/channel/UCmuQsLILcWAis2F0ezYAT-Q/</a><br />【LINE】→ <a href="http://nav.cx/dSK0vMY" rel="noopener">http://nav.cx/dSK0vMY</a><br />【自己紹介】→ <a href="https://solea.me/about/" rel="noopener">https://solea.me/about/</a>',
        image:
          "https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/a77ce2b40e3dcf342da20a5e8810a44c.jpg",
        itunesId: null,
        language: "ja",
        categories: {
          "29": "Health",
          "30": "Fitness",
          "33": "Mental",
        },
      },
      {
        id: 6427963,
        url: "https://stand.fm/rss/644d01b49afdfc28ca35663c",
        title: "呼吸ラボラトリーの実験ラジオ",
        newestItemPublishTime: 1748348021,
        oldestItemPublishTime: 1683541356,
        description:
          "呼吸のワークをしたり、本を作ったり\n整えるandトキメクアイテムを\nつくったりしています\n呼吸、本、暮らし、猫、からだ、畑、、、\n日々行っている実験のこと\n（そう、この配信も実験！）、\n気になることや気づいたこと、\nつらつら考えてることなど\n2020年秋に居を移した\n長野・諏訪よりお届けします\nコメント、お気軽におくってください✨\nただ、コメントだとお返事できないため、\n返信希望の方は下記にメールください\nkokyu-oshirase@kokyulaboratory.com\n◯呼吸ラボラトリー\nhttps://kokyulaboratory.com/\n◯instagram\nhttps://instagram.com/anna_nemo_a\n◯online store\nhttps://lightfields8.com/",
        image:
          "https://cdncf.stand.fm/cdn-cgi/image/fit=cover,width=1400,height=1400/watermarked/png/01GZS4X5CSZV2DAVTQG781YT6N.png",
        itunesId: 1687242468,
        language: "ja",
        categories: {
          "29": "Health",
          "30": "Fitness",
        },
      },
      {
        id: 7307410,
        url: "https://stand.fm/rss/67f3c87d87fe90ae17fff29e",
        title: "奥村由希のとりあえず喋らせてもろて。",
        newestItemPublishTime: 1748347227,
        oldestItemPublishTime: 1744811959,
        description:
          "京都在住・関西を中心に活動中のアーティスト「奥村由希」です。\nギター弾きます曲作ります歌います。\nずっとやりたかったポッドキャスト、ワクワクです。\nたまに歌ったりもしたいねぇ。\nまぁとりえず好き勝手歌わせてもろて喋らせてもろて、ということで。",
        image:
          "https://cdncf.stand.fm/cdn-cgi/image/fit=cover,width=1400,height=1400/watermarked/png/01JRZEFMF88E77J7YMKQKCS786.png",
        itunesId: 1810212555,
        language: "ja",
        categories: {
          "53": "Music",
        },
      },
      {
        id: 7317699,
        url: "https://feeds.megaphone.fm/ynpc",
        title: "cacaoのMBSヤングタウンNEXT Podcast",
        newestItemPublishTime: 1748346900,
        oldestItemPublishTime: 1745998500,
        description:
          '<p>【毎週火曜２１時ごろ配信予定】</p><p>「MBSヤングタウン」の次世代を担うパーソナリティを発掘・育成する番組「MBSヤングタウンNEXT」のポッドキャストオリジナルコンテンツが配信開始！</p><p>火曜：cacaoのMBSヤングタウンNEXT Podcast</p><p>水曜：空前メテオのMBSヤングタウンNEXT Podcast</p><p>木曜：三遊間のMBSヤングタウンNEXT Podcast</p><p>※2025年5月から12月の期間、最も再生数が多かった番組は、ポッドキャストでレギュラー化！</p><p>▶お便りはこちらから　<a href="mailto:ynp@mbs1179.com">ynp@mbs1179.com</a></p><p>▶Youtube</p><p><a href="https://www.youtube.com/channel/UCNxVZQxTs8NUlAuj_iua0eg">https://www.youtube.com/channel/UCNxVZQxTs8NUlAuj_iua0eg</a></p><p>▶番組X</p><p><a href="https://x.com/yantan_nextp">https://x.com/yantan_nextp</a></p>',
        image:
          "https://megaphone.imgix.net/podcasts/42896ebc-2588-11f0-bb32-af11cdbc37e1/image/e648c15ab8524f7de734aeb0185c738c.png?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
        itunesId: 1811765910,
        language: "ja",
        categories: {
          "16": "Comedy",
        },
      },
      {
        id: 4386864,
        url: "https://anchor.fm/s/62a3d8a8/podcast/rss",
        title: "コベラバ＠ナイト|KOBE LOVERs@Night",
        newestItemPublishTime: 1748346900,
        oldestItemPublishTime: 1631447698,
        description:
          "コベラバラジオ部\n神戸好き、音声配信が好き、なKOBE LOVERが集まる大人の部活動。\nその活動として配信しているのが、この、コベラバ＠ナイト\n担当パーソナリティごとに様々な切り口で神戸の魅力を発信しています。\nこれまでのアーカイブはnoteにまとめています\nhttps://note.com/awl7763/n/nf765dc318841",
        image:
          "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded/16449050/16449050-1625324063982-57de1463700f2.jpg",
        itunesId: 1589410560,
        language: "ja",
        categories: {
          "77": "Society",
          "78": "Culture",
          "83": "Places",
          "84": "Travel",
        },
      },
      {
        id: 6814060,
        url: "https://feeds.megaphone.fm/ACC4900490564",
        title: "むなかったんあらたの熱血！マンデー野球塾",
        newestItemPublishTime: 1748346180,
        oldestItemPublishTime: 1647874800,
        description:
          '<p>野球大好き芸人むなかったんあらたによる、月曜日試合がなくて寂しい思いをしている プロ野球ファンのためのスポーツバラエティ番組。 福岡ソフトバンクホークスを中心に前週の試合を振り返り、「あらた目線」で解説。 こってこてのプロ野球ファンだからこそのマニアックな話で、月曜日からリスナーの野球熱を高めます。 この番組を聴けば、今週の試合がますます待ち遠しくなる！！！はず。</p><p><br></p><p>メール　<a href="mailto:kor@rkbr.jp">kor@rkbr.jp</a></p><p>King Of Radio　ホームページ　<a href="https://rkb.jp/radio/kor/">https://rkb.jp/radio/kor/</a></p><p>King Of Radio　公式X　<a href="https://x.com/rkbrkor">https://x.com/rkbrkor</a></p><p>King Of Radio　公式Instagram　<a href="https://www.instagram.com/king_of_radio/">https://www.instagram.com/king_of_radio/</a></p><p>むなかったんあらた　<a href="https://x.com/ArataHbs24">https://x.com/ArataHbs24</a></p>',
        image:
          "https://megaphone.imgix.net/podcasts/11e8e8ba-8443-11ee-9e74-5f48a3284990/image/5c534fd1417f299e7bccf2890d9d5429.jpg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
        itunesId: 1719551618,
        language: "ja",
        categories: {
          "16": "Comedy",
          "55": "News",
          "86": "Sports",
          "87": "Baseball",
        },
      },
    ],
    count: 10,
    max: "10",
    since: null,
    description: "Found matching feeds.",
  }
