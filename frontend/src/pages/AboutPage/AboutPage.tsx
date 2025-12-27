import "./AboutPage.css"
import jeremyProfilePicture from "./jeremy-profile-picture.webp"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { IconType } from "react-icons/lib"
import { FaStickyNote } from "react-icons/fa"
import { FaHeadphonesSimple, FaStar, FaUsersViewfinder } from "react-icons/fa6"
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.tsx"
import Separator from "../../components/Separator/Separator.tsx"
import useScreenDimensions from "../../hooks/useScreenDimensions.ts"
import usePodcastStats, {
  CurrentPodcastStats,
} from "../../hooks/podcast/usePodcastStats.ts"

export default function AboutPage() {
  const { width } = useScreenDimensions()
  const profilePictureSize = Math.min(width * 0.7, 500)

  useEffect(() => {
    document.title = "xtal - about"
  }, [])

  return (
    <div className="about-page-container">
      <div className="about-section-creator-container">
        <img
          data-testid="jeremy-profile-picture"
          className="jeremy-profile-picture"
          src={jeremyProfilePicture}
          alt="Jeremy Loh"
          width={profilePictureSize}
          height={profilePictureSize}
        />
        <div>
          <p className="jeremy-intro-title">
            👋 Hi, I'm <b>Jeremy Loh (@Jeremy_Loh)</b>
          </p>
          <p>
            I'm a Software Engineer who loves Photography. When I'm not
            programming, you can find me behind a camera!
          </p>
        </div>
      </div>
      <Separator />
      <h2>
        Immerse yourself in the world by exploring podcasts and radio stations
        from around the world using xtal!
      </h2>
      <h3>Why listen to podcasts/radio?</h3>
      <div className="about-section-container">
        <AboutSectionCard
          text="Discover new interests across a large variety of categories"
          Icon={FaStar}
        />
        <AboutSectionCard
          text="Obtain expert insights and learn on the go"
          Icon={FaStickyNote}
        />
        <AboutSectionCard
          text="Practice your active listening skills"
          Icon={FaHeadphonesSimple}
        />
        <AboutSectionCard
          text="Experience different cultures and perspectives"
          Icon={FaUsersViewfinder}
        />
      </div>
      <Separator />
      <AboutSectionStats />
    </div>
  )
}

type AboutSectionCardProps = { text: string; Icon: IconType }

function AboutSectionCard({ text, Icon }: Readonly<AboutSectionCardProps>) {
  const ICON_SIZE = 36
  return (
    <div className="about-section-card">
      <Icon size={ICON_SIZE} />
      <p>{text}</p>
    </div>
  )
}

function AboutSectionStats() {
  // Approximate radio station count is hard-coded - Radio Browser #Server_stats
  // Server stats endpoint is available on HTTP endpoint, not on HTTPS
  const { loading, fetchCurrentPodcastStats } = usePodcastStats()
  const [currentStats, setCurrentStats] = useState<CurrentPodcastStats | null>(
    null
  )
  useEffect(() => {
    if (currentStats == null) {
      fetchCurrentPodcastStats().then((stats) => {
        if (stats) {
          setCurrentStats(stats)
        }
      })
    }
  }, [currentStats, fetchCurrentPodcastStats])

  return (
    <>
      <div className="about-page-radio-station-stats-container">
        <b>
          <span className="about-page-radio-station-stats-figure">54805</span>{" "}
          Radio Stations in{" "}
          <span className="about-page-radio-station-stats-figure">238</span>{" "}
          Countries <br />
        </b>
        <b>
          —{" "}
          <Link
            to="https://www.radio-browser.info/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.radio-browser.info/
          </Link>
        </b>
      </div>
      <div className="about-page-podcast-stats-container">
        {/* ensure podcast stats container has explicit height to prevent layout shift - need to be outside <LoadingDisplay> to exist in DOM */}
        <LoadingDisplay loading={loading}>
          {currentStats == null ? (
            <p>Could not get current podcast stats</p>
          ) : (
            <>
              <b>
                <span className="about-page-podcast-stats-figure">
                  {currentStats.totalPodcasts.toLocaleString()}
                </span>{" "}
                Podcasts
              </b>
              <b>
                <span className="about-page-podcast-stats-figure">
                  {currentStats.totalPodcastEpisodes.toLocaleString()}
                </span>{" "}
                Podcast Episodes
              </b>
              <b>
                <span className="about-page-podcast-stats-figure">
                  {currentStats.episodesPublishedInLastThirtyDays.toLocaleString()}
                </span>{" "}
                New Podcast Episodes in Last 30 Days
              </b>
              <b>
                —{" "}
                <Link
                  to="https://podcastindex.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://podcastindex.org/
                </Link>
              </b>
            </>
          )}
        </LoadingDisplay>
      </div>
    </>
  )
}
