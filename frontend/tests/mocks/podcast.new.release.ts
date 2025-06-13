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

// backend endpoint /api/podcast/recent?limit=5&exclude=description&lang=ja
// "description" field in response is removed with query parameter (exclude=description)
// retrieve podcasts that have Japanese language (lang=ja)
export const fiveJapaneseNewReleasePodcasts: NewReleasePodcastResponse = {
  count: 5,
  data: [
    {
      id: 6725404,
      url: "https://masaco.koelab.blue/feed/podcast/",
      title: "リーダーの心得",
      description:
        "人間は誰しもが生を受けた時からのこの世のリーダーです。「●●長」など肩書は関係ありません。ただ、いざリーダーシップを発揮する場面に自身が遭遇した時に「人が付いてくるリーダーになるためには、どうしたらいいのか」と悩まれる方もいるのではないでしょうか。\n多くの経営者と会ってきた私が見る各業界で「リーダー」を務める特徴や、人材育成などについてざっくばらんにお話ししていきます♪\n\n▼お仕事のご依頼はこちらから→https://officerevo.jp/\n\n▼公式メルマガ\nhttps://officerevo1.com/p/r/itNK9CMN",
      author: "",
      image: "https://masaco.koelab.blue/wp-content/uploads/artwork.jpg",
      latestPublishTime: 1749834026,
      language: "Japanese",
      categories: [
        "Business",
        "Management",
        "Education",
        "Self Improvement",
        "News",
      ],
    },
    {
      id: 7110814,
      url: "https://stand.fm/rss/63bceea17655e00c1c353d52",
      title: "知のチルアウト-デジタルの砂漠にて",
      description:
        "便利すぎるデジタルの砂漠で、ふと立ち止まりたくなったら。\n情報に追われる現代の違和感を、チルな空気で解いていく教養エンタメ番組です。たまに気取ってコンテンツ作ってます、眠剤代わりにどうぞ。\n※番組のコンセプトをリニューアルしました。\nvoicyのコンテンツもリミックス掛けて再録します。\n雑談はvoicy premiumで。\nPodcasts:\nhttps://podcasts.apple.com/jp/podcast/id1740277424\nhttps://open.spotify.com/show/18oSbqZdZxCCXeWOzYVwgf\nサムネ写真は主に破棄された古写真とAIによるモノです。特に内容との関係性はありません。\nBGMはChobiさんオリジナルです。\n元フェリス女学院大学国際交流学部教授\n昭和女子大学現代ビジネス研究所研究員\n基本遊んでます、定年だもの。",
      author: "",
      image:
        "https://cdncf.stand.fm/cdn-cgi/image/fit=cover,width=1400,height=1400/watermarked/png/01JN8HPFMV7VGX8J0WJS9AZ243.png",
      latestPublishTime: 1749832201,
      language: "Japanese",
      categories: ["Society", "Culture", "Personal", "Journals"],
    },
    {
      id: 5593541,
      url: "https://eiwata.com/feed/podcast/",
      title: "英ワタ 英語でクイズ！「私は誰でしょう！？」～初心者編～",
      description:
        "英語初級～中級者のためのクイズ番組！英語力はまだまだ駆け出しレベル、でも特殊な憑依能力を持つパーソナリティ2人が、毎回交互に「有名人」や「物」や「出来事」を自分に憑依させ、英語で自己紹介をします！さて、私は誰でしょう！？\n\n出演＝\nさくら剛（Twitter:@sakuratsuyoshi）\n山本ひろし（Twitter:@yamamo10hiro4）\n\n英語の間違いは大目に見てね！",
      author: "",
      image: "https://eiwata.com/WPD/wp-content/uploads/2022/06/bannerAH.jpg",
      latestPublishTime: 1749830038,
      language: "Japanese",
      categories: [
        "Business",
        "Careers",
        "Comedy",
        "Improv",
        "Education",
        "Language",
        "Learning",
      ],
    },
    {
      id: 7252994,
      url: "https://feeds.megaphone.fm/jyakagyun",
      title: "フリージアンのジャカジャカギューン⚡⚡",
      description:
        "<p>令和の時代にバンド界を盛り上げるべく⽴ち上がった「バンドマンのバンドマンによるバンドマンのための番組」！</p><p>神⼾で結成された“ロックバンド”フリージアンのマエダカズシ（Vo.）と、たなりょー（Dr.）がバンド・バンドマンの全部を包み隠さずフリーに語る！！</p><p>でもラジオは初めてなので、ロックは“ジャカジャカギューン”だよ！みたいになっちゃうかも。</p><p>まぁ、なんとかなる！</p>",
      author: "",
      image:
        "https://megaphone.imgix.net/podcasts/10a43b24-ffaa-11ef-831f-bb8c572063a2/image/4af0ed31f9ffa3ad06cbc933eb38faae.jpg?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
      latestPublishTime: 1749828420,
      language: "Japanese",
      categories: ["Leisure", "Hobbies", "Music"],
    },
    {
      id: 7245244,
      url: "https://stand.fm/rss/6566a0d64db2e7bbf594a948",
      title: "現役リフォームプランナーの業界裏話",
      description:
        "現役のリフォームプランナーだから話せる、忖度なしの業界裏話、リフォームの困り事、工事あるある話を配信します。\n【プロフィール】\nリフォームを生業にしている二級建築士、インテリアコーディネーター、照明コンサルタント。職歴25年。\n初めて入社したのは、照明器具の開発・輸入販売をしていた会社。店頭販売を経て、照明・インテリアの提案営業に従事。ルイス・ポールセンやフリッツ・ハンセンなど、今も愛され続ける北欧やヨーロッパの名作デザインの数々と間近に触れ合う機会を得た。\nその後、某小売大手のインテリア部門に転職。インテリアコーディネーターとして、主に新築分譲マンションのモデルルームのインテリア提案・設営を数多く手がける。\n飽和状態の新築分譲マンションビジネスに疑問を感じるのと同時に、もっと建築よりの仕事がしたくなり、リフォーム業界に飛び込む。ブラックな労働環境にも関わらず、毎回違う課題が出てくるリフォーム業の奥深さと学びの多さに、日々楽しく奮闘中。\n✴︎Spotify単独配信に挑戦中🎙️\nhttps://open.spotify.com/episode/3Ylk7TeknDOBiYvcHEo2er?si=NwPvghl0Qryln-b0RqHcSw\nSpotifyでもお聴きいただけます⇩\nhttps://open.spotify.com/show/1UtaMkVbKenY9bgaKNYFZt\nApple Podcastでもお聴きいただけます⇩\nhttps://podcasts.apple.com/us/podcast/現役リフォームプランナーの業界裏話/id1737633805\nポッドキャストの文字起こし版は『LISTEN』でご覧いただけます⇩\nhttps://listen.style/p/sunshakureform?3TAABmjn",
      author: "",
      image:
        "https://cdncf.stand.fm/cdn-cgi/image/fit=cover,width=1400,height=1400/images/01HRBTHZCT45WP09HT7P4ESZ8Y.jpg",
      latestPublishTime: 1749827401,
      language: "Japanese",
      categories: ["Business", "Careers"],
    },
  ],
}
